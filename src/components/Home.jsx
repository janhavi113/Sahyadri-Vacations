import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const handleDelete = () => {
    // Handle delete logic here
    console.log('Item deleted');
  };

  return (
    <div>i am here
    <form onSubmit={handleDelete}>
      <input type="submit" value={<FontAwesomeIcon icon={faTrash} />} />
    </form>
    </div>
  );
}

export default Home
