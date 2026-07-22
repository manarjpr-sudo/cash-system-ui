import { useEffect, useState, useContext } from "react";
import dashboardService from "../services/dashboardService";
import { AuthContext } from "../context/AuthContext";


function Dashboard() {

    const [data, setData] = useState(null);

    const { user } = useContext(AuthContext);



    useEffect(() => {

        loadDashboard();

    }, []);





    const loadDashboard = async () => {

        try {

            const result =
                await dashboardService.getDashboard();

            setData(result);

        }

        catch(error) {

            console.log(error);

        }

    };





    if (!data)
    {
        return (
            <div className="container mt-4">
                Loading...
            </div>
        );
    }





    const isAdmin = data.role === "Admin";





    return (

        <div className="container mt-4">


            <h2 className="mb-4">
                Dashboard
            </h2>



            <div className="row g-3">



                <div className="col-md-3">

                    <div className="card shadow border-0 p-3">

                        <h6>
                            Customers
                        </h6>

                        <h3>
                            {data.totalCustomers}
                        </h3>

                    </div>

                </div>





                {
                    isAdmin && (

                        <div className="col-md-3">

                            <div className="card shadow border-0 p-3">

                                <h6>
                                    Users
                                </h6>

                                <h3>
                                    {data.totalUsers}
                                </h3>

                            </div>

                        </div>

                    )
                }







                <div className="col-md-3">

                    <div className="card shadow border-0 p-3">

                        <h6>
                            Orders
                        </h6>

                        <h3>
                            {data.totalOrders}
                        </h3>

                    </div>

                </div>







                <div className="col-md-3">

                    <div className="card shadow border-0 p-3">

                        <h6>
                            Total Amount
                        </h6>

                        <h3>
                            {data.totalAmount}
                        </h3>

                    </div>

                </div>




            </div>








            <div className="row g-3 mt-2">



                <div className="col-md-4">

                    <div className="card shadow border-warning p-3">

                        <h6>
                            Pending Orders
                        </h6>

                        <h3>
                            {data.pendingOrders}
                        </h3>

                    </div>

                </div>





                <div className="col-md-4">

                    <div className="card shadow border-success p-3">

                        <h6>
                            Approved Orders
                        </h6>

                        <h3>
                            {data.approvedOrders}
                        </h3>

                    </div>

                </div>





                <div className="col-md-4">

                    <div className="card shadow border-danger p-3">

                        <h6>
                            Rejected Orders
                        </h6>

                        <h3>
                            {data.rejectedOrders}
                        </h3>

                    </div>

                </div>



            </div>







            <hr className="my-4"/>





            <h4>
                Latest Transactions
            </h4>






            <table className="table table-striped table-hover">


                <thead>

                    <tr>

                        <th>
                            Type
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Date
                        </th>


                    </tr>


                </thead>





                <tbody>


                {
                    data.latestTransactions.map(t => (

                        <tr key={t.id}>


                            <td>
                                {t.type}
                            </td>



                            <td>
                                {t.amount}
                            </td>



                            <td>
                                {t.description}
                            </td>



                            <td>
                                {new Date(t.createdAt)
                                    .toLocaleString()
                                }
                            </td>



                        </tr>

                    ))
                }


                </tbody>



            </table>






        </div>

    );

}



export default Dashboard;