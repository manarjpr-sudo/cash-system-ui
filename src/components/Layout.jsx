import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


function Layout() {

    return (

        <div className="d-flex">

            <Sidebar />

            <div className="flex-grow-1">

                <Navbar />

                <main className="p-4">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}


export default Layout;