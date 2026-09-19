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
            name: "إدارة أموالي",
            subtitle: "مدير مالي شخصي",
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
            actions: "الإجراءات",
            status: "الحالة",
            date: "التاريخ",
            name: "الاسم",
            email: "البريد الإلكتروني",
            amount: "المبلغ",
            income: "الدخل",
            expense: "المصروفات",
            category: "التصنيف",
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
            email: "البريد الإلكتروني",
        },

        navigation: {
            dashboard: "لوحة التحكم",
            operations: "العمليات",
            categories: "التصنيفات",
            reports: "التقارير",
            settings: "الإعدادات",
            profile: "الملف الشخصي",
            logout: "تسجيل الخروج",
        },

        dashboard: {
            title: "لوحة التحكم",
            welcome: "مرحبًا بعودتك",
            overview: "نظرة عامة",
            income: "الدخل",
            expenses: "المصروفات",
            balance: "الرصيد",
            latestOperations: "أحدث العمليات",
        },

        operations: {
            title: "العمليات",
            add: "إضافة عملية",
            edit: "تعديل العملية",
            delete: "حذف العملية",
            amount: "المبلغ",
            category: "التصنيف",
            date: "التاريخ",
            notes: "ملاحظات",
            income: "الدخل",
            expense: "المصروفات",
        },

        categories: {
            title: "التصنيفات",
            income: "الدخل",
            expense: "المصروفات",
            add: "إضافة تصنيف",
            edit: "تعديل التصنيف",
            delete: "حذف التصنيف",
        },

        settings: {
            title: "الإعدادات",
            general: "عام",
            financial: "مالي",
            account: "الحساب",
            language: "اللغة",
            currency: "العملة",
            dateFormat: "تنسيق التاريخ",
            timezone: "المنطقة الزمنية",
        },
    },

    en: {
        app: {
            name: "My Finances",
            subtitle: "Personal Finance",
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
            actions: "Actions",
            status: "Status",
            date: "Date",
            name: "Name",
            email: "Email",
            amount: "Amount",
            income: "Income",
            expense: "Expenses",
            category: "Category",
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
            email: "Email",
        },

        navigation: {
            dashboard: "Dashboard",
            operations: "Operations",
            categories: "Categories",
            reports: "Reports",
            settings: "Settings",
            profile: "Profile",
            logout: "Logout",
        },

        dashboard: {
            title: "Dashboard",
            welcome: "Welcome back",
            overview: "Overview",
            income: "Income",
            expenses: "Expenses",
            balance: "Balance",
            latestOperations: "Latest operations",
        },

        operations: {
            title: "Operations",
            add: "Add operation",
            edit: "Edit operation",
            delete: "Delete operation",
            amount: "Amount",
            category: "Category",
            date: "Date",
            notes: "Notes",
            income: "Income",
            expense: "Expenses",
        },

        categories: {
            title: "Categories",
            income: "Income",
            expense: "Expenses",
            add: "Add category",
            edit: "Edit category",
            delete: "Delete category",
        },

        settings: {
            title: "Settings",
            general: "General",
            financial: "Financial",
            account: "Account",
            language: "Language",
            currency: "Currency",
            dateFormat: "Date format",
            timezone: "Timezone",
        },
    },
};

function getTranslation(language, key) {
    return (
        key.split(".").reduce(
            (value, part) => value?.[part],
            translations[language]
        ) ?? key
    );
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
        if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
            setLanguage(newLanguage);
        }
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