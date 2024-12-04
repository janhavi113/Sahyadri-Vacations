import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import SearchAndAdd from './SearchAndAdd';
const AddSpecialOfferEvents = () => {
    const options = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
    ];

    const apiUrl = import.meta.env.VITE_API_URL;
    const [isSuccess, setSuccess] = useState(false);
    const [events, setEvent] = useState();
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
        let temp ='';
        if (res.isSuccess == true) {
            setSuccess(true);
            for (let i = 0; i < res.events.length; i++) {
               
            }
           
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

    return (
        <AdminNavbar>
            <div className=" contentbody">
                <div className="container justify-content-center py-md-5">
                    <div>
                        <h1>Search and Add Example</h1>
                        <SearchAndAdd options={options} placeholder="Search items to add..." />
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
        </AdminNavbar>
    )
}

export default AddSpecialOfferEvents