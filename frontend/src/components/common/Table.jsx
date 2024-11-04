// src/components/common/Table.jsx
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table = ({ headers, rows, actions }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <TableHeader headers={headers} />
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index} rowData={row} actions={actions} />
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
