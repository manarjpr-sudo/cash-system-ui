import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import operationService from "../services/operationService";
import customerService from "../services/customerService";
import OperationForm from "../components/operations/OperationForm";
import TableSkeleton from "../components/common/TableSkeleton";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import api from "../api/axios";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import FormatAmount from "../components/common/FormatAmount";
import FormatDate from "../components/common/FormatDate";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// ============================================================
// مكون العملاء مع إضافة وتعديل وحذف
// ============================================================
const CustomersSimple = ({ onCustomerAdded }) => {
    const { language } = useLanguage();
    const { hasPermission } = useContext(AuthContext);
    const { settings } = useSettings();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });
    const [adding, setAdding] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
    const [editing, setEditing] = useState(false);

    const [deleteCustomerId, setDeleteCustomerId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const t = language === 'ar'
        ? {
            title: 'العملاء',
            loading: 'جارٍ التحميل...',
            noData: 'لا يوجد عملاء',
            add: 'إضافة عميل',
            edit: 'تعديل',
            delete: 'حذف',
            actions: 'الإجراءات',
            cancel: 'إلغاء',
            save: 'حفظ',
            saving: 'جارٍ الحفظ...',
            deleting: 'جارٍ الحذف...',
            name: 'الاسم',
            phone: 'الهاتف',
            email: 'البريد الإلكتروني',
            nameRequired: 'الاسم مطلوب',
            successAdd: 'تم إضافة العميل بنجاح',
            successEdit: 'تم تحديث العميل بنجاح',
            successDelete: 'تم حذف العميل بنجاح',
            error: 'فشل العملية',
            editTitle: 'تعديل عميل',
            deleteTitle: 'تأكيد الحذف',
            deleteConfirm: 'هل أنت متأكد من حذف هذا العميل؟',
            confirmDelete: 'نعم، حذف',
        }
        : {
            title: 'Customers',
            loading: 'Loading...',
            noData: 'No customers found',
            add: 'Add Customer',
            edit: 'Edit',
            delete: 'Delete',
            actions: 'Actions',
            cancel: 'Cancel',
            save: 'Save',
            saving: 'Saving...',
            deleting: 'Deleting...',
            name: 'Name',
            phone: 'Phone',
            email: 'Email',
            nameRequired: 'Name is required',
            successAdd: 'Customer added successfully',
            successEdit: 'Customer updated successfully',
            successDelete: 'Customer deleted successfully',
            error: 'Operation failed',
            editTitle: 'Edit Customer',
            deleteTitle: 'Confirm Deletion',
            deleteConfirm: 'Are you sure you want to delete this customer?',
            confirmDelete: 'Yes, Delete',
        };

    const canManage = hasPermission('manage_customers');

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/customers', {
                params: { per_page: settings.items_per_page || 10 }
            });
            const data = res.data?.data || res.data || [];
            setCustomers(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleAddCustomer = async () => {
        if (!newCustomer.name.trim()) {
            toast.error(t.nameRequired);
            return;
        }
        setAdding(true);
        try {
            await api.post('/customers', newCustomer);
            toast.success(t.successAdd);
            setShowModal(false);
            setNewCustomer({ name: "", phone: "", email: "" });
            await loadCustomers();
            if (onCustomerAdded) onCustomerAdded();
        } catch (e) {
            console.error(e);
            toast.error(e.response?.data?.message || t.error);
        } finally {
            setAdding(false);
        }
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setEditForm({
            name: customer.name || '',
            phone: customer.phone || '',
            email: customer.email || '',
        });
        setShowEditModal(true);
    };

    const handleEditCustomer = async () => {
        if (!editForm.name.trim()) {
            toast.error(t.nameRequired);
            return;
        }
        setEditing(true);
        try {
            await api.put(`/customers/${editingCustomer.id}`, editForm);
            toast.success(t.successEdit);
            setShowEditModal(false);
            setEditingCustomer(null);
            await loadCustomers();
            if (onCustomerAdded) onCustomerAdded();
        } catch (e) {
            console.error(e);
            toast.error(e.response?.data?.message || t.error);
        } finally {
            setEditing(false);
        }
    };

    const openDeleteModal = (id) => {
        setDeleteCustomerId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteCustomer = async () => {
        setDeleting(true);
        try {
            await api.delete(`/customers/${deleteCustomerId}`);
            toast.success(t.successDelete);
            setShowDeleteModal(false);
            setDeleteCustomerId(null);
            await loadCustomers();
            if (onCustomerAdded) onCustomerAdded();
        } catch (e) {
            console.error(e);
            toast.error(e.response?.data?.message || t.error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="text-center py-4 text-muted">{t.loading}</div>;

    const colCount = canManage ? 5 : 4;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0" style={{ color: "#0f172a" }}>{t.title}</h3>
                {canManage && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        + {t.add}
                    </button>
                )}
            </div>
            <div className="table-responsive">
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t.name}</th>
                            <th>{t.phone}</th>
                            <th>{t.email}</th>
                            {canManage && <th className="text-center">{t.actions}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr><td colSpan={colCount} className="text-center text-muted py-4">{t.noData}</td></tr>
                        ) : customers.map((c, i) => (
                            <tr key={c.id}>
                                <td>{i + 1}</td>
                                <td><strong>{c.name}</strong></td>
                                <td>{c.phone || '-'}</td>
                                <td>{c.email || '-'}</td>
                                {canManage && (
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => openEditModal(c)}
                                                title={t.edit}
                                            >
                                                <i className="fas fa-edit"></i> {t.edit}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => openDeleteModal(c.id)}
                                                title={t.delete}
                                            >
                                                <i className="fas fa-trash"></i> {t.delete}
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* مودال إضافة عميل */}
            {showModal && (
                <div className="system-modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="system-modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="system-modal-header">
                            <h3>{t.add}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="system-modal-body">
                            <div className="mb-3">
                                <label className="form-label">{t.name} *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    disabled={adding}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t.phone}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    disabled={adding}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t.email}</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    disabled={adding}
                                />
                            </div>
                        </div>
                        <div className="system-modal-footer">
                            <button
                                type="button"
                                className="modal-button modal-button-secondary"
                                onClick={() => setShowModal(false)}
                                disabled={adding}
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddCustomer}
                                disabled={adding}
                            >
                                {adding ? t.saving : t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تعديل عميل */}
            {showEditModal && editingCustomer && (
                <div className="system-modal-backdrop" onClick={() => setShowEditModal(false)}>
                    <div className="system-modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="system-modal-header">
                            <h3>{t.editTitle}</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="system-modal-body">
                            <div className="mb-3">
                                <label className="form-label">{t.name} *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    disabled={editing}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t.phone}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    disabled={editing}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t.email}</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    disabled={editing}
                                />
                            </div>
                        </div>
                        <div className="system-modal-footer">
                            <button
                                type="button"
                                className="modal-button modal-button-secondary"
                                onClick={() => setShowEditModal(false)}
                                disabled={editing}
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleEditCustomer}
                                disabled={editing}
                            >
                                {editing ? t.saving : t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تأكيد الحذف */}
            {showDeleteModal && (
                <div className="system-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
                    <div className="system-modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="system-modal-header">
                            <h3>{t.deleteTitle}</h3>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="system-modal-body">
                            <p>{t.deleteConfirm}</p>
                        </div>
                        <div className="system-modal-footer">
                            <button
                                type="button"
                                className="modal-button modal-button-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDeleteCustomer}
                                disabled={deleting}
                            >
                                {deleting ? t.deleting : t.confirmDelete}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// الصفحة الرئيسية
// ============================================================
function Operations() {
    const { language } = useLanguage();
    const { user, hasPermission } = useContext(AuthContext); // ✅ إضافة user
    const { settings } = useSettings();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("operations");
    const [operations, setOperations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, netCash: 0, pending: 0 });
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [pagination, setPagination] = useState(null);

    const t = {
        ar: {
            title: "العمليات المالية",
            pageDescription: "إدارة العمليات المالية والموافقات",
            create: "إنشاء عملية",
            loading: "جارٍ التحميل...",
            created: "تم إنشاء العملية بنجاح",
            failedCreate: "فشل إنشاء العملية",
            approved: "تمت الموافقة",
            rejected: "تم الرفض",
            failedApprove: "فشل الموافقة",
            failedReject: "فشل الرفض",
            noData: "لا توجد عمليات",
            search: "بحث بالعميل أو الوصف",
            all: "الكل",
            pending: "معلقة",
            approvedStatus: "مقبولة",
            rejectedStatus: "مرفوضة",
            type: "النوع",
            amount: "المبلغ",
            status: "الحالة",
            createdAt: "التاريخ",
            actions: "الإجراءات",
            approve: "موافقة",
            reject: "رفض",
            income: "إجمالي الدخل",
            expense: "إجمالي الخرج",
            net: "صافي التدفق",
            pendingCount: "معلقة",
            receipt: "قبض (دخل)",
            payment: "دفع (خرج)",
            exportExcel: "تصدير Excel",
            exportPDF: "تصدير PDF",
            tabOperations: "العمليات",
            tabCustomers: "العملاء",
            details: "تفاصيل العملية",
            operationDetails: "تفاصيل العملية",
            close: "إغلاق",
            description: "الوصف",
            customer: "العميل",
            mainCategory: "التصنيف الأساسي",
            subCategory: "التصنيف الفرعي",
            rejectionReason: "سبب الرفض",
            noReason: "لا يوجد سبب",
            noCustomer: "لا يوجد عميل",
            noDescription: "لا يوجد وصف",
        },
        en: {
            title: "Financial Operations",
            pageDescription: "Manage financial operations and approvals",
            create: "Create Operation",
            loading: "Loading...",
            created: "Operation created successfully",
            failedCreate: "Failed to create operation",
            approved: "Operation approved",
            rejected: "Operation rejected",
            failedApprove: "Failed to approve",
            failedReject: "Failed to reject",
            noData: "No operations found",
            search: "Search by customer or description",
            all: "All",
            pending: "Pending",
            approvedStatus: "Approved",
            rejectedStatus: "Rejected",
            type: "Type",
            amount: "Amount",
            status: "Status",
            createdAt: "Date",
            actions: "Actions",
            approve: "Approve",
            reject: "Reject",
            income: "Total Income",
            expense: "Total Expense",
            net: "Net Cash Flow",
            pendingCount: "Pending",
            receipt: "Receipt (Income)",
            payment: "Payment (Expense)",
            exportExcel: "Export Excel",
            exportPDF: "Export PDF",
            tabOperations: "Operations",
            tabCustomers: "Customers",
            details: "Operation Details",
            operationDetails: "Operation Details",
            close: "Close",
            description: "Description",
            customer: "Customer",
            mainCategory: "Main Category",
            subCategory: "Sub Category",
            rejectionReason: "Rejection Reason",
            noReason: "No reason provided",
            noCustomer: "No Customer",
            noDescription: "No description",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    // فتح المودال تلقائياً من الـ URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'create' || params.get('openForm') === 'true') {
            setShowForm(true);
        }
    }, [location]);

    const loadOperations = async () => {
        try {
            setLoading(true);
            const params = { per_page: settings.items_per_page || 10, };
            if (search.trim()) params.search = search.trim();
            if (statusFilter !== "all") params.status = statusFilter;
            if (typeFilter !== "all") params.type = typeFilter;
            const response = await operationService.getAll(params);
            const ops = response.data?.data || [];
            setOperations(ops);
            setPagination(response.data || null);
            // حساب الإحصائيات
            const totalIncome = ops.filter(op => op.type === 'receipt' && op.status === 'approved')
                .reduce((sum, op) => sum + (parseFloat(op.amount) || 0), 0);
            const totalExpense = ops.filter(op => op.type === 'payment' && op.status === 'approved')
                .reduce((sum, op) => sum + (parseFloat(op.amount) || 0), 0);
            const pending = ops.filter(op => op.status === 'pending').length;
            setStats({ totalIncome, totalExpense, netCash: totalIncome - totalExpense, pending });
            } catch (error) {
                console.error(error);
                toast.error(lang.failedCreate);
            } finally {
                setLoading(false);
            }
        };

         // ✅ تعديل دالة التصدير لاستخدام جميع البيانات (بدون Pagination)
        const exportAllOperations = async () => {
            try {
                const response = await operationService.getAll({ 
                    search: search.trim() || undefined,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    type: typeFilter !== "all" ? typeFilter : undefined,
                    per_page: 10000 // جلب كل البيانات للتصدير
                });
                const allOps = response.data?.data || [];
                exportToExcel(allOps, 'operations');
            } catch (error) {
                console.error(error);
                toast.error('فشل التصدير');
            }
        };

        // إعادة التحميل عند تغيير الإعدادات
        useEffect(() => {
            loadOperations();
        }, [settings.items_per_page, search, statusFilter, typeFilter]);

        const loadCustomers = async () => {
            try {
                const response = await customerService.getAll();
                setCustomers(response.data?.data || []);
            } catch (error) { console.error(error); }
        };

    useEffect(() => {
        const timer = setTimeout(() => loadOperations(), 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter, typeFilter]);

    useEffect(() => { loadCustomers(); }, []);

    const createOperation = async (operation) => {
        try {
            const data = { ...operation };
            if (!data.category_id) data.category_id = null;
            await operationService.create(data);
            toast.success(lang.created);
            setShowForm(false);
            loadOperations();
            loadCustomers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.failedCreate);
        }
    };

    // ✅ دالة الموافقة والرفض المحسنة
    const handleApproval = async (id, status) => {
        try {
            let rejectionReason = null;
            if (status === 'rejected') {
                rejectionReason = prompt(language === 'ar' ? 'أدخل سبب الرفض:' : 'Enter rejection reason:');
                if (rejectionReason === null) {
                    return;
                }
                if (!rejectionReason.trim()) {
                    toast.error(language === 'ar' ? 'يرجى إدخال سبب الرفض' : 'Please enter a rejection reason');
                    return;
                }
            }

            const payload = { operation_id: id, status };
            if (rejectionReason) {
                payload.rejection_reason = rejectionReason.trim();
            }

            await api.post("/approvals", payload);
            toast.success(status === "approved" ? lang.approved : lang.rejected);
            loadOperations();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || (status === "approved" ? lang.failedApprove : lang.failedReject));
        }
    };

    const handleShowForm = async () => {
        try {
            await loadCustomers();
            setShowForm(true);
        } catch (error) {
            console.error("Error loading customers:", error);
            toast.error(language === 'ar' ? 'فشل تحميل العملاء' : 'Failed to load customers');
        }
    };


    if (loading && operations.length === 0 && activeTab === "operations") {
        return (
            <div className="dashboard-page" style={{ padding: "24px 32px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h2 style={{ fontWeight: 600, color: "#0f172a" }}>{lang.title}</h2>
                </div>
                <div className="dashboard-financial-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="financial-card" style={{ minHeight: '100px' }}>
                            <div className="skeleton-line" style={{ width: '60%', height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div className="skeleton-line" style={{ width: '40%', height: '24px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                        </div>
                    ))}
                </div>
                <TableSkeleton rows={6} columns={7} />
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ padding: "24px 32px" }}>
            {/* ============================================================
                العنوان الرئيسي
            ============================================================ */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "#0f172a" }}>{lang.title}</h1>
                    <p className="text-muted" style={{ fontSize: "14px" }}>{lang.pageDescription}</p>
                </div>
                {hasPermission("manage_operations") && (
                    <button className="btn btn-primary" onClick={handleShowForm}>
                        + {lang.create}
                    </button>
                )}
            </div>

            {/* ============================================================
                التبويبات (Tabs) - شكل المتصفح (Chrome)
            ============================================================ */}
            <div className="d-flex gap-1 mb-4" style={{ borderBottom: "2px solid #e9edf2" }}>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === 'operations' ? 'text-primary bg-white' : 'text-secondary'}`}
                    onClick={() => setActiveTab('operations')}
                    style={{
                        border: activeTab === 'operations' ? '1px solid #e9edf2' : 'none',
                        borderBottom: activeTab === 'operations' ? '2px solid #2563eb' : 'none',
                        marginBottom: '-2px',
                        fontSize: "14px",
                        background: activeTab === 'operations' ? '#ffffff' : 'transparent',
                        borderRadius: "8px 8px 0 0",
                        transition: 'all 0.2s ease',
                        color: activeTab === 'operations' ? '#2563eb' : '#64748b',
                    }}
                >
                    {lang.tabOperations}
                </button>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === 'customers' ? 'text-primary bg-white' : 'text-secondary'}`}
                    onClick={() => setActiveTab('customers')}
                    style={{
                        border: activeTab === 'customers' ? '1px solid #e9edf2' : 'none',
                        borderBottom: activeTab === 'customers' ? '2px solid #2563eb' : 'none',
                        marginBottom: '-2px',
                        fontSize: "14px",
                        background: activeTab === 'customers' ? '#ffffff' : 'transparent',
                        borderRadius: "8px 8px 0 0",
                        transition: 'all 0.2s ease',
                        color: activeTab === 'customers' ? '#2563eb' : '#64748b',
                    }}
                >
                    {lang.tabCustomers}
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'operations' && (
                    <>
                        {/* ============================================================
                            بطاقات الإحصائيات المالية - مع توسيط المعلومات
                        ============================================================ */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3 col-sm-6">
                                <div className="financial-card p-3 h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="financial-label">{lang.income}</div>
                                    <div className="financial-value fs-4">
                                        <FormatAmount 
                                            key={`income-${settings.currency}-${language}`} 
                                            value={stats.totalIncome} 
                                        />
                                    </div>
                                    <div className="financial-description">{lang.receipt}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="financial-card p-3 h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="financial-label">{lang.expense}</div>
                                    <div className="financial-value fs-4">
                                        <FormatAmount 
                                            key={`expense-${settings.currency}-${language}`} 
                                            value={stats.totalExpense} 
                                        />
                                    </div>
                                    <div className="financial-description">{lang.payment}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="financial-card p-3 h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="financial-label">{lang.net}</div>
                                    <div className="financial-value fs-4" style={{ color: stats.netCash >= 0 ? '#16a34a' : '#dc2626' }}>
                                        <FormatAmount 
                                            key={`net-${settings.currency}-${language}`} 
                                            value={stats.netCash} 
                                        />
                                    </div>
                                    <div className="financial-description">{lang.pendingCount}</div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="financial-card p-3 h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                    <div className="financial-label">{lang.pendingCount}</div>
                                    <div className="financial-value fs-4" style={{ color: '#d97706' }}>{stats.pending}</div>
                                    <div className="financial-description">{lang.pending}</div>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================
                            شريط الفلترة والبحث
                        ============================================================ */}
                        <div className="management-toolbar flex-wrap mb-3">
                            <input
                                type="search"
                                className="form-control"
                                placeholder={lang.search}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ flex: 1, minWidth: "180px" }}
                            />
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ width: "140px" }}
                            >
                                <option value="all">{lang.all}</option>
                                <option value="pending">{lang.pending}</option>
                                <option value="approved">{lang.approvedStatus}</option>
                                <option value="rejected">{lang.rejectedStatus}</option>
                            </select>
                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                style={{ width: "140px" }}
                            >
                                <option value="all">{lang.all}</option>
                                <option value="receipt">{lang.receipt}</option>
                                <option value="payment">{lang.payment}</option>
                            </select>
                        </div>

                        {/* ============================================================
                            شريط التصدير
                        ============================================================ */}
                        <div className="d-flex gap-2 mb-4">
                            <button className="btn btn-success btn-sm" onClick={() => exportToExcel(operations, 'operations')}>
                                📊 {lang.exportExcel}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => exportToPDF(operations, 'operations')}>
                                📄 {lang.exportPDF}
                            </button>
                        </div>

                        {/* ============================================================
                            جدول العمليات (مع عمود العميل)
                        ============================================================ */}
                        <div className="table-responsive">
                            <table className="system-table">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>#</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.customer}</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.type}</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.amount}</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.status}</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.createdAt}</th>
                                        <th className="px-3 py-3 text-center fw-semibold" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}>{lang.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operations.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center text-muted py-4">{lang.noData}</td></tr>
                                    ) : (
                                        operations.map((op) => (
                                            <tr key={op.id} onClick={() => setSelectedOperation(op)} style={{ cursor: 'pointer' }}>
                                                <td className="px-3 py-3 text-center fw-semibold">{op.id}</td>
                                                <td className="px-3 py-3 text-center">{op.customer?.name || lang.noCustomer}</td>
                                                <td className="px-3 py-3 text-center">
                                                    <span className={`badge ${op.type === 'receipt' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} px-3 py-2`}>
                                                        {op.type === 'receipt' ? <FaArrowUp className="me-1" /> : <FaArrowDown className="me-1" />}
                                                        {op.type === 'receipt' ? lang.receipt : lang.payment}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-center fw-bold"><FormatAmount value={op.amount} /></td>
                                                <td className="px-3 py-3 text-center">
                                                    {op.status === "rejected" ? (
                                                        <span 
                                                            className="badge bg-danger px-3 py-2" 
                                                            title={op.rejection_reason || lang.noReason}
                                                            style={{ cursor: 'help' }}
                                                        >
                                                            ✗ {lang.rejectedStatus}
                                                        </span>
                                                    ) : (
                                                        <span className={`badge ${op.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'} px-3 py-2`}>
                                                            {op.status === 'pending' ? lang.pending : lang.approvedStatus}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-3 text-center" style={{ color: "#64748b" }}><FormatDate value={op.created_at} /></td>
                                                <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                    {op.status === "pending" && hasPermission("manage_approvals") && (
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button className="btn btn-sm btn-success" onClick={() => handleApproval(op.id, "approved")}>
                                                                {lang.approve}
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleApproval(op.id, "rejected")}>
                                                                {lang.reject}
                                                            </button>
                                                        </div>
                                                    )}
                                                    {op.status === "approved" && (
                                                        <span className="badge bg-success">✓ {lang.approvedStatus}</span>
                                                    )}
                                                    {op.status === "rejected" && (
                                                        <span 
                                                            className="badge bg-danger" 
                                                            title={op.rejection_reason || lang.noReason}
                                                            style={{ cursor: 'help' }}
                                                        >
                                                            ✗ {lang.rejectedStatus}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ============================================================
                            مودال إنشاء عملية
                        ============================================================ */}
                        {showForm && (
                            <div className="system-modal-backdrop" onClick={() => setShowForm(false)}>
                                <div className="system-modal" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header">
                                        <h3>{lang.create}</h3>
                                        <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                                    </div>
                                    <div className="system-modal-body">
                                        <OperationForm
                                            customers={customers}
                                            onSave={createOperation}
                                            onCancel={() => setShowForm(false)}
                                            onCustomerAdded={loadCustomers}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============================================================
                            مودال تفاصيل العملية - مع عرض التصنيفات وسبب الرفض
                        ============================================================ */}
                        {selectedOperation && (
                            <div className="system-modal-backdrop" onClick={() => setSelectedOperation(null)}>
                                <div className="system-modal" style={{ maxWidth: "540px", width: "100%", borderRadius: "16px" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="system-modal-header" style={{ 
                                        padding: "20px 24px", 
                                        borderBottom: "1px solid #e9edf2", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        background: "#fafbfc",
                                        borderRadius: "16px 16px 0 0"
                                    }}>
                                        <h3 style={{ margin: 0, fontWeight: 600, fontSize: "18px", color: "#0f172a" }}>
                                            {lang.operationDetails} #{selectedOperation.id}
                                        </h3>
                                        <button className="modal-close" onClick={() => setSelectedOperation(null)} style={{ 
                                            background: "none", 
                                            border: "none", 
                                            fontSize: "24px", 
                                            cursor: "pointer", 
                                            color: "#94a3b8",
                                            padding: "0 4px",
                                            transition: "color 0.2s"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="system-modal-body" style={{ padding: "24px" }}>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                    {lang.type}
                                                </div>
                                                <div style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", marginTop: "4px" }}>
                                                    {selectedOperation.type === 'receipt' ? (
                                                        <span className="text-success"><FaArrowUp className="me-1" /> {lang.receipt}</span>
                                                    ) : (
                                                        <span className="text-danger"><FaArrowDown className="me-1" /> {lang.payment}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                    {lang.amount}
                                                </div>
                                                <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>
                                                    <FormatAmount value={selectedOperation.amount} />
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                    {lang.status}
                                                </div>
                                                <div style={{ marginTop: "4px" }}>
                                                    {selectedOperation.status === "rejected" ? (
                                                        <span 
                                                            className="badge bg-danger px-3 py-2" 
                                                            title={selectedOperation.rejection_reason || lang.noReason}
                                                            style={{ cursor: 'help' }}
                                                        >
                                                            ✗ {lang.rejectedStatus}
                                                        </span>
                                                    ) : (
                                                        <span className={`badge ${selectedOperation.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'} px-3 py-2`}>
                                                            {selectedOperation.status === 'pending' ? lang.pending : lang.approvedStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                    {lang.createdAt}
                                                </div>
                                                <div style={{ fontSize: "15px", color: "#0f172a", marginTop: "4px" }}>
                                                    <FormatDate value={selectedOperation.created_at} />
                                                </div>
                                            </div>

                                            {selectedOperation.customer && (
                                                <div className="col-12">
                                                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                        {lang.customer}
                                                    </div>
                                                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#0f172a", marginTop: "4px" }}>
                                                        {selectedOperation.customer.name}
                                                    </div>
                                                </div>
                                            )}

                                            {/* سبب الرفض (إذا كانت العملية مرفوضة) */}
                                            {selectedOperation.status === "rejected" && (
                                                <div className="col-12">
                                                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                        {lang.rejectionReason}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: "14px", 
                                                        color: "#0f172a", 
                                                        marginTop: "4px",
                                                        padding: "12px 16px",
                                                        background: "#f8afc",
                                                        borderRadius: "8px",
                                                        border: "1px solid #e9edf2",
                                                        minHeight: "50px"
                                                    }}>
                                                        {selectedOperation.rejection_reason || lang.noReason}
                                                    </div>
                                                </div>
                                            )}

                                            {/* التصنيف الأساسي */}
                                            {selectedOperation.category && (
                                                <div className="col-12">
                                                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                        {lang.mainCategory}
                                                    </div>
                                                    <div style={{ fontSize: "15px", color: "#0f172a", marginTop: "4px" }}>
                                                        {selectedOperation.category.name}
                                                    </div>
                                                </div>
                                            )}

                                            {/* التصنيف الفرعي */}
                                            {selectedOperation.subCategory && (
                                                <div className="col-12">
                                                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                        {lang.subCategory}
                                                    </div>
                                                    <div style={{ fontSize: "15px", color: "#0f172a", marginTop: "4px" }}>
                                                        {selectedOperation.subCategory.name}
                                                    </div>
                                                </div>
                                            )}

                                            {/* الوصف */}
                                            <div className="col-12">
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                                    {lang.description}
                                                </div>
                                                <div style={{ 
                                                    fontSize: "14px", 
                                                    color: "#0f172a", 
                                                    marginTop: "4px",
                                                    padding: "12px 16px",
                                                    background: "#f8afc",
                                                    borderRadius: "8px",
                                                    border: "1px solid #e9edf2",
                                                    minHeight: "50px"
                                                }}>
                                                    {selectedOperation.description || lang.noDescription}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="system-modal-footer" style={{ 
                                        padding: "16px 24px", 
                                        borderTop: "1px solid #e9edf2", 
                                        display: "flex", 
                                        justifyContent: "flex-end",
                                        background: "#fafbfc",
                                        borderRadius: "0 0 16px 16px"
                                    }}>
                                        <button 
                                            className="modal-button modal-button-secondary" 
                                            onClick={() => setSelectedOperation(null)}
                                            style={{
                                                padding: "8px 20px",
                                                borderRadius: "8px",
                                                border: "1px solid #e9edf2",
                                                background: "#ffffff",
                                                color: "#0f172a",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#f1f5f9";
                                                e.currentTarget.style.borderColor = "#cbd5e1";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "#ffffff";
                                                e.currentTarget.style.borderColor = "#e9edf2";
                                            }}
                                        >
                                            {lang.close}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'customers' && <CustomersSimple onCustomerAdded={loadCustomers} />}
            </div>
        </div>
    );
}

export default Operations;