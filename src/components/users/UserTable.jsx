function UserTable({ users }) {


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