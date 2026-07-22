function OrderTable({ orders, onApprove, onReject }) {


    return (

        <div className="card shadow">

            <div className="card-body">


                <table className="table table-striped">


                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>User</th>
                            <th>Customer</th>
                            <th>Actions</th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            orders.map(order => (

                                <tr key={order.id}>


                                    <td>
                                        {order.id}
                                    </td>


                                    <td>
                                        {order.type}
                                    </td>


                                    <td>
                                        {order.status}
                                    </td>


                                    <td>
                                        {order.amount}
                                    </td>


                                    <td>
                                        {order.description}
                                    </td>


                                    <td>
                                        {order.userName}
                                    </td>


                                    <td>
                                        {order.customerName || "-"}
                                    </td>



                                    <td>


                                        {
                                            order.status === "Pending" && (

                                                <>

                                                    <button
                                                        className="btn btn-success btn-sm me-2"
                                                        onClick={() => onApprove(order.id)}
                                                    >
                                                        Approve
                                                    </button>


                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => onReject(order.id)}
                                                    >
                                                        Reject
                                                    </button>

                                                </>

                                            )
                                        }


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


export default OrderTable;