import React from 'react';
import { cost_hi, cost_lo, price_hi, price_lo, value_hi, value_lo } from "../../constants";

function getColor(name) {
    if (name.toLowerCase().includes("low")) {
        return "#FA6B84";
    } else if (name.toLowerCase().includes("high") || name.toLowerCase().includes("premium")) {
        return "#00CDBB";
    } else {
        return "white";
    }
}

// Credits: code modified off Chat-GPT
function PayoffTable({ data }) {
    // Assuming data is a 2D array where data[0] represents column names
    // and each subsequent array represents a row with the first element as the row name
    const columnNames = data[0];
    const rows = data.slice(1);

    console.log(columnNames);
    console.log(rows);


    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    {/* Render column names with blue color */}
                    {columnNames.map((columnName, index) => (
                        <th key={index} style={{ fontFamily: "Avenir", color: 'white', backgroundColor: getColor(columnName), border: '1px solid #ddd', padding: '8px' }}>
                            {columnName}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* Render rows with orange-colored row names */}
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {/* Render row name with orange color */}
                        <td style={{ fontFamily: "Avenir", fontWeight: "bold", color: 'white', backgroundColor: getColor(row[0]), border: '1px solid #ddd', padding: '8px' }}>
                            {row[0]}
                        </td>
                        {/* Render row data */}
                        {row.slice(1).map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ color: cell < 0 ? 'red' : (cell > 0 ? 'green' : ''), border: '1px solid #ddd', padding: '8px', backgroundColor: 'white' }}>
                                {(cell > 0 ? "+" : "") + cell + " points"}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function PayoffMatrix({ role }) {
    // const price_lo = 0.5 * (cost_lo + value_lo);
    // const price_hi = 0.5 * (cost_hi + value_hi);
    let data;

    if (role == "consumer") {
        data = [
            ['', 'Advertised Quality - Low', 'Advertised Qulaity - High'],
            ['Actual Quality - Low', value_lo - price_hi, value_lo - price_lo],
            ['Actual Quality - High', value_hi - price_hi, value_hi - price_lo],
        ];
    } else if (role == "producer") {
        data = [
            ['', 'Advertised As - Low', 'Advertised As - High'],
            ['Produced Quality - Low', price_hi - cost_lo, price_lo - cost_lo],
            ['Produced Quality - High', price_hi - cost_hi, price_lo - cost_hi],
            // Add more rows as needed
        ];
    }

    return <PayoffTable data={data} />
}