function DataTable({ columns, data, emptyMessage = "No data found" }) {
    if (!data || data.length === 0) {
        return <div className="alert alert-info">{emptyMessage}</div>;
    }

    return (
        <div className="table-responsive">
            <table className="system-table">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIdx) => (
                        <tr key={rowIdx}>
                            {columns.map((col, colIdx) => (
                                <td key={colIdx}>
                                    {col.render ? col.render(item) : item[col.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;