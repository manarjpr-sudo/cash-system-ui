import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <nav className="navbar navbar-light bg-white shadow-sm px-4">

            <h5 className="mb-0">
                Cash System
            </h5>

            <div className="d-flex align-items-center">

                <span className="me-3">
                    {user?.name}
                </span>

                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

}

export default Navbar;