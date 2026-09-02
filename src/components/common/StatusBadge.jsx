function StatusBadge({ status }) {


    const getClass = () => {

        switch(status) {

            case "Approved":
            case "Completed":
                return "bg-success";


            case "Pending":
                return "bg-warning text-dark";


            case "Rejected":
                return "bg-danger";


            default:
                return "bg-secondary";

        }

    };



    return (

        <span className={`badge ${getClass()}`}>

            {status}

        </span>

    );

}


export default StatusBadge;