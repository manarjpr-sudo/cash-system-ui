function TransactionTable({ transactions }) {

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
                            <th>Order</th>
                            <th>User</th>
                            <th>Customer</th>
                            <th>Date</th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            transactions.map(transaction => (

                                <tr key={transaction.id}>

                                    <td>
                                        {transaction.id}
                                    </td>


                                    <td>
                                        {transaction.type}
                                    </td>


                                    <td>
                                        {transaction.status}
                                    </td>


                                    <td>
                                        {transaction.amount}
                                    </td>


                                    <td>
                                        {transaction.description}
                                    </td>


                                    <td>
                                        {transaction.orderId}
                                    </td>


                                    <td>
                                        {transaction.userName}
                                    </td>


                                    <td>
                                        {transaction.customerName || "-"}
                                    </td>


                                    <td>
                                        {new Date(transaction.createdAt)
                                            .toLocaleDateString()}
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


export default TransactionTable;