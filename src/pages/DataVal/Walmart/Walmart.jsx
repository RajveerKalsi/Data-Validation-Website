import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, TableSortLabel } from '@mui/material';
import { useTable, useSortBy } from 'react-table';
import './Walmart.scss';

const Walmart = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [tableRows, setTableRows] = useState([]);
    const [threshold, setThreshold] = useState(0); // State for threshold
    const [columns, setColumns] = useState([
        { Header: 'S.No', accessor: (row, i) => i + 1 }, // Serial number column
        { Header: 'Campaign Name', accessor: 'campaignName' },
        { Header: 'Status (File 1)', accessor: 'status1' },
        { Header: 'Status (File 2)', accessor: 'status2' },
        { Header: 'Impressions (File 1)', accessor: 'impressions1' },
        { Header: 'Impressions (File 2)', accessor: 'impressions2' },
        { Header: 'Clicks (File 1)', accessor: 'clicks1' },
        { Header: 'Clicks (File 2)', accessor: 'clicks2' },
        { Header: 'Spend (File 1)', accessor: 'spend1' },
        { Header: 'Spend (File 2)', accessor: 'spend2' },
        { Header: 'Sales (File 1)', accessor: 'sales1' },
        { Header: 'Sales (File 2)', accessor: 'sales2' },
        { Header: 'Orders (File 1)', accessor: 'orders1' },
        { Header: 'Orders (File 2)', accessor: 'orders2' },
        { Header: 'Units (File 1)', accessor: 'units1' },
        { Header: 'Units (File 2)', accessor: 'units2' }
    ]);

    const loadFiles = () => {
        if (file1 && file2) {
            Papa.parse(file1, {
                header: true,
                complete: function(results1) {
                    Papa.parse(file2, {
                        header: true,
                        complete: function(results2) {
                            compareCSV(results1.data, results2.data);
                        }
                    });
                }
            });
        } else {
            alert("Please upload both CSV files.");
        }
    };

    const cleanNumber = (value) => {
        if (!value) return 0;
        return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
    };

    const compareCSV = (data1, data2) => {
        const mappingFile1 = {
            CampaignName: "Campaign Name",
            Status: "Status",
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Total Attributed Sales",
            Orders: "Orders",
            Units: "Units Sold"
        };

        const mappingFile2 = {
            CampaignName: "Campaign Name",
            Status: "Status",
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Ad Sales",
            Orders: "Ad Orders",
            Units: "Ad Units"
        };

        const file1Map = {};
        data1.forEach(row => file1Map[row[mappingFile1.CampaignName]] = row);

        const rows = data2.map(row => {
            const campaignName = row[mappingFile2.CampaignName];
            if (file1Map[campaignName]) {
                const file1Row = file1Map[campaignName];

                const impressions1 = cleanNumber(file1Row[mappingFile1.Impressions]);
                const impressions2 = cleanNumber(row[mappingFile2.Impressions]);
                const clicks1 = cleanNumber(file1Row[mappingFile1.Clicks]);
                const clicks2 = cleanNumber(row[mappingFile2.Clicks]);
                const spend1 = cleanNumber(file1Row[mappingFile1.Spend]);
                const spend2 = cleanNumber(row[mappingFile2.Spend]);
                const sales1 = cleanNumber(file1Row[mappingFile1.Sales]);
                const sales2 = cleanNumber(row[mappingFile2.Sales]);
                const orders1 = cleanNumber(file1Row[mappingFile1.Orders]);
                const orders2 = cleanNumber(row[mappingFile2.Orders]);
                const units1 = cleanNumber(file1Row[mappingFile1.Units]);
                const units2 = cleanNumber(row[mappingFile2.Units]);

                if (
                    Math.abs(impressions1 - impressions2) > threshold ||
                    Math.abs(clicks1 - clicks2) > threshold ||
                    Math.abs(spend1 - spend2) > threshold ||
                    Math.abs(sales1 - sales2) > threshold ||
                    Math.abs(orders1 - orders2) > threshold ||
                    Math.abs(units1 - units2) > threshold
                ) {
                    return {
                        campaignName,
                        status1: file1Row[mappingFile1.Status],
                        status2: row[mappingFile2.Status],
                        impressions1,
                        impressions2,
                        clicks1,
                        clicks2,
                        spend1,
                        spend2,
                        sales1,
                        sales2,
                        orders1,
                        orders2,
                        units1,
                        units2
                    };
                }
            } else {
                return {
                    campaignName,
                    status1: 'Not Found',
                    status2: 'N/A',
                    impressions1: 'N/A',
                    impressions2: 'N/A',
                    clicks1: 'N/A',
                    clicks2: 'N/A',
                    spend1: 'N/A',
                    spend2: 'N/A',
                    sales1: 'N/A',
                    sales2: 'N/A',
                    orders1: 'N/A',
                    orders2: 'N/A',
                    units1: 'N/A',
                    units2: 'N/A'
                };
            }
            return null;
        }).filter(row => row !== null);

        if (rows.length === 0) {
            setTableRows([{ campaignName: 'No significant differences found!' }]);
        } else {
            setTableRows(rows);
        }
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: tableRows
        },
        useSortBy
    );

    return (
        <div className="walmart-comparison">
            <Typography variant="h4">Walmart CSV Comparison</Typography>
            <div className="file-inputs">
                <div className="file-upload">
                    <Typography variant="h6">Insert Walmart Portal File</Typography>
                    <TextField
                        type="file"
                        onChange={(e) => setFile1(e.target.files[0])}
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div className="file-upload">
                    <Typography variant="h6">Insert Anarix Portal File</Typography>
                    <TextField
                        type="file"
                        onChange={(e) => setFile2(e.target.files[0])}
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div className="threshold-input">
                    <Typography variant="h6">Difference Threshold</Typography>
                    <TextField
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            inputProps: { min: 0 } // Optional: prevents negative values
                        }}
                    />
                </div>
                <Button
                    onClick={loadFiles}
                    variant="contained"
                    color="primary"
                >
                    Compare Files
                </Button>
            </div>

            <div className="results">
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} style={{ maxHeight: 600, overflowY: 'auto', maxWidth: 1000, overflowX: 'auto' }}>
                            <Table {...getTableProps()}>
                                <TableHead>
                                    {headerGroups.map(headerGroup => (
                                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                    {column.render('Header')}
                                                    <TableSortLabel
                                                        active={column.isSorted}
                                                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody {...getTableBodyProps()}>
                                    {rows.map(row => {
                                        prepareRow(row);
                                        return (
                                            <TableRow {...row.getRowProps()}>
                                                {row.cells.map(cell => (
                                                    <TableCell {...cell.getCellProps()}>
                                                        {cell.render('Cell')}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Walmart;
