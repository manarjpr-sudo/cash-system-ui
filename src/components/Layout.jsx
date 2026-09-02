import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="d-flex min-vh-100 bg-light">
            <Sidebar />
            <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="container-fluid py-4 px-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
export default Layout;