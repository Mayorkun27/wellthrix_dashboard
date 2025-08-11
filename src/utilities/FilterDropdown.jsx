import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterDropdown = ({ options, selectedType, setSelectedType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-40 cursor-pointer" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border border-pryClr/50 rounded-full px-4 py-2 bg-transparent text-sm text-black/80"
      >
        <span className='w-11/12 line-clamp-1 text-start'>{selectedType + " History"}</span>
        {isOpen ? (
          <FaChevronUp className="text-pryClr/50 text-xs" />
        ) : (
          <FaChevronDown className="text-pryClr/50 text-xs" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelectedType(option);
                setIsOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                option === selectedType ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {`${option}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;