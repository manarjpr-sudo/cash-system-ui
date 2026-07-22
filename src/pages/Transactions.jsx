import { useEffect, useState } from "react";
import api from "../api/axios";

import TransactionTable from "../components/transactions/TransactionTable";


function Transactions() {


    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        loadTransactions();

    }, []);




    const loadTransactions = async () => {

        try {

            const response = await api.get("/transactions");

            setTransactions(response.data);


        } catch(error) {

            console.log(error);

            alert("Failed to load transactions");


        } finally {

            setLoading(false);

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


            <h2 className="mb-4">
                Transactions
            </h2>



            <TransactionTable

                transactions={transactions}

            />



        </div>

    );

}


export default Transactions;