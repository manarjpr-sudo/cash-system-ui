import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();


        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });


            login(response.data);


            alert("Login successful");


            navigate("/dashboard");


        } catch (error) {


            console.log(error);


            alert(
                error.response?.data ||
                "Login failed"
            );
        }
    };



    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">


                    <div className="card shadow">


                        <div className="card-body">


                            <h3 className="text-center mb-4">
                                Cash System Login
                            </h3>



                            <form onSubmit={handleLogin}>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>


                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e)=>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>



                                <div className="mb-3">


                                    <label className="form-label">
                                        Password
                                    </label>


                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e)=>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />


                                </div>



                                <button
                                    className="btn btn-primary w-100"
                                >
                                    Login
                                </button>



                            </form>


                        </div>


                    </div>


                </div>


            </div>


        </div>

    );
}


export default Login;