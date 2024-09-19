import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, TableSortLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTable, useSortBy } from 'react-table';
import './WalmartCampaign.scss';

const WalmartCampaign = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [tableRows, setTableRows] = useState([]);
    const [filterOption] = useState('all'); // Dropdown state
    const [columns] = useState([
        { Header: 'S.No', accessor: 'sno' },
        { Header: 'Campaign Name', accessor: 'campaignName' },
        { Header: 'CTR (File 1)', accessor: 'ctr1' },
        { Header: 'CTR (File 2)', accessor: 'ctr2' },
        { Header: 'CTR Difference', accessor: 'ctrDifference' }, // New column for CTR difference
        { Header: 'CPC (File 1)', accessor: 'cpc1' },
        { Header: 'CPC (File 2)', accessor: 'cpc2' },
        { Header: 'CPC Difference', accessor: 'cpcDifference' }, // New column for CPC difference
        { Header: 'CVR (File 1)', accessor: 'cvr1' },
        { Header: 'CVR (File 2)', accessor: 'cvr2' },
        { Header: 'CVR Difference', accessor: 'cvrDifference' },
        { Header: 'ROAS (File 1)', accessor: 'roas1' },
        { Header: 'ROAS (File 2)', accessor: 'roas2' },
        { Header: 'ROAS Difference', accessor: 'roasDifference' },
        { Header: 'ACOS (File 1)', accessor: 'acos1' },
        { Header: 'ACOS (File 2)', accessor: 'acos2' },
        { Header: 'ACOS Difference', accessor: 'acosDifference' }
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
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Total Attributed Sales",
            Units: "Units Sold"
        };

        const mappingFile2 = {
            CampaignName: "Campaign Name",
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Ad Sales",
            Units: "Ad Units"
        };

        const file1Map = {};
        data1.forEach(row => {
            file1Map[row[mappingFile1.CampaignName]] = row;
        });

        const allCampaigns = new Set([
            ...data1.map(row => row[mappingFile1.CampaignName]),
            ...data2.map(row => row[mappingFile2.CampaignName])
        ]);

        const rows = Array.from(allCampaigns).map((campaignName, index) => {
            const file1Row = file1Map[campaignName];
            const file2Row = data2.find(row => row[mappingFile2.CampaignName] === campaignName);

            const impressions1 = file1Row ? cleanNumber(file1Row[mappingFile1.Impressions]) : 0;
            const impressions2 = file2Row ? cleanNumber(file2Row[mappingFile2.Impressions]) : 0;
            const clicks1 = file1Row ? cleanNumber(file1Row[mappingFile1.Clicks]) : 0;
            const clicks2 = file2Row ? cleanNumber(file2Row[mappingFile2.Clicks]) : 0;
            const spend1 = file1Row ? cleanNumber(file1Row[mappingFile1.Spend]) : 0;
            const spend2 = file2Row ? cleanNumber(file2Row[mappingFile2.Spend]) : 0;
            const sales1 = file1Row ? cleanNumber(file1Row[mappingFile1.Sales]) : 0;
            const sales2 = file2Row ? cleanNumber(file2Row[mappingFile2.Sales]) : 0;
            const units1 = file1Row ? cleanNumber(file1Row[mappingFile1.Units]) : 0;
            const units2 = file2Row ? cleanNumber(file2Row[mappingFile2.Units]) : 0;

            const ctr1 = impressions1 ? (clicks1 / impressions1) * 100 : 0;
            const ctr2 = impressions2 ? (clicks2 / impressions2) * 100 : 0;
            const cpc1 = clicks1 ? (spend1 / clicks1) : 0;
            const cpc2 = clicks2 ? (spend2 / clicks2) : 0;
            const cvr1 = clicks1 ? (units1 / clicks1) : 0;
            const cvr2 = clicks2 ? (units2 / clicks2) : 0;
            const roas1 = spend1 ? (sales1 / spend1) : 0;
            const roas2 = spend2 ? (sales2 / spend2) : 0;
            const acos1 = sales1 ? (spend1 / sales1) : 0;
            const acos2 = sales2 ? (spend2 / sales2) : 0;

            // Calculate differences
            const ctrDifference = (ctr1 - ctr2).toFixed(2);
            const cpcDifference = (cpc1 - cpc2).toFixed(2);
            const cvrDifference = (cvr1 - cvr2).toFixed(2);
            const roasDifference = (roas1 - roas2).toFixed(2);
            const acosDifference = (acos1 - acos2).toFixed(2);

            return {
                sno: index + 1,
                campaignName,
                ctr1: ctr1.toFixed(2),
                ctr2: ctr2.toFixed(2),
                ctrDifference,
                cpc1: cpc1.toFixed(2),
                cpc2: cpc2.toFixed(2),
                cpcDifference,
                cvr1: cvr1.toFixed(2),
                cvr2: cvr2.toFixed(2),
                cvrDifference,
                roas1: roas1.toFixed(2),
                roas2: roas2.toFixed(2),
                roasDifference,
                acos1: acos1.toFixed(2),
                acos2: acos2.toFixed(2),
                acosDifference
            };
        });

        setTableRows(rows);
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
            <Typography variant="h4">Walmart Campaign CSV Comparison</Typography>

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

                {/* Dropdown for filtering campaigns */}
                <FormControl fullWidth variant="outlined" style={{ marginTop: '10px' }}>
                    <InputLabel>Filter Campaigns</InputLabel>
                    <Select
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                        label="Filter Campaigns"
                        disabled // Keep it disabled as per the updated requirement
                    >
                        <MenuItem value="all">All Campaigns</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    onClick={loadFiles}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '15px' }}
                >
                    Compare Files
                </Button>
            </div>

            <div className="results">
                <Card>
                    <CardContent>
                        {tableRows.length === 0 ? (
                            <Typography variant="h6" color="textSecondary" align="center">
                                No Campaign Found
                            </Typography>
                        ) : (
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
                                                        <TableCell
                                                            {...cell.getCellProps()}
                                                            className={
                                                                (row.original.ctrDifference !== "0.00" || row.original.cpcDifference !== "0.00" || row.original.cvrDifference !== "0.00" 
                                                                    || row.original.roasDifference !== "0.00" || row.original.acosDifference !== "0.00") &&
                                                                cell.column.id === "campaignName"
                                                                    ? "highlight"
                                                                    : ""
                                                            }
                                                        >
                                                            {cell.render('Cell')}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WalmartCampaign;
