function CustomerTable({ customers, onEdit, onDelete }) {

    return (

        <div className="card shadow">

            <div className="card-body">

                <table className="table table-striped">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Identity Number</th>
                            <th>Room Number</th>
                            <th>Actions</th>
                        </tr>

                    </thead>


                    <tbody>

                        {
                            customers.map(customer => (

                                <tr key={customer.id}>

                                    <td>{customer.id}</td>

                                    <td>{customer.name}</td>

                                    <td>{customer.phone}</td>

                                    <td>{customer.identityNumber}</td>

                                    <td>{customer.roomNumber}</td>


                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => onEdit(customer)}
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDelete(customer)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))
                        }


                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default CustomerTable;