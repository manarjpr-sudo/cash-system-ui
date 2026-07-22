import { useState } from "react";


function SettingForm({ setting, onSave, onCancel }) {


    const [key, setKey] = useState(
        setting?.key || ""
    );


    const [value, setValue] = useState(
        setting?.value || ""
    );



    const submit = (e) => {

        e.preventDefault();


        onSave({

            id: setting?.id,

            key,

            value

        });


    };




    return (

        <div className="card shadow mb-4">


            <div className="card-body">


                <h5>
                    {setting ? "Edit Setting" : "Add Setting"}
                </h5>



                <form onSubmit={submit}>


                    <input

                        className="form-control mb-3"

                        placeholder="Key"

                        value={key}

                        onChange={(e)=>setKey(e.target.value)}

                        required

                    />



                    <input

                        className="form-control mb-3"

                        placeholder="Value"

                        value={value}

                        onChange={(e)=>setValue(e.target.value)}

                        required

                    />



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


export default SettingForm;