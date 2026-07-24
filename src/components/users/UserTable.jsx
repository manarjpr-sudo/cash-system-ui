function UserTable({ users, onEdit, onDelete, canEdit, canDelete }) {


    return (

        <div className="card shadow">

            <div className="card-body">


                <table className="table table-striped">


                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>

                        </tr>

                    </thead>



                    <tbody>


                        {
                            users.map(user => (

                                <tr key={user.id}>


                                    <td>
                                        {user.id}
                                    </td>


                                    <td>
                                        {user.name}
                                    </td>


                                    <td>
                                        {user.email}
                                    </td>


                                    <td>
                                        {user.role}
                                    </td>


                                    <td>


                                        {
                                            canEdit && (

                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => onEdit(user)}
                                                >
                                                    Edit
                                                </button>

                                            )
                                        }



                                        {
                                            canDelete && (

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => onDelete(user.id)}
                                                >
                                                    Delete
                                                </button>

                                            )
                                        }


                                    </td>


                                </tr>

                            ))
                        }


                    </tbody>


                </table>


            </div>


        </div>

    );

}


export default UserTable;