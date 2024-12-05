import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import './AddSpecialOfferEvents.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleXmark, faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import SearchAndAdd from './SearchAndAdd';
const AddSpecialOfferEvents = () => {
    const [selectedEvents, setSelectedEvents] = useState([]);

    const handleSelectionChange = (selectedItems) => {
        console.log('selectedItems--', selectedItems);
        setSelectedEvents(selectedItems); // Update state with selected items
    };
    const [options, setOptions] = useState([]);


    const apiUrl = import.meta.env.VITE_API_URL;
    const [isSuccess, setSuccess] = useState(false);
    const [couponsFound, setCouponsFound] = useState(false);
    const [coupons, setCoupons] = useState();
    const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin-login");
            return;
        }
        if (isSuccess == false) {
            getAllRecord();
            getAllSpecialOfferCoupon();
        }
    }, [navigate]);

    const getAllRecord = async () => {
        let liveEvents = [];
        let r = await fetch(`${apiUrl}scheduled-events`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        })
        let res = await r.json()
        let temp = '';
        if (res.isSuccess == true) {
            setSuccess(true);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let tempOptions = [];
            for (let i = 0; i < res.events.length; i++) {
                let batchdate = '';
                let eventLable = '';
                if (res.events[i].everyWeekend == true) {
                    batchdate = 'Available On All Weekends';
                } else if (res.events[i].notScheduleYet == true) {
                    batchdate = 'On Public Demand';
                } else {
                    batchdate = batchdate + new Date(res.events[i].eventStartDate).getDate() + ' ' + months[new Date(res.events[i].eventStartDate).getMonth()] + ' ' + new Date(res.events[i].eventStartDate).getFullYear() + ' - ' + new Date(res.events[i].eventEndDate).getDate() + ' ' + months[new Date(res.events[i].eventEndDate).getMonth()] + ' ' + new Date(res.events[i].eventEndDate).getFullYear();
                }
                eventLable = res.events[i].eventname + ' | ' + batchdate;
                tempOptions.push({ label: eventLable, value: res.events[i].eventId });
            }
            setOptions(tempOptions);
            console.log('tempOptions ---', tempOptions);
        }

    }

    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file), // Create a preview URL for the image
            })
        );
        setUploadedFiles((prev) => [...prev, ...newFiles]); // Add new files to the uploaded files state
        clearErrors("dropzone");
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const removeFile = (file) => {
        setUploadedFiles((prev) => prev.filter((f) => f !== file)); // Remove the file from the state
    };
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const onSubmit = async (data) => {
        if (uploadedFiles.length === 0) {
            setError("dropzone", {
                type: "manual",
                message: "Please upload at least one file.",
            });
            return;
        }
        console.log('I am here---', selectedEvents);
        const formData = new FormData();
        formData.append("images", uploadedFiles[0]); // Adjust the name as needed
        formData.append("title", data.name);
        formData.append("events", JSON.stringify(selectedEvents));
        let r = await fetch(`${apiUrl}create-special-event`, {
            method: "POST",
            body: formData,
        });
        let res = await r.json();
        if (res.ok) {
            alert('done');
        }
    };

    const getAllSpecialOfferCoupon = async () => {

        let r = await fetch(`${apiUrl}special-offer`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        })
        let res = await r.json();
        console.log('getAllSpecialOfferCoupon---', res);
        let temp = '';
        if (r.ok) {
            setCouponsFound(true);
            setCoupons(res.coupons);
        }

    }

    return (
        <AdminNavbar>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                    <div className="content">
                        <div className="search-user-details user-details">
                            <div className=" contentbody">
                                <div className="container justify-content-center py-md-5">
                                    <div className="input-box ">
                                        <span className="details">Title</span>
                                        <input
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: "This field is required",
                                                },
                                            })}
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <h3>Search and Add Months</h3>
                                        <SearchAndAdd
                                            options={options}
                                            placeholder="Search months to add..."
                                            onSelectionChange={handleSelectionChange}
                                        />

                                    </div>
                                    <div className="input-box-search input-box" >
                                        <span className="details">Select Coupons</span>
                                        {couponsFound &&
                                            <select id="picklist" value={selectedValue} onChange={handleChange}>
                                                {coupons &&
                                                    coupons.map((event, index) => (
                                                        <option key={index} value={event._id} >{event.couponName}</option>
                                                    ))}
                                            </select>
                                        }
                                    </div>

                                    <div className="row justify-content- py-4">
                                        <div className="content">
                                            <div className="user-details">
                                                <div className="input-box-column ">
                                                    <span className="details">Upload Cover Photo <span style={{ 'color': 'red' }}>*</span></span>
                                                </div>
                                                {/* Dropzone for file uploads */}
                                                <Dropzone onDrop={onDrop} accept="image/jpeg, image/png">
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section className="dropzone">
                                                            <div {...getRootProps({ className: "dropzone" })}>
                                                                <input {...getInputProps()} />
                                                                <p>
                                                                    Drag 'n' drop some files here, or click to select files
                                                                </p>
                                                            </div>
                                                        </section>
                                                    )}
                                                </Dropzone>
                                                {/* Show validation error if no file is uploaded */}
                                                {errors.dropzone && (
                                                    <p className="error-message">{errors.dropzone.message}</p>
                                                )}

                                                {/* Preview Uploaded Images */}
                                                <div className="image-preview-container">
                                                    {uploadedFiles.map((file) => (
                                                        <div key={file.name} className="image-preview">
                                                            <img
                                                                src={file.preview}
                                                                alt={file.name}
                                                                style={{
                                                                    width: "150px",
                                                                    height: "175px",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                            <button type="button" onClick={() => removeFile(file)}>
                                                                <FontAwesomeIcon
                                                                    icon={faCircleXmark}
                                                                    size="lg"
                                                                    style={{ color: "orange" }}
                                                                />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button">
                        <input disabled={isSubmitting} type="submit" value="Submit" />
                    </div>
                </div>
            </form>
        </AdminNavbar >
    )
}

export default AddSpecialOfferEvents