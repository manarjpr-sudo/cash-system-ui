function ActionButton({ type, onClick }) {


    const buttons = {

        edit: {
            text: "Edit",
            className: "btn btn-warning btn-sm me-2"
        },

        delete: {
            text: "Delete",
            className: "btn btn-danger btn-sm"
        },

        view: {
            text: "View",
            className: "btn btn-info btn-sm me-2"
        }

    };


    const button = buttons[type];


    if (!button) {
        return null;
    }


    return (

        <button
            className={button.className}
            onClick={onClick}
        >
            {button.text}
        </button>

    );

}


export default ActionButton;