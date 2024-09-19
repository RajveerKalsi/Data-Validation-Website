import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Typography, TableSortLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTable, useSortBy } from 'react-table';
import './WalmartVal.scss';

const WalmartVal = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [tableRows, setTableRows] = useState([]);
    const [filterOption] = useState('all'); // Dropdown state
    const [threshold, setThreshold] = useState(0); 
    const [columns] = useState([
        { Header: 'S.No', accessor: 'sno' },
        { Header: 'Campaign Name', accessor: 'campaignName' },
        //status
        { Header: 'Status (Walmart)', accessor: 'status1' },
        { Header: 'Status (Anarix)', accessor: 'status2' },
        //imp
        { Header: 'Impressions (Walmart)', accessor: 'impressions1' },
        { Header: 'Impressions (Anarix)', accessor: 'impressions2' },
        { Header: 'Impressions Difference', accessor: 'impDifference' },
        //cli
        { Header: 'Clicks (Walmart)', accessor: 'clicks1' },
        { Header: 'Clicks (Anarix)', accessor: 'clicks2' },
        { Header: 'Clicks Difference', accessor: 'cliDifference' },
        //spend
        { Header: 'Spend (Walmart)', accessor: 'spend1' },
        { Header: 'Spend (Anarix)', accessor: 'spend2' },
        { Header: 'Spend Difference', accessor: 'spendDifference' },
        //sales
        { Header: 'Sales (Walmart)', accessor: 'sales1' },
        { Header: 'Sales (Anarix)', accessor: 'sales2' },
        { Header: 'Sales Difference', accessor: 'salesDifference' },
        //units
        { Header: 'Units (Walmart)', accessor: 'units1' },
        { Header: 'Units (Anarix)', accessor: 'units2' },
        { Header: 'Units Difference', accessor: 'unitsDifference' },
        //budget
        { Header: 'Daily Budget (Walmart)', accessor: 'dBudget1' },
        { Header: 'Daily Budget (Anarix)', accessor: 'dBudget2' },
        { Header: 'Daily Budget Difference', accessor: 'dBudgetDifference' },
        //ctr
        { Header: 'CTR (Walmart)', accessor: 'ctr1' },
        { Header: 'CTR (Anarix)', accessor: 'ctr2' },
        { Header: 'CTR Difference', accessor: 'ctrDifference' },
        //cpc
        { Header: 'CPC (Walmart)', accessor: 'cpc1' },
        { Header: 'CPC (Anarix)', accessor: 'cpc2' },
        { Header: 'CPC Difference', accessor: 'cpcDifference' },
        //cvr units
        { Header: 'CVR Units (Walmart)', accessor: 'cvr1' },
        { Header: 'CVR Units (Anarix)', accessor: 'cvr2' },
        { Header: 'CVR Units Difference', accessor: 'cvrDifference' },
        //cvr orders
        { Header: 'CVR Orders (Walmart)', accessor: 'cvrO1' },
        { Header: 'CVR Orders (Anarix)', accessor: 'cvrO2' },
        { Header: 'CVR Orders Difference', accessor: 'cvrOrderDifference' },
        //roas
        { Header: 'ROAS (Walmart)', accessor: 'roas1' },
        { Header: 'ROAS (Anarix)', accessor: 'roas2' },
        { Header: 'ROAS Difference', accessor: 'roasDifference' },
        //acos
        { Header: 'ACOS (Walmart)', accessor: 'acos1' },
        { Header: 'ACOS (Anarix)', accessor: 'acos2' },
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
            Status: "Campaign Status",
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Total Attributed Sales",
            Units: "Units Sold",
            DBudget: "Daily Budget",
            Ctr: "CTR",
            Cpc: "Average CPC",
            CvrO: "Conversion Rate",
            Roas: "RoAS",
        };

        const mappingFile2 = {
            CampaignName: "Campaign Name",
            Status: "Status",
            Impressions: "Impressions",
            Clicks: "Clicks",
            Spend: "Ad Spend",
            Sales: "Ad Sales",
            Units: "Ad Units",
            DBudget: "Daily Budget",
            Ctr: "CTR",
            Cpc: "CPC",
            Cvr: "CVR (Units Based)",
            CvrO: "CVR (Orders Based)",
            Roas: "ROAS",
            Acos: "ACOS",
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

            const status1 = file1Row ? file1Row[mappingFile1.Status] : "NA";
            const status2 = file2Row ? file2Row[mappingFile2.Status] : "NA";
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
            const dBudget1 = file1Row ? cleanNumber(file1Row[mappingFile1.DBudget]) : 0;
            const dBudget2 = file2Row ? cleanNumber(file2Row[mappingFile2.DBudget]) : 0;

            const ctr1 = file1Row ? cleanNumber(file1Row[mappingFile1.Ctr]) * 100 : 0;
            const ctr2 = file2Row ? cleanNumber(file2Row[mappingFile2.Ctr]) : 0;
            const cpc1 = file1Row ? cleanNumber(file1Row[mappingFile1.Cpc]) : 0;
            const cpc2 = file2Row ? cleanNumber(file2Row[mappingFile2.Cpc]) : 0;
            const cvr1 = clicks1 ? (units1 / clicks1) * 100 : 0;
            const cvr2 = file2Row ? cleanNumber(file2Row[mappingFile2.Cvr]) : 0;
            const cvrO1 = file1Row ? cleanNumber(file1Row[mappingFile1.CvrO]) * 100 : 0;
            const cvrO2 = file2Row ? cleanNumber(file2Row[mappingFile2.CvrO]) : 0;
            const roas1 = file1Row ? cleanNumber(file1Row[mappingFile1.Roas]) : 0;
            const roas2 = file2Row ? cleanNumber(file2Row[mappingFile2.Roas]) : 0;
            const acos1 = sales1 ? (spend1 / sales1) *100 : 0;
            const acos2 = file2Row ? cleanNumber(file2Row[mappingFile2.Acos]) : 0;

            // Calculate differences
            const ctrDifference = Math.abs(ctr1 - ctr2).toFixed(2);
            const cpcDifference = Math.abs(cpc1 - cpc2).toFixed(2);
            const cvrDifference = Math.abs(cvr1 - cvr2).toFixed(2);
            const cvrOrderDifference = Math.abs(cvrO1 - cvrO2).toFixed(2);
            const roasDifference = Math.abs(roas1 - roas2).toFixed(2);
            const acosDifference = Math.abs(acos1 - acos2).toFixed(2);

            const impDifference = Math.abs(impressions1 - impressions2).toFixed(2);
            const cliDifference = Math.abs(clicks1 - clicks2).toFixed(2);
            const spendDifference = Math.abs(spend1 - spend2).toFixed(2);
            const salesDifference = Math.abs(sales1 - sales2).toFixed(2);
            const unitsDifference = Math.abs(units1 - units2).toFixed(2);
            const dBudgetDifference = Math.abs(dBudget1 - dBudget2).toFixed(2);

            const highlightColor = 
            (Math.abs(impDifference) > threshold ||
                Math.abs(cliDifference) > threshold ||
                Math.abs(spendDifference) > threshold ||
                Math.abs(salesDifference) > threshold ||
                Math.abs(unitsDifference) > threshold ||
                Math.abs(dBudgetDifference) > threshold) &&
            (ctrDifference !== "0.00" || cpcDifference !== "0.00" || cvrDifference !== "0.00" || cvrOrderDifference !== "0.00" || roasDifference !== "0.00" || acosDifference !== "0.00") 
                ? "red"
            : (Math.abs(impDifference) > threshold ||
                Math.abs(cliDifference) > threshold ||
                Math.abs(spendDifference) > threshold ||
                Math.abs(salesDifference) > threshold ||
                Math.abs(unitsDifference) > threshold ||
                Math.abs(dBudgetDifference) > threshold)
                ? "orange"
            : (ctrDifference !== "0.00" || cpcDifference !== "0.00" || cvrDifference !== "0.00" || cvrOrderDifference !== "0.00" || roasDifference !== "0.00" || acosDifference !== "0.00")
                ? "yellow"
            : "";

            return {
                sno: index + 1,
                campaignName,
                status1,
                status2,
                impressions1,
                impressions2,
                impDifference,
                clicks1,
                clicks2,
                cliDifference,
                spend1,
                spend2,
                spendDifference,
                sales1,
                sales2,
                salesDifference,
                units1,
                units2,
                unitsDifference,
                dBudget1,
                dBudget2,
                dBudgetDifference,
                ctr1: ctr1.toFixed(2),
                ctr2: ctr2.toFixed(2),
                ctrDifference,
                cpc1: cpc1.toFixed(2),
                cpc2: cpc2.toFixed(2),
                cpcDifference,
                cvr1: cvr1.toFixed(2),
                cvr2: cvr2.toFixed(2),
                cvrDifference,
                cvrO1: cvrO1.toFixed(2),
                cvrO2: cvrO2.toFixed(2),
                cvrOrderDifference,
                roas1: roas1.toFixed(2),
                roas2: roas2.toFixed(2),
                roasDifference,
                acos1: acos1.toFixed(2),
                acos2: acos2.toFixed(2),
                acosDifference,
                highlightColor
            };
        });

        const sortedRows = rows.sort((a, b) => {
            const colorPriority = {
                red: 0,
                orange: 1,
                yellow: 2,
                '': 3
            };
            return colorPriority[a.highlightColor] - colorPriority[b.highlightColor];
        });

        setTableRows(sortedRows);
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
            <Typography variant="h4">Walmart Campaign Data Validation</Typography>

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

                <TextField
                    label="Difference Threshold"
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    style={{ marginTop: '10px' }}
                />

                <Button
                    onClick={loadFiles}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px' }}
                >
                    Compare Files
                </Button>
            </div>

            <div className="results">
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Comparison Table</Typography>
                            <Box display="flex" alignItems="center">
                                <Box display="flex" alignItems="center" mr={2}>
                                    <div className="color-box red" />
                                    <Typography variant="body2">Devired and Known Values are Diff.</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mr={2}>
                                    <div className="color-box orange" />
                                    <Typography variant="body2">Known Values are Diff.</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <div className="color-box yellow" />
                                    <Typography variant="body2">Devired Values are Diff.</Typography>
                                </Box>
                            </Box>
                        </Box>
                        {tableRows.length === 0 ? (
                            <Typography variant="h6" color="textSecondary" align="center" style={{marginTop: '20px'}}>
                                No Campaign Found
                            </Typography>
                        ) : (
                            <TableContainer component={Paper} style={{ maxHeight: 600, overflowY: 'auto', maxWidth: 1000, overflowX: 'auto' }}>
                                <Table {...getTableProps()}>
                                    <TableHead style={{ position: 'sticky', top: 0, zIndex: 1}}>
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
                                            const rowData = row.original;
                                            return (
                                                <TableRow {...row.getRowProps()}>
                                                    {row.cells.map(cell => {
                                                        const cellData = cell.value;
                                                        const highlightColor = rowData.highlightColor;

                                                        // Check which column is being rendered and apply bold based on the condition
                                                        const isBold = highlightColor && (
                                                            (cell.column.id === 'impDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'cliDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'spendDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'salesDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'unitsDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'dBudgetDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'ctrDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'cpcDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'cvrDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'roasDifference' && cellData !== '0.00') ||
                                                            (cell.column.id === 'acosDifference' && cellData !== '0.00')
                                                        );
                                                        return (
                                                            <TableCell
                                                                {...cell.getCellProps()}
                                                                style={{
                                                                    backgroundColor: rowData.highlightColor,
                                                                    fontWeight: isBold ? 'bold' : 'normal' // Apply bold if the condition is true
                                                                }}
                                                            >
                                                                {cell.render('Cell')}
                                                            </TableCell>
                                                        );
                                                    })}
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

export default WalmartVal;
