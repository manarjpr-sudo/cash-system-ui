import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


function Sidebar() {


    const { hasPermission } = useContext(AuthContext);




    return (

        <div

            className="bg-dark text-white p-3"

            style={{
                width: "250px",
                minHeight: "100vh"
            }}

        >


            <h4 className="mb-4">
                Cash System
            </h4>





            <div className="nav flex-column">





                <NavLink

                    to="/dashboard"

                    className="nav-link text-white"

                >

                    Dashboard

                </NavLink>






                {
                    hasPermission("View_Dashboard") && (

                        <NavLink

                            to="/dashboard"

                            className="nav-link text-white"

                        >

                            Dashboard

                        </NavLink>

                    )
                }






                {
                    hasPermission("View_Customers") && (

                        <NavLink

                            to="/customers"

                            className="nav-link text-white"

                        >

                            Customers

                        </NavLink>

                    )
                }






                {
                    hasPermission("View_Transactions") && (

                        <NavLink

                            to="/transactions"

                            className="nav-link text-white"

                        >

                            Transactions

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_Users") && (

                        <NavLink

                            to="/users"

                            className="nav-link text-white"

                        >

                            Users

                        </NavLink>

                    )
                }






                {
                    hasPermission("Manage_Settings") && (

                        <NavLink

                            to="/settings"

                            className="nav-link text-white"

                        >

                            Settings

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_AuditLogs") && (

                        <NavLink

                            to="/auditlogs"

                            className="nav-link text-white"

                        >

                            Audit Logs

                        </NavLink>

                    )
                }




            </div>


        </div>

    );

}


export default Sidebar;