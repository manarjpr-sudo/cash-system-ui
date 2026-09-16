import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import dashboardService from "../services/dashboardService";

import FormatAmount from "../components/common/FormatAmount";
import FormatDate from "../components/common/FormatDate";

import {
    FaArrowDown,
    FaArrowUp,
    FaPlus,
} from "react-icons/fa";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function Dashboard() {
    const { language } = useLanguage();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isArabic = language === "ar";

    const lang = isArabic
        ? {
          greeting: "أهلًا بك",
          title: "أموالك اليوم",
          subtitle:
              "اعرف رصيدك، وتابع دخلك ومصروفاتك بسهولة.",

          balance: "رصيدك الحالي",
          income: "ما دخل إليك",
          expense: "ما أنفقته",

          incomeVsExpense: "دخلك مقابل مصروفاتك",
          chartSubtitle:
              "شاهد الفرق بين ما دخل إليك وما أنفقته.",

          quickTitle: "أضف دخلاً أو مصروفًا",
          quickText:
              "سجّل أي حركة مالية جديدة ليبقى رصيدك محدثًا.",

          latest: "آخر ما سجّلته",
          latestSub:
              "أحدث العمليات المالية التي أضفتها إلى حسابك.",
          viewAll: "عرض كل العمليات",

          noOperations:
              "لم تسجّل أي عملية بعد.",
          addOperation: "أضف أول عملية",

          loading: "نجهّز ملخص أموالك...",
          loadError:
              "لم نتمكن من تحميل بيانات أموالك الآن.",
          retry: "حاول مرة أخرى",

          today: "اليوم",

          incomeType: "دخل",
          expenseType: "مصروف",
      }
    : {
          greeting: "Welcome back",
          title: "Your money at a glance",
          subtitle:
              "See your balance and keep track of what comes in and goes out.",

          balance: "Your current balance",
          income: "Money in",
          expense: "Money out",

          incomeVsExpense: "Money in vs. money out",
          chartSubtitle:
              "See the difference between what you receive and what you spend.",

          quickTitle: "Add income or expense",
          quickText:
              "Record a new money movement to keep your balance up to date.",

          latest: "What you added recently",
          latestSub:
              "Your latest recorded financial activity.",
          viewAll: "View all operations",

          noOperations:
              "You haven't added any operations yet.",
          addOperation: "Add your first operation",

          loading: "Getting your financial overview ready...",
          loadError:
              "We couldn't load your financial data right now.",
          retry: "Try again",

          today: "Today",

          incomeType: "Income",
          expenseType: "Expense",
      };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await dashboardService.getDashboard();

            setData(result);
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(lang.loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const stats = data?.stats ?? {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        operationsCount: 0,
    };

    const latestOperations =
        data?.latestOperations ?? [];

    const user = data?.user;

    const chartData = useMemo(
        () => [
            {
                name: lang.income,
                value: Number(stats.totalIncome || 0),
            },
            {
                name: lang.expense,
                value: Number(stats.totalExpense || 0),
            },
        ],
        [
            stats.totalIncome,
            stats.totalExpense,
            lang.income,
            lang.expense,
        ]
    );

    const getCategoryName = (operation) => {
        const category = operation?.category;

        if (!category) return "-";

        return isArabic
            ? category.name_ar ||
                  category.name_en ||
                  "-"
            : category.name_en ||
                  category.name_ar ||
                  "-";
    };

    if (loading) {
        return (
            <div
                className="finance-dashboard-state"
                dir={isArabic ? "rtl" : "ltr"}
            >
                <div className="finance-dashboard-loading">
                    {lang.loading}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="finance-dashboard-state"
                dir={isArabic ? "rtl" : "ltr"}
            >
                <div className="finance-dashboard-error">
                    <p>{error}</p>

                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={loadDashboard}
                    >
                        {lang.retry}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="finance-dashboard"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Header */}
            <header className="finance-dashboard-header">
                <div>
                    <div className="finance-dashboard-greeting">
                        {lang.greeting}
                        {user?.name
                            ? `، ${user.name}`
                            : ""}
                    </div>

                    <h1>{lang.title}</h1>

                    <p className="finance-dashboard-subtitle">
                        {lang.subtitle}
                    </p>
                </div>

                <Link
                    to="/operations?action=create"
                    className="finance-dashboard-add"
                >
                    <FaPlus size={11} />
                    {lang.addOperation}
                </Link>
            </header>

            {/* Balance hero */}
            <section className="finance-hero">
                <div>
                    <div className="finance-hero-label">
                        {lang.balance}
                    </div>

                    <div className="finance-hero-balance">
                        <FormatAmount
                            value={stats.balance}
                        />
                    </div>
                </div>

                <div className="finance-hero-side">
                    <div className="finance-hero-stat">
                        <div className="finance-hero-stat-label">
                            <span className="finance-hero-dot income" />
                            {lang.income}
                        </div>

                        <div className="finance-hero-stat-value">
                            <FormatAmount
                                value={stats.totalIncome}
                            />
                        </div>
                    </div>

                    <div className="finance-hero-stat">
                        <div className="finance-hero-stat-label">
                            <span className="finance-hero-dot expense" />
                            {lang.expense}
                        </div>

                        <div className="finance-hero-stat-value">
                            <FormatAmount
                                value={stats.totalExpense}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Small stats */}
            <div className="finance-summary-grid">
                <div className="finance-summary-card">
                    <div className="finance-summary-icon income">
                        <FaArrowUp />
                    </div>

                    <div>
                        <div className="finance-summary-label">
                            {lang.income}
                        </div>

                        <div className="finance-summary-value">
                            <FormatAmount
                                value={stats.totalIncome}
                            />
                        </div>
                    </div>
                </div>

                <div className="finance-summary-card">
                    <div className="finance-summary-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>
                        <div className="finance-summary-label">
                            {lang.expense}
                        </div>

                        <div className="finance-summary-value">
                            <FormatAmount
                                value={stats.totalExpense}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart + quick action */}
            <div className="finance-dashboard-grid">
                <section className="finance-panel">
                    <div className="finance-panel-header">
                        <div>
                            <h2>
                                {lang.incomeVsExpense}
                            </h2>

                            <p>
                                {lang.chartSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="finance-panel-body">
                        <div className="finance-chart-wrap">
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 12,
                                        right: 8,
                                        left: isArabic
                                            ? 8
                                            : 0,
                                        bottom: 8,
                                    }}
                                    barCategoryGap="34%"
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="var(--border-color)"
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fill: "var(--text-muted)",
                                        }}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        width={58}
                                        tick={{
                                            fontSize: 9,
                                            fill: "var(--text-muted)",
                                        }}
                                    />

                                    <Tooltip
                                        cursor={{
                                            fill: "rgba(37, 99, 235, 0.04)",
                                        }}
                                        formatter={(value) => [
                                            Number(value || 0).toLocaleString(),
                                            "",
                                        ]}
                                    />

                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-primary)"
                                        radius={[
                                            7,
                                            7,
                                            2,
                                            2,
                                        ]}
                                        maxBarSize={58}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <section className="finance-panel">
                    <div className="finance-quick-action">
                        <div className="finance-quick-action-top">
                            <div className="finance-quick-icon">
                                <FaPlus />
                            </div>

                            <h2>{lang.quickTitle}</h2>

                            <p>{lang.quickText}</p>
                        </div>

                        <Link
                            to="/operations?action=create"
                            className="finance-quick-button"
                        >
                            <FaPlus size={10} />
                            {lang.addOperation}
                        </Link>
                    </div>
                </section>
            </div>

            {/* Latest operations */}
            <section className="finance-latest">
                <header className="finance-latest-header">
                    <div>
                        <h2>{lang.latest}</h2>

                        <p>{lang.latestSub}</p>
                    </div>

                    <Link
                        to="/operations"
                        className="finance-latest-link"
                    >
                        {lang.viewAll}
                    </Link>
                </header>

                {latestOperations.length === 0 ? (
                    <div className="finance-latest-empty">
                        {lang.noOperations}
                    </div>
                ) : (
                    <div className="finance-latest-list">
                        {latestOperations.map(
                            (operation) => {
                                const isIncome =
                                    operation.type ===
                                    "income";

                                return (
                                    <div
                                        key={operation.id}
                                        className="finance-latest-item"
                                    >
                                        <div
                                            className={`finance-latest-icon ${
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

                                        <div className="finance-latest-content">
                                            <div className="finance-latest-category">
                                                {getCategoryName(
                                                    operation
                                                )}
                                            </div>

                                            <div className="finance-latest-meta">
                                                <FormatDate
                                                    value={
                                                        operation.operation_date
                                                    }
                                                />

                                                <span>•</span>

                                                <span>
                                                    {isIncome
                                                        ? lang.incomeType
                                                        : lang.expenseType}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`finance-latest-amount ${
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
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;