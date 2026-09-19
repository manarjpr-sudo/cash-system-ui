import {
    useEffect,
    useState,
    useContext,
} from "react";

import {
    FaGlobe,
    FaLock,
    FaUser,
    FaWallet,
    FaPlus,
    FaEdit,
    FaPowerOff,
    FaCheck,
} from "react-icons/fa";

import { toast } from "react-toastify";

import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import { AuthContext } from "../context/AuthContext";

import api from "../api/axios";
import categoryService from "../services/categoryService";
import { CURRENCIES } from "../constants/currencies";

function Settings() {
    const {
        language,
        changeLanguage,
    } = useLanguage();

    const {
        settings,
        updateSettings,
        loading: settingsLoading,
        loadSettings,
    } = useSettings();

    const { user } = useContext(AuthContext);

    const isArabic = language === "ar";

    const [savingSettings, setSavingSettings] =
        useState(false);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingPassword, setSavingPassword] =
        useState(false);

    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [financial, setFinancial] = useState({
        currency: "USD",
        currency_symbol: "$",
        date_format: "dd/mm/yyyy",
    });

    const [categoryType, setCategoryType] =
        useState("expense");

    const [categories, setCategories] =
        useState([]);

    const [categoriesLoading, setCategoriesLoading] =
        useState(false);

    const [categorySaving, setCategorySaving] =
        useState(false);

    const [showCategoryForm, setShowCategoryForm] =
        useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const [categoryForm, setCategoryForm] =
        useState({
            name_ar: "",
            name_en: "",
        });

    const text = isArabic
        ? {
              title: "الإعدادات",
              subtitle:
                  "خصص التطبيق بما يناسبك",

              general: "عام",
              financial: "المال",
              account: "الحساب",
              categories: "التصنيفات",

              language: "اللغة",
              arabic: "العربية",
              english: "English",

              currency: "العملة",
              currencyHint:
                  "سيظهر رمزها بجانب المبالغ",
              customCurrency: "عملة مخصصة",
              customCurrencyHint:
                  "أدخل رمز العملة الذي تريد عرضه",

              dateFormat: "تنسيق التاريخ",

              name: "الاسم",
              email: "البريد الإلكتروني",

              currentPassword:
                  "كلمة المرور الحالية",
              newPassword:
                  "كلمة المرور الجديدة",
              confirmPassword:
                  "تأكيد كلمة المرور",

              save: "حفظ",
              saving: "جارٍ الحفظ...",
              updateAccount:
                  "حفظ بيانات الحساب",
              changePassword:
                  "تغيير كلمة المرور",

              saved:
                  "تم حفظ الإعدادات",
              profileSaved:
                  "تم تحديث بيانات الحساب",
              passwordSaved:
                  "تم تغيير كلمة المرور",
              error:
                  "حدث خطأ، حاول مرة أخرى",

              income: "الدخل",
              expense: "المصروفات",
              addCategory:
                  "إضافة تصنيف",
              editCategory:
                  "تعديل التصنيف",
              arabicName:
                  "الاسم بالعربية",
              englishName:
                  "الاسم بالإنجليزية",
              add:
                  "إضافة",
              update:
                  "حفظ التعديلات",
              cancel:
                  "إلغاء",
              active:
                  "فعال",
              inactive:
                  "معطّل",
              disable:
                  "تعطيل",
              enable:
                  "تفعيل",
              noCategories:
                  "لا توجد تصنيفات.",
              categoryAdded:
                  "تمت إضافة التصنيف",
              categoryUpdated:
                  "تم تحديث التصنيف",
              categoryDisabled:
                  "تم تعطيل التصنيف",
              categoryEnabled:
                  "تم تفعيل التصنيف",
              categoryRequired:
                  "أدخل اسم التصنيف باللغتين.",
              categoryLoading:
                  "جارٍ تحميل التصنيفات...",
          }
        : {
              title: "Settings",
              subtitle:
                  "Customize the app to suit you",

              general: "General",
              financial: "Money",
              account: "Account",
              categories: "Categories",

              language: "Language",
              arabic: "العربية",
              english: "English",

              currency: "Currency",
              currencyHint:
                  "Shown next to amounts",
              customCurrency:
                  "Custom currency",
              customCurrencyHint:
                  "Enter the currency symbol to display",

              dateFormat: "Date format",

              name: "Name",
              email: "Email",

              currentPassword:
                  "Current password",
              newPassword:
                  "New password",
              confirmPassword:
                  "Confirm password",

              save: "Save",
              saving: "Saving...",
              updateAccount:
                  "Save account details",
              changePassword:
                  "Change password",

              saved:
                  "Settings saved",
              profileSaved:
                  "Account details updated",
              passwordSaved:
                  "Password changed",
              error:
                  "Something went wrong",

              income: "Income",
              expense: "Expenses",
              addCategory:
                  "Add category",
              editCategory:
                  "Edit category",
              arabicName:
                  "Arabic name",
              englishName:
                  "English name",
              add:
                  "Add",
              update:
                  "Save changes",
              cancel:
                  "Cancel",
              active:
                  "Active",
              inactive:
                  "Disabled",
              disable:
                  "Disable",
              enable:
                  "Enable",
              noCategories:
                  "No categories.",
              categoryAdded:
                  "Category added",
              categoryUpdated:
                  "Category updated",
              categoryDisabled:
                  "Category disabled",
              categoryEnabled:
                  "Category enabled",
              categoryRequired:
                  "Enter the category name in both languages.",
              categoryLoading:
                  "Loading categories...",
          };

    useEffect(() => {
        setFinancial({
            currency:
                settings?.currency || "USD",

            currency_symbol:
                settings?.currency_symbol || "$",

            date_format:
                settings?.date_format ||
                "dd/mm/yyyy",
        });
    }, [settings]);

    useEffect(() => {
        setProfile((current) => ({
            ...current,
            name: user?.name || "",
            email: user?.email || "",
        }));
    }, [user]);

    useEffect(() => {
        loadCategories(categoryType);
    }, [categoryType]);

    const loadCategories = async (type) => {
        try {
            setCategoriesLoading(true);

            const data =
                await categoryService.getByType(
                    type,
                    true
                );

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(error);

            setCategories([]);

            toast.error(text.error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const getCategoryName = (category) => {
        return isArabic
            ? category.name_ar ||
                  category.name_en
            : category.name_en ||
                  category.name_ar;
    };

    const isCategoryActive = (category) =>
        category.is_active === true ||
        category.is_active === 1 ||
        category.is_active === "1";

    const handleFinancialChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFinancial((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCurrencyChange = (
        event
    ) => {
        const value =
            event.target.value;

        setFinancial((current) => ({
            ...current,
            currency: value,
        }));
    };

    const handleProfileChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setProfile((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleLanguageChange = (
        event
    ) => {
        changeLanguage(
            event.target.value
        );
    };

    const handleSaveFinancial =
        async (event) => {
            event.preventDefault();

            if (
                financial.currency ===
                    "CUSTOM" &&
                !financial.currency_symbol.trim()
            ) {
                toast.error(
                    text.customCurrencyHint
                );

                return;
            }

            try {
                setSavingSettings(true);

                const success =
                    await updateSettings({
                        currency:
                            financial.currency,

                        currency_symbol:
                            financial.currency_symbol,

                        date_format:
                            financial.date_format,
                    });

                if (!success) {
                    throw new Error(
                        "Settings update failed"
                    );
                }

                await loadSettings();

                toast.success(
                    text.saved
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    text.error
                );
            } finally {
                setSavingSettings(false);
            }
        };

    const handleUpdateProfile =
        async (event) => {
            event.preventDefault();

            try {
                setSavingProfile(true);

                const response =
                    await api.put(
                        "/profile",
                        {
                            name:
                                profile.name.trim(),

                            email:
                                profile.email.trim(),
                        }
                    );

                const updatedUser = {
                    ...user,
                    ...(response.data || {}),
                    name:
                        profile.name.trim(),
                    email:
                        profile.email.trim(),
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );

                toast.success(
                    text.profileSaved
                );

                window.location.reload();
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.response?.data
                        ?.message ||
                        text.error
                );
            } finally {
                setSavingProfile(false);
            }
        };

    const handleChangePassword =
        async (event) => {
            event.preventDefault();

            if (
                profile.password !==
                profile.password_confirmation
            ) {
                toast.error(
                    text.error
                );

                return;
            }

            try {
                setSavingPassword(
                    true
                );

                await api.put(
                    "/profile/password",
                    {
                        current_password:
                            profile.current_password,

                        password:
                            profile.password,

                        password_confirmation:
                            profile.password_confirmation,
                    }
                );

                setProfile(
                    (current) => ({
                        ...current,
                        current_password:
                            "",
                        password: "",
                        password_confirmation:
                            "",
                    })
                );

                toast.success(
                    text.passwordSaved
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.response?.data
                        ?.message ||
                        text.error
                );
            } finally {
                setSavingPassword(
                    false
                );
            }
        };

    const resetCategoryForm = () => {
        setCategoryForm({
            name_ar: "",
            name_en: "",
        });

        setEditingCategory(
            null
        );

        setShowCategoryForm(
            false
        );
    };

    const openAddCategory = () => {
        setEditingCategory(
            null
        );

        setCategoryForm({
            name_ar: "",
            name_en: "",
        });

        setShowCategoryForm(
            true
        );
    };

    const openEditCategory = (
        category
    ) => {
        setEditingCategory(
            category
        );

        setCategoryForm({
            name_ar:
                category.name_ar ||
                "",
            name_en:
                category.name_en ||
                "",
        });

        setShowCategoryForm(
            true
        );
    };

    const handleCategoryChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setCategoryForm(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    };

    const handleCategorySave =
        async (event) => {
            event.preventDefault();

            const nameAr =
                categoryForm.name_ar.trim();

            const nameEn =
                categoryForm.name_en.trim();

            if (
                !nameAr ||
                !nameEn
            ) {
                toast.error(
                    text.categoryRequired
                );

                return;
            }

            try {
                setCategorySaving(
                    true
                );

                if (
                    editingCategory
                ) {
                    await categoryService.update(
                        editingCategory.id,
                        {
                            name_ar:
                                nameAr,
                            name_en:
                                nameEn,
                            type:
                                editingCategory.type ||
                                categoryType,
                            parent_id:
                                editingCategory.parent_id ??
                                null,
                        }
                    );

                    toast.success(
                        text.categoryUpdated
                    );
                } else {
                    await categoryService.create(
                        {
                            name_ar:
                                nameAr,
                            name_en:
                                nameEn,
                            type:
                                categoryType,
                            parent_id:
                                null,
                        }
                    );

                    toast.success(
                        text.categoryAdded
                    );
                }

                await loadCategories(
                    categoryType
                );

                resetCategoryForm();
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.response?.data
                        ?.message ||
                        text.error
                );
            } finally {
                setCategorySaving(
                    false
                );
            }
        };

    const handleToggleCategory =
        async (category) => {
            try {
                await categoryService.toggleStatus(
                    category.id
                );

                const active =
                    isCategoryActive(
                        category
                    );

                toast.success(
                    active
                        ? text.categoryDisabled
                        : text.categoryEnabled
                );

                await loadCategories(
                    categoryType
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.response?.data
                        ?.message ||
                        text.error
                );
            }
        };

    const getCurrencySymbol =
        (currency) => {
            if (!currency) {
                return "";
            }

            return isArabic
                ? currency.symbol_ar ||
                      currency.symbol_en ||
                      currency.code
                : currency.symbol_en ||
                      currency.symbol_ar ||
                      currency.code;
        };

    if (settingsLoading) {
        return (
            <div className="finance-page">
                <div className="finance-empty-state">
                    <p>
                        {isArabic
                            ? "جارٍ التحميل..."
                            : "Loading..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="finance-page settings-page"
            dir={
                isArabic
                    ? "rtl"
                    : "ltr"
            }
        >
            <div className="finance-page-header">
                <div>
                    <h1>
                        {text.title}
                    </h1>

                    <p>
                        {text.subtitle}
                    </p>
                </div>
            </div>

            <div className="settings-simple-grid">
                {/* General */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <FaGlobe />
                        </div>

                        <div>
                            <h2>
                                {text.general}
                            </h2>
                        </div>
                    </div>

                    <div className="finance-form-group">
                        <label>
                            {text.language}
                        </label>

                        <select
                            value={language}
                            onChange={
                                handleLanguageChange
                            }
                        >
                            <option value="ar">
                                {text.arabic}
                            </option>

                            <option value="en">
                                {text.english}
                            </option>
                        </select>
                    </div>
                </section>

                {/* Financial */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <FaWallet />
                        </div>

                        <div>
                            <h2>
                                {text.financial}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            handleSaveFinancial
                        }
                    >
                        <div className="finance-form-group">
                            <label>
                                {text.currency}
                            </label>

                            <select
                                name="currency"
                                value={
                                    financial.currency
                                }
                                onChange={
                                    handleCurrencyChange
                                }
                                disabled={
                                    savingSettings
                                }
                            >
                                {CURRENCIES.map(
                                    (currency) => (
                                        <option
                                            key={
                                                currency.code
                                            }
                                            value={
                                                currency.code
                                            }
                                        >
                                            {
                                                currency.code
                                            }{" "}
                                            —{" "}
                                            {getCurrencySymbol(
                                                currency
                                            )}
                                        </option>
                                    )
                                )}

                                <option value="CUSTOM">
                                    {text.customCurrency}
                                </option>
                            </select>

                            {financial.currency ===
                                "CUSTOM" && (
                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="currency_symbol"
                                        value={
                                            financial.currency_symbol
                                        }
                                        onChange={
                                            handleFinancialChange
                                        }
                                        maxLength={
                                            10
                                        }
                                        placeholder={
                                            text.customCurrencyHint
                                        }
                                        disabled={
                                            savingSettings
                                        }
                                    />

                                    <small className="settings-help">
                                        {
                                            text.customCurrencyHint
                                        }
                                    </small>
                                </div>
                            )}

                            {financial.currency !==
                                "CUSTOM" && (
                                <small className="settings-help">
                                    {
                                        text.currencyHint
                                    }
                                </small>
                            )}
                        </div>

                        <div className="finance-form-group">
                            <label>
                                {text.dateFormat}
                            </label>

                            <select
                                name="date_format"
                                value={
                                    financial.date_format
                                }
                                onChange={
                                    handleFinancialChange
                                }
                                disabled={
                                    savingSettings
                                }
                            >
                                <option value="dd/mm/yyyy">
                                    DD/MM/YYYY
                                </option>

                                <option value="mm/dd/yyyy">
                                    MM/DD/YYYY
                                </option>

                                <option value="yyyy/mm/dd">
                                    YYYY/MM/DD
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="finance-primary-button"
                            disabled={
                                savingSettings
                            }
                        >
                            {savingSettings
                                ? text.saving
                                : text.save}
                        </button>
                    </form>
                </section>

                {/* Account */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <FaUser />
                        </div>

                        <div>
                            <h2>
                                {text.account}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            handleUpdateProfile
                        }
                    >
                        <div className="finance-form-group">
                            <label>
                                {text.name}
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    profile.name
                                }
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />
                        </div>

                        <div className="finance-form-group">
                            <label>
                                {text.email}
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    profile.email
                                }
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="finance-primary-button"
                            disabled={
                                savingProfile
                            }
                        >
                            {savingProfile
                                ? text.saving
                                : text.updateAccount}
                        </button>
                    </form>
                </section>

                {/* Password */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <FaLock />
                        </div>

                        <div>
                            <h2>
                                {text.changePassword}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            handleChangePassword
                        }
                    >
                        <div className="finance-form-group">
                            <label>
                                {
                                    text.currentPassword
                                }
                            </label>

                            <input
                                type="password"
                                name="current_password"
                                value={
                                    profile.current_password
                                }
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />
                        </div>

                        <div className="finance-form-group">
                            <label>
                                {
                                    text.newPassword
                                }
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={
                                    profile.password
                                }
                                onChange={
                                    handleProfileChange
                                }
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="finance-form-group">
                            <label>
                                {
                                    text.confirmPassword
                                }
                            </label>

                            <input
                                type="password"
                                name="password_confirmation"
                                value={
                                    profile.password_confirmation
                                }
                                onChange={
                                    handleProfileChange
                                }
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="finance-primary-button"
                            disabled={
                                savingPassword
                            }
                        >
                            {savingPassword
                                ? text.saving
                                : text.changePassword}
                        </button>
                    </form>
                </section>

                {/* Categories */}
                <section
                    className="settings-card"
                    style={{
                        gridColumn:
                            "1 / -1",
                    }}
                >
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            <FaWallet />
                        </div>

                        <div
                            style={{
                                flex: 1,
                            }}
                        >
                            <h2>
                                {
                                    text.categories
                                }
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="finance-primary-button"
                            onClick={
                                openAddCategory
                            }
                        >
                            <FaPlus
                                size={11}
                            />

                            {text.addCategory}
                        </button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom:
                                "20px",
                            flexWrap:
                                "wrap",
                        }}
                    >
                        <button
                            type="button"
                            className={
                                categoryType ===
                                "expense"
                                    ? "finance-primary-button"
                                    : "finance-secondary-button"
                            }
                            onClick={() =>
                                setCategoryType(
                                    "expense"
                                )
                            }
                        >
                            {text.expense}
                        </button>

                        <button
                            type="button"
                            className={
                                categoryType ===
                                "income"
                                    ? "finance-primary-button"
                                    : "finance-secondary-button"
                            }
                            onClick={() =>
                                setCategoryType(
                                    "income"
                                )
                            }
                        >
                            {text.income}
                        </button>
                    </div>

                    {showCategoryForm && (
                        <form
                            onSubmit={
                                handleCategorySave
                            }
                            style={{
                                border:
                                    "1px solid var(--border-color)",
                                borderRadius:
                                    "12px",
                                padding:
                                    "16px",
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap:
                                        "12px",
                                }}
                            >
                                <div className="finance-form-group">
                                    <label>
                                        {
                                            text.arabicName
                                        }
                                    </label>

                                    <input
                                        type="text"
                                        name="name_ar"
                                        value={
                                            categoryForm.name_ar
                                        }
                                        onChange={
                                            handleCategoryChange
                                        }
                                        required
                                        disabled={
                                            categorySaving
                                        }
                                    />
                                </div>

                                <div className="finance-form-group">
                                    <label>
                                        {
                                            text.englishName
                                        }
                                    </label>

                                    <input
                                        type="text"
                                        name="name_en"
                                        value={
                                            categoryForm.name_en
                                        }
                                        onChange={
                                            handleCategoryChange
                                        }
                                        required
                                        disabled={
                                            categorySaving
                                        }
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap:
                                        "8px",
                                    marginTop:
                                        "12px",
                                }}
                            >
                                <button
                                    type="submit"
                                    className="finance-primary-button"
                                    disabled={
                                        categorySaving
                                    }
                                >
                                    {categorySaving
                                        ? text.saving
                                        : editingCategory
                                          ? text.update
                                          : text.add}
                                </button>

                                <button
                                    type="button"
                                    className="finance-secondary-button"
                                    onClick={
                                        resetCategoryForm
                                    }
                                    disabled={
                                        categorySaving
                                    }
                                >
                                    {text.cancel}
                                </button>
                            </div>
                        </form>
                    )}

                    {categoriesLoading ? (
                        <div className="finance-empty-state">
                            <p>
                                {
                                    text.categoryLoading
                                }
                            </p>
                        </div>
                    ) : categories.length ===
                      0 ? (
                        <div className="finance-empty-state">
                            <p>
                                {
                                    text.noCategories
                                }
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap:
                                    "8px",
                            }}
                        >
                            {categories.map(
                                (
                                    category
                                ) => {
                                    const active =
                                        isCategoryActive(
                                            category
                                        );

                                    return (
                                        <div
                                            key={
                                                category.id
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "12px",
                                                padding:
                                                    "12px",
                                                border:
                                                    "1px solid var(--border-color)",
                                                borderRadius:
                                                    "10px",
                                                opacity:
                                                    active
                                                        ? 1
                                                        : 0.55,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex:
                                                        1,
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    {
                                                        getCategoryName(
                                                            category
                                                        )
                                                    }
                                                </div>

                                                <small className="settings-help">
                                                    {active
                                                        ? text.active
                                                        : text.inactive}
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="finance-secondary-button"
                                                onClick={() =>
                                                    openEditCategory(
                                                        category
                                                    )
                                                }
                                                title={
                                                    text.editCategory
                                                }
                                            >
                                                <FaEdit
                                                    size={
                                                        11
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="finance-secondary-button"
                                                onClick={() =>
                                                    handleToggleCategory(
                                                        category
                                                    )
                                                }
                                                title={
                                                    active
                                                        ? text.disable
                                                        : text.enable
                                                }
                                            >
                                                {active ? (
                                                    <FaPowerOff
                                                        size={
                                                            11
                                                        }
                                                    />
                                                ) : (
                                                    <FaCheck
                                                        size={
                                                            11
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Settings;