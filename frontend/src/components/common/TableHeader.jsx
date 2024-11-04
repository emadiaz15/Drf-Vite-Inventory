// src/components/common/TableHeader.jsx
import React from 'react';

const TableHeader = ({ headers }) => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      {headers.map((header, index) => (
        <th key={index} className="px-6 py-3">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
