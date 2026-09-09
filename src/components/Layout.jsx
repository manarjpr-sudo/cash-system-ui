import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
            {/* ✅ السايد بار ثابت في الجانب */}
            <Sidebar />

            {/* ✅ المحتوى الرئيسي (يتوسع تلقائياً) */}
            <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
                <Navbar />
                <main className="flex-grow-1 p-3 p-md-4" style={{ overflowX: "auto" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;