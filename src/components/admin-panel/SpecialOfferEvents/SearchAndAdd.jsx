import React, { useState } from 'react';
import './SearchAndAdd.css';

const SearchAndAdd = ({ options, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Handle text change in search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filter options based on search input
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(value.toLowerCase()) &&
          !selectedItems.find((item) => item.value === option.value)
      )
    );
  };

  // Handle selecting an item
  const handleSelect = (item) => {
    setSelectedItems((prev) => [...prev, item]);
    setFilteredOptions((prev) => prev.filter((option) => option.value !== item.value));
    setSearchText(''); // Clear search input after selection
    setIsDropdownVisible(false); // Hide dropdown after selection
  };

  // Handle removing a selected item
  const handleRemove = (item) => {
    setSelectedItems((prev) => prev.filter((selected) => selected.value !== item.value));
    setFilteredOptions((prev) => [...prev, item].sort((a, b) => a.label.localeCompare(b.label)));
  };

  // Handle input focus to show the dropdown
  const handleInputFocus = () => {
    // Reset filtered options to show all options not yet selected
    setFilteredOptions(
      options.filter((option) => !selectedItems.find((item) => item.value === option.value))
    );
    setIsDropdownVisible(true);
  };

  // Handle clicking outside to close the dropdown
  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-add-container')) {
      setIsDropdownVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-add-container">
      <input
        type="text"
        placeholder={placeholder || 'Search and add...'}
        value={searchText}
        onChange={handleSearchChange}
        onFocus={handleInputFocus} // Show dropdown on focus
      />

      {/* Filtered Options Dropdown */}
      {isDropdownVisible && filteredOptions.length > 0 && (
        <ul>
          {filteredOptions.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* Selected Items */}
      <div className="selected-items">
        {selectedItems.map((item) => (
          <span key={item.value}>
            {item.label}{' '}
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
