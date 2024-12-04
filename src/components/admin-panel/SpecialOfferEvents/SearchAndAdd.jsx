import React, { useState } from 'react';
import './SearchAndAdd.css';

const SearchAndAdd = ({ options, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.toLowerCase().includes(e.target.value.toLowerCase()) &&
          !selectedItems.includes(option)
      )
    );
  };

  const handleSelect = (item) => {
    setSelectedItems((prev) => [...prev, item]);
    setFilteredOptions((prev) => prev.filter((option) => option !== item));
    setSearchText('');
  };

  const handleRemove = (item) => {
    setSelectedItems((prev) => prev.filter((selected) => selected !== item));
    setFilteredOptions((prev) => [...prev, item].sort());
  };

  return (
    <div className="search-add-container">
      <input
        type="text"
        placeholder={placeholder || 'Search and add...'}
        value={searchText}
        onChange={handleSearchChange}
      />

      {searchText && filteredOptions.length > 0 && (
        <ul>
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}

      <div className="selected-items">
        {selectedItems.map((item, index) => (
          <span key={index}>
            {item}{' '}
            <span
              className="remove-item"
              onClick={() => handleRemove(item)}
            >
              ×
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchAndAdd;
