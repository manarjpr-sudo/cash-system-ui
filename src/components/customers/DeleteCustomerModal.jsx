import { useLanguage } from "../../context/LanguageContext";

function DeleteCustomerModal({ customer, onConfirm, onCancel }) {
    const { language } = useLanguage();

    const t = {
        ar: {
            title: "تأكيد الحذف",
            confirmText: `هل أنت متأكد من حذف العميل "${customer?.name}"؟`,
            warning: "هذا الإجراء لا يمكن التراجع عنه.",
            cancel: "إلغاء",
            confirm: "حذف",
        },
        en: {
            title: "Confirm Deletion",
            confirmText: `Are you sure you want to delete customer "${customer?.name}"?`,
            warning: "This action cannot be undone.",
            cancel: "Cancel",
            confirm: "Delete",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;

    return (
        <div className="system-modal-backdrop">
            <div className="system-modal">
                <div className="system-modal-header">
                    <h3>{lang.title}</h3>
                    <button type="button" className="modal-close" onClick={onCancel}>×</button>
                </div>
                <div className="system-modal-body">
                    <p>{lang.confirmText}</p>
                    <p className="text-danger" style={{ fontSize: "12px" }}>{lang.warning}</p>
                </div>
                <div className="system-modal-footer">
                    <button className="modal-button modal-button-secondary" onClick={onCancel}>
                        {lang.cancel}
                    </button>
                    <button className="modal-button modal-button-danger" onClick={onConfirm}>
                        {lang.confirm}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteCustomerModal;