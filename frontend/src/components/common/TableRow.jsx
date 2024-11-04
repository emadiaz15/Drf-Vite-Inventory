// src/components/common/TableRow.jsx
import React from 'react';

const TableRow = ({ rowData, actions }) => (
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
    {Object.keys(rowData).map((key, index) => (
      <td key={index} className="px-6 py-4">
        {typeof rowData[key] === 'object' ? (
          rowData[key].component ? rowData[key].component : rowData[key].value
        ) : (
          rowData[key]
        )}
      </td>
    ))}
    {actions && (
      <td className="px-6 py-4 space-x-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(rowData.id);
            }}
            className={`${action.className} py-1 px-3 rounded hover:${action.hoverClass}`}
          >
            {action.label}
          </button>
        ))}
      </td>
    )}
  </tr>
);

export default TableRow;
