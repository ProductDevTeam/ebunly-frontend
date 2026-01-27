"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterBar({ onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  const filters = [
    {
      label: "Occassion",
      key: "category",
      options: [
        { label: "Birthday", value: "birthday" },
        { label: "Wedding", value: "wedding" },
        { label: "Anniversary", value: "anniversary" },
        { label: "Corporate", value: "corporate" },
        { label: "Festival", value: "festival" },
      ],
    },
    {
      label: "Gift Type",
      key: "category",
      options: [
        { label: "Clothing", value: "clothing" },
        { label: "Accessories", value: "accessories" },
        { label: "Home Decor", value: "home-decor" },
        { label: "Electronics", value: "electronics" },
        { label: "Personalized", value: "personalized" },
      ],
    },
    {
      label: "Price",
      key: "price",
      options: [
        { label: "Under ₦1,000", minPrice: 0, maxPrice: 1000 },
        { label: "₦1,000 - ₦5,000", minPrice: 1000, maxPrice: 5000 },
        { label: "₦5,000 - ₦10,000", minPrice: 5000, maxPrice: 10000 },
        { label: "Above ₦10,000", minPrice: 10000, maxPrice: undefined },
      ],
    },
  ];

  const handleFilterSelect = (filterKey, value) => {
    let newFilters = { ...selectedFilters };

    if (filterKey === "price") {
      newFilters.minPrice = value.minPrice;
      newFilters.maxPrice = value.maxPrice;
    } else {
      newFilters[filterKey] = value;
    }

    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const quickFilters = ["Discounts", "Made In Naija", "Delivery Date"];

  return (
    <div className="bg-white px-8.5 font-sans py-4 hidden md:block">
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <div key={filter.label} className="relative group">
            <button className="flex items-center space-x-2 rounded-lg hover:border-gray-400 transition-colors bg-white">
              <span className="text-md font-medium text-gray-900">
                {filter.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {filter.options.map((option) => (
                <button
                  key={option.label || option.value}
                  onClick={() =>
                    handleFilterSelect(
                      filter.key,
                      filter.key === "price" ? option : option.value,
                    )
                  }
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Filters */}
        {quickFilters.map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 text-md font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
