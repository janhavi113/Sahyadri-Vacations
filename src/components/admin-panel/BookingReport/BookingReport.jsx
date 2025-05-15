import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";

function BookingReport() {
  const [booked, setBooked] = useState([]);
  const [notBooked, setNotBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    mobileNumber: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${apiUrl}booking-report`);
      const data = await res.json();
      if (data.isSuccess) {
        setBooked(data.booked);
        setNotBooked(data.notBooked);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Parse bookingDate string "MM/DD/YYYY" to Date object
  const parseBookingDate = (dateStr) => {
    // Expect format like "12/8/2024"
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    return new Date(+year, +month - 1, +day);
  };

  // Filter function with inclusive date range filtering
  const applyFilters = (data) =>
    data.filter((item) => {
      // Text filters (case insensitive)
      const textFiltersPass = ["name", "mobileNumber", "status"].every(
        (key) => {
          if (!filters[key]) return true;
          return item[key]
            ?.toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        }
      );
      if (!textFiltersPass) return false;

      // Date filter (inclusive)
      if (filters.fromDate || filters.toDate) {
        const bookingDateObj = parseBookingDate(item.bookingDate);
        if (!bookingDateObj) return false; // Exclude invalid dates

        if (filters.fromDate) {
          const fromDateObj = new Date(filters.fromDate );
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              <div className="row g-3">
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

          <h4>✅ People Who Booked ({filteredBooked.length})</h4>
          <table className="table table-bordered mb-5">
            <thead>
              <tr>
                <th>#</th> {/* Row Number */}
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Booking ID</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooked.length > 0 ? (
                filteredBooked.map((b, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{b.name}</td>
                    <td>
                      <a href={`tel:${b.mobileNumber}`}>{b.mobileNumber}</a>
                    </td>
                    <td>{b.status}</td>
                    <td>{b.bookingId}</td>
                    <td>{b.bookingDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No bookings match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <h4>🕗 People Who Didn't Book Yet ({filteredNotBooked.length})</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th> {/* Row Number */}
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotBooked.length > 0 ? (
                filteredNotBooked.map((b, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{b.name}</td>
                    <td>
                      <a href={`tel:${b.mobileNumber}`}>{b.mobileNumber}</a>
                    </td>
                    <td>{b.status}</td>
                    <td>{b.bookingDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
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
