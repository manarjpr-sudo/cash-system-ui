import { useEffect, useState, useContext } from "react";
import { getUsers, deleteUser } from "../services/userService";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import { AuthContext } from "../context/AuthContext";


function Users() {


    const [users, setUsers] = useState([]);

    const [editingUser, setEditingUser] = useState(null);


    const { hasPermission } = useContext(AuthContext);



    const loadUsers = async () => {

        const response = await getUsers();

        setUsers(response.data);

    };



    useEffect(() => {

        loadUsers();

    }, []);


    const handleDelete = async (id) => {

        try {

            await deleteUser(id);

            alert("User deleted successfully");

            loadUsers();

        } catch(error) {

            console.log(error);

            alert(
                error.response?.data ||
                "Failed to delete user"
            );

        }

    };


    return (

        <div className="container mt-4">


            <h2>
                Users Management
            </h2>




            {
                (hasPermission("Create_User") || editingUser) && (

                    <UserForm
                        onSuccess={loadUsers}
                        editingUser={editingUser}
                        clearEdit={() => setEditingUser(null)}
                    />

                )
            }





            <UserTable

                users={users}

                onEdit={setEditingUser}

                onDelete={handleDelete}

                canEdit={hasPermission("Edit_User")}

                canDelete={hasPermission("Delete_User")}

            />



        </div>

    );

}


export default Users;