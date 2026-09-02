import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

function CustomerForm({ customer, onSave, onCancel }) {
    const { language } = useLanguage();
    const [form, setForm] = useState({
        name: "",
        phone: "",
        identity_number: "",
        room_number: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const t = {
        ar: {
            title: customer ? "تعديل عميل" : "إضافة عميل جديد",
            name: "الاسم",
            phone: "الهاتف",
            identity: "رقم الهوية",
            room: "رقم الغرفة",
            notes: "ملاحظات",
            save: "حفظ",
            cancel: "إلغاء",
            saving: "جارٍ الحفظ...",
            nameRequired: "الاسم مطلوب",
            errorPrefix: "فشل حفظ العميل",
        },
        en: {
            title: customer ? "Edit Customer" : "Add New Customer",
            name: "Name",
            phone: "Phone",
            identity: "Identity Number",
            room: "Room Number",
            notes: "Notes",
            save: "Save",
            cancel: "Cancel",
            saving: "Saving...",
            nameRequired: "Name is required",
            errorPrefix: "Failed to save customer",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;

    useEffect(() => {
        if (customer) {
            setForm({
                name: customer.name || "",
                phone: customer.phone || "",
                identity_number: customer.identity_number || "",
                room_number: customer.room_number || "",
                notes: customer.notes || "",
            });
        }
    }, [customer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!form.name.trim()) {
            setErrorMessage(lang.nameRequired);
            return;
        }

        setLoading(true);
        try {
            await onSave(form);
            setForm({ name: "", phone: "", identity_number: "", room_number: "", notes: "" });
        } catch (error) {
            console.error("Customer save error:", error);
            const errorData = error.response?.data;
            if (errorData?.message) {
                setErrorMessage(errorData.message);
            } else if (errorData?.errors) {
                const firstError = Object.values(errorData.errors).flat()[0];
                setErrorMessage(firstError || lang.errorPrefix);
            } else {
                setErrorMessage(error.message || lang.errorPrefix);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-4 p-3" style={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h5 style={{ marginBottom: "16px", fontWeight: 600, color: "#0f172a" }}>
                {lang.title}
            </h5>

            {errorMessage && (
                <div className="alert alert-danger" role="alert" style={{ fontSize: "13px" }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                            {lang.name} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            disabled={loading}
                            style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                            {lang.phone}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            disabled={loading}
                            style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                            {lang.identity}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.identity_number}
                            onChange={(e) => setForm({ ...form, identity_number: e.target.value })}
                            disabled={loading}
                            style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                            {lang.room}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.room_number}
                            onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                            disabled={loading}
                            style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label" style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                            {lang.notes}
                        </label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            disabled={loading}
                            style={{ borderRadius: "8px", borderColor: "#cbd5e1" }}
                        />
                    </div>
                </div>

                <div className="d-flex gap-2 justify-content-end mt-3">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                        style={{ borderRadius: "8px", fontSize: "13px", padding: "8px 20px" }}
                    >
                        {lang.cancel}
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                        style={{ borderRadius: "8px", fontSize: "13px", padding: "8px 24px" }}
                    >
                        {loading ? lang.saving : lang.save}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CustomerForm;