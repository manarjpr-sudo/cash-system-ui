import { useEffect, useState } from "react";
import api from "../api/axios";

import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import DeleteCustomerModal from "../components/customers/DeleteCustomerModal";


function Customers() {


    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);


    const [showForm, setShowForm] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [deleteCustomer, setDeleteCustomer] = useState(null);



    useEffect(() => {

        loadCustomers();

    }, []);



    const loadCustomers = async () => {

        try {

            const response = await api.get("/customers");

            setCustomers(response.data);


        } catch (error) {

            console.log(error);

            alert("Failed to load customers");


        } finally {

            setLoading(false);

        }

    };




    const saveCustomer = async (customer) => {

        try {


            if (selectedCustomer) {


                await api.put(
                    `/customers/${selectedCustomer.id}`,
                    customer
                );


                alert("Customer updated successfully");


            } else {


                await api.post(
                    "/customers",
                    customer
                );


                alert("Customer added successfully");

            }



            setShowForm(false);

            setSelectedCustomer(null);


            loadCustomers();



        } catch (error) {

            console.log(error);

            alert("Failed to save customer");

        }

    };





    const removeCustomer = async () => {


        try {


            await api.delete(
                `/customers/${deleteCustomer.id}`
            );


            alert("Customer deleted successfully");


            setDeleteCustomer(null);


            loadCustomers();



        } catch (error) {


            console.log(error);

            alert("Failed to delete customer");


        }


    };




    const handleEdit = (customer) => {

        setSelectedCustomer(customer);

        setShowForm(true);

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
                    Customers
                </h2>



                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setSelectedCustomer(null);

                        setShowForm(true);

                    }}
                >
                    Add Customer
                </button>


            </div>




            {
                showForm && (

                    <CustomerForm

                        customer={selectedCustomer}

                        onSave={saveCustomer}

                        onCancel={() => {

                            setShowForm(false);

                            setSelectedCustomer(null);

                        }}

                    />

                )
            }




            {
                deleteCustomer && (

                    <DeleteCustomerModal

                        customer={deleteCustomer}

                        onConfirm={removeCustomer}

                        onCancel={() => setDeleteCustomer(null)}

                    />

                )
            }





            <CustomerTable

                customers={customers}

                onEdit={handleEdit}

                onDelete={(customer)=>setDeleteCustomer(customer)}

            />



        </div>

    );

}


export default Customers;