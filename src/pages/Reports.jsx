import { useEffect, useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaChartPie } from "react-icons/fa";
import { toast } from "react-toastify";

import reportService from "../services/reportService";
import FormatAmount from "../components/common/FormatAmount";
import { useLanguage } from "../context/LanguageContext";

function Reports() {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [period, setPeriod] = useState("month");
    const [activeType, setActiveType] = useState("expense");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const text = isArabic
        ? {
              title: "التقارير",
              subtitle: "افهم أين يذهب مالك وكيف يتغير دخلك",
              month: "هذا الشهر",
              lastThreeMonths: "آخر 3 أشهر",
              year: "هذه السنة",
              all: "كل الوقت",
              income: "الدخل",
              expenses: "المصروفات",
              balance: "الصافي",
              operations: "العمليات",
              distribution: "التوزيع حسب التصنيف",
              noData: "لا توجد بيانات لهذه الفترة.",
              loading: "جارٍ تحميل التقرير...",
              error: "تعذر تحميل التقرير.",
              retry: "حاول مرة أخرى",
              count: "عملية",
          }
        : {
              title: "Reports",
              subtitle: "Understand where your money goes and how your income changes",
              month: "This month",
              lastThreeMonths: "Last 3 months",
              year: "This year",
              all: "All time",
              income: "Income",
              expenses: "Expenses",
              balance: "Balance",
              operations: "Operations",
              distribution: "By category",
              noData: "No data for this period.",
              loading: "Loading report...",
              error: "Couldn't load the report.",
              retry: "Try again",
              count: "operations",
          };

    const getDateRange = (selectedPeriod) => {
        const today = new Date();
        const to = today.toISOString().split("T")[0];

        if (selectedPeriod === "all") {
            return {};
        }

        if (selectedPeriod === "month") {
            const from = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            return {
                date_from: from.toISOString().split("T")[0],
                date_to: to,
            };
        }

        if (selectedPeriod === "last3") {
            const from = new Date(
                today.getFullYear(),
                today.getMonth() - 2,
                1
            );

            return {
                date_from: from.toISOString().split("T")[0],
                date_to: to,
            };
        }

        if (selectedPeriod === "year") {
            const from = new Date(
                today.getFullYear(),
                0,
                1
            );

            return {
                date_from: from.toISOString().split("T")[0],
                date_to: to,
            };
        }

        return {};
    };

    const loadReport = async () => {
        try {
            setLoading(true);

            const params = getDateRange(period);

            const result = await reportService.getReport(params);

            setData(result);
        } catch (error) {
            console.error("Reports error:", error);

            toast.error(text.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [period]);

    const summary = data?.summary ?? {
        income: 0,
        expense: 0,
        balance: 0,
        operations_count: 0,
    };

    const categories =
        activeType === "income"
            ? data?.income_by_category ?? []
            : data?.expense_by_category ?? [];

    const total =
        activeType === "income"
            ? Number(summary.income || 0)
            : Number(summary.expense || 0);

    const categoryRows = useMemo(
        () =>
            categories.map((category) => ({
                ...category,
                amount: Number(category.amount || 0),
                percentage:
                    total > 0
                        ? (Number(category.amount || 0) / total) * 100
                        : 0,
            })),
        [categories, total]
    );

    const getCategoryName = (category) =>
        isArabic
            ? category.name_ar || category.name_en || "بدون تصنيف"
            : category.name_en || category.name_ar || "Uncategorized";

    if (loading) {
        return (
            <div
                className="finance-dashboard-state"
                dir={isArabic ? "rtl" : "ltr"}
            >
                <div className="finance-dashboard-loading">
                    {text.loading}
                </div>
            </div>
        );
    }

    return (
        <div
            className="finance-page reports-page"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <div className="finance-page-header">
                <div>
                    <h1>{text.title}</h1>
                    <p>{text.subtitle}</p>
                </div>

                <select
                    className="reports-period-select"
                    value={period}
                    onChange={(event) =>
                        setPeriod(event.target.value)
                    }
                >
                    <option value="month">{text.month}</option>
                    <option value="last3">
                        {text.lastThreeMonths}
                    </option>
                    <option value="year">{text.year}</option>
                    <option value="all">{text.all}</option>
                </select>
            </div>

            <div className="reports-summary-grid">
                <div className="reports-summary-card">
                    <div className="reports-summary-icon income">
                        <FaArrowUp />
                    </div>

                    <div>
                        <span>{text.income}</span>
                        <strong>
                            <FormatAmount value={summary.income} />
                        </strong>
                    </div>
                </div>

                <div className="reports-summary-card">
                    <div className="reports-summary-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>
                        <span>{text.expenses}</span>
                        <strong>
                            <FormatAmount value={summary.expense} />
                        </strong>
                    </div>
                </div>

                <div className="reports-summary-card">
                    <div className="reports-summary-icon balance">
                        <FaChartPie />
                    </div>

                    <div>
                        <span>{text.balance}</span>
                        <strong>
                            <FormatAmount value={summary.balance} />
                        </strong>
                    </div>
                </div>

                <div className="reports-summary-card">
                    <div className="reports-count">
                        {summary.operations_count}
                    </div>

                    <div>
                        <span>{text.operations}</span>
                        <strong>
                            {summary.operations_count}{" "}
                            {text.count}
                        </strong>
                    </div>
                </div>
            </div>

            <section className="reports-panel">
                <div className="reports-panel-header">
                    <div>
                        <h2>{text.distribution}</h2>
                    </div>

                    <div className="reports-type-tabs">
                        <button
                            type="button"
                            className={
                                activeType === "expense"
                                    ? "active expense"
                                    : ""
                            }
                            onClick={() =>
                                setActiveType("expense")
                            }
                        >
                            <FaArrowDown />
                            {text.expenses}
                        </button>

                        <button
                            type="button"
                            className={
                                activeType === "income"
                                    ? "active income"
                                    : ""
                            }
                            onClick={() =>
                                setActiveType("income")
                            }
                        >
                            <FaArrowUp />
                            {text.income}
                        </button>
                    </div>
                </div>

                {categoryRows.length === 0 ? (
                    <div className="reports-empty">
                        {text.noData}
                    </div>
                ) : (
                    <div className="reports-category-list">
                        {categoryRows.map((category) => (
                            <div
                                className="reports-category-row"
                                key={
                                    category.category_id ??
                                    category.name_ar ??
                                    category.name_en
                                }
                            >
                                <div className="reports-category-top">
                                    <strong>
                                        {getCategoryName(category)}
                                    </strong>

                                    <span>
                                        <FormatAmount
                                            value={category.amount}
                                        />
                                    </span>
                                </div>

                                <div className="reports-progress">
                                    <div
                                        className={`reports-progress-bar ${
                                            activeType
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                category.percentage,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className="reports-category-meta">
                                    <span>
                                        {category.percentage.toFixed(1)}%
                                    </span>

                                    <span>
                                        {category.count}{" "}
                                        {text.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Reports;