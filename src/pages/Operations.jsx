import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import {
    FaArrowDown,
    FaArrowUp,
    FaEdit,
    FaFileExcel,
    FaFilePdf,
    FaPlus,
    FaSearch,
    FaTimes,
    FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import operationService from "../services/operationService";
import dashboardService from "../services/dashboardService";
import categoryService from "../services/categoryService";
import OperationForm from "../components/operations/OperationForm";
import FormatAmount from "../components/common/FormatAmount";
import FormatDate from "../components/common/FormatDate";
import TableSkeleton from "../components/common/TableSkeleton";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import {
    exportToExcel,
    exportToPDF,
} from "../utils/exportUtils";

function Operations() {
    const { language } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const { settings } = useSettings();

    const isArabic = language === "ar";

    const [activeType, setActiveType] = useState("all");
    const [operations, setOperations] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] =
        useState(false);
    const [exporting, setExporting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [selectedOperation, setSelectedOperation] =
        useState(null);
    const [operationToDelete, setOperationToDelete] =
        useState(null);

    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: settings.items_per_page || 20,
        from: null,
        to: null,
    });

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        operationsCount: 0,
    });

    const text = isArabic
        ? {
              title: "العمليات",
              subtitle: "سجّل دخلك ومصروفاتك بسهولة",

              all: "كل العمليات",
              income: "الدخل",
              expense: "المصروفات",

              add: "إضافة عملية",
              search: "ابحث في العمليات...",

              fromDate: "من تاريخ",
              toDate: "إلى تاريخ",
              category: "التصنيف",
              allCategories: "كل التصنيفات",
              clear: "مسح الفلاتر",

              date: "التاريخ",
              type: "النوع",
              mainCategory: "التصنيف الرئيسي",
              subcategory: "التصنيف التفصيلي",
              amount: "المبلغ",
              notes: "الملاحظات",
              actions: "الإجراءات",

              incomeLabel: "دخل",
              expenseLabel: "مصروف",

              balance: "الرصيد الحالي",
              totalIncome: "إجمالي الدخل",
              totalExpense: "إجمالي المصروفات",

              operationCount: "عملية",
              showing: "عرض",
              of: "من",

              noOperations:
                  "لا توجد عمليات مطابقة للفلاتر الحالية.",
              emptyIncome: "لا توجد عمليات دخل بعد.",
              emptyExpense: "لا توجد مصروفات بعد.",

              edit: "تعديل",
              delete: "حذف",

              deleteConfirm: "هل تريد حذف هذه العملية؟",
              deleteWarning:
                  "سيتم حذف العملية نهائيًا ولا يمكن استعادتها.",

              cancel: "إلغاء",
              confirmDelete: "حذف العملية",

              added: "تمت إضافة العملية بنجاح.",
              updated: "تم تحديث العملية بنجاح.",
              deleted: "تم حذف العملية بنجاح.",

              failed: "تعذر تنفيذ العملية.",

              excel: "تصدير Excel",
              pdf: "تصدير PDF",
              exporting: "جارٍ التصدير...",

              previous: "السابق",
              next: "التالي",

              uncategorized: "بدون تصنيف",
              nothingToExport:
                  "لا توجد عمليات لتصديرها.",
          }
        : {
              title: "Operations",
              subtitle:
                  "Record your income and expenses easily",

              all: "All operations",
              income: "Income",
              expense: "Expenses",

              add: "Add operation",
              search: "Search operations...",

              fromDate: "From date",
              toDate: "To date",
              category: "Category",
              allCategories: "All categories",
              clear: "Clear filters",

              date: "Date",
              type: "Type",
              mainCategory: "Main category",
              subcategory: "Detail category",
              amount: "Amount",
              notes: "Notes",
              actions: "Actions",

              incomeLabel: "Income",
              expenseLabel: "Expense",

              balance: "Current balance",
              totalIncome: "Total income",
              totalExpense: "Total expenses",

              operationCount: "operations",
              showing: "Showing",
              of: "of",

              noOperations:
                  "No operations match the current filters.",
              emptyIncome: "No income operations yet.",
              emptyExpense: "No expenses yet.",

              edit: "Edit",
              delete: "Delete",

              deleteConfirm: "Delete this operation?",
              deleteWarning:
                  "This operation will be permanently deleted.",

              cancel: "Cancel",
              confirmDelete: "Delete operation",

              added: "Operation added successfully.",
              updated: "Operation updated successfully.",
              deleted: "Operation deleted successfully.",

              failed:
                  "We couldn't complete the action.",

              excel: "Export Excel",
              pdf: "Export PDF",
              exporting: "Exporting...",

              previous: "Previous",
              next: "Next",

              uncategorized: "Uncategorized",
              nothingToExport:
                  "There are no operations to export.",
          };

    const getCategoryName = (category) => {
        if (!category) {
            return text.uncategorized;
        }

        return isArabic
            ? category.name_ar ||
                  category.name_en ||
                  text.uncategorized
            : category.name_en ||
                  category.name_ar ||
                  text.uncategorized;
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);

            if (activeType === "all") {
                const [
                    incomeCategories,
                    expenseCategories,
                ] = await Promise.all([
                    categoryService.getByType("income"),
                    categoryService.getByType("expense"),
                ]);

                const merged = [
                    ...(incomeCategories || []),
                    ...(expenseCategories || []),
                ];

                const unique = Array.from(
                    new Map(
                        merged.map((category) => [
                            String(category.id),
                            category,
                        ])
                    ).values()
                );

                setCategories(unique);

                return;
            }

            const data =
                await categoryService.getByType(
                    activeType
                );

            setCategories(data || []);
        } catch (error) {
            console.error(
                "Error loading categories:",
                error
            );

            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadSummary = async () => {
        try {
            const response =
                await dashboardService.getDashboard();

            const data = response || {};

            setSummary({
                totalIncome: Number(
                    data.stats?.totalIncome || 0
                ),
                totalExpense: Number(
                    data.stats?.totalExpense || 0
                ),
                balance: Number(
                    data.stats?.balance || 0
                ),
                operationsCount: Number(
                    data.stats?.operationsCount || 0
                ),
            });
        } catch (error) {
            console.error(
                "Dashboard summary loading error:",
                error
            );
        }
    };

    const buildOperationParams = (
        page = currentPage,
        perPage = settings.items_per_page || 20
    ) => {
        const params = {
            page,
            per_page: perPage,
        };

        if (activeType !== "all") {
            params.type = activeType;
        }

        if (search.trim()) {
            params.search = search.trim();
        }

        if (dateFrom) {
            params.date_from = dateFrom;
        }

        if (dateTo) {
            params.date_to = dateTo;
        }

        if (categoryFilter) {
            params.category_id = categoryFilter;
        }

        return params;
    };

    const loadOperations = async (
        page = currentPage
    ) => {
        try {
            setLoading(true);

            const params =
                buildOperationParams(page);

            const response =
                await operationService.getAll(
                    params
                );

            const responseData = response?.data || {};
            const data =
                responseData.data || [];

            const meta =
                responseData.meta ||
                responseData;

            setOperations(data);

            setPagination({
                currentPage:
                    Number(
                        meta.current_page ??
                            page
                    ),
                lastPage:
                    Number(
                        meta.last_page ?? 1
                    ),
                total:
                    Number(
                        meta.total ??
                            data.length
                    ),
                perPage:
                    Number(
                        meta.per_page ??
                            params.per_page
                    ),
                from:
                    meta.from ?? null,
                to:
                    meta.to ?? null,
            });
        } catch (error) {
            console.error(
                "Operations loading error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    text.failed
            );
        } finally {
            setLoading(false);
        }
    };

    const loadAllFilteredOperations =
        async () => {
            const baseParams =
                buildOperationParams(
                    1,
                    500
                );

            const firstResponse =
                await operationService.getAll(
                    baseParams
                );

            const firstData =
                firstResponse?.data || {};

            let allOperations =
                firstData.data || [];

            const firstMeta =
                firstData.meta ||
                firstData;

            const lastPage = Number(
                firstMeta.last_page || 1
            );

            if (lastPage <= 1) {
                return allOperations;
            }

            for (
                let page = 2;
                page <= lastPage;
                page += 1
            ) {
                const response =
                    await operationService.getAll({
                        ...baseParams,
                        page,
                    });

                const pageData =
                    response?.data?.data || [];

                allOperations = [
                    ...allOperations,
                    ...pageData,
                ];
            }

            return allOperations;
        };

    const handleExportExcel = async () => {
        try {
            setExporting(true);

            const data =
                await loadAllFilteredOperations();

            if (!data.length) {
                toast.info(text.nothingToExport);
                return;
            }

            exportToExcel(
                data,
                "operations"
            );
        } catch (error) {
            console.error(
                "Excel export error:",
                error
            );

            toast.error(text.failed);
        } finally {
            setExporting(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            setExporting(true);

            const data =
                await loadAllFilteredOperations();

            if (!data.length) {
                toast.info(text.nothingToExport);
                return;
            }

            exportToPDF(
                data,
                "operations"
            );
        } catch (error) {
            console.error(
                "PDF export error:",
                error
            );

            toast.error(text.failed);
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [activeType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadOperations(currentPage);
        }, 250);

        return () => clearTimeout(timer);
    }, [
        activeType,
        search,
        dateFrom,
        dateTo,
        categoryFilter,
        currentPage,
        settings.items_per_page,
    ]);

    useEffect(() => {
        loadSummary();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(
            location.search
        );

        const shouldOpen =
            params.get("action") === "create" ||
            params.get("openForm") === "true" ||
            location.state?.openCreate === true;

        if (!shouldOpen) {
            return;
        }

        setSelectedOperation(null);
        setShowForm(true);

        navigate(
            location.pathname,
            {
                replace: true,
                state: {},
            }
        );
    }, [
        location,
        navigate,
    ]);

    const clearFilters = () => {
        setSearch("");
        setDateFrom("");
        setDateTo("");
        setCategoryFilter("");
        setCurrentPage(1);
    };

    const hasFilters =
        Boolean(search.trim()) ||
        Boolean(dateFrom) ||
        Boolean(dateTo) ||
        Boolean(categoryFilter);

    const openCreateForm = () => {
        setSelectedOperation(null);
        setShowForm(true);
    };

    const openEditForm = (operation) => {
        setSelectedOperation(operation);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSelectedOperation(null);
    };

    const handleSave = async (data) => {
        try {
            if (selectedOperation) {
                await operationService.update(
                    selectedOperation.id,
                    data
                );

                toast.success(text.updated);
            } else {
                await operationService.create(data);

                toast.success(text.added);
            }

            closeForm();

            await Promise.all([
                loadOperations(currentPage),
                loadSummary(),
            ]);
        } catch (error) {
            console.error(
                "Operation save error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    text.failed
            );

            throw error;
        }
    };

    const handleDelete = async () => {
        if (!operationToDelete) {
            return;
        }

        try {
            await operationService.delete(
                operationToDelete.id
            );

            toast.success(text.deleted);

            setOperationToDelete(null);

            await loadSummary();

            if (
                operations.length === 1 &&
                currentPage > 1
            ) {
                setCurrentPage(
                    (page) => page - 1
                );
            } else {
                await loadOperations(
                    currentPage
                );
            }
        } catch (error) {
            console.error(
                "Operation delete error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    text.failed
            );
        }
    };

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > pagination.lastPage ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (value) => {
        setDateFrom(value);
        setCurrentPage(1);
    };

    const handleDateToChange = (value) => {
        setDateTo(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const selectType = (type) => {
        setActiveType(type);
        setCategoryFilter("");
        setCurrentPage(1);
    };

    const selectedOperationType =
        selectedOperation?.type ||
        (activeType === "all"
            ? "expense"
            : activeType);

    const emptyMessage =
        activeType === "income"
            ? text.emptyIncome
            : activeType === "expense"
              ? text.emptyExpense
              : text.noOperations;

    if (
        loading &&
        operations.length === 0
    ) {
        return (
            <div
                className="personal-finance-page"
                dir={
                    isArabic ? "rtl" : "ltr"
                }
            >
                <TableSkeleton
                    rows={6}
                    columns={7}
                />
            </div>
        );
    }

    return (
        <div
            className="personal-finance-page"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <header className="finance-intro">
                <div>
                    <div className="finance-greeting">
                        {text.title}
                    </div>

                    <h1>{text.subtitle}</h1>
                </div>

                <button
                    type="button"
                    className="finance-add"
                    onClick={openCreateForm}
                >
                    <FaPlus size={11} />
                    {text.add}
                </button>
            </header>

            {/* ملخص الحساب */}
            <section className="finance-balance">
                <div>
                    <div className="finance-balance-caption">
                        {text.balance}
                    </div>

                    <div className="finance-balance-number">
                        <FormatAmount
                            value={
                                summary.balance
                            }
                        />
                    </div>
                </div>

                <div className="finance-balance-side">
                    <div>
                        <span className="income-dot" />

                        <span>
                            {text.totalIncome}
                        </span>

                        <strong>
                            <FormatAmount
                                value={
                                    summary.totalIncome
                                }
                            />
                        </strong>
                    </div>

                    <div>
                        <span className="expense-dot" />

                        <span>
                            {text.totalExpense}
                        </span>

                        <strong>
                            <FormatAmount
                                value={
                                    summary.totalExpense
                                }
                            />
                        </strong>
                    </div>
                </div>
            </section>

            {/* نوع العملية */}
            <div className="operations-type-tabs">
                <button
                    type="button"
                    className={
                        activeType === "all"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        selectType("all")
                    }
                >
                    {text.all}
                </button>

                <button
                    type="button"
                    className={
                        activeType === "expense"
                            ? "active expense"
                            : ""
                    }
                    onClick={() =>
                        selectType("expense")
                    }
                >
                    <FaArrowDown />
                    {text.expense}
                </button>

                <button
                    type="button"
                    className={
                        activeType === "income"
                            ? "active income"
                            : ""
                    }
                    onClick={() =>
                        selectType("income")
                    }
                >
                    <FaArrowUp />
                    {text.income}
                </button>
            </div>

            {/* الفلاتر */}
            <section className="operations-toolbar">
                <div className="operations-search">
                    <FaSearch size={11} />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                        placeholder={
                            text.search
                        }
                    />
                </div>

                <div className="operations-filter">
                    <label>
                        {text.fromDate}
                    </label>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) =>
                            handleDateFromChange(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="operations-filter">
                    <label>
                        {text.toDate}
                    </label>

                    <input
                        type="date"
                        value={dateTo}
                        min={
                            dateFrom ||
                            undefined
                        }
                        onChange={(event) =>
                            handleDateToChange(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="operations-filter">
                    <label>
                        {text.category}
                    </label>

                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            handleCategoryChange(
                                event.target.value
                            )
                        }
                        disabled={
                            loadingCategories
                        }
                    >
                        <option value="">
                            {loadingCategories
                                ? "..."
                                : text.allCategories}
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={
                                        category.id
                                    }
                                    value={
                                        category.id
                                    }
                                >
                                    {getCategoryName(
                                        category
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        className="operations-clear"
                        onClick={
                            clearFilters
                        }
                        title={text.clear}
                    >
                        <FaTimes size={10} />
                        {text.clear}
                    </button>
                )}

                <div className="finance-export">
                    <button
                        type="button"
                        title={text.excel}
                        onClick={
                            handleExportExcel
                        }
                        disabled={exporting}
                    >
                        <FaFileExcel
                            size={11}
                        />
                    </button>

                    <button
                        type="button"
                        title={text.pdf}
                        onClick={
                            handleExportPDF
                        }
                        disabled={exporting}
                    >
                        <FaFilePdf
                            size={11}
                        />
                    </button>
                </div>
            </section>

            {/* الجدول */}
            <section className="operations-table-wrapper">
                {operations.length === 0 ? (
                    <div className="finance-empty-state">
                        <strong>
                            {emptyMessage}
                        </strong>

                        {!hasFilters && (
                            <button
                                type="button"
                                className="finance-primary-button"
                                onClick={
                                    openCreateForm
                                }
                            >
                                <FaPlus />
                                {text.add}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="operations-table">
                            <thead>
                                <tr>
                                    <th>
                                        {text.date}
                                    </th>
                                    <th>
                                        {text.type}
                                    </th>
                                    <th>
                                        {
                                            text.mainCategory
                                        }
                                    </th>
                                    <th>
                                        {
                                            text.subcategory
                                        }
                                    </th>
                                    <th>
                                        {text.amount}
                                    </th>
                                    <th>
                                        {text.notes}
                                    </th>
                                    <th>
                                        {
                                            text.actions
                                        }
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {operations.map(
                                    (
                                        operation
                                    ) => {
                                        const isIncome =
                                            operation.type ===
                                            "income";

                                        return (
                                            <tr
                                                key={
                                                    operation.id
                                                }
                                            >
                                                <td>
                                                    <FormatDate
                                                        value={
                                                            operation.operation_date
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <span
                                                        className={`operation-type-badge ${
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

                                                        {isIncome
                                                            ? text.incomeLabel
                                                            : text.expenseLabel}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="operation-category-main">
                                                        {isIncome
                                                            ? text.income
                                                            : text.expense}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="operation-category-sub">
                                                        {getCategoryName(
                                                            operation.category
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div
                                                        className={`operation-amount ${
                                                            isIncome
                                                                ? "income"
                                                                : "expense"
                                                        }`}
                                                    >
                                                        {isIncome
                                                            ? "+"
                                                            : "-"}{" "}
                                                        <FormatAmount
                                                            value={
                                                                operation.amount
                                                            }
                                                        />
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="operation-notes">
                                                        {operation.description ||
                                                            "—"}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="operation-row-actions">
                                                        <button
                                                            type="button"
                                                            title={
                                                                text.edit
                                                            }
                                                            onClick={() =>
                                                                openEditForm(
                                                                    operation
                                                                )
                                                            }
                                                        >
                                                            <FaEdit
                                                                size={
                                                                    10
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title={
                                                                text.delete
                                                            }
                                                            onClick={() =>
                                                                setOperationToDelete(
                                                                    operation
                                                                )
                                                            }
                                                        >
                                                            <FaTrash
                                                                size={
                                                                    9
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
                <div className="operations-pagination">
                    <button
                        type="button"
                        disabled={
                            currentPage ===
                                1 ||
                            loading
                        }
                        onClick={() =>
                            goToPage(
                                currentPage - 1
                            )
                        }
                    >
                        {text.previous}
                    </button>

                    <span>
                        {currentPage}{" "}
                        {text.of}{" "}
                        {pagination.lastPage}
                    </span>

                    <button
                        type="button"
                        disabled={
                            currentPage >=
                                pagination.lastPage ||
                            loading
                        }
                        onClick={() =>
                            goToPage(
                                currentPage + 1
                            )
                        }
                    >
                        {text.next}
                    </button>
                </div>
            )}

            {/* نموذج الإضافة والتعديل */}
            {showForm && (
                <div
                    className="system-modal-backdrop"
                    onClick={closeForm}
                >
                    <div
                        className="system-modal operation-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="system-modal-body">
                            <OperationForm
                                operation={
                                    selectedOperation
                                }
                                initialType={
                                    selectedOperationType
                                }
                                onSave={handleSave}
                                onCancel={
                                    closeForm
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* حذف */}
            {operationToDelete && (
                <div
                    className="system-modal-backdrop"
                    onClick={() =>
                        setOperationToDelete(
                            null
                        )
                    }
                >
                    <div
                        className="system-modal"
                        style={{
                            maxWidth:
                                "420px",
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="system-modal-header">
                            <h3>
                                {
                                    text.deleteConfirm
                                }
                            </h3>

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
                            <p>
                                {
                                    text.deleteWarning
                                }
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
                                {text.cancel}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={
                                    handleDelete
                                }
                            >
                                {
                                    text.confirmDelete
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Operations;