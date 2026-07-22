import { useEffect, useState } from "react";
import api from "../api/axios";

import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";


function Users() {


    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);



    useEffect(() => {

        loadUsers();

    }, []);




    const loadUsers = async () => {

        try {

            const response = await api.get("/users");

            setUsers(response.data);


        } catch(error) {

            console.log(error);

            alert("Failed to load users");


        } finally {

            setLoading(false);

        }

    };





    const createUser = async (user) => {

        try {


            await api.post(
                "/users",
                user
            );


            alert("User created successfully");


            setShowForm(false);


            loadUsers();



        } catch(error) {


            console.log(error);


            alert(
                error.response?.data ||
                "Failed to create user"
            );


        }

    };





    if (loading) {

        return (

            <div className="container mt-4">

                <h4>
                    Loading...
                </h4>

            </div>

        );

    }





    return (

        <div className="container mt-4">



            <div className="d-flex justify-content-between align-items-center mb-4">


                <h2>
                    Users
                </h2>



                <button

                    className="btn btn-primary"

                    onClick={() => setShowForm(true)}

                >

                    Add User

                </button>



            </div>





            {
                showForm && (

                    <UserForm

                        onSave={createUser}

                        onCancel={() => setShowForm(false)}

                    />

                )
            }





            <UserTable

                users={users}

            />



        </div>

    );

}


export default Users;