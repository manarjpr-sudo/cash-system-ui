function Dashboard() {

    return (

        <div className="container mt-5">

            <h1>
                Cash System Dashboard
            </h1>


            <div className="row mt-4">


                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>
                                Pending Orders
                            </h5>

                            <h2>
                                0
                            </h2>

                        </div>

                    </div>

                </div>



                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>
                                Approved Orders
                            </h5>

                            <h2>
                                0
                            </h2>

                        </div>

                    </div>

                </div>



                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>
                                Transactions
                            </h5>

                            <h2>
                                0
                            </h2>

                        </div>

                    </div>

                </div>


            </div>


        </div>

    );
}


export default Dashboard;