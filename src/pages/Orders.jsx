import { useEffect, useState } from "react";
import api from "../api/axios";

import OrderForm from "../components/orders/OrderForm";
import OrderTable from "../components/orders/OrderTable";


function Orders() {


    const [orders, setOrders] = useState([]);

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);



    useEffect(() => {

        loadOrders();

        loadCustomers();

    }, []);




    const loadOrders = async () => {

        try {

            const response = await api.get("/orders");

            setOrders(response.data);


        } catch (error) {

            console.log(error);

            alert("Failed to load orders");


        } finally {

            setLoading(false);

        }

    };




    const loadCustomers = async () => {

        try {

            const response = await api.get("/customers");

            setCustomers(response.data);


        } catch (error) {

            console.log(error);

        }

    };





    const createOrder = async (order) => {

        try {


            await api.post("/orders", order);


            alert("Order created successfully");


            setShowForm(false);


            loadOrders();



        } catch (error) {


            console.log(error);


            alert(
                error.response?.data ||
                "Failed to create order"
            );


        }

    };





    const approveOrder = async (id) => {

        try {


            await api.post(
                `/orders/${id}/approve`
            );


            alert("Order approved");


            loadOrders();


        } catch(error) {


            console.log(error);


            alert(
                error.response?.data ||
                "Failed to approve order"
            );

        }

    };





    const rejectOrder = async (id) => {

        try {


            await api.post(
                `/orders/${id}/reject`
            );


            alert("Order rejected");


            loadOrders();


        } catch(error) {


            console.log(error);


            alert(
                error.response?.data ||
                "Failed to reject order"
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
                    Orders
                </h2>



                <button

                    className="btn btn-primary"

                    onClick={() => setShowForm(true)}

                >

                    Create Order

                </button>


            </div>




            {
                showForm && (

                    <OrderForm

                        customers={customers}

                        onSave={createOrder}

                        onCancel={() => setShowForm(false)}

                    />

                )
            }





            <OrderTable

                orders={orders}

                onApprove={approveOrder}

                onReject={rejectOrder}

            />



        </div>

    );

}


export default Orders;