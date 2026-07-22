import { useEffect, useState } from "react";
import api from "../api/axios";

import SettingTable from "../components/settings/SettingTable";
import SettingForm from "../components/settings/SettingForm";


function Settings() {


    const [settings, setSettings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [selectedSetting, setSelectedSetting] = useState(null);



    useEffect(() => {

        loadSettings();

    }, []);




    const loadSettings = async () => {

        try {

            const response = await api.get("/settings");

            setSettings(response.data);


        } catch(error) {

            console.log(error);

            alert("Failed to load settings");


        } finally {

            setLoading(false);

        }

    };





    const saveSetting = async (setting) => {

        try {


            if (selectedSetting) {


                await api.put(

                    `/settings/${selectedSetting.id}`,

                    setting

                );


                alert("Setting updated successfully");


            } else {


                await api.post(

                    "/settings",

                    setting

                );


                alert("Setting created successfully");


            }



            setShowForm(false);

            setSelectedSetting(null);


            loadSettings();



        } catch(error) {


            console.log(error);


            alert(

                error.response?.data ||

                "Failed to save setting"

            );


        }

    };





    const deleteSetting = async (setting) => {

        try {


            await api.delete(

                `/settings/${setting.id}`

            );


            alert("Setting deleted successfully");


            loadSettings();



        } catch(error) {


            console.log(error);


            alert("Failed to delete setting");


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
                    Settings
                </h2>



                <button

                    className="btn btn-primary"

                    onClick={() => {

                        setSelectedSetting(null);

                        setShowForm(true);

                    }}

                >

                    Add Setting

                </button>


            </div>





            {
                showForm && (

                    <SettingForm

                        setting={selectedSetting}

                        onSave={saveSetting}

                        onCancel={() => {

                            setShowForm(false);

                            setSelectedSetting(null);

                        }}

                    />

                )
            }






            <SettingTable

                settings={settings}

                onEdit={(setting)=>{

                    setSelectedSetting(setting);

                    setShowForm(true);

                }}

                onDelete={deleteSetting}

            />



        </div>

    );

}


export default Settings;