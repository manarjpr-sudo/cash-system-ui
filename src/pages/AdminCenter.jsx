import { useState, useEffect, useContext, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import roleService from "../services/roleService";
import { toast } from "react-toastify";

function AdminCenter() {
    const { language } = useLanguage();
    const { hasPermission } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("users");

    // ===== حالة المستخدمين =====
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [roleId, setRoleId] = useState("all");
    const [pagination, setPagination] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [rejectingUser, setRejectingUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [deactivateConfirm, setDeactivateConfirm] = useState(null);

    // ===== حالة الأدوار =====
    const [rolesList, setRolesList] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] });

    // ===== الترجمات =====
    const text = useMemo(() => {
        const isAr = language === "ar";
        return {
            title: isAr ? "مركز الإدارة" : "Admin Center",
            cancel: isAr ? "إلغاء" : "Cancel",
            save: isAr ? "حفظ" : "Save",
            loading: isAr ? "جارٍ التحميل..." : "Loading...",
            error: isAr ? "حدث خطأ" : "An error occurred",
            usersTab: isAr ? "المستخدمين" : "Users",
            usersSubtitle: isAr ? "إدارة طلبات التسجيل والحسابات والأدوار والحالات." : "Manage registration requests, accounts, roles and status.",
            all: isAr ? "الكل" : "All",
            pending: isAr ? "قيد الانتظار" : "Pending",
            active: isAr ? "نشط" : "Active",
            inactive: isAr ? "غير نشط" : "Inactive",
            rejected: isAr ? "مرفوض" : "Rejected",
            searchPlaceholder: isAr ? "البحث بالاسم أو البريد الإلكتروني" : "Search by name or email",
            role: isAr ? "الدور" : "Role",
            statusLabel: isAr ? "الحالة" : "Status",
            noUsers: isAr ? "لا توجد حسابات مطابقة." : "No matching users found.",
            user: isAr ? "المستخدم" : "User",
            email: isAr ? "البريد الإلكتروني" : "Email",
            requestedRole: isAr ? "الدور المطلوب" : "Requested Role",
            currentRole: isAr ? "الدور الحالي" : "Current Role",
            createdAt: isAr ? "تاريخ التسجيل" : "Registered",
            actions: isAr ? "الإجراءات" : "Actions",
            approve: isAr ? "موافقة" : "Approve",
            reject: isAr ? "رفض" : "Reject",
            activate: isAr ? "تفعيل" : "Activate",
            deactivate: isAr ? "تعطيل" : "Deactivate",
            assignRole: isAr ? "الدور النهائي" : "Final Role",
            approveTitle: isAr ? "اعتماد طلب التسجيل" : "Approve Registration",
            approveText: isAr ? "اختر الدور النهائي الذي سيُمنح للحساب قبل تفعيله." : "Choose the final role before activating the account.",
            rejectTitle: isAr ? "رفض طلب التسجيل" : "Reject Registration",
            rejectText: isAr ? "أدخل سبب الرفض." : "Provide a rejection reason.",
            rejectionReasonLabel: isAr ? "سبب الرفض" : "Rejection reason",
            confirmApprove: isAr ? "اعتماد وتفعيل" : "Approve & Activate",
            confirmReject: isAr ? "رفض الطلب" : "Reject Request",
            confirmDeactivate: isAr ? "تأكيد التعطيل" : "Confirm Deactivation",
            deactivateConfirmText: isAr ? "هل أنت متأكد من تعطيل هذا الحساب؟" : "Are you sure you want to deactivate this account?",
            successApprove: isAr ? "تم اعتماد الحساب وتفعيله." : "User approved and activated.",
            successReject: isAr ? "تم رفض طلب التسجيل." : "Registration request rejected.",
            successDeactivate: isAr ? "تم تعطيل الحساب." : "User deactivated.",
            successActivate: isAr ? "تم تفعيل الحساب." : "User activated.",
            roleRequired: isAr ? "اختر الدور النهائي أولًا." : "Please select the final role.",
            reasonRequired: isAr ? "أدخل سبب الرفض." : "Please provide a rejection reason.",
            rolesTab: isAr ? "الأدوار والصلاحيات" : "Roles & Permissions",
            rolesSubtitle: isAr ? "إنشاء وتعديل الأدوار ومنح الصلاحيات." : "Create, edit roles and assign permissions.",
            roleName: isAr ? "اسم الدور" : "Role Name",
            roleDescription: isAr ? "الوصف" : "Description",
            permissionsLabel: isAr ? "الصلاحيات" : "Permissions",
            addRole: isAr ? "إضافة دور" : "Add Role",
            editRole: isAr ? "تعديل دور" : "Edit Role",
            deleteRole: isAr ? "حذف" : "Delete",
            noRoles: isAr ? "لا توجد أدوار" : "No roles found",
            confirmDeleteRole: isAr ? "هل أنت متأكد من حذف هذا الدور؟" : "Are you sure you want to delete this role?",
            successCreateRole: isAr ? "تم إنشاء الدور بنجاح" : "Role created successfully",
            successUpdateRole: isAr ? "تم تحديث الدور بنجاح" : "Role updated successfully",
            successDeleteRole: isAr ? "تم حذف الدور بنجاح" : "Role deleted successfully",
        };
    }, [language]);

    // ===== دوال المستخدمين =====
    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            const params = {};
            if (search.trim()) params.search = search.trim();
            if (status !== "all") params.status = status;
            if (roleId !== "all") params.role_id = roleId;
            const response = await api.get("/users", { params });
            setUsers(response.data?.data || []);
            setPagination(response.data || null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to load users.");
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadRolesForFilter = async () => {
        try {
            const response = await api.get("/roles");
            setRoles(response.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadRolesForFilter(); }, []);
    useEffect(() => {
        const timer = setTimeout(() => loadUsers(), 250);
        return () => clearTimeout(timer);
    }, [search, status, roleId]);

    const openApprove = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.requested_role_id || user.requestedRole?.id || "");
    };
    const closeApprove = () => { if (actionLoading) return; setSelectedUser(null); setSelectedRole(""); };

    const approveUser = async () => {
        if (!selectedUser || !selectedRole) {
            toast.error(text.roleRequired);
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/users/${selectedUser.id}/approve`, { role_id: selectedRole });
            toast.success(text.successApprove);
            closeApprove();
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to approve user.");
        } finally {
            setActionLoading(false);
        }
    };

    const openReject = (user) => { setRejectingUser(user); setRejectionReason(""); };
    const closeReject = () => { if (actionLoading) return; setRejectingUser(null); setRejectionReason(""); };

    const rejectUser = async () => {
        if (!rejectingUser || !rejectionReason.trim()) {
            toast.error(text.reasonRequired);
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/users/${rejectingUser.id}/reject`, { rejection_reason: rejectionReason.trim() });
            toast.success(text.successReject);
            closeReject();
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to reject user.");
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDeactivate = (user) => setDeactivateConfirm(user);
    const executeDeactivate = async () => {
        if (!deactivateConfirm) return;
        try {
            setActionLoading(true);
            await api.post(`/users/${deactivateConfirm.id}/deactivate`);
            toast.success(text.successDeactivate);
            setDeactivateConfirm(null);
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to deactivate user.");
        } finally {
            setActionLoading(false);
        }
    };

    const activateUser = async (user) => {
        try {
            setActionLoading(true);
            await api.post(`/users/${user.id}/activate`);
            toast.success(text.successActivate);
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Unable to activate user.");
        } finally {
            setActionLoading(false);
        }
    };

    const statusClass = (value) => `status-badge status-${value}`;
    const statusLabel = (value) => {
        const labels = { pending: text.pending, active: text.active, inactive: text.inactive, rejected: text.rejected };
        return labels[value] || value;
    };

    // ===== دوال الأدوار =====
    const loadRolesData = async () => {
        try {
            setLoadingRoles(true);
            const [rolesData, permissionsData] = await Promise.all([
                roleService.getAll(),
                roleService.getPermissions(),
            ]);
            setRolesList(rolesData);
            setPermissions(permissionsData);
        } catch (error) {
            console.error(error);
            toast.error(text.error);
        } finally {
            setLoadingRoles(false);
        }
    };

    useEffect(() => {
        if (activeTab === "roles") loadRolesData();
    }, [activeTab]);

    const openRoleModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            setRoleForm({
                name: role.name,
                description: role.description || "",
                permissions: role.permissions?.map((p) => p.id) || [],
            });
        } else {
            setEditingRole(null);
            setRoleForm({ name: "", description: "", permissions: [] });
        }
        setShowRoleModal(true);
    };
    const closeRoleModal = () => { setShowRoleModal(false); setEditingRole(null); };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await roleService.update(editingRole.id, roleForm);
                toast.success(text.successUpdateRole);
            } else {
                await roleService.create(roleForm);
                toast.success(text.successCreateRole);
            }
            closeRoleModal();
            loadRolesData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || text.error);
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm(text.confirmDeleteRole)) return;
        try {
            await roleService.delete(id);
            toast.success(text.successDeleteRole);
            loadRolesData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || text.error);
        }
    };

    const togglePermission = (permId) => {
        setRoleForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter((id) => id !== permId)
                : [...prev.permissions, permId],
        }));
    };

    // ===== العرض =====
    return (
        <div className="dashboard-page" style={{ padding: "24px 32px" }}>
            {/* ============================================================
                العنوان الرئيسي
            ============================================================ */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "#0f172a" }}>{text.title}</h1>
                    <p className="text-muted" style={{ fontSize: "14px" }}>إدارة المستخدمين والأدوار والصلاحيات</p>
                </div>
            </div>

            {/* ============================================================
                التبويبات (Tabs) - نفس شكل المتصفح (Chrome)
            ============================================================ */}
            <div className="d-flex gap-1 mb-4" style={{ borderBottom: "2px solid #e9edf2" }}>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === "users" ? "text-primary bg-white" : "text-secondary"}`}
                    onClick={() => setActiveTab("users")}
                    style={{
                        border: activeTab === "users" ? "1px solid #e9edf2" : "none",
                        borderBottom: activeTab === "users" ? "2px solid #2563eb" : "none",
                        marginBottom: "-2px",
                        fontSize: "14px",
                        background: activeTab === "users" ? "#ffffff" : "transparent",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.2s ease",
                        color: activeTab === "users" ? "#2563eb" : "#64748b",
                    }}
                >
                    {text.usersTab}
                </button>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === "roles" ? "text-primary bg-white" : "text-secondary"}`}
                    onClick={() => setActiveTab("roles")}
                    style={{
                        border: activeTab === "roles" ? "1px solid #e9edf2" : "none",
                        borderBottom: activeTab === "roles" ? "2px solid #2563eb" : "none",
                        marginBottom: "-2px",
                        fontSize: "14px",
                        background: activeTab === "roles" ? "#ffffff" : "transparent",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.2s ease",
                        color: activeTab === "roles" ? "#2563eb" : "#64748b",
                    }}
                >
                    {text.rolesTab}
                </button>
            </div>

            <div className="tab-content">
                {/* ===== تبويب المستخدمين ===== */}
                {activeTab === "users" && (
                    <>
                        {/* شريط الأدوات */}
                        <div className="management-toolbar flex-wrap">
                            <input
                                type="search"
                                className="form-control"
                                placeholder={text.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "220px" }}
                            />
                            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "140px" }}>
                                <option value="all">{text.all}</option>
                                <option value="pending">{text.pending}</option>
                                <option value="active">{text.active}</option>
                                <option value="inactive">{text.inactive}</option>
                                <option value="rejected">{text.rejected}</option>
                            </select>
                            <select className="form-select" value={roleId} onChange={(e) => setRoleId(e.target.value)} style={{ width: "140px" }}>
                                <option value="all">{text.role}</option>
                                {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                            </select>
                            <span className="badge bg-light text-dark ms-auto px-3 py-2">{pagination?.total || users.length}</span>
                        </div>

                        {/* جدول المستخدمين */}
                        <div className="table-responsive">
                            <table className="system-table">
                                <thead>
                                    <tr>
                                        <th>{text.user}</th>
                                        <th>{text.email}</th>
                                        <th>{text.requestedRole}</th>
                                        <th>{text.currentRole}</th>
                                        <th>{text.statusLabel}</th>
                                        <th className="text-center">{text.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingUsers ? (
                                        <tr><td colSpan="6" className="text-center text-muted py-4">{text.loading}</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center text-muted py-4">{text.noUsers}</td></tr>
                                    ) : users.map((user) => (
                                        <tr key={user.id}>
                                            <td><strong>{user.name}</strong></td>
                                            <td>{user.email}</td>
                                            <td>{user.requestedRole?.name || "—"}</td>
                                            <td>{user.role?.name || "—"}</td>
                                            <td><span className={statusClass(user.status)}>{statusLabel(user.status)}</span></td>
                                            <td className="text-center">
                                                <div className="d-flex gap-2 justify-content-center flex-wrap">
                                                    {user.status === "pending" && (
                                                        <>
                                                            <button className="btn btn-sm btn-success" onClick={() => openApprove(user)}>{text.approve}</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => openReject(user)}>{text.reject}</button>
                                                        </>
                                                    )}
                                                    {user.status === "active" && (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDeactivate(user)}>{text.deactivate}</button>
                                                    )}
                                                    {user.status === "inactive" && (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => activateUser(user)}>{text.activate}</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* مودال الموافقة */}
                        {selectedUser && (
                            <div className="system-modal-backdrop" onClick={closeApprove}>
                                <div className="system-modal" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header">
                                        <h3>{text.approveTitle}</h3>
                                        <button className="modal-close" onClick={closeApprove}>×</button>
                                    </div>
                                    <div className="system-modal-body">
                                        <p>{text.approveText}</p>
                                        <p><strong>{selectedUser.name}</strong> ({selectedUser.email})</p>
                                        <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} disabled={actionLoading}>
                                            <option value="">{text.assignRole}</option>
                                            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="system-modal-footer">
                                        <button className="modal-button modal-button-secondary" onClick={closeApprove} disabled={actionLoading}>{text.cancel}</button>
                                        <button className="modal-button modal-button-success" onClick={approveUser} disabled={actionLoading}>{actionLoading ? text.loading : text.confirmApprove}</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* مودال الرفض */}
                        {rejectingUser && (
                            <div className="system-modal-backdrop" onClick={closeReject}>
                                <div className="system-modal" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header">
                                        <h3>{text.rejectTitle}</h3>
                                        <button className="modal-close" onClick={closeReject}>×</button>
                                    </div>
                                    <div className="system-modal-body">
                                        <p>{text.rejectText}</p>
                                        <p><strong>{rejectingUser.name}</strong> ({rejectingUser.email})</p>
                                        <textarea className="form-control" rows="3" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder={text.rejectionReasonLabel} disabled={actionLoading} />
                                    </div>
                                    <div className="system-modal-footer">
                                        <button className="modal-button modal-button-secondary" onClick={closeReject} disabled={actionLoading}>{text.cancel}</button>
                                        <button className="modal-button modal-button-danger" onClick={rejectUser} disabled={actionLoading}>{actionLoading ? text.loading : text.confirmReject}</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* مودال تأكيد التعطيل */}
                        {deactivateConfirm && (
                            <div className="system-modal-backdrop" onClick={() => setDeactivateConfirm(null)}>
                                <div className="system-modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header">
                                        <h3>{text.confirmDeactivate}</h3>
                                        <button className="modal-close" onClick={() => setDeactivateConfirm(null)}>×</button>
                                    </div>
                                    <div className="system-modal-body">
                                        <p>{text.deactivateConfirmText}</p>
                                        <p><strong>{deactivateConfirm.name}</strong> ({deactivateConfirm.email})</p>
                                    </div>
                                    <div className="system-modal-footer">
                                        <button className="modal-button modal-button-secondary" onClick={() => setDeactivateConfirm(null)} disabled={actionLoading}>{text.cancel}</button>
                                        <button className="modal-button modal-button-danger" onClick={executeDeactivate} disabled={actionLoading}>{actionLoading ? text.loading : text.confirmDeactivate}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ===== تبويب الأدوار ===== */}
                {activeTab === "roles" && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="text-muted">{text.rolesSubtitle}</p>
                            <button className="btn btn-primary btn-sm" onClick={() => openRoleModal()}>+ {text.addRole}</button>
                        </div>

                        <div className="table-responsive">
                            <table className="system-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{text.roleName}</th>
                                        <th>{text.roleDescription}</th>
                                        <th>{text.permissionsLabel}</th>
                                        <th className="text-center">{text.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingRoles ? (
                                        <tr><td colSpan="5" className="text-center text-muted py-4">{text.loading}</td></tr>
                                    ) : rolesList.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted py-4">{text.noRoles}</td></tr>
                                    ) : rolesList.map((role, idx) => (
                                        <tr key={role.id}>
                                            <td>{idx + 1}</td>
                                            <td><strong>{role.name}</strong></td>
                                            <td>{role.description || "-"}</td>
                                            <td>
                                                {role.permissions?.map(p => (
                                                    <span key={p.id} className="badge bg-light text-dark me-1 px-2 py-1">{p.name}</span>
                                                )) || "-"}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => openRoleModal(role)}>{text.editRole}</button>
                                                    {role.name !== "Admin" && (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRole(role.id)}>{text.deleteRole}</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* مودال إضافة/تعديل دور */}
                        {showRoleModal && (
                            <div className="system-modal-backdrop" onClick={closeRoleModal}>
                                <div className="system-modal" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header">
                                        <h3>{editingRole ? text.editRole : text.addRole}</h3>
                                        <button className="modal-close" onClick={closeRoleModal}>×</button>
                                    </div>
                                    <form onSubmit={handleRoleSubmit}>
                                        <div className="system-modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">{text.roleName}</label>
                                                <input type="text" className="form-control" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">{text.roleDescription}</label>
                                                <input type="text" className="form-control" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">{text.permissionsLabel}</label>
                                                <div className="row">
                                                    {permissions.map((perm) => (
                                                        <div key={perm.id} className="col-md-6">
                                                            <div className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`perm-${perm.id}`}
                                                                    checked={roleForm.permissions.includes(perm.id)}
                                                                    onChange={() => togglePermission(perm.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`perm-${perm.id}`}>{perm.name}</label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="system-modal-footer">
                                            <button type="button" className="modal-button modal-button-secondary" onClick={closeRoleModal}>{text.cancel}</button>
                                            <button type="submit" className="modal-button modal-button-success">{text.save}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminCenter;