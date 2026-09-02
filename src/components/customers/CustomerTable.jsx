import { useLanguage } from "../../context/LanguageContext";
import FormatDate from "../common/FormatDate";

function CustomerTable({ customers, onEdit, onDelete, canEdit, canDelete }) {
    const { language } = useLanguage();

    const t = {
        ar: {
            name: "الاسم",
            phone: "الهاتف",
            identity: "رقم الهوية",
            room: "رقم الغرفة",
            notes: "ملاحظات",
            createdAt: "تاريخ الإنشاء",
            actions: "إجراءات",
            edit: "تعديل",
            delete: "حذف",
            noData: "لا يوجد عملاء",
        },
        en: {
            name: "Name",
            phone: "Phone",
            identity: "ID Number",
            room: "Room No.",
            notes: "Notes",
            createdAt: "Created At",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            noData: "No customers found",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;

    if (!customers || customers.length === 0) {
        return <div className="alert alert-info">{lang.noData}</div>;
    }

    return (
        <div className="table-responsive">
            <table className="system-table">
                <thead>
                    <tr>
                        <th>{lang.name}</th>
                        <th>{lang.phone}</th>
                        <th>{lang.identity}</th>
                        <th>{lang.room}</th>
                        <th className="hide-mobile">{lang.notes}</th>
                        <th>{lang.createdAt}</th>
                        {(canEdit || canDelete) && <th>{lang.actions}</th>}
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>
                                <div className="table-user">
                                    <div className="table-user-avatar">
                                        {customer.name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <strong>{customer.name}</strong>
                                    </div>
                                </div>
                            </td>
                            <td>{customer.phone || "-"}</td>
                            <td>{customer.identity_number || "-"}</td>
                            <td>{customer.room_number || "-"}</td>
                            <td className="hide-mobile">{customer.notes || "-"}</td>
                            <td><FormatDate value={customer.created_at} /></td>
                            {(canEdit || canDelete) && (
                                <td>
                                    <div className="d-flex gap-2">
                                        {canEdit && <button className="btn btn-sm btn-primary" onClick={() => onEdit(customer)}>{lang.edit}</button>}
                                        {canDelete && <button className="btn btn-sm btn-danger" onClick={() => onDelete(customer)}>{lang.delete}</button>}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerTable;