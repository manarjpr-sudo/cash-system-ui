function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <div className="table-responsive">
            <table className="system-table">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i}>
                                <div className="skeleton-line" style={{ width: '80%', height: '14px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIdx) => (
                        <tr key={rowIdx}>
                            {Array.from({ length: columns }).map((_, colIdx) => (
                                <td key={colIdx}>
                                    <div className="skeleton-line" style={{ width: colIdx === 0 ? '60%' : '85%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableSkeleton;