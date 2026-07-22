import { useEffect, useState } from "react";
import api from "../api/axios";


function AuditLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        loadLogs();

    }, []);





    const loadLogs = async () => {

        try {

            const response = await api.get("/auditlogs");

            setLogs(response.data);


        } catch(error) {

            console.log(error);

            alert("Failed to load audit logs");


        } finally {

            setLoading(false);

        }

    };





    if (loading) {

        return (

            <div className="container mt-4">

                <h4>
                    Loading...
                </h4>

            </div>

        );

    }






    return (

        <div className="container mt-4">


            <h2 className="mb-4">
                Audit Logs
            </h2>




            <div className="card shadow">


                <div className="card-body">


                    <table className="table table-striped">


                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Action
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Date
                                </th>

                            </tr>

                        </thead>




                        <tbody>


                            {
                                logs.map(log => (

                                    <tr key={log.id}>


                                        <td>
                                            {log.id}
                                        </td>


                                        <td>
                                            {log.action}
                                        </td>


                                        <td>
                                            {log.userName}
                                        </td>


                                        <td>
                                            {log.orderId ?? "-"}
                                        </td>


                                        <td>
                                            {
                                                new Date(
                                                    log.createdAt
                                                )
                                                .toLocaleString()
                                            }
                                        </td>


                                    </tr>

                                ))
                            }


                        </tbody>


                    </table>


                </div>


            </div>


        </div>

    );

}


export default AuditLogs;