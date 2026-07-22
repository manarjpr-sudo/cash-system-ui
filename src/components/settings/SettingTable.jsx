function SettingTable({ settings, onEdit, onDelete }) {


    return (

        <div className="card shadow">

            <div className="card-body">


                <table className="table table-striped">


                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Actions</th>

                        </tr>

                    </thead>



                    <tbody>


                        {
                            settings.map(setting => (

                                <tr key={setting.id}>


                                    <td>
                                        {setting.id}
                                    </td>


                                    <td>
                                        {setting.key}
                                    </td>


                                    <td>
                                        {setting.value}
                                    </td>



                                    <td>


                                        <button

                                            className="btn btn-warning btn-sm me-2"

                                            onClick={() => onEdit(setting)}

                                        >

                                            Edit

                                        </button>



                                        <button

                                            className="btn btn-danger btn-sm"

                                            onClick={() => onDelete(setting)}

                                        >

                                            Delete

                                        </button>


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


export default SettingTable;