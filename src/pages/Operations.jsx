import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaPlus,
    FaSearch,
    FaArrowUp,
    FaArrowDown,
    FaEdit,
    FaTrash,
    FaFileExcel,
    FaFilePdf,
} from "react-icons/fa";

import operationService from "../services/operationService";
import dashboardService from "../services/dashboardService";
import OperationForm from "../components/operations/OperationForm";
import TableSkeleton from "../components/common/TableSkeleton";
import FormatAmount from "../components/common/FormatAmount";
import FormatDate from "../components/common/FormatDate";

import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";

function Operations() {
    const { language } = useLanguage();
    const { settings } = useSettings();
    const location = useLocation();

    const isArabic = language === "ar";

    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [operationToDelete, setOperationToDelete] = useState(null);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const [userName, setUserName] = useState("");

    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        operationsCount: 0,
    });

    const t = {
        ar: {
            greeting: "أهلًا بك",
            subtitle: "تابع أموالك وسجّل عملياتك بسهولة",
            
            balance: "رصيدك الحالي",
            income: "إجمالي الدخل",
            expense: "إجمالي المصروفات",

            recent: "عملياتك المالية",
            operationCount: "عملية",
            
            add: "أضف عملية",
            
            search: "ابحث في العمليات...",
            
            all: "الكل",
            incomeOnly: "الدخل",
            expenseOnly: "المصروفات",
            
            allOperations: "عرض كل العمليات",

            noOperations:
                "لم تسجّل أي عملية مالية بعد.",
            
            noResults:
                "لم نجد عمليات تطابق بحثك أو الفلتر المحدد.",
            
            noDescription:
                "بدون وصف",

            edit: "تعديل العملية",
            delete: "حذف العملية",

            exportExcel:
                "تصدير العمليات إلى Excel",
            exportPDF:
                "تصدير العمليات إلى PDF",

            deleteTitle:
                "حذف العملية؟",

            deleteConfirm:
                "هل أنت متأكد من أنك تريد حذف هذه العملية؟",

            deleteWarning:
                "سيتم حذف العملية نهائيًا ولن تتمكن من استعادتها بعد ذلك.",

            cancel: "إلغاء",
            confirmDelete: "نعم، احذفها",
            close: "إغلاق",

            addSuccess:
                "تمت إضافة العملية بنجاح.",

            updateSuccess:
                "تم تحديث العملية بنجاح.",

            deleteSuccess:
                "تم حذف العملية بنجاح.",

            failed:
                "تعذر تنفيذ العملية. حاول مرة أخرى.",
        },

        en: {
            greeting: "Welcome back",
            subtitle:
                "Track your money and record your operations with ease",

            balance: "Your current balance",
            income: "Total income",
            expense: "Total expenses",

            recent: "Your financial operations",
            operationCount: "operations",

            add: "Add operation",

            search: "Search your operations...",

            all: "All",
            incomeOnly: "Income",
            expenseOnly: "Expenses",

            allOperations:
                "View all operations",

            noOperations:
                "You haven't recorded any financial operations yet.",

            noResults:
                "No operations match your search or selected filter.",

            noDescription:
                "No description",

            edit: "Edit operation",
            delete: "Delete operation",

            exportExcel:
                "Export operations to Excel",
            exportPDF:
                "Export operations to PDF",

            deleteTitle:
                "Delete this operation?",

            deleteConfirm:
                "Are you sure you want to delete this operation?",

            deleteWarning:
                "This operation will be permanently deleted and cannot be restored.",

            cancel: "Cancel",
            confirmDelete: "Yes, delete it",
            close: "Close",

            addSuccess:
                "Operation added successfully.",

            updateSuccess:
                "Operation updated successfully.",

            deleteSuccess:
                "Operation deleted successfully.",

            failed:
                "We couldn't complete that action. Please try again.",
        },
    };
    const lang = isArabic ? t.ar : t.en;

    const getCategoryName = (category) => {
        if (!category) return "-";

        return isArabic
            ? category.name_ar || category.name_en || "-"
            : category.name_en || category.name_ar || "-";
    };

    const loadOperations = async () => {
        try {
            setLoading(true);

            const params = {
                per_page: settings.items_per_page || 15,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (typeFilter !== "all") {
                params.type = typeFilter;
            }

            const [operationsResponse, dashboardResponse] =
                await Promise.all([
                    operationService.getAll(params),
                    dashboardService.getDashboard(),
                ]);

            setOperations(
                operationsResponse?.data?.data || []
            );

            const dashboardData = dashboardResponse || {};

            setUserName(dashboardData.user?.name || "");

            setStats({
                totalIncome: Number(
                    dashboardData.stats?.totalIncome || 0
                ),
                totalExpense: Number(
                    dashboardData.stats?.totalExpense || 0
                ),
                balance: Number(
                    dashboardData.stats?.balance || 0
                ),
                operationsCount: Number(
                    dashboardData.stats?.operationsCount || 0
                ),
            });
        } catch (error) {
            console.error("Operations loading error:", error);

            toast.error(
                error.response?.data?.message || lang.failed
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(loadOperations, 250);

        return () => clearTimeout(timer);
    }, [
        search,
        typeFilter,
        settings.items_per_page,
    ]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        if (
            params.get("action") === "create" ||
            params.get("openForm") === "true"
        ) {
            setSelectedOperation(null);
            setShowForm(true);
        }
    }, [location]);

    const closeForm = () => {
        setShowForm(false);
        setSelectedOperation(null);
    };

    const openCreateForm = () => {
        setSelectedOperation(null);
        setShowForm(true);
    };

    const openEditForm = (operation) => {
        setSelectedOperation(operation);
        setShowForm(true);
    };

    const handleSave = async (data) => {
        try {
            if (selectedOperation) {
                await operationService.update(
                    selectedOperation.id,
                    data
                );

                toast.success(lang.updateSuccess);
            } else {
                await operationService.create(data);

                toast.success(lang.addSuccess);
            }

            closeForm();
            await loadOperations();
        } catch (error) {
            console.error("Operation save error:", error);

            toast.error(
                error.response?.data?.message || lang.failed
            );

            throw error;
        }
    };

    const handleDelete = async () => {
        if (!operationToDelete) return;

        try {
            await operationService.delete(
                operationToDelete.id
            );

            toast.success(lang.deleteSuccess);
            setOperationToDelete(null);

            await loadOperations();
        } catch (error) {
            console.error("Operation delete error:", error);

            toast.error(
                error.response?.data?.message || lang.failed
            );
        }
    };

    if (loading && operations.length === 0) {
        return (
            <div
                className="personal-finance-page"
                dir={isArabic ? "rtl" : "ltr"}
            >
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }

    return (
        <div
            className="personal-finance-page"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Intro */}
            <header className="finance-intro">
                <div>
                    <div className="finance-greeting">
                        {lang.greeting}
                        {userName ? `، ${userName}` : ""}
                    </div>

                    <h1>{lang.subtitle}</h1>
                </div>

                <button
                    type="button"
                    className="finance-add"
                    onClick={openCreateForm}
                >
                    <FaPlus size={11} />
                    {lang.add}
                </button>
            </header>

            {/* Balance */}
            <section className="finance-balance">
                <div>
                    <div className="finance-balance-caption">
                        {lang.balance}
                    </div>

                    <div className="finance-balance-number">
                        <FormatAmount
                            value={stats.balance}
                        />
                    </div>
                </div>

                <div className="finance-balance-side">
                    <div>
                        <span className="income-dot" />
                        <span>{lang.income}</span>

                        <strong>
                            <FormatAmount
                                value={stats.totalIncome}
                            />
                        </strong>
                    </div>

                    <div>
                        <span className="expense-dot" />
                        <span>{lang.expense}</span>

                        <strong>
                            <FormatAmount
                                value={stats.totalExpense}
                            />
                        </strong>
                    </div>
                </div>
            </section>

            {/* Recent operations */}
            <section className="finance-recent">
                <div className="finance-recent-header">
                    <div>
                        <h2>{lang.recent}</h2>

                        <span>
                            {stats.operationsCount}{" "}
                            {lang.operationCount}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="finance-view-all"
                        onClick={() => {
                            setSearch("");
                            setTypeFilter("all");
                        }}
                    >
                        {lang.allOperations}
                    </button>
                </div>

                {/* Tools */}
                <div className="finance-toolbar">
                    <div className="finance-search">
                        <FaSearch size={11} />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder={lang.search}
                        />
                    </div>

                    <div className="finance-filter">
                        <button
                            type="button"
                            className={
                                typeFilter === "all"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setTypeFilter("all")
                            }
                        >
                            {lang.all}
                        </button>

                        <button
                            type="button"
                            className={
                                typeFilter === "income"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setTypeFilter("income")
                            }
                        >
                            {lang.incomeOnly}
                        </button>

                        <button
                            type="button"
                            className={
                                typeFilter === "expense"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setTypeFilter("expense")
                            }
                        >
                            {lang.expenseOnly}
                        </button>
                    </div>

                    <div className="finance-export">
                        <button
                            type="button"
                            title={lang.exportExcel}
                            onClick={() =>
                                exportToExcel(
                                    operations,
                                    "operations"
                                )
                            }
                        >
                            <FaFileExcel size={11} />
                        </button>

                        <button
                            type="button"
                            title={lang.exportPDF}
                            onClick={() =>
                                exportToPDF(
                                    operations,
                                    "operations"
                                )
                            }
                        >
                            <FaFilePdf size={11} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="finance-list">
                    {operations.length === 0 ? (
                        <div className="finance-empty-state">
                            <strong>
                                {search.trim() ||
                                typeFilter !== "all"
                                    ? lang.noResults
                                    : lang.noOperations}
                            </strong>
                        </div>
                    ) : (
                        operations.map((operation) => {
                            const isIncome =
                                operation.type === "income";

                            return (
                                <article
                                    key={operation.id}
                                    className="finance-item"
                                >
                                    <div
                                        className={`finance-item-icon ${
                                            isIncome
                                                ? "income"
                                                : "expense"
                                        }`}
                                    >
                                        {isIncome ? (
                                            <FaArrowUp />
                                        ) : (
                                            <FaArrowDown />
                                        )}
                                    </div>

                                    <div className="finance-item-content">
                                        <div className="finance-item-name">
                                            {getCategoryName(
                                                operation.category
                                            )}
                                        </div>

                                        <div className="finance-item-details">
                                            <FormatDate
                                                value={
                                                    operation.operation_date
                                                }
                                            />

                                            {operation.description && (
                                                <>
                                                    <span>·</span>
                                                    <span>
                                                        {
                                                            operation.description
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`finance-item-amount ${
                                            isIncome
                                                ? "income"
                                                : "expense"
                                        }`}
                                    >
                                        {isIncome ? "+" : "-"}{" "}
                                        <FormatAmount
                                            value={
                                                operation.amount
                                            }
                                        />
                                    </div>

                                    <div className="finance-item-actions">
                                        <button
                                            type="button"
                                            title={lang.edit}
                                            onClick={() =>
                                                openEditForm(
                                                    operation
                                                )
                                            }
                                        >
                                            <FaEdit size={10} />
                                        </button>

                                        <button
                                            type="button"
                                            title={lang.delete}
                                            onClick={() =>
                                                setOperationToDelete(
                                                    operation
                                                )
                                            }
                                        >
                                            <FaTrash size={9} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Form */}
            {showForm && (
                <div
                    className="system-modal-backdrop"
                    onClick={closeForm}
                >
                    <div
                        className="system-modal"
                        style={{
                            maxWidth: "700px",
                            width: "100%",
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="system-modal-header">
                            <h3>
                                {selectedOperation
                                    ? lang.edit
                                    : lang.add}
                            </h3>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeForm}
                            >
                                ×
                            </button>
                        </div>

                        <div className="system-modal-body">
                            <OperationForm
                                operation={selectedOperation}
                                onSave={handleSave}
                                onCancel={closeForm}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete */}
            {operationToDelete && (
                <div
                    className="system-modal-backdrop"
                    onClick={() =>
                        setOperationToDelete(null)
                    }
                >
                    <div
                        className="system-modal"
                        style={{ maxWidth: "420px" }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="system-modal-header">
                            <h3>{lang.deleteTitle}</h3>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setOperationToDelete(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="system-modal-body">
                            <p className="finance-delete-title">
                                {lang.deleteConfirm}
                            </p>

                            <p className="finance-delete-text">
                                {lang.deleteWarning}
                            </p>
                        </div>

                        <div className="system-modal-footer">
                            <button
                                type="button"
                                className="modal-button-secondary"
                                onClick={() =>
                                    setOperationToDelete(
                                        null
                                    )
                                }
                            >
                                {lang.cancel}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                {lang.confirmDelete}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Operations;