import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = "ar";
const SUPPORTED_LANGUAGES = ["ar", "en"];

const translations = {
    ar: {
        app: {
            name: "نظام إدارة النقد",
            subtitle: "منصة الإدارة المالية والعمليات النقدية",
        },

        common: {
            loading: "جارٍ التحميل...",
            save: "حفظ",
            cancel: "إلغاء",
            confirm: "تأكيد",
            close: "إغلاق",
            search: "بحث",
            filter: "تصفية",
            all: "الكل",
            active: "نشط",
            inactive: "غير نشط",
            pending: "قيد الانتظار",
            approved: "مقبول",
            rejected: "مرفوض",
            actions: "الإجراءات",
            status: "الحالة",
            date: "التاريخ",
            name: "الاسم",
            email: "البريد الإلكتروني",
            role: "الدور",
        },

        auth: {
            login: "تسجيل الدخول",
            createAccount: "إنشاء حساب",
            createYourAccount: "إنشاء حسابك",
            forgotPassword: "نسيت كلمة المرور؟",
            noAccount: "ليس لديك حساب؟",
            haveAccount: "لديك حساب بالفعل؟",
            signIn: "دخول",
            signUp: "إنشاء حساب",
            password: "كلمة المرور",
            confirmPassword: "تأكيد كلمة المرور",
            fullName: "الاسم الكامل",
            accountType: "نوع الحساب",
            email: "البريد الإلكتروني",
            pendingTitle: "تم إرسال طلب التسجيل",
            pendingMessage:
                "تم إنشاء طلبك وهو بانتظار مراجعة مدير النظام.",
            pendingStatus: "بانتظار الموافقة",
            returnToLogin: "العودة إلى تسجيل الدخول",
        },

        navigation: {
            dashboard: "لوحة التحكم",
            operations: "العمليات",
            customers: "العملاء",
            transactions: "المعاملات",
            approvals: "الموافقات",
            users: "المستخدمون",
            roles: "الأدوار والصلاحيات",
            reports: "التقارير",
            cashFlow: "التدفق النقدي",
            auditLogs: "سجل التدقيق",
            settings: "الإعدادات",
            logout: "تسجيل الخروج",
        },

        dashboard: {
            title: "لوحة التحكم",
            welcome: "مرحبًا بعودتك",
            overview: "نظرة عامة",
            cashSummary: "ملخص النقد",
            orderStatus: "حالة العمليات",
            latestTransactions: "أحدث المعاملات",
            customers: "العملاء",
            users: "المستخدمون",
            operations: "العمليات",
            transactions: "المعاملات",
            totalReceipts: "إجمالي المقبوضات",
            totalPayments: "إجمالي المدفوعات",
            totalAdvances: "إجمالي السلف",
            netCash: "صافي النقد",
            pendingOperations: "العمليات قيد الانتظار",
            approvedOperations: "العمليات المقبولة",
            rejectedOperations: "العمليات المرفوضة",
        },
    },

    en: {
        app: {
            name: "Cash Management System",
            subtitle: "Financial Management & Cash Operations Platform",
        },

        common: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            search: "Search",
            filter: "Filter",
            all: "All",
            active: "Active",
            inactive: "Inactive",
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            actions: "Actions",
            status: "Status",
            date: "Date",
            name: "Name",
            email: "Email",
            role: "Role",
        },

        auth: {
            login: "Sign in",
            createAccount: "Create account",
            createYourAccount: "Create your account",
            forgotPassword: "Forgot password?",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            signIn: "Sign in",
            signUp: "Sign up",
            password: "Password",
            confirmPassword: "Confirm password",
            fullName: "Full name",
            accountType: "Account type",
            pendingTitle: "Registration submitted",
            pendingMessage:
                "Your registration request has been submitted and is awaiting administrator review.",
            pendingStatus: "Pending Approval",
            returnToLogin: "Return to sign in",
        },

        navigation: {
            dashboard: "Dashboard",
            operations: "Operations",
            customers: "Customers",
            transactions: "Transactions",
            approvals: "Approvals",
            users: "Users",
            roles: "Roles & Permissions",
            reports: "Reports",
            cashFlow: "Cash Flow",
            auditLogs: "Audit Logs",
            settings: "Settings",
            logout: "Logout",
        },

        dashboard: {
            title: "Dashboard",
            welcome: "Welcome back",
            overview: "Overview",
            cashSummary: "Cash Summary",
            orderStatus: "Operation Status",
            latestTransactions: "Latest Transactions",
            customers: "Customers",
            users: "Users",
            operations: "Operations",
            transactions: "Transactions",
            totalReceipts: "Total Receipts",
            totalPayments: "Total Payments",
            totalAdvances: "Total Advances",
            netCash: "Net Cash",
            pendingOperations: "Pending Operations",
            approvedOperations: "Approved Operations",
            rejectedOperations: "Rejected Operations",
        },
    },
};

function getTranslation(language, key) {
    return key.split(".").reduce(
        (value, part) => value?.[part],
        translations[language]
    ) ?? key;
}

export function LanguageProvider({ children }) {
    const storedLanguage = localStorage.getItem("language");

    const [language, setLanguage] = useState(
        SUPPORTED_LANGUAGES.includes(storedLanguage)
            ? storedLanguage
            : DEFAULT_LANGUAGE
    );

    const direction = language === "ar" ? "rtl" : "ltr";

    useEffect(() => {
        localStorage.setItem("language", language);

        document.documentElement.lang = language;
        document.documentElement.dir = direction;
        document.body.dir = direction;
    }, [language, direction]);

    const changeLanguage = (newLanguage) => {
        if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
            return;
        }

        setLanguage(newLanguage);
    };

    const value = useMemo(
        () => ({
            language,
            direction,
            changeLanguage,
            isArabic: language === "ar",
            isEnglish: language === "en",
            t: (key) => getTranslation(language, key),
        }),
        [language, direction]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider."
        );
    }

    return context;
}