import { useState } from "react";


function OrderForm({ customers, onSave, onCancel }) {


    const [type, setType] = useState("Payment");

    const [amount, setAmount] = useState("");

    const [description, setDescription] = useState("");

    const [customerId, setCustomerId] = useState("");



    const handleSubmit = (e) => {

        e.preventDefault();


        onSave({

            type,

            amount: Number(amount),

            description,

            customerId: customerId
                ? Number(customerId)
                : null

        });


    };



    return (

        <div className="card shadow mb-4">


            <div className="card-body">


                <h5>
                    Create Order
                </h5>



                <form onSubmit={handleSubmit}>


                    <div className="mb-3">

                        <label>
                            Type
                        </label>


                        <select
                            className="form-control"
                            value={type}
                            onChange={(e)=>setType(e.target.value)}
                        >

                            <option value="Payment">
                                Payment
                            </option>

                            <option value="Receipt">
                                Receipt
                            </option>

                            <option value="Advance">
                                Advance
                            </option>


                        </select>


                    </div>




                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={(e)=>setAmount(e.target.value)}
                            required
                        />

                    </div>




                    <div className="mb-3">

                        <input
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />

                    </div>




                    <div className="mb-3">


                        <select

                            className="form-control"

                            value={customerId}

                            onChange={(e)=>setCustomerId(e.target.value)}

                        >

                            <option value="">
                                No Customer
                            </option>


                            {
                                customers.map(customer => (

                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >

                                        {customer.name}

                                    </option>

                                ))
                            }


                        </select>


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


export default OrderForm;