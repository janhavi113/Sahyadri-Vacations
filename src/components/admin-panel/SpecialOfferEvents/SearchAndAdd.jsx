import React, { useState } from 'react';
import './SearchAndAdd.css';

const SearchAndAdd = ({ options, placeholder, onSelectionChange }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(value.toLowerCase()) &&
          !selectedItems.find((item) => item.value === option.value)
      )
    );
  };

  const handleSelect = (item) => {
    const updatedItems = [...selectedItems, item];
    setSelectedItems(updatedItems);
    setFilteredOptions((prev) => prev.filter((option) => option.value !== item.value));
    setSearchText('');
    setIsDropdownVisible(false);

    // Notify parent of the selection change
    onSelectionChange && onSelectionChange(updatedItems);
  };

  const handleRemove = (item) => {
    const updatedItems = selectedItems.filter((selected) => selected.value !== item.value);
    setSelectedItems(updatedItems);
    setFilteredOptions((prev) => [...prev, item].sort((a, b) => a.label.localeCompare(b.label)));

    // Notify parent of the selection change
    onSelectionChange && onSelectionChange(updatedItems);
  };

  const handleInputFocus = () => {
    setFilteredOptions(
      options.filter((option) => !selectedItems.find((item) => item.value === option.value))
    );
    setIsDropdownVisible(true);
  };

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
        onFocus={handleInputFocus}
      />
      {isDropdownVisible && filteredOptions.length > 0 && (
        <ul>
          {filteredOptions.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <div className="selected-items">
        {selectedItems.map((item) => (
          <span key={item.value}>
            {item.label}{' '}
            <span className="remove-item" onClick={() => handleRemove(item)}>
              ×
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchAndAdd;
