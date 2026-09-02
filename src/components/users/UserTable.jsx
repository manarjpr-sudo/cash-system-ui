import { useLanguage } from "../../context/LanguageContext";

function UserTable({ users, onEdit, onDelete, canEdit, canDelete }) {
    const { language } = useLanguage();

    const t = {
        ar: {
            id: "#",
            name: "الاسم",
            email: "البريد الإلكتروني",
            role: "الدور",
            actions: "إجراءات",
            edit: "تعديل",
            delete: "حذف",
            noData: "لا يوجد مستخدمين",
        },
        en: {
            id: "#",
            name: "Name",
            email: "Email",
            role: "Role",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            noData: "No users found",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;

    if (!users || users.length === 0) {
        return <div className="alert alert-info">{lang.noData}</div>;
    }

    return (
        <div className="table-responsive">
            <table className="system-table">
                <thead>
                    <tr>
                        <th>{lang.id}</th>
                        <th>{lang.name}</th>
                        <th>{lang.email}</th>
                        <th>{lang.role}</th>
                        {(canEdit || canDelete) && <th>{lang.actions}</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                <div className="table-user">
                                    <div className="table-user-avatar">
                                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <strong>{user.name}</strong>
                                    </div>
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.role || "-"}</td>
                            {(canEdit || canDelete) && (
                                <td>
                                    <div className="d-flex gap-2">
                                        {canEdit && (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => onEdit(user)}
                                                style={{ fontSize: '10px', padding: '4px 10px', fontWeight: 600 }}
                                            >
                                                {lang.edit}
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => onDelete(user.id)}
                                                style={{ fontSize: '10px', padding: '4px 10px', fontWeight: 600 }}
                                            >
                                                {lang.delete}
                                            </button>
                                        )}
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

export default UserTable;