import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import StatusBadge from "../common/StatusBadge";
import FormatAmount from "../common/FormatAmount";
import FormatDate from "../common/FormatDate";

function OperationTable({ operations, onApprove, onReject }) {
    const { hasPermission } = useContext(AuthContext);
    const { language } = useLanguage();
    const [selectedOperation, setSelectedOperation] = useState(null);

    const t = {
        ar: {
            id: "#",
            customer: "العميل",
            type: "النوع",
            amount: "المبلغ",
            status: "الحالة",
            createdAt: "التاريخ",
            actions: "الإجراءات",
            approve: "موافقة",
            reject: "رفض",
            approved: "مقبولة",
            rejected: "مرفوضة",
            noData: "لا توجد عمليات",
            income: "دخل",
            expense: "خرج",
            details: "تفاصيل العملية",
            close: "إغلاق",
            description: "الوصف",
        },
        en: {
            id: "#",
            customer: "Customer",
            type: "Type",
            amount: "Amount",
            status: "Status",
            createdAt: "Date",
            actions: "Actions",
            approve: "Approve",
            reject: "Reject",
            approved: "Approved",
            rejected: "Rejected",
            noData: "No operations found",
            income: "Income",
            expense: "Expense",
            details: "Operation Details",
            close: "Close",
            description: "Description",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;
    const getTypeLabel = (type) => {
        const map = { receipt: lang.income, payment: lang.expense };
        return map[type] || type;
    };

    if (!operations || operations.length === 0) {
        return <div className="alert alert-info">{lang.noData}</div>;
    }

    return (
        <>
            <div className="table-responsive">
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>{lang.id}</th>
                            <th>{lang.customer}</th>  {/* ✅ عمود العميل */}
                            <th>{lang.type}</th>
                            <th>{lang.amount}</th>
                            <th>{lang.status}</th>
                            <th>{lang.createdAt}</th>
                            <th>{lang.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((op) => (
                            <tr key={op.id} onClick={() => setSelectedOperation(op)} style={{ cursor: 'pointer' }}>
                                <td><strong>{op.id}</strong></td>
                                <td>{op.customer?.name || "N/A"}</td>  {/* ✅ عرض اسم العميل */}
                                <td>
                                    <span className="badge" style={{ background: op.type === 'receipt' ? '#d1fae5' : '#fee2e2', color: op.type === 'receipt' ? '#065f46' : '#991b1b' }}>
                                        {getTypeLabel(op.type)}
                                    </span>
                                </td>
                                <td><FormatAmount value={op.amount} /></td>
                                <td>
                                    {op.status === "rejected" ? (
                                        <span 
                                            className="badge bg-danger" 
                                            title={op.rejection_reason || (language === 'ar' ? 'لا يوجد سبب' : 'No reason provided')}
                                            style={{ cursor: 'help' }}
                                        >
                                            ✗ {lang.rejected}
                                        </span>
                                    ) : (
                                        <StatusBadge status={op.status} />
                                    )}
                                </td>
                                <td><FormatDate value={op.created_at} /></td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    {op.status === "pending" && hasPermission("manage_approvals") && (
                                        <div className="d-flex gap-2" style={{ alignItems: 'center' }}>
                                            <button className="btn btn-sm btn-success" onClick={() => onApprove(op.id)}>
                                                {lang.approve}
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => onReject(op.id)}>
                                                {lang.reject}
                                            </button>
                                        </div>
                                    )}
                                    {op.status === "approved" && 
                                        <span className="badge bg-success">✓ {lang.approved}</span>
                                    }
                                    {op.status === "rejected" && 
                                        <span className="badge bg-danger" title={op.rejection_reason || (language === 'ar' ? 'لا يوجد سبب' : 'No reason provided')}>
                                            ✗ {lang.rejected}
                                        </span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick View Modal */}
            {selectedOperation && (
                <div className="system-modal-backdrop" onClick={() => setSelectedOperation(null)}>
                    <div className="system-modal" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="system-modal-header">
                            <h3>{lang.details} #{selectedOperation.id}</h3>
                            <button className="modal-close" onClick={() => setSelectedOperation(null)}>×</button>
                        </div>
                        <div className="system-modal-body">
                            <div className="row g-2">
                                <div className="col-6"><strong>{lang.customer}:</strong> {selectedOperation.customer?.name || "N/A"}</div>
                                <div className="col-6"><strong>{lang.type}:</strong> {getTypeLabel(selectedOperation.type)}</div>
                                <div className="col-6"><strong>{lang.amount}:</strong> <FormatAmount value={selectedOperation.amount} /></div>
                                <div className="col-6"><strong>{lang.status}:</strong> <StatusBadge status={selectedOperation.status} /></div>
                                {selectedOperation.status === "rejected" && (
                                    <div className="col-12"><strong>{language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}:</strong> {selectedOperation.rejection_reason || (language === 'ar' ? 'لا يوجد سبب' : 'No reason provided')}</div>
                                )}
                                <div className="col-6"><strong>{lang.createdAt}:</strong> <FormatDate value={selectedOperation.created_at} /></div>
                                <div className="col-12"><strong>{lang.description}:</strong> {selectedOperation.description || "-"}</div>
                            </div>
                        </div>
                        <div className="system-modal-footer">
                            <button className="modal-button modal-button-secondary" onClick={() => setSelectedOperation(null)}>{lang.close}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OperationTable;