function DeleteCustomerModal({ customer, onConfirm, onCancel }) {

    if (!customer)
        return null;


    return (

        <div className="card shadow mb-4 border-danger">

            <div className="card-body">

                <h5 className="text-danger">
                    Delete Customer
                </h5>


                <p>
                    Are you sure you want to delete:
                    <strong> {customer.name}</strong> ?
                </p>


                <button
                    className="btn btn-danger me-2"
                    onClick={onConfirm}
                >
                    Delete
                </button>


                <button
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>


            </div>

        </div>

    );

}


export default DeleteCustomerModal;