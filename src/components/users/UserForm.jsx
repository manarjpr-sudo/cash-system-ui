import { useState } from "react";


function UserForm({ onSave, onCancel }) {


    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [roleId, setRoleId] = useState(1);



    const submit = (e) => {

        e.preventDefault();


        onSave({

            name,

            email,

            password,

            roleId: Number(roleId)

        });

    };



    return (

        <div className="card shadow mb-4">


            <div className="card-body">


                <h5>
                    Add User
                </h5>



                <form onSubmit={submit}>


                    <input

                        className="form-control mb-3"

                        placeholder="Name"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                        required

                    />



                    <input

                        className="form-control mb-3"

                        placeholder="Email"

                        type="email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        required

                    />



                    <input

                        className="form-control mb-3"

                        placeholder="Password"

                        type="password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        required

                    />



                    <select

                        className="form-control mb-3"

                        value={roleId}

                        onChange={(e)=>setRoleId(e.target.value)}

                    >

                        <option value="1">
                            Admin
                        </option>


                        <option value="2">
                            Cashier
                        </option>


                    </select>



                    <button className="btn btn-success me-2">

                        Save

                    </button>



                    <button

                        type="button"

                        className="btn btn-secondary"

                        onClick={onCancel}

                    >

                        Cancel

                    </button>



                </form>


            </div>


        </div>

    );

}


export default UserForm;