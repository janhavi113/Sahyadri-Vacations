import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import Select from "react-select";

function BookingReport() {
  const [booked, setBooked] = useState([]);
  const [notBooked, setNotBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventBatchList, setEventBatchList] = useState([]);
  const [batchesForSelectedEvent, setBatchesForSelectedEvent] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    mobileNumber: "",
    status: "",
    fromDate: "",
    toDate: "",
    eventName: "",
    batch: ""
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReport();
    fetchEventBatches();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${apiUrl}booking-report`);
      const data = await res.json();
      if (data.isSuccess) {
        setBooked(data.booked);
        setNotBooked(data.notBooked);
        setPendingBookings(data.triedbooked)
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventBatches = async () => {
    try {
      const res = await fetch(`${apiUrl}event-batches`);
      const data = await res.json();
      if (data.isSuccess) {
        setEventBatchList(data.data);
      }
    } catch (error) {
      console.error("Error fetching event batches:", error);
    }
  };

  const parseBookingDate = (dateStr) => {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    return new Date(+year, +month - 1, +day);
  };

  const applyFilters = (data) =>
    data.filter((item) => {
      console.log('filters---', filters);
      const textFiltersPass = ["name", "mobileNumber", "status", "eventName", "batch"].every(
        (key) => {
          if (!filters[key]) return true;
          return item[key]
            ?.toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        }
      );
      console.log('textFiltersPass---', textFiltersPass);
      if (!textFiltersPass) return false;

      if (filters.fromDate || filters.toDate) {
        const bookingDateObj = parseBookingDate(item.bookingDate);
        if (!bookingDateObj) return false;

        if (filters.fromDate) {
          const fromDateObj = new Date(filters.fromDate);
          fromDateObj.setDate(fromDateObj.getDate() - 1);
          if (bookingDateObj < fromDateObj) return false;
        }
        if (filters.toDate) {
          const toDateObj = new Date(filters.toDate);
          if (bookingDateObj > toDateObj) return false;
        }
      }

      return true;
    });

  const filteredBooked = applyFilters(booked);
  const filteredNotBooked = applyFilters(notBooked);
  const filteredPendingBooking = applyFilters(pendingBookings);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventChange = (selectedOption) => {
    const selectedEvent = selectedOption ? selectedOption.value : "";
    const selected = eventBatchList.find((e) => e.eventName === selectedEvent);
    setBatchesForSelectedEvent(selected ? selected.batches : []);
    setFilters((prev) => ({
      ...prev,
      eventName: selectedEvent,
      batch: ""
    }));
  };

  const handleBatchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      batch: e.target.value
    }));
  };

  const eventOptions = eventBatchList.map((event) => ({
    label: event.eventName,
    value: event.eventName
  }));

  return (
    <AdminNavbar>
      {loading ? (
        <p>Loading report...</p>
      ) : (
        <div className="container py-4">
          <h2 className="mb-4">📊 Booking Report</h2>

          {/* Filters */}
          <div className="mb-4">
            <h5>Filters</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Filter by Name"
                  value={filters.name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Filter by Mobile Number"
                  value={filters.mobileNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="status"
                  placeholder="Filter by Status"
                  value={filters.status}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label>Event Name</label>
                <Select
                  options={eventOptions}
                  isClearable
                  onChange={handleEventChange}
                  value={filters.eventName ? { value: filters.eventName, label: filters.eventName } : null}
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3">
                <label>Batch</label>
                <select
                  className="form-select"
                  name="batch"
                  value={filters.batch}
                  onChange={handleBatchChange}
                  disabled={!filters.eventName}
                >
                  <option value="">Select Batch</option>
                  {batchesForSelectedEvent.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-2">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-2">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <h4>✅ People Who Booked </h4>
          <table className="table table-bordered mb-5">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Batch</th>
                <th>Event Name</th>
                <th>Booking ID</th>
                <th>Booking Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooked.length > 0 ? (() => {
                let rowIndex = 1; // Initialize a row counter

                return filteredBooked.flatMap((b, i) => {
                  const rows = [];

                  // Main person row
                  rows.push(
                    <tr key={`main-${i}`}>
                      <td>{rowIndex++}</td>
                      <td>{b.name}</td>
                      <td>
                        <a href={`tel:${b.mobileNumber}`}>{b.mobileNumber}</a>
                      </td>
                      <td>{b.status}</td>
                      <td>{b.batch}</td>
                      <td>{b.eventName}</td>
                      <td>{b.bookingId}</td>
                      <td>{b.bookingDate}</td>
                      <td>Main</td>
                    </tr>
                  );

                  // Other participants
                  if (Array.isArray(b.otherParticipants)) {
                    b.otherParticipants.forEach((p, idx) => {
                      rows.push(
                        <tr key={`other-${i}-${idx}`}>
                          <td>{rowIndex++}</td>
                          <td>{p.name}</td>
                          <td>
                            <a href={`tel:${p.mobileNumber}`}>{p.mobileNumber}</a>
                          </td>
                          <td>{p.status || "N/A"}</td>
                          <td>{b.batch}</td>
                          <td>{b.eventName}</td>
                          <td>{b.bookingId}</td>
                          <td>{b.bookingDate}</td>
                          <td>Other</td>
                        </tr>
                      );
                    });
                  }

                  return rows;
                });
              })() : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No bookings match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          <h4>🕗 People Who Pending </h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Batch</th>
                <th>Event Name</th>
                <th>Booking ID</th>
                <th>Booking Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingBooking.length > 0 ? (() => {
                let rowIndex = 1;

                return filteredPendingBooking.flatMap((b, i) => {
                  const rows = [];

                  // Main person
                  rows.push(
                    <tr key={`main-nb-${i}`}>
                      <td>{rowIndex++}</td>
                      <td>{b.name}</td>
                      <td>
                        <a href={`tel:${b.mobileNumber}`}>{b.mobileNumber}</a>
                      </td>
                      <td>{b.status}</td>
                      <td>{b.batch}</td>
                      <td>{b.eventName}</td>
                      <td>{b.bookingId}</td>
                      <td>{b.bookingDate}</td>
                      <td>Main</td>
                    </tr>
                  );

                  // Other participants
                  if (Array.isArray(b.otherParticipants)) {
                    b.otherParticipants.forEach((p, idx) => {
                      rows.push(
                        <tr key={`other-nb-${i}-${idx}`}>
                          <td>{rowIndex++}</td>
                          <td>{p.name}</td>
                          <td>
                            <a href={`tel:${p.mobileNumber}`}>{p.mobileNumber}</a>
                          </td>
                          <td>{p.status || "N/A"}</td>
                          <td>{b.batch}</td>
                          <td>{b.eventName}</td>
                          <td>{b.bookingId}</td>
                          <td>{b.bookingDate}</td>
                          <td>Other</td>
                        </tr>
                      );
                    });
                  }

                  return rows;
                });
              })() : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No records match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          <h4>🕗 People Who Didn't Book Yet </h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Batch</th>
                <th>Event Name</th>
                <th>Booking ID</th>
                <th>Booking Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotBooked.length > 0 ? (() => {
                let rowIndex = 1;

                return filteredNotBooked.flatMap((b, i) => {
                  const rows = [];

                  // Main person
                  rows.push(
                    <tr key={`main-nb-${i}`}>
                      <td>{rowIndex++}</td>
                      <td>{b.name}</td>
                      <td>
                        <a href={`tel:${b.mobileNumber}`}>{b.mobileNumber}</a>
                      </td>
                      <td>{b.status}</td>
                      <td>{b.batch}</td>
                      <td>{b.eventName}</td>
                      <td>{b.bookingId}</td>
                      <td>{b.bookingDate}</td>
                      <td>Main</td>
                    </tr>
                  );

                  // Other participants
                  if (Array.isArray(b.otherParticipants)) {
                    b.otherParticipants.forEach((p, idx) => {
                      rows.push(
                        <tr key={`other-nb-${i}-${idx}`}>
                          <td>{rowIndex++}</td>
                          <td>{p.name}</td>
                          <td>
                            <a href={`tel:${p.mobileNumber}`}>{p.mobileNumber}</a>
                          </td>
                          <td>{p.status || "N/A"}</td>
                          <td>{b.batch}</td>
                          <td>{b.eventName}</td>
                          <td>{b.bookingId}</td>
                          <td>{b.bookingDate}</td>
                          <td>Other</td>
                        </tr>
                      );
                    });
                  }

                  return rows;
                });
              })() : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No records match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      )}
    </AdminNavbar>
  );
}

export default BookingReport;
