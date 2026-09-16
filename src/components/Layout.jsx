import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="personal-layout">
            <Sidebar />

            <div className="personal-layout-main">
                <Navbar />

                <main className="personal-layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;