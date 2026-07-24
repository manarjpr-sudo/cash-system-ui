import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


function Sidebar() {


    const { hasPermission } = useContext(AuthContext);



    const linkClass = ({ isActive }) =>

        `nav-link text-white ${
            isActive ? "bg-secondary rounded" : ""
        }`;




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





            <div className="nav flex-column gap-1">





                <NavLink

                    to="/dashboard"

                    className={linkClass}

                >

                    Dashboard

                </NavLink>






                {
                    hasPermission("View_Customers") && (

                        <NavLink

                            to="/customers"

                            className={linkClass}

                        >

                            Customers

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_Orders") && (

                        <NavLink

                            to="/orders"

                            className={linkClass}

                        >

                            Orders

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_Transactions") && (

                        <NavLink

                            to="/transactions"

                            className={linkClass}

                        >

                            Transactions

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_Users") && (

                        <NavLink

                            to="/users"

                            className={linkClass}

                        >

                            Users

                        </NavLink>

                    )
                }







                {
                    hasPermission("Manage_Settings") && (

                        <NavLink

                            to="/settings"

                            className={linkClass}

                        >

                            Settings

                        </NavLink>

                    )
                }







                {
                    hasPermission("View_AuditLogs") && (

                        <NavLink

                            to="/auditlogs"

                            className={linkClass}

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