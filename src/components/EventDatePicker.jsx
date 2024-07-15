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
    const [dateError, setDateError] = useState(false);
    const [multipleOptionSelected, setMultipleOptionSelected] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };
    const buttonHide = () => {
    }
    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    const onDelete = async (data) => {
    }
    const onSubmit = async (data) => {
        var formData = {
            "Edit": isEditable,
            "Data": data,
            "key": props.count,
        }
       
        let dateFill = false;
        let MultipleSelected = false;
        console.log('formData.Data.notScheduleYet -- '+formData.Data.notScheduleYet == false);
        console.log('formData.Data.everyWeekend -- '+(formData.Data.everyWeekend ));
        console.log('formData.Data.eventEndDate -- '+formData.Data.eventEndDate.length);
        console.log('formData -- ',(formData.Data.eventEndDate.length == 0 && formData.Data.notScheduleYet == false && formData.Data.everyWeekend == false));
        if ( formData.Data.eventEndDate.length == 0 && formData.Data.notScheduleYet == false && formData.Data.everyWeekend == false) {
            dateFill = true;
            setDateError(true);
            setError("dateError", {
                type: "manual",
                message: "End Date must be filled",
              })
             
        }
   
        console.log('errors. -- ',errors);
        if ((formData.Data.notScheduleYet && formData.Data.everyWeekend) || (formData.Data.notScheduleYet && dateFill) || (formData.Data.everyWeekend && dateFill)) {
            setMultipleOptionSelected(true);
            MultipleSelected = true;
            setError("multipleError", {
                type: "manual",
                message: "You can only select one from Every Weekend or On Public Demand or End Date",
              })
        }
        console.log('multipleOptionSelected',dateFill );
        console.log('dateError -- ',MultipleSelected);
        
            if (isEditable) {
                setEditVisible(false);
            }
            props.sendDataToParent(formData);
      
        console.log('data', data);
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
                                    <input type="date" {...register("eventStartDate")} />
                                </div>
                                <div className="input-box-column ">
                                    <span className="details">End Date </span>
                                    <input type="date" {...register("eventEndDate")} />
                                </div>
                                {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}
                                <div className="input-box-column event-picker ">
                                    <span className="details">Every Weekend </span>
                                    <input type="checkbox"  {...register("everyWeekend")} />
                                </div>

                                <div className="input-box-column event-picker ">
                                    <span className="details">On Public Demand </span>
                                    <input type="checkbox"   {...register("notScheduleYet")}  />
                                </div>
                                {errors.multipleError && <p className='show-error'>{errors.multipleError.message}</p>}
                                <div className="schedule-input input-box ">
                                    <span className="details">Batch Size</span>
                                    <input  {...register("eventBatchCount", { required: { value: true, message: "This field is required" }, })} min="1" type="number" required />
                                </div>
                                <div className="schedule-input input-box ">
                                    <span className="details">Cost Per Person</span>
                                    <input  {...register("eventCostPerPerson", { required: { value: true, message: "This field is required" }, })} type="text" required />
                                </div>
                            </div>
                            <div className="button-edit-container">
                                <div className="button">
                                    {isEditVisible &&
                                        <input className="schedule-button" type="submit" value="Update" />
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
