import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import dashboardService from "../services/dashboardService";
import FormatAmount from "../components/common/FormatAmount";
import FormatDate from "../components/common/FormatDate";
import { FaUsers, FaUser, FaClipboardList, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaBalanceScale } from "react-icons/fa";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const { language } = useLanguage();
    const { user, hasPermission } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const t = {
        ar: {
            title: "لوحة المعلومات",
            subtitle: "نظرة عامة على أداء النظام",
            customers: "العملاء",
            users: "المستخدمين",
            operations: "العمليات",
            transactions: "المعاملات",
            totalReceipts: "إجمالي المقبوضات",
            totalPayments: "إجمالي المدفوعات",
            netCash: "صافي النقد",
            pending: "معلقة",
            approved: "مقبولة",
            rejected: "مرفوضة",
            latestOps: "آخر العمليات",
            viewAll: "عرض الكل",
            noData: "لا توجد بيانات",
            loading: "جارٍ التحميل...",
            type: "النوع",
            amount: "المبلغ",
            status: "الحالة",
            date: "التاريخ",
            incomeExpenseChart: "الدخل مقابل الخرج",
            statusDistribution: "توزيع الحالات",
        },
        en: {
            title: "Dashboard",
            subtitle: "System performance overview",
            customers: "Customers",
            users: "Users",
            operations: "Operations",
            transactions: "Transactions",
            totalReceipts: "Total Receipts",
            totalPayments: "Total Payments",
            netCash: "Net Cash",
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            latestOps: "Latest Operations",
            viewAll: "View all",
            noData: "No data found",
            loading: "Loading...",
            type: "Type",
            amount: "Amount",
            status: "Status",
            date: "Date",
            incomeExpenseChart: "Income vs Expense",
            statusDistribution: "Status Distribution",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const result = await dashboardService.getDashboard();
            setData(result);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = data?.stats || {};
    const latestOperations = data?.latestOperations || [];

    const pieData = [
        { name: lang.pending, value: stats.pendingOperations || 0 },
        { name: lang.approved, value: stats.approvedOperations || 0 },
        { name: lang.rejected, value: stats.rejectedOperations || 0 },
    ].filter(item => item.value > 0);

    const barData = [
        { name: "الإيرادات", value: stats.totalReceipts || 0 },
        { name: "المصروفات", value: stats.totalPayments || 0 },
    ];

    const CARD_COLORS = {
        customers: { bg: '#dbeafe', icon: '#2563eb' },
        users: { bg: '#dcfce7', icon: '#16a34a' },
        operations: { bg: '#fef3c7', icon: '#d97706' },
        transactions: { bg: '#e0e7ff', icon: '#4f46e5' },
    };

    const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444'];
    const BAR_COLORS = ['#10b981', '#ef4444'];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">{lang.loading}</span>
                    </div>
                    <p className="mt-3 text-muted">{lang.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ padding: "24px 32px" }}>
            {/* العنوان الرئيسي */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "#0f172a" }}>{lang.title}</h1>
                    <p className="text-muted mb-0" style={{ fontSize: "14px", marginTop: "4px" }}>{lang.subtitle}</p>
                </div>
                <div className="text-end">
                    <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: "12px", fontWeight: "500" }}>
                        {new Date().toLocaleDateString(language === "ar" ? "ar" : "en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* بطاقات الإحصائيات */}
            <div className="row g-4 mb-5">
                <div className="col-md-3 col-sm-6">
                    <div className="stat-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: "160px" }}>
                        <div className="stat-icon mb-3" style={{ background: CARD_COLORS.customers.bg, color: CARD_COLORS.customers.icon, width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaUsers size={24} />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="stat-value" style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", lineHeight: "1.2" }}>{stats.customersCount || 0}</span>
                            <span className="stat-label" style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{lang.customers}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="stat-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: "160px" }}>
                        <div className="stat-icon mb-3" style={{ background: CARD_COLORS.users.bg, color: CARD_COLORS.users.icon, width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaUser size={24} />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="stat-value" style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", lineHeight: "1.2" }}>{stats.usersCount || 0}</span>
                            <span className="stat-label" style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{lang.users}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="stat-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: "160px" }}>
                        <div className="stat-icon mb-3" style={{ background: CARD_COLORS.operations.bg, color: CARD_COLORS.operations.icon, width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaClipboardList size={24} />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="stat-value" style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", lineHeight: "1.2" }}>{stats.operationsCount || 0}</span>
                            <span className="stat-label" style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{lang.operations}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="stat-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: "160px" }}>
                        <div className="stat-icon mb-3" style={{ background: CARD_COLORS.transactions.bg, color: CARD_COLORS.transactions.icon, width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaMoneyBillWave size={24} />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="stat-value" style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", lineHeight: "1.2" }}>{stats.transactionsCount || 0}</span>
                            <span className="stat-label" style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{lang.transactions}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* الرسوم البيانية */}
            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2" }}>
                        <h6 className="text-center mb-4 fw-semibold" style={{ color: "#0f172a", fontSize: "15px" }}>
                            <span className="text-secondary">{lang.incomeExpenseChart}</span>
                        </h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} barSize={50} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }} tickLine={{ stroke: '#cbd5e1' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }} tickLine={{ stroke: '#cbd5e1' }} width={80} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="d-flex justify-content-center gap-4 mt-3">
                            <div className="d-flex align-items-center gap-2">
                                <span style={{ display: "inline-block", width: "12px", height: "12px", background: "#10b981", borderRadius: "4px" }}></span>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>إيرادات</span>
                                <strong className="ms-1" style={{ fontSize: "14px", color: "#0f172a" }}><FormatAmount value={stats.totalReceipts || 0} /></strong>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span style={{ display: "inline-block", width: "12px", height: "12px", background: "#ef4444", borderRadius: "4px" }}></span>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>مصروفات</span>
                                <strong className="ms-1" style={{ fontSize: "14px", color: "#0f172a" }}><FormatAmount value={stats.totalPayments || 0} /></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 h-100 shadow-sm border-0" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2" }}>
                        <h6 className="text-center mb-4 fw-semibold" style={{ color: "#0f172a", fontSize: "15px" }}>
                            <span className="text-secondary">{lang.statusDistribution}</span>
                        </h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
                            {pieData.map((item, index) => (
                                <div key={item.name} className="d-flex align-items-center gap-2">
                                    <span style={{ display: "inline-block", width: "12px", height: "12px", background: PIE_COLORS[index % PIE_COLORS.length], borderRadius: "4px" }}></span>
                                    <span style={{ fontSize: "12px", color: "#64748b" }}>{item.name}</span>
                                    <strong className="ms-1" style={{ fontSize: "14px", color: "#0f172a" }}>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                بطاقات الملخص المالي (مع ألوان الأسهم)
            ============================================================ */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="financial-card p-4 h-100 d-flex flex-column" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2" }}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div style={{ background: '#f1f5f9', color: '#1e293b', width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaArrowUp size={18} />
                            </div>
                            <div className="financial-label" style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "500" }}>{lang.totalReceipts}</div>
                        </div>
                        <div className="financial-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "4px 0" }}>
                            <FormatAmount value={stats.totalReceipts || 0} />
                            <span style={{ fontSize: "16px", fontWeight: "500", marginLeft: "4px", color: '#10b981' }}>
                                ▲
                            </span>
                        </div>
                        <div className="financial-description" style={{ fontSize: "12px", color: "#94a3b8" }}>إجمالي الإيرادات</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="financial-card p-4 h-100 d-flex flex-column" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2" }}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div style={{ background: '#f1f5f9', color: '#1e293b', width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaArrowDown size={18} />
                            </div>
                            <div className="financial-label" style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "500" }}>{lang.totalPayments}</div>
                        </div>
                        <div className="financial-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "4px 0" }}>
                            <FormatAmount value={stats.totalPayments || 0} />
                            <span style={{ fontSize: "16px", fontWeight: "500", marginLeft: "4px", color: '#ef4444' }}>
                                ▼
                            </span>
                        </div>
                        <div className="financial-description" style={{ fontSize: "12px", color: "#94a3b8" }}>إجمالي المصروفات</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="financial-card p-4 h-100 d-flex flex-column" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2" }}>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div style={{ background: '#f1f5f9', color: '#1e293b', width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaBalanceScale size={18} />
                            </div>
                            <div className="financial-label" style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "500" }}>{lang.netCash}</div>
                        </div>
                        <div className="financial-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "4px 0" }}>
                            <FormatAmount value={stats.netCash || 0} />
                            <span style={{ fontSize: "16px", fontWeight: "500", marginLeft: "4px", color: stats.netCash >= 0 ? '#10b981' : '#ef4444' }}>
                                {stats.netCash >= 0 ? '▲' : '▼'}
                            </span>
                        </div>
                        <div className="financial-description" style={{ fontSize: "12px", color: "#94a3b8" }}>صافي التدفق النقدي</div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                آخر العمليات - مع حواف دائرية وتناوب ألوان الصفوف
            ============================================================ */}
            <div className="dashboard-panel shadow-sm border-0" style={{ borderRadius: "16px", background: "#fff", border: "1px solid #e9edf2", overflow: "hidden" }}>
                {/* ✅ رأس الجدول: العنوان والشرح في جهة، وعرض الكل في الجهة الأخرى */}
                <div className="dashboard-panel-header bg-white px-4 py-3 d-flex align-items-center justify-content-between" style={{ borderBottom: "1px solid #e9edf2" }}>
                    <div>
                        <h2 className="h5 fw-bold mb-0" style={{ color: "#0f172a" }}>{lang.latestOps}</h2>
                        <p className="text-muted small mb-0">جميع العمليات المسجلة حديثاً</p>
                    </div>
                    <Link to="/operations" className="dashboard-view-link" style={{ color: "#2563eb", fontWeight: "500", textDecoration: "none" }}>
                        {lang.viewAll}
                    </Link>
                </div>

                {/* ✅ الجدول مع حواف دائرية وتناوب ألوان الصفوف */}
                <div className="px-0">
                    <div className="table-responsive">
                        <table className="system-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-center" style={{ background: "#f8fafc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b", fontWeight: "600", borderBottom: "2px solid #e9edf2" }}>#</th>
                                    <th className="px-4 py-3 text-center" style={{ background: "#f8fafc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b", fontWeight: "600", borderBottom: "2px solid #e9edf2" }}>{lang.type}</th>
                                    <th className="px-4 py-3 text-center" style={{ background: "#f8fafc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b", fontWeight: "600", borderBottom: "2px solid #e9edf2" }}>{lang.amount}</th>
                                    <th className="px-4 py-3 text-center" style={{ background: "#f8fafc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b", fontWeight: "600", borderBottom: "2px solid #e9edf2" }}>{lang.status}</th>
                                    <th className="px-4 py-3 text-center" style={{ background: "#f8fafc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b", fontWeight: "600", borderBottom: "2px solid #e9edf2" }}>{lang.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestOperations.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center text-muted py-4">{lang.noData}</td></tr>
                                ) : (
                                    latestOperations.map((op) => (
                                        <tr key={op.id} onClick={() => navigate(`/operations?status=${op.status}`)} style={{ cursor: 'pointer' }}>
                                            <td className="px-4 py-3 text-center fw-semibold" style={{ borderBottom: "1px solid #e9edf2" }}>{op.id}</td>
                                            <td className="px-4 py-3 text-center" style={{ borderBottom: "1px solid #e9edf2" }}>
                                                <span className={`badge ${op.type === 'receipt' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} px-3 py-2`} style={{ fontSize: "12px", fontWeight: "500" }}>
                                                    {op.type === 'receipt' ? 'دخل' : 'خرج'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center fw-bold" style={{ borderBottom: "1px solid #e9edf2", color: "#0f172a" }}><FormatAmount value={op.amount} /></td>
                                            <td className="px-4 py-3 text-center" style={{ borderBottom: "1px solid #e9edf2" }}>
                                                <span className={`badge ${op.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : op.status === 'approved' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} px-3 py-2`} style={{ fontSize: "12px", fontWeight: "500" }}>
                                                    {op.status === 'pending' ? lang.pending : op.status === 'approved' ? lang.approved : lang.rejected}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center" style={{ borderBottom: "1px solid #e9edf2", color: "#64748b" }}><FormatDate value={op.created_at} /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;