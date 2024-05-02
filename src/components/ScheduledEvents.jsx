import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminNavbar from "./AdminNavbar";
function ScheduledEvents() {
  const [dataFromChild, setDataFromChild] = useState("");
  function handleDataFromChild(data) {
    setDataFromChild(data);
  }
  const handleDelete = () => {
    // Handle delete logic here
    console.log('Item deleted');
  };
  return (
    <div>
        <AdminNavbar />
        <form onSubmit={handleDelete}>
      <input type="submit"  style={{ background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v2H3V5zm4.46 10.12a.75.75 0 000 1.06.76.76 0 001.06 0L12 11.06l3.48 3.48a.75.75 0 001.06 0 .75.75 0 000-1.06L13.06 10l3.48-3.48a.75.75 0 00-1.06-1.06L12 8.94l-3.48-3.48a.75.75 0 00-1.06 1.06L10.94 10 7.46 13.48a.75.75 0 01-1.06 0z"/></svg>') no-repeat center` }} />
    </form>
    </div>
  )
}

export default ScheduledEvents
