import { useEffect, useState } from "react";

function CustomerForm({ customer, onSave, onCancel }) {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [identityNumber, setIdentityNumber] = useState("");
    const [roomNumber, setRoomNumber] = useState("");


    useEffect(() => {

        if (customer) {

            setName(customer.name || "");
            setPhone(customer.phone || "");
            setIdentityNumber(customer.identityNumber || "");
            setRoomNumber(customer.roomNumber || "");

        } else {

            setName("");
            setPhone("");
            setIdentityNumber("");
            setRoomNumber("");

        }

    }, [customer]);


    const handleSubmit = (e) => {

        e.preventDefault();


        onSave({
            name,
            phone,
            identityNumber,
            roomNumber
        });

    };


    return (

        <div className="card shadow mb-4">

            <div className="card-body">

                <h5>
                    {customer ? "Edit Customer" : "Add Customer"}
                </h5>


                <form onSubmit={handleSubmit}>


                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            required
                        />

                    </div>


                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e)=>setPhone(e.target.value)}
                        />

                    </div>


                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Identity Number"
                            value={identityNumber}
                            onChange={(e)=>setIdentityNumber(e.target.value)}
                        />

                    </div>


                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Room Number"
                            value={roomNumber}
                            onChange={(e)=>setRoomNumber(e.target.value)}
                        />

                    </div>


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


export default CustomerForm;