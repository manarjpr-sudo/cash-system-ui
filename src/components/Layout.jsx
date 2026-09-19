import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((current) => !current);
    };

    return (
        <div
            className={`personal-layout ${
                isSidebarCollapsed ? "sidebar-collapsed" : ""
            }`}
        >
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
            />

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