import { useEffect, useState } from "react";
import {
    createUser,
    updateUser
} from "../../services/userService";


function UserForm({
    onSuccess,
    editingUser,
    clearEdit
}) {


    const [form, setForm] = useState({

        name: "",
        email: "",
        password: "",
        roleId: 2

    });


    const [error, setError] = useState("");





    useEffect(() => {


        if (editingUser) {


            setForm({

                name: editingUser.name,

                email: editingUser.email,

                password: "",

                roleId: editingUser.roleId || 2

            });


        }
        else {


            setForm({

                name: "",

                email: "",

                password: "",

                roleId: 2

            });


        }


    }, [editingUser]);







    const handleChange = (e) => {


        setForm({

            ...form,

            [e.target.name]: e.target.value

        });


    };







    const handleSubmit = async (e) => {


        e.preventDefault();


        try {


            setError("");



            if (editingUser) {


                await updateUser(
                    editingUser.id,
                    {

                        name: form.name,

                        email: form.email,

                        roleId: Number(form.roleId)

                    }
                );


            }
            else {


                await createUser({

                    name: form.name,

                    email: form.email,

                    password: form.password,

                    roleId: Number(form.roleId)

                });


            }





            setForm({

                name: "",

                email: "",

                password: "",

                roleId: 2

            });



            if(clearEdit)
                clearEdit();



            onSuccess();



        }


        catch(err) {


            console.error(
                "User save error:",
                err.response?.data || err.message
            );


            setError(
                err.response?.data ||
                "Failed to save user"
            );


        }


    };






    return (

        <div className="card mb-4 shadow">


            <div className="card-body">


                <h5>

                    {
                        editingUser
                        ? "Edit User"
                        : "Create User"
                    }

                </h5>




                {
                    error &&

                    <div className="alert alert-danger">

                        {error}

                    </div>

                }





                <form onSubmit={handleSubmit}>


                    <div className="mb-2">

                        <input

                            className="form-control"

                            name="name"

                            placeholder="Name"

                            value={form.name}

                            onChange={handleChange}

                            required

                        />

                    </div>





                    <div className="mb-2">

                        <input

                            className="form-control"

                            name="email"

                            placeholder="Email"

                            type="email"

                            value={form.email}

                            onChange={handleChange}

                            required

                        />

                    </div>





                    {
                        !editingUser &&

                        <div className="mb-2">


                            <input

                                className="form-control"

                                name="password"

                                placeholder="Password"

                                type="password"

                                value={form.password}

                                onChange={handleChange}

                                required

                            />


                        </div>

                    }





                    <div className="mb-2">


                        <select

                            className="form-control"

                            name="roleId"

                            value={form.roleId}

                            onChange={handleChange}

                        >

                            <option value={1}>
                                Admin
                            </option>


                            <option value={2}>
                                Cashier
                            </option>


                        </select>


                    </div>





                    <button
                        className="btn btn-primary"
                    >

                        {
                            editingUser
                            ? "Update User"
                            : "Create User"
                        }

                    </button>




                    {
                        editingUser &&

                        <button

                            type="button"

                            className="btn btn-secondary ms-2"

                            onClick={clearEdit}

                        >

                            Cancel

                        </button>

                    }



                </form>



            </div>


        </div>

    );


}


export default UserForm;