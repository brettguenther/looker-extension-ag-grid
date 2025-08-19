import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ExtensionContext40 } from '@looker/extension-sdk-react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export const AgGridTable = () => {
  const { coreSDK } = useContext(ExtensionContext40);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  useEffect(() => {
    const fetchLookerData = async () => {
      try {
        // A simple inline query. Replace with your model, view, and fields.
        const query = {
          model: 'basic_ecomm',
          view: 'basic_order_items',
          fields: ['basic_users.state', 'basic_users.city', 'basic_order_items.count'],
          limit: '500',
        };

        const result = await coreSDK.run_inline_query({
          result_format: 'json_detail',
          body: query,
        });

        console.log(`result ${JSON.stringify(result)}`);
        // console.log(`result.ok ${result}`)

        if (result.ok) {
          const fields = [...result.value.fields.dimensions, ...result.value.fields.measures];
          // Create AG-Grid column definitions from Looker field metadata
          const columnDefs = fields.map((field) => ({
            headerName: field.label_short || field.label,
            field: field.name.replace(/\./g, '_'),
          }));
          console.log(`columnDefs ${JSON.stringify(columnDefs)}`);
          setColDefs(columnDefs);

          // Create AG-Grid row data from the Looker query result
          const rowData = result.value.data.map((row) => {
            const newRow = {};
            for (const cell in row) {
              newRow[cell.replace(/\./g, '_')] = row[cell].value;
            }
            return newRow;
          });
          console.log(`rowData ${JSON.stringify(rowData)}`);
          setRowData(rowData);
        } else {
          console.error('Error fetching Looker data:', result.error);
        }
      } catch (error) {
        console.error('Failed to run inline query', error);
      }
    };

    if (coreSDK) {
      fetchLookerData();
    }
  }, [coreSDK]);

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%', marginTop: '20px' }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef}></AgGridReact>
    </div>
  );
};