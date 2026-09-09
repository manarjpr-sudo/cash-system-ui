import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="d-flex" style={{ minHeight: "100vh", background: "var(--bg-app)" }}>
            <Sidebar />
            <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0, minHeight: "100vh" }}>
                <Navbar />
                <main className="flex-grow-1 p-3 p-md-4" style={{ overflowX: "auto", minHeight: "200px" }}>
                    <Outlet />
                </main>
                {/* ❌ حذف <Footer /> نهائياً */}
            </div>
        </div>
    );
}

export default Layout;