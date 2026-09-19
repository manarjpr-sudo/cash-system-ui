import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import dashboardService from "../services/dashboardService";
import operationService from "../services/operationService";

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
    const { lang, language } = useLanguage();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [chartPeriod, setChartPeriod] =
        useState("days");

    const [chartData, setChartData] =
        useState([]);

    const [chartLoading, setChartLoading] =
        useState(false);

    const isArabic =
        language === "ar" ||
        language === "AR";

    /*
     * ---------------------------------------------------------
     * Dashboard
     * ---------------------------------------------------------
     */

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await dashboardService.getDashboard();

            setData(
                response?.data ??
                    response
            );
        } catch (err) {
            console.error(
                "Error loading dashboard:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "حدث خطأ أثناء تحميل لوحة التحكم."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    /*
     * ---------------------------------------------------------
     * Statistics
     * ---------------------------------------------------------
     */

    const stats = useMemo(
        () => ({
            totalIncome: Number(
                data?.stats?.totalIncome || 0
            ),

            totalExpense: Number(
                data?.stats?.totalExpense || 0
            ),

            balance: Number(
                data?.stats?.balance || 0
            ),

            operationsCount: Number(
                data?.stats?.operationsCount || 0
            ),
        }),
        [data]
    );

    const latestOperations =
        data?.latestOperations || [];

    const user =
        data?.user || null;

    /*
     * ---------------------------------------------------------
     * Text
     * ---------------------------------------------------------
     */

    const text = {
        greeting:
            lang?.greeting ||
            (isArabic
                ? "مرحبًا"
                : "Welcome"),

        title:
            lang?.dashboardTitle ||
            (isArabic
                ? "لوحة التحكم"
                : "Dashboard"),

        subtitle:
            lang?.dashboardSubtitle ||
            (isArabic
                ? "نظرة سريعة على وضعك المالي"
                : "A quick overview of your finances"),

        balance:
            lang?.balance ||
            (isArabic
                ? "رصيدك الحالي"
                : "Current Balance"),

        income:
            lang?.income ||
            (isArabic
                ? "الدخل"
                : "Income"),

        expense:
            lang?.expense ||
            (isArabic
                ? "المصروفات"
                : "Expenses"),

        incomeVsExpense:
            lang?.incomeVsExpense ||
            (isArabic
                ? "حركة دخلك ومصروفاتك"
                : "Income & Expense Activity"),

        chartSubtitle:
            lang?.chartSubtitle ||
            (isArabic
                ? "ملخص العمليات حسب الفترة"
                : "Operations summary by period"),

        lastDays:
            isArabic
                ? "آخر 7 أيام"
                : "Last 7 days",

        lastWeeks:
            isArabic
                ? "آخر 6 أسابيع"
                : "Last 6 weeks",

        latest:
            lang?.latest ||
            (isArabic
                ? "آخر ما سجلته"
                : "Latest Operations"),

        latestSub:
            lang?.latestSub ||
            (isArabic
                ? "أحدث العمليات المالية"
                : "Your latest financial operations"),

        viewAll:
            lang?.viewAll ||
            (isArabic
                ? "عرض الكل"
                : "View All"),

        noOperations:
            lang?.noOperations ||
            (isArabic
                ? "لا توجد عمليات مسجلة"
                : "No operations recorded"),

        addOperation:
            lang?.addOperation ||
            (isArabic
                ? "إضافة عملية"
                : "Add Operation"),

        loading:
            lang?.loading ||
            (isArabic
                ? "جاري التحميل..."
                : "Loading..."),

        loadError:
            lang?.loadError ||
            (isArabic
                ? "تعذر تحميل البيانات"
                : "Unable to load data"),

        retry:
            lang?.retry ||
            (isArabic
                ? "إعادة المحاولة"
                : "Retry"),

        incomeType:
            lang?.incomeType ||
            (isArabic
                ? "دخل"
                : "Income"),

        expenseType:
            lang?.expenseType ||
            (isArabic
                ? "مصروف"
                : "Expense"),

        operation:
            isArabic
                ? "النوع"
                : "Type",

        category:
            isArabic
                ? "التصنيف"
                : "Category",

        date:
            isArabic
                ? "التاريخ"
                : "Date",

        amount:
            isArabic
                ? "المبلغ"
                : "Amount",

        noDescription:
            isArabic
                ? "بدون ملاحظات"
                : "No notes",
    };

    /*
     * ---------------------------------------------------------
     * Category name
     * ---------------------------------------------------------
     */

    const getCategoryName = (
        category
    ) => {
        if (!category) {
            return "-";
        }

        return isArabic
            ? category.name_ar ||
                  category.name_en ||
                  "-"
            : category.name_en ||
                  category.name_ar ||
                  "-";
    };

    /*
     * ---------------------------------------------------------
     * Chart periods
     * ---------------------------------------------------------
     */

    const buildPeriods = (
        period
    ) => {
        const periods = [];
        const today = new Date();

        if (period === "days") {
            for (
                let i = 6;
                i >= 0;
                i--
            ) {
                const date =
                    new Date(today);

                date.setHours(
                    0,
                    0,
                    0,
                    0
                );

                date.setDate(
                    today.getDate() -
                        i
                );

                const key =
                    date
                        .toISOString()
                        .slice(
                            0,
                            10
                        );

                periods.push({
                    key,
                    start: key,
                    end: key,

                    name:
                        date.toLocaleDateString(
                            isArabic
                                ? "ar-EG"
                                : "en-GB",
                            {
                                day: "2-digit",
                                month: "2-digit",
                            }
                        ),

                    income: 0,
                    expense: 0,
                });
            }

            return periods;
        }

        const current =
            new Date(today);

        current.setHours(
            0,
            0,
            0,
            0
        );

        const day =
            current.getDay();

        const mondayOffset =
            day === 0
                ? 6
                : day - 1;

        current.setDate(
            current.getDate() -
                mondayOffset
        );

        for (
            let i = 5;
            i >= 0;
            i--
        ) {
            const start =
                new Date(current);

            start.setDate(
                current.getDate() -
                    i * 7
            );

            const end =
                new Date(start);

            end.setDate(
                start.getDate() + 6
            );

            const startKey =
                start
                    .toISOString()
                    .slice(
                        0,
                        10
                    );

            const endKey =
                end
                    .toISOString()
                    .slice(
                        0,
                        10
                    );

            periods.push({
                key: startKey,
                start: startKey,
                end: endKey,

                name:
                    start.toLocaleDateString(
                        isArabic
                            ? "ar-EG"
                            : "en-GB",
                        {
                            day: "2-digit",
                            month: "2-digit",
                        }
                    ) +
                    " - " +
                    end.toLocaleDateString(
                        isArabic
                            ? "ar-EG"
                            : "en-GB",
                        {
                            day: "2-digit",
                            month: "2-digit",
                        }
                    ),

                income: 0,
                expense: 0,
            });
        }

        return periods;
    };

    /*
     * ---------------------------------------------------------
     * Chart
     * ---------------------------------------------------------
     */

    const loadChartData =
        async () => {
            try {
                setChartLoading(true);

                const periods =
                    buildPeriods(
                        chartPeriod
                    );

                if (!periods.length) {
                    setChartData([]);
                    return;
                }

                const firstPeriod =
                    periods[0];

                const lastPeriod =
                    periods[
                        periods.length - 1
                    ];

                let allOperations =
                    [];

                let page = 1;
                let lastPage = 1;

                do {
                    const response =
                        await operationService.getAll(
                            {
                                date_from:
                                    firstPeriod.start,

                                date_to:
                                    lastPeriod.end,

                                per_page: 100,

                                page,
                            }
                        );

                    const payload =
                        response?.data ??
                        response;

                    const operations =
                        Array.isArray(
                            payload?.data
                        )
                            ? payload.data
                            : [];

                    allOperations =
                        allOperations.concat(
                            operations
                        );

                    const meta =
                        payload?.meta ||
                        payload;

                    lastPage =
                        Number(
                            meta?.last_page ||
                                1
                        );

                    page += 1;
                } while (
                    page <= lastPage
                );

                const result =
                    periods.map(
                        (period) => ({
                            ...period,
                        })
                    );

                allOperations.forEach(
                    (operation) => {
                        const type =
                            operation?.type;

                        const amount =
                            Number(
                                operation?.amount ||
                                    0
                            );

                        const dateValue =
                            operation?.operation_date ||
                            operation?.date;

                        if (
                            !dateValue ||
                            !amount
                        ) {
                            return;
                        }

                        const date =
                            new Date(
                                dateValue
                            );

                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {
                            return;
                        }

                        const dateKey =
                            date
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                );

                        if (
                            chartPeriod ===
                            "days"
                        ) {
                            const target =
                                result.find(
                                    (
                                        item
                                    ) =>
                                        item.key ===
                                        dateKey
                                );

                            if (!target) {
                                return;
                            }

                            if (
                                type ===
                                "income"
                            ) {
                                target.income +=
                                    amount;
                            }

                            if (
                                type ===
                                "expense"
                            ) {
                                target.expense +=
                                    amount;
                            }

                            return;
                        }

                        const operationDate =
                            new Date(
                                date
                            );

                        operationDate.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        const operationDay =
                            operationDate.getDay();

                        const operationMondayOffset =
                            operationDay ===
                            0
                                ? 6
                                : operationDay -
                                  1;

                        operationDate.setDate(
                            operationDate.getDate() -
                                operationMondayOffset
                        );

                        const weekKey =
                            operationDate
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                );

                        const target =
                            result.find(
                                (
                                    item
                                ) =>
                                    item.key ===
                                    weekKey
                            );

                        if (!target) {
                            return;
                        }

                        if (
                            type ===
                            "income"
                        ) {
                            target.income +=
                                amount;
                        }

                        if (
                            type ===
                            "expense"
                        ) {
                            target.expense +=
                                amount;
                        }
                    }
                );

                setChartData(
                    result
                );
            } catch (err) {
                console.error(
                    "Error loading chart data:",
                    err
                );

                setChartData([]);
            } finally {
                setChartLoading(false);
            }
        };

    useEffect(() => {
        loadChartData();
    }, [
        chartPeriod,
        data,
    ]);

    /*
     * ---------------------------------------------------------
     * Loading
     * ---------------------------------------------------------
     */

    if (
        loading &&
        !data
    ) {
        return (
            <div
                className="d-flex align-items-center justify-content-center"
                style={{
                    minHeight:
                        "60vh",
                }}
            >
                <div
                    className="text-muted"
                    style={{
                        fontSize:
                            "14px",
                    }}
                >
                    {text.loading}
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * Error
     * ---------------------------------------------------------
     */

    if (
        error &&
        !data
    ) {
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center text-center"
                style={{
                    minHeight:
                        "60vh",
                }}
            >
                <div
                    className="text-danger mb-3"
                    style={{
                        fontSize:
                            "14px",
                    }}
                >
                    {text.loadError}
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={
                        loadDashboard
                    }
                >
                    {text.retry}
                </button>
            </div>
        );
    }

    return (
        <div
            className="finance-dashboard"
            style={{
                paddingBottom:
                    "32px",
            }}
        >
            {/* =================================================
                Header
            ================================================= */}

            <div
                className="d-flex align-items-center justify-content-between flex-wrap gap-3"
                style={{
                    marginBottom:
                        "24px",
                }}
            >
                <div>
                    <div
                        className="text-muted"
                        style={{
                            fontSize:
                                "13px",
                            marginBottom:
                                "4px",
                        }}
                    >
                        {text.greeting}
                        {user?.name
                            ? `، ${user.name}`
                            : ""}
                    </div>

                    <h1
                        className="mb-1"
                        style={{
                            fontSize:
                                "26px",
                            fontWeight:
                                700,
                        }}
                    >
                        {text.title}
                    </h1>

                    <div
                        className="text-muted"
                        style={{
                            fontSize:
                                "14px",
                        }}
                    >
                        {text.subtitle}
                    </div>
                </div>

                {/* Important:
                    Adding from Dashboard goes to the SAME
                    Operations page and SAME operation form.
                */}
                <Link
                    to="/operations?action=create"
                    className="finance-dashboard-add text-decoration-none"
                >
                    <FaPlus
                        size={11}
                    />
                    {text.addOperation}
                </Link>
            </div>

            {/* =================================================
                Current Balance
            ================================================= */}

            <section
                className="finance-hero"
                style={{
                    marginBottom:
                        "24px",
                    padding:
                        "24px",
                    boxSizing:
                        "border-box",
                }}
            >
                <div>
                    <div
                        className="text-muted"
                        style={{
                            fontSize:
                                "13px",
                            marginBottom:
                                "8px",
                        }}
                    >
                        {text.balance}
                    </div>

                    <div
                        style={{
                            fontSize:
                                "32px",
                            fontWeight:
                                700,
                            lineHeight:
                                1.2,
                        }}
                    >
                        <FormatAmount
                            value={
                                stats.balance
                            }
                        />
                    </div>
                </div>

                <div
                    className="d-flex flex-wrap gap-4"
                    style={{
                        marginTop:
                            "20px",
                    }}
                >
                    <div>
                        <div
                            className="text-muted"
                            style={{
                                fontSize:
                                    "12px",
                                marginBottom:
                                    "4px",
                            }}
                        >
                            {text.income}
                        </div>

                        <div
                            style={{
                                color:
                                    "var(--color-success)",
                                fontWeight:
                                    600,
                            }}
                        >
                            <FormatAmount
                                value={
                                    stats.totalIncome
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <div
                            className="text-muted"
                            style={{
                                fontSize:
                                    "12px",
                                marginBottom:
                                    "4px",
                            }}
                        >
                            {text.expense}
                        </div>

                        <div
                            style={{
                                color:
                                    "var(--color-danger)",
                                fontWeight:
                                    600,
                            }}
                        >
                            <FormatAmount
                                value={
                                    stats.totalExpense
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                Chart
            ================================================= */}

            <section
                className="finance-panel"
                style={{
                    marginBottom:
                        "24px",
                    padding:
                        "24px",
                    boxSizing:
                        "border-box",
                }}
            >
                <div
                    className="d-flex align-items-center justify-content-between flex-wrap gap-3"
                    style={{
                        marginBottom:
                            "20px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize:
                                    "18px",
                                fontWeight:
                                    700,
                                marginBottom:
                                    "5px",
                            }}
                        >
                            {
                                text.incomeVsExpense
                            }
                        </h2>

                        <div
                            className="text-muted"
                            style={{
                                fontSize:
                                    "13px",
                            }}
                        >
                            {
                                text.chartSubtitle
                            }
                        </div>
                    </div>

                    {/* Period controls — custom compact style */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "4px",
                            padding:
                                "4px",
                            border:
                                "1px solid var(--border-color)",
                            borderRadius:
                                "10px",
                            background:
                                "var(--bg-surface)",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setChartPeriod(
                                    "days"
                                )
                            }
                            style={{
                                border:
                                    "none",
                                borderRadius:
                                    "7px",
                                padding:
                                    "7px 12px",
                                fontSize:
                                    "12px",
                                fontWeight:
                                    600,
                                cursor:
                                    "pointer",
                                background:
                                    chartPeriod ===
                                    "days"
                                        ? "var(--color-primary)"
                                        : "transparent",
                                color:
                                    chartPeriod ===
                                    "days"
                                        ? "#fff"
                                        : "var(--text-secondary)",
                                transition:
                                    "all 0.15s ease",
                            }}
                        >
                            {
                                text.lastDays
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setChartPeriod(
                                    "weeks"
                                )
                            }
                            style={{
                                border:
                                    "none",
                                borderRadius:
                                    "7px",
                                padding:
                                    "7px 12px",
                                fontSize:
                                    "12px",
                                fontWeight:
                                    600,
                                cursor:
                                    "pointer",
                                background:
                                    chartPeriod ===
                                    "weeks"
                                        ? "var(--color-primary)"
                                        : "transparent",
                                color:
                                    chartPeriod ===
                                    "weeks"
                                        ? "#fff"
                                        : "var(--text-secondary)",
                                transition:
                                    "all 0.15s ease",
                            }}
                        >
                            {
                                text.lastWeeks
                            }
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        width:
                            "100%",
                        height:
                            "340px",
                    }}
                >
                    {chartLoading ? (
                        <div
                            className="d-flex align-items-center justify-content-center h-100 text-muted"
                            style={{
                                fontSize:
                                    "13px",
                            }}
                        >
                            {
                                text.loading
                            }
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={
                                    chartData
                                }
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 5,
                                    bottom: 5,
                                }}
                                barGap={8}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border-color)"
                                    vertical={
                                        false
                                    }
                                />

                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize:
                                            11,
                                        fill: "var(--text-muted)",
                                    }}
                                    axisLine={{
                                        stroke:
                                            "var(--border-color)",
                                    }}
                                    tickLine={
                                        false
                                    }
                                />

                                <YAxis
                                    tick={{
                                        fontSize:
                                            11,
                                        fill: "var(--text-muted)",
                                    }}
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                    tickFormatter={(
                                        value
                                    ) =>
                                        Number(
                                            value
                                        ).toLocaleString()
                                    }
                                />

                                <Tooltip
                                    formatter={(
                                        value
                                    ) => [
                                        Number(
                                            value
                                        ).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        ),
                                        "",
                                    ]}
                                    contentStyle={{
                                        background:
                                            "var(--bg-card)",
                                        border:
                                            "1px solid var(--border-color)",
                                        borderRadius:
                                            "10px",
                                    }}
                                />

                                <Bar
                                    dataKey="income"
                                    name={
                                        text.income
                                    }
                                    fill="var(--color-success)"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={
                                        42
                                    }
                                />

                                <Bar
                                    dataKey="expense"
                                    name={
                                        text.expense
                                    }
                                    fill="var(--color-danger)"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={
                                        42
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Simple chart legend */}
                <div
                    className="d-flex align-items-center justify-content-center gap-4"
                    style={{
                        marginTop:
                            "6px",
                    }}
                >
                    <div
                        className="d-flex align-items-center gap-2"
                        style={{
                            fontSize:
                                "12px",
                            color:
                                "var(--text-secondary)",
                        }}
                    >
                        <span
                            style={{
                                width:
                                    "8px",
                                height:
                                    "8px",
                                borderRadius:
                                    "50%",
                                background:
                                    "var(--color-success)",
                            }}
                        />
                        {
                            text.income
                        }
                    </div>

                    <div
                        className="d-flex align-items-center gap-2"
                        style={{
                            fontSize:
                                "12px",
                            color:
                                "var(--text-secondary)",
                        }}
                    >
                        <span
                            style={{
                                width:
                                    "8px",
                                height:
                                    "8px",
                                borderRadius:
                                    "50%",
                                background:
                                    "var(--color-danger)",
                            }}
                        />
                        {
                            text.expense
                        }
                    </div>
                </div>
            </section>

            {/* =================================================
                Latest Operations
            ================================================= */}

            <section
                className="finance-panel"
                style={{
                    marginTop:
                        "24px",
                    padding:
                        "24px",
                    boxSizing:
                        "border-box",
                    overflow:
                        "hidden",
                }}
            >
                <div
                    className="d-flex align-items-center justify-content-between flex-wrap gap-3"
                    style={{
                        marginBottom:
                            "18px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize:
                                    "18px",
                                fontWeight:
                                    700,
                                marginBottom:
                                    "5px",
                            }}
                        >
                            {
                                text.latest
                            }
                        </h2>

                        <div
                            className="text-muted"
                            style={{
                                fontSize:
                                    "13px",
                            }}
                        >
                            {
                                text.latestSub
                            }
                        </div>
                    </div>

                    <Link
                        to="/operations"
                        className="text-decoration-none"
                        style={{
                            fontSize:
                                "13px",
                        }}
                    >
                        {
                            text.viewAll
                        }
                    </Link>
                </div>

                {latestOperations.length ===
                0 ? (
                    <div
                        className="text-center text-muted"
                        style={{
                            padding:
                                "40px 20px",
                            fontSize:
                                "14px",
                        }}
                    >
                        {
                            text.noOperations
                        }
                    </div>
                ) : (
                    <div
                        style={{
                            width:
                                "100%",
                            overflowX:
                                "auto",
                        }}
                    >
                        <table
                            className="w-100"
                            style={{
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "620px",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        borderBottom:
                                            "1px solid var(--border-color)",
                                    }}
                                >
                                    <th
                                        style={{
                                            padding:
                                                "12px 10px",
                                            textAlign:
                                                isArabic
                                                    ? "right"
                                                    : "left",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                600,
                                            color:
                                                "var(--text-muted)",
                                        }}
                                    >
                                        {
                                            text.category
                                        }
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px 10px",
                                            textAlign:
                                                isArabic
                                                    ? "right"
                                                    : "left",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                600,
                                            color:
                                                "var(--text-muted)",
                                        }}
                                    >
                                        {
                                            text.date
                                        }
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px 10px",
                                            textAlign:
                                                "center",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                600,
                                            color:
                                                "var(--text-muted)",
                                        }}
                                    >
                                        {
                                            text.operation
                                        }
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px 10px",
                                            textAlign:
                                                isArabic
                                                    ? "left"
                                                    : "right",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                600,
                                            color:
                                                "var(--text-muted)",
                                        }}
                                    >
                                        {
                                            text.amount
                                        }
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {latestOperations
                                    .slice(
                                        0,
                                        5
                                    )
                                    .map(
                                        (
                                            operation
                                        ) => {
                                            const isIncome =
                                                operation?.type ===
                                                "income";

                                            return (
                                                <tr
                                                    key={
                                                        operation.id
                                                    }
                                                    style={{
                                                        borderBottom:
                                                            "1px solid var(--border-color)",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding:
                                                                "14px 10px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            {
                                                                getCategoryName(
                                                                    operation?.category
                                                                )
                                                            }
                                                        </div>

                                                        {operation?.description && (
                                                            <div
                                                                className="text-muted"
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    marginTop:
                                                                        "3px",
                                                                    maxWidth:
                                                                        "280px",
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                {
                                                                    operation.description
                                                                }
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "14px 10px",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "var(--text-secondary)",
                                                        }}
                                                    >
                                                        {operation?.operation_date ? (
                                                            <FormatDate
                                                                value={
                                                                    operation.operation_date
                                                                }
                                                            />
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "14px 10px",
                                                            textAlign:
                                                                "center",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-flex",
                                                                alignItems:
                                                                    "center",
                                                                gap:
                                                                    "6px",
                                                                padding:
                                                                    "5px 9px",
                                                                borderRadius:
                                                                    "999px",
                                                                background:
                                                                    isIncome
                                                                        ? "rgba(34, 197, 94, 0.10)"
                                                                        : "rgba(239, 68, 68, 0.10)",
                                                                color:
                                                                    isIncome
                                                                        ? "var(--color-success)"
                                                                        : "var(--color-danger)",
                                                                fontSize:
                                                                    "11px",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            {isIncome ? (
                                                                <FaArrowUp
                                                                    size={
                                                                        9
                                                                    }
                                                                />
                                                            ) : (
                                                                <FaArrowDown
                                                                    size={
                                                                        9
                                                                    }
                                                                />
                                                            )}

                                                            {isIncome
                                                                ? text.incomeType
                                                                : text.expenseType}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "14px 10px",
                                                            textAlign:
                                                                isArabic
                                                                    ? "left"
                                                                    : "right",
                                                            fontSize:
                                                                "14px",
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                isIncome
                                                                    ? "var(--color-success)"
                                                                    : "var(--color-danger)",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {isIncome
                                                            ? "+"
                                                            : "-"}{" "}
                                                        <FormatAmount
                                                            value={Number(
                                                                operation?.amount ||
                                                                    0
                                                            )}
                                                        />
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
        </div>
    );
}

export default Dashboard;