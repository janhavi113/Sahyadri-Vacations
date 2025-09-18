import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import Editor from "../../Editor"; // adjust import as per your project
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const BrochureItineraryForm = ({ initialValues, eventRecord, onFormSubmit }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(!eventRecord);
    const [selectedEvent, setSelectedEvent] = useState(
        initialValues
            ? { value: initialValues.eventId, label: initialValues.preferredLocation, fullEvent: eventRecord }
            : null
    );

    const [eventId, setEventId] = useState(initialValues?.eventId);
    const [selectedEventId, setSelectedEventId] = useState(initialValues?.eventId);
    const { register, handleSubmit } = useForm();

    // states for fields
    const [eventName, setEventName] = useState(eventRecord?.eventName || "");
    const [eventAPIName, setEventAPIName] = useState(eventRecord?.apiname || "");
    const [eventDetails, setEventDetails] = useState(eventRecord?.eventDetails || "");
    const [itinerary, setItinerary] = useState(eventRecord?.itinerary || "");
    const [highlights, setHighlights] = useState(eventRecord?.highlights || "");
    const [costIncludes, setCostIncludes] = useState(eventRecord?.costIncludes || "");
    const [costExcludes, setCostExcludes] = useState(eventRecord?.costExcludes || "");
    const [thingsToCarry, setThingsToCarry] = useState(eventRecord?.thingsToCarry || "");
    const [pickupPoints, setPickupPoints] = useState(eventRecord?.pickupPoints || "");
    const [pickupPointsfromMumbai, setPickupPointsfromMumbai] = useState(eventRecord?.pickupPointsfromMumbai || "");
    const [FAQ, setFAQ] = useState(eventRecord?.FAQ || "");
    const [locationValue, setLocationValue] = useState(eventRecord?.location || "");
    const [typeValue, setTypeValue] = useState(eventRecord?.type || "");
    const [elevationValue, setElevationValue] = useState(eventRecord?.elevation || "");
    const [difficultyValue, setDifficultyValue] = useState(eventRecord?.difficulty || "");
    const [enduranceValue, setEnduranceValue] = useState(eventRecord?.endurance || "");
    const [durationValue, setDurationValue] = useState(eventRecord?.duration || "");
    const [totalDistanceValue, setTotalDistanceValue] = useState(eventRecord?.totalDistance || "");
    const [ageGroupValue, setAgeGroupValue] = useState(eventRecord?.ageGroup || "");
    const [trekDistanceValue, setTrekDistanceValue] = useState(eventRecord?.trekDistance || "");
    const [b2bLocation, setB2BLocation] = useState(eventRecord?.b2bLocation || "");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [currentImages, setCurrentImages] = useState(eventRecord?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createNew, setCreateNew] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState(null);
    // fetch events if no eventRecord
    useEffect(() => {
        if (eventRecord) return;

        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/admin-login");
                    return;
                }
                const res = await fetch(`${apiUrl}all-events`, {
                    headers: { Authorization: token },
                });
                const data = await res.json();
                if (data.isSuccess) {
                    const formattedEvents = data.events.map((e) => ({
                        value: e.eventId,   // use eventId instead of _id if you want to match initialValues.eventId
                        label: e.name,
                        fullEvent: e,
                    }));

                    setEvents(formattedEvents);

                    // ✅ Preselect if initialValues.eventId exists
                    if (initialValues?.eventId) {
                        const match = formattedEvents.find(
                            (ev) => ev.value === initialValues.eventId
                        );
                        if (match) {
                            handleEventChange(match);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [apiUrl, eventRecord]);

    // file handlers
    const onDrop = (files) => {
        const mapped = files.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setUploadedFiles((prev) => [...prev, ...mapped]);
    };

    const removeFile = (file) => {
        setUploadedFiles((prev) => prev.filter((f) => f !== file));
    };

    const removeCurrentFile = (file) => {
        setCurrentImages((prev) => prev.filter((f) => f !== file));
    };

    const onUpload = async (data, e) => {
        setIsSubmitting(true);
        try {
            const action = e.nativeEvent.submitter.value; // "Create" or "Update"

            console.log("Action:", action);
            console.log("Submitting event data:", {
                ...data,
                eventAPIName,
                eventName,
                itinerary,
                highlights,
                costIncludes,
                costExcludes,
                thingsToCarry,
                pickupPoints,
                pickupPointsfromMumbai,
                FAQ,
                locationValue,
                typeValue,
                elevationValue,
                difficultyValue,
                enduranceValue,
                durationValue,
                totalDistanceValue,
                ageGroupValue,
                trekDistanceValue,
                b2bLocation,
                uploadedFiles,
                currentImages,
            });
            // TODO: add API call to update event
            //  alert("Event updated (mock)");
            if (action === "Create") {
                //  alert("Event created");
                // TODO: API call for create
            } else {
                //  alert("Event updated (mock)");
                // TODO: API call for update
            }
            if (currentImages.length === 0 && uploadedFiles != 'undefined' && uploadedFiles.length === 0) {
                setError("dropzone", {
                    type: "manual",
                    message: "Please upload at least one file.",
                });
                return;
            }
            // fake request to upload file
            const url = `${apiUrl}upsert-customitiniery/:${initialValues?._id}`;
            const formData = new FormData();
            if (uploadedFiles) {
                for (let index = 0; index < uploadedFiles?.length; index++) {
                    formData.append("files", uploadedFiles[index]);
                }
            }
            if (currentImages) {
                for (let index = 0; index < currentImages?.length; index++) {
                    formData.append("currentImages", currentImages[index])
                }
            }

            formData.append("costIncludes", costIncludes);
            formData.append("costExcludes", costExcludes);
            formData.append("FAQ", FAQ);
            formData.append("eventDetails", data.eventDetails);
            formData.append("eventName", eventName);
            formData.append("apiname", eventAPIName);
            formData.append("eventType", data.eventType);
            formData.append("highlights", highlights);
            formData.append("itinerary", itinerary);
            formData.append("pickupPoints", pickupPoints);
            formData.append("pickupPointsfromMumbai", pickupPointsfromMumbai);
            formData.append("b2bLocaion", b2bLocation);
            formData.append("thingsToCarry", thingsToCarry);
            formData.append("location", data.location);
            formData.append("type", data.type);
            formData.append("elevation", data.elevation);
            formData.append("difficulty", data.difficulty);
            formData.append("endurance", data.endurance);
            formData.append("duration", data.duration);
            formData.append("totalDistance", data.totalDistance);
            formData.append("ageGroup", data.ageGroup);
            formData.append("trekDistance", data.trekDistance);

            console.log('formData ===', formData);
            console.log('url ===', url);
            let r = await fetch(`${url}`, {
                method: "POST",
                body: formData,
            })
            let res = await r.json();
            if (res.isSuccess) {
                onFormSubmit(res);
            }




        } finally {
            setIsSubmitting(false);
        }
    };

    // Separate handler for select change
    const handleEventChange = (opt) => {
        console.log('opt--', opt);

        setSelectedEvent(opt);
        if (opt) {
            setCreateNew(true);
        } else {
            setCreateNew(false);
        }

        if (opt?.fullEvent) {
            setSelectedEventId(opt.fullEvent?.eventId);
            setEventName(opt.fullEvent?.name || "");
            setEventAPIName(opt.fullEvent?.apiname || "");
            setItinerary(opt.fullEvent?.itinerary || "");
            setEventDetails(opt.fullEvent?.eventDetails || "")
            setHighlights(opt.fullEvent?.highlights || "");
            setPickupPoints(opt.fullEvent?.pickupPoints || "");
            setB2BLocation(opt.fullEvent?.b2bLocation || "");
            setCurrentImages(opt.fullEvent?.images);
            setPickupPointsfromMumbai(opt.fullEvent?.pickupPointsfromMumbai || "");
            setThingsToCarry(opt.fullEvent?.thingsToCarry || "");
            setCostIncludes(opt.fullEvent?.costIncludes || "");
            setCostExcludes(opt.fullEvent?.costExcludes || "");
            setFAQ(opt.fullEvent?.FAQ || "");
            setLocationValue(opt.fullEvent?.location || "");
            setTypeValue(opt.fullEvent?.type || "");
            setElevationValue(opt.fullEvent?.elevation || "");
            setDifficultyValue(opt.fullEvent?.difficulty || "");
            setEnduranceValue(opt.fullEvent?.endurance || "");
            setDurationValue(opt.fullEvent?.duration || "");
            setTotalDistanceValue(opt.fullEvent?.totalDistance || "");
            setAgeGroupValue(opt.fullEvent?.ageGroup || "");
            setTrekDistanceValue(opt.fullEvent?.trekDistance || "");
        }
        console.log("Selected Event Record:", opt?.fullEvent);
    };
    // Handler for Event Name input
    const handleEventNameChange = (e) => {
        const value = e.target.value;
        setEventName(value);

        // Convert to API-friendly name
        const apiName = value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")   // replace spaces & special chars with _
            .replace(/^_+|_+$/g, "");      // remove leading/trailing underscores

        setEventAPIName(apiName);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">Select Event to Edit</h3>
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <>
                    <Select
                        options={events}
                        onChange={handleEventChange}
                        value={selectedEvent}
                        placeholder="Search and select an event..."
                        isClearable
                        isSearchable
                    />

                    {/* OR text */}
                    <div className="flex items-center justify-center my-4">
                        <span className="text-gray-500 font-semibold">OR</span>
                    </div>

                    {/* Checkbox for new itinerary */}
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="newItinerary"
                            checked={createNew}
                            onChange={(e) => {
                                setCreateNew(e.target.checked);
                                if (e.target.checked) {
                                    setSelectedEvent(null); // clear selected event if creating new
                                }
                            }}
                        />
                        <label htmlFor="newItinerary" className="text-gray-700 font-medium">
                            Create new Itinerary
                        </label>
                    </div>
                </>
            )}

            {(createNew) && (
                <form onSubmit={handleSubmit(onUpload)} className="mt-6">
                    <div className="container">
                        <div className="title-header">Event Details</div>
                        <div className="content">
                            {isSubmitting && <div>Loading...</div>}
                            <div className="user-details">
                                <div className="input-box">
                                    <span className="details">
                                        Event Name <HelpTooltip text="Enter event name" />
                                    </span>
                                    <input
                                        value={eventName}
                                        onChange={handleEventNameChange}   // <-- use handler here
                                        type="text"
                                        required
                                    />
                                </div>

                                <div className="input-box ">
                                    <span className="details">
                                        Event API Name
                                        <HelpTooltip text="Enter api name of the event" />
                                    </span>
                                    <input
                                        value={eventAPIName}
                                        onChange={(e) => setEventAPIName(e.target.value)} // still allow manual edit if needed
                                        type="text"
                                        required
                                        readOnly
                                    />
                                </div>


                                <div className="input-box ">
                                    <span className="details">Event Details
                                        <HelpTooltip text="Provide a brief summary of the event" />
                                    </span>
                                    <textarea defaultValue={eventDetails}   {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Itinerary</span>
                                    <Editor value={itinerary} onChange={setItinerary} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Event Type
                                        <HelpTooltip text="Select the type of event" />
                                    </span>
                                    <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                                        <option value={"TrekEvent"} >Trekking Event</option>
                                        <option value={"CampingEvent"}>Camping Event</option>
                                        <option value={"BackPackingTrip"} >BackPacking Trip</option>
                                        <option value={"AdventureActivity"} >Adventure Activity</option>
                                    </select>
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Location
                                        <HelpTooltip text="Enter the location where the event will take place" />
                                    </span>
                                    <input value={locationValue} {...register("location", { required: { value: true, message: "This field is required" }, })} type="text" />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Type
                                        <HelpTooltip text="Type of activity or event style" />
                                    </span>
                                    <input value={typeValue} {...register("type")} type="text" onChange={(e) => setTypeValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Elevation
                                        <HelpTooltip text="Enter the highest altitude in meters" />
                                    </span>
                                    <input value={elevationValue} {...register("elevation",)} type="text" onChange={(e) => setElevationValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Difficulty
                                        <HelpTooltip text="Describe how challenging the event is" />
                                    </span>
                                    <input value={difficultyValue} {...register("difficulty",)} type="text" onChange={(e) => setDifficultyValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Endurance
                                        <HelpTooltip text="Mention the stamina level required" />
                                    </span>
                                    <input value={enduranceValue} {...register("endurance",)} type="text" onChange={(e) => setEnduranceValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Duration
                                        <HelpTooltip text="Provide the duration of the event in days" />
                                    </span>
                                    <input value={durationValue} {...register("duration",)} type="text" onChange={(e) => setDurationValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Total Distance
                                        <HelpTooltip text="Total travel distance in kilometers" />
                                    </span>
                                    <input value={totalDistanceValue} {...register("totalDistance",)} type="text" onChange={(e) => setTrekDistanceValue(e.target.value)} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Age Group
                                        <HelpTooltip text="Specify suitable age group for the event" />
                                    </span>
                                    <input value={ageGroupValue} {...register("ageGroup",)} type="text" onChange={(e) => setAgeGroupValue(e.target.value)} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Trek Distance
                                        <HelpTooltip text="Distance to be trekked during event" />
                                    </span>
                                    <input value={trekDistanceValue} {...register("trekDistance",)} type="text" onChange={(e) => setTrekDistanceValue(e.target.value)} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Highlights
                                        <HelpTooltip text="Main attractions or features of the event" />
                                    </span>
                                    <Editor value={highlights} sendDataToParent={setHighlights} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Cost Includes
                                        <HelpTooltip text="Everything included in the event cost" />
                                    </span>
                                    <Editor value={costIncludes} sendDataToParent={setCostIncludes} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Cost Excludes
                                        <HelpTooltip text="Things not included in the cost" />
                                    </span>
                                    <Editor value={costExcludes} sendDataToParent={setCostExcludes} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Things To Carry
                                        <HelpTooltip text="Checklist of things participants should bring" />
                                    </span>
                                    <Editor value={thingsToCarry} sendDataToParent={setThingsToCarry} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">B2B Location
                                        <HelpTooltip text="Base toBase Pickup Location" />
                                    </span>
                                    <input value={b2bLocation} onChange={(e) => setB2BLocation(e.target.value)} type="text" />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">Pickup Points from Pune
                                        <HelpTooltip text="Enter all pickup locations from Pune" />
                                    </span>
                                    <Editor value={pickupPoints} sendDataToParent={setPickupPoints} />
                                </div>

                                <div className="input-select-box">
                                    <span className="details">Pickup Points from Mumbai
                                        <HelpTooltip text="Enter all pickup locations from Mumbai" />
                                    </span>
                                    <Editor value={pickupPointsfromMumbai} sendDataToParent={setPickupPointsfromMumbai} />
                                </div>
                                <div className="input-select-box">
                                    <span className="details">FAQ
                                        <HelpTooltip text="Frequently Asked Questions" /></span>
                                    <Editor value={FAQ} sendDataToParent={setFAQ} />
                                </div>
                                {/* Dropzone */}
                                <div className="input-box">
                                    <span className="details">Upload Images</span>
                                    <Dropzone onDrop={onDrop} accept="image/*">
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className="dropzone">
                                                <input {...getInputProps()} />
                                                <p>Drag & drop images here, or click to select files</p>
                                            </div>
                                        )}
                                    </Dropzone>
                                    <div className="preview-container">
                                        {uploadedFiles.map((file) => (
                                            <div key={file.name} className="preview">
                                                <img src={file.preview} alt={file.name} width={100} />
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    onClick={() => removeFile(file)}
                                                />
                                            </div>
                                        ))}
                                        {currentImages?.map((img, i) => (
                                            <div key={i} className="preview">
                                                <img src={img} alt={`img-${i}`} width={100} />
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    onClick={() => removeCurrentFile(img)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showDialog && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                                    {!dialogMode && (
                                        <>
                                            <h3 className="text-lg font-bold mb-4">What do you want to do?</h3>
                                            <div className="flex justify-between">
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                                    onClick={() => setDialogMode("create")}
                                                >
                                                    Create New
                                                </button>
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setDialogMode("update");
                                                        handleSubmit((data, e) => onUpload(data, { nativeEvent: { submitter: { value: "Update" } } }))();
                                                        setShowDialog(false);
                                                    }}
                                                >
                                                    Update Existing
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {dialogMode === "create" && (
                                        <>
                                            <h3 className="text-lg font-bold mb-4">Enter New Event Name</h3>
                                            <div className="user-details">
                                                <div className="input-box">
                                                    <span className="details">
                                                        Event Name <HelpTooltip text="Enter event name" />
                                                    </span>
                                                    <input
                                                        value={eventName}
                                                        onChange={handleEventNameChange}   // <-- use handler here
                                                        type="text"
                                                        required
                                                    />
                                                </div>

                                                <div className="input-box ">
                                                    <span className="details">
                                                        Event API Name
                                                        <HelpTooltip text="Enter api name of the event" />
                                                    </span>
                                                    <input
                                                        value={eventAPIName}
                                                        onChange={(e) => setEventAPIName(e.target.value)} // still allow manual edit if needed
                                                        type="text"
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setDialogMode(null);
                                                        setNewEventName("");
                                                    }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                                    onClick={() => {
                                                        setEventName(newEventName);
                                                        handleEventNameChange({ target: { value: newEventName } }); // updates API name
                                                        handleSubmit((data, e) => onUpload(data, { nativeEvent: { submitter: { value: "Create" } } }))();
                                                        setShowDialog(false);
                                                    }}
                                                >
                                                    Create
                                                </button>

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="button-edit-container">
                            <div className="button">
                                <input
                                    disabled={isSubmitting}
                                    type="button"
                                    value="Save"
                                    onClick={() => setShowDialog(true)}
                                />

                                <input
                                    disabled={isSubmitting}
                                    type="button"
                                    value="Cancel"
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        setEventName(null);
                                        setEventAPIName(null);
                                        setItinerary(null);
                                        setEventDetails(null);
                                        setHighlights(null);
                                        setPickupPoints(null);
                                        setB2BLocation(null);
                                        setCurrentImages(null);
                                        setPickupPointsfromMumbai(null);
                                        setThingsToCarry(null);
                                        setCostIncludes(null);
                                        setCostExcludes(null);
                                        setFAQ(null);
                                        setLocationValue(null);
                                        setTypeValue(null);
                                        setElevationValue(null);
                                        setDifficultyValue(null);
                                        setEnduranceValue(null);
                                        setDurationValue(null);
                                        setTotalDistanceValue(null);
                                        setAgeGroupValue(null);
                                        setTrekDistanceValue(null);
                                        setCreateNew(false);   // reset create new
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BrochureItineraryForm;
