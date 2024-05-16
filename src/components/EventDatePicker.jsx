import React, { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "./EventDataPicker.css"
const EventDatePicker = (props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

   
    const [modal, setModal] = useState();
    const [isEditable, setEditable] = useState(true);
    const [isEditVisible, setEditVisible] = useState(true);
    const [data, setData] = useState("");
    const toggleModal = () => {
        setModal(!modal);
    };
    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    const onDelete = async (data) => {
    }
    const onSubmit = async (data) => {
        var formData = {
            "Edit":isEditable,
            "Data": data,
            "key": props.count,
        }
        if(isEditable){
            setEditVisible(false);
        }
        props.sendDataToParent(formData);
        console.log('data',data);
    }
    return (
        <div>
            {
                < form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="datapicker container">
                        <div className="content">
                            <div className="thicker ">Batch {props.count}</div>
                            <div className="user-details">
                                <div className="input-box-column ">
                                    <span className="details">Start Date </span>
                                    <input type="date" {...register("eventStartDate", { required: { value: true, message: "This field is required" }, })} required />
                                </div>
                                <div className="input-box-column ">
                                    <span className="details">End Date </span>
                                    <input type="date" {...register("eventEndDate", { required: { value: true, message: "This field is required" }, })} required />
                                </div>
                                <div className="schedule-input input-box ">
                                    <span className="details">Cost Per Person</span>
                                    <input  {...register("eventCostPerPerson", { required: { value: true, message: "This field is required" }, })} type="text" required />
                                </div>                                
                            </div>
                            <div className="button-edit-container">
                                <div className="button">
                                    {isEditVisible &&
                                        <input className="schedule-button"  type="submit" value="Update"  />
                                    }
                                    
                                    <input className="schedule-button" type="submit" value="Cancel" onClick={() => setEditable(false)} />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            }
        </div >
    )
}

export default EventDatePicker
