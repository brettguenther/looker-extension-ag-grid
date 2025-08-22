import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { ExtensionContext40 } from '@looker/extension-sdk-react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Alpine theme
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import { AllEnterpriseModule } from "ag-grid-enterprise";

// ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([AllEnterpriseModule]);

export const AgGridTable = () => {
  const gridRef = useRef(null);
  const { visualizationSDK, visualizationData } = useContext(ExtensionContext40);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: "100%" }), []);

  const configInitialized = useRef(false);
  const [gridTheme, setGridTheme] = useState('ag-theme-balham');

  const defaultColDef = useMemo(() => ({
    // sortable: true,
    // filter: true,
    flex: 1,
    minWidth: 50,
    resizable: true,
    // enableRowGroup: true,
  }), []);

  const autoGroupColumnDef = useMemo(() => ({
    minWidth: 200,
    // headerName: visualizationData?.visConfig?.groupingColumnName,
  }), []);

  useEffect(() => {
    if (gridRef.current?.api && visualizationData?.visConfig?.groupingColumnName) {
      const existingDef = gridRef.current.api.getGridOption('autoGroupColumnDef');
      gridRef.current.api.setGridOption('autoGroupColumnDef', {
        ...existingDef,
        headerName: visualizationData.visConfig.groupingColumnName,
      });
    }
  }, [visualizationData?.visConfig?.groupingColumnName]);

  useEffect(() => {
    if (visualizationSDK) {
      const visConfig = visualizationData?.visConfig;
      if (!configInitialized.current && visConfig) {
        console.log(`visConfig: ${JSON.stringify(visConfig)}`)
        visualizationSDK.configureVisualization({
          groupingColumnName: {
            type: 'string',
            label: 'Grouping Column Name',
            placeholder: 'Enter a column name to group by',
          },

          measureHeaderName: {
            type: 'string',
            display: 'select',
            label: 'Measure Header Name',
            values: [
              { 'Short Label': 'label_short' },
              { 'Full Label': 'label' },
            ],
            default: 'label_short',
          },

          theme: {
            type: 'string',
            display: 'select',
            label: 'Theme',
            values: [
              { 'Alpine': 'ag-theme-alpine' },
              { 'Balham': 'ag-theme-balham' },
            ],
            default: 'ag-theme-balham',
          },
        });
        if (visConfig){
          visualizationSDK.setVisConfig({
            "groupingColumnName":visConfig?.groupingColumnName,
            "measureHeaderName":visConfig?.measureHeaderName,
            "theme":visConfig?.theme
          });
        }
        configInitialized.current = true;
      }
    }
  }, [visualizationSDK, visualizationData?.visConfig]);

  // useEffect(() => { 
  //   if (visualizationSDK && visualizationData?.visConfig) {
  //     const visConfig = visualizationData?.visConfig;
  //   }
  // },[visualizationData?.visConfig]);

  useEffect(() => {
    if (visualizationData && visualizationData.queryResponse && visualizationData.visConfig) {
      const { queryResponse, visConfig } = visualizationData;
      const { fields, data, subtotal_sets } = queryResponse;

      if (!fields || !data) {
        return;
      }

      const groupingColumnName = visConfig.groupingColumnName || '';
      const theme = visConfig.theme || 'ag-theme-balham';
      const measureHeaderNameType = visConfig.measureHeaderName || 'label_short';
      setGridTheme(theme);

      const subtotalFields = new Set((subtotal_sets || []).flat());

      const dimensions = (fields.dimensions || []).map((field) => {
        const isGrouping = subtotalFields.has(field.name);
        return {
          headerName: field.label_short || field.label,
          field: field.name.replace(/\./g, '_'),
          rowGroup: isGrouping,
          hide: isGrouping,
          // enableRowGroup: true,
        };
      });

      const measures = (fields.measures || []).map((field) => {
        let headerName;
        switch (measureHeaderNameType) {
          case 'label':
            headerName = field.label;
            break;
          default:
            headerName = field.label_short || field.label;
            break;
        }
        return {
          headerName,
          field: field.name.replace(/\./g, '_'),
          aggFunc: field.type === 'average' ? 'avg' : field.type,
          enableValue: true,
        };
      });

      const columnDefs = [...dimensions, ...measures];
      setColDefs(columnDefs);

      const rowData = data.map((row) => {
        const newRow = {};
        for (const cell in row) {
          newRow[cell.replace(/\./g, '_')] = row[cell].value;
        }
        return newRow;
      });
      setRowData(rowData);
    }
  }, [visualizationData]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={gridTheme}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        // enableRowGroup={true}
        groupDisplayType={"singleColumn"}
        theme="legacy"
        groupTotalRow='bottom'
        suppressAggFuncInHeader={true}
      ></AgGridReact>
      </div>
    </div>
  );
};