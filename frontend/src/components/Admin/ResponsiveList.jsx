// components/admin/ResponsiveList.jsx
import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

const ResponsiveList = ({
  items,
  renderMobileCard,
  tableHeaders,
  renderTableRow,
  isLoading,
  emptyMessage,
  emptyAction,
  emptyActionLabel,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No items found</h3>
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        <button onClick={emptyAction} className="text-teal-600 hover:text-teal-700 font-medium">
          {emptyActionLabel}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden space-y-4">{items.map((item) => renderMobileCard(item))}</div>
      <div className="hidden md:block">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">{items.map((item) => renderTableRow(item))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ResponsiveList;