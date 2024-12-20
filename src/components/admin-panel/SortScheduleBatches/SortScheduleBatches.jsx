import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "./SortScheduleBatches.css";
const SortScheduleBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch all scheduled batches
  const fetchBatches = async () => {
    setLoading(true);
    try {
      let r = await fetch(`${apiUrl}schedule-event`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res = await r.json();
      if (res.isSuccess == true) {
        let tempBatch = [];
        let temp;
        for (let i = 0; i < res.scheduleBatches.length; i++) {
          if (
            res.scheduleBatches[i].notScheduleYet == false &&
            res.scheduleBatches[i].everyWeekend == false
          ) {
            temp = res.scheduleBatches[i];
            temp.batchName =
              formatDate(res.scheduleBatches[i].eventStartDate) +
              " - " +
              formatDate(res.scheduleBatches[i].eventEndDate);
            tempBatch.push(temp);
          }
        }
        tempBatch.sort((a, b) => a.sort - b.sort);
        console.log("tempBatch----", tempBatch);

        setBatches(tempBatch);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Update sort order
  const updateSortOrder = async () => {
    try {
      const sortedBatches = batches.map((batch, index) => ({
        _id: batch._id,
        sort: index + 1, // Assign a new sort value based on position
      }));

      const response = await fetch(`${apiUrl}update-sort-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batches: sortedBatches }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sort order");
      }

      alert("Sort order updated successfully!");
      fetchBatches(); // Refresh the list after updating
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Handle drag and drop for sorting
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("batchIndex", index);
  };
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("batchIndex");
    const updatedBatches = [...batches];

    // Rearrange the array based on the drag-and-drop action
    const [draggedItem] = updatedBatches.splice(draggedIndex, 1);
    updatedBatches.splice(index, 0, draggedItem);

    setBatches(updatedBatches);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <AdminNavbar>
        <div className=" contentbody">
          <div className="container justify-content-center py-md-5">
            <h1>
              <b>Scheduled Batches</b>
            </h1>
            <div className="button-edit-container">
              <div className="button">
                <button onClick={updateSortOrder} disabled={loading}>
                  Save Sort Order
                </button>
              </div>
            </div>
            <ul className="sort-section">
              {batches.map((batch, index) => (
                <li
                  key={batch._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="sort-list"
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    margin: "10px 0",
                    cursor: "grab",
                    backgroundcolor: "#f9f9f9",
                  }}
                >
                  <strong>
                    {batch.eventname} : {batch.batchName}
                  </strong>
                  <br />
                  Sort Order: {index + 1}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AdminNavbar>
    </div>
  );
};

export default SortScheduleBatches;
