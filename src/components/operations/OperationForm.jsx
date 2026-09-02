import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

function OperationForm({ customers = [], onSave, onCancel, operation = null, onCustomerAdded }) {
    const { language } = useLanguage();

    const [formData, setFormData] = useState({
        customer_id: "",
        type: "receipt",
        amount: "",
        description: "",
        category_id: "",
        category_name: "",
        sub_category_id: "",
        sub_category_name: "", // ✅ لتخزين اسم التصنيف الفرعي المدخل
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // مودال إضافة عميل
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });
    const [addingCustomer, setAddingCustomer] = useState(false);

    const t = {
        ar: {
            customer: "العميل",
            selectCustomer: "اختر عميلاً",
            addCustomer: "إضافة عميل جديد",
            type: "النوع",
            receipt: "قبض (دخل)",
            payment: "دفع (خرج)",
            amount: "المبلغ",
            description: "الوصف (اختياري)",
            category: "التصنيف الأساسي",
            selectCategory: "اكتب أو اختر تصنيفاً أساسياً",
            subCategory: "التصنيف الفرعي",
            selectSubCategory: "اكتب أو اختر تصنيفاً فرعياً (اختياري)",
            save: "حفظ",
            cancel: "إلغاء",
            saving: "جارٍ الحفظ...",
            newCustomerTitle: "إضافة عميل جديد",
            name: "الاسم",
            phone: "رقم الهاتف",
            email: "البريد الإلكتروني",
            successCustomer: "تم إضافة العميل بنجاح",
            errorCustomer: "فشل إضافة العميل",
            errorNameRequired: "الاسم مطلوب",
        },
        en: {
            customer: "Customer",
            selectCustomer: "Select a customer",
            addCustomer: "Add New Customer",
            type: "Type",
            receipt: "Receipt (Income)",
            payment: "Payment (Expense)",
            amount: "Amount",
            description: "Description (Optional)",
            category: "Main Category",
            selectCategory: "Type or select a main category",
            subCategory: "Sub Category",
            selectSubCategory: "Type or select a sub category (Optional)",
            save: "Save",
            cancel: "Cancel",
            saving: "Saving...",
            newCustomerTitle: "Add New Customer",
            name: "Name",
            phone: "Phone Number",
            email: "Email",
            successCustomer: "Customer added successfully",
            errorCustomer: "Failed to add customer",
            errorNameRequired: "Name is required",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    // تحميل التصنيفات
    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (operation) {
            setFormData({
                customer_id: operation.customer_id || "",
                type: operation.type || "receipt",
                amount: operation.amount || "",
                description: operation.description || "",
                category_id: operation.category_id || "",
                category_name: "",
                sub_category_id: operation.sub_category_id || "",
                sub_category_name: "",
            });
        }
    }, [operation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ============================================================
    // دوال التصنيف الأساسي (مع إضافة تلقائية)
    // ============================================================
    const handleCategoryInput = async (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, category_name: value, category_id: "" }));

        const existing = categories.find(c => c.name.toLowerCase() === value.toLowerCase() && !c.parent_id);
        if (existing) {
            setFormData((prev) => ({ ...prev, category_id: existing.id, category_name: "" }));
            return;
        }

        if (value.length >= 2) {
            try {
                const response = await api.post("/categories", {
                    name: value,
                    parent_id: null,
                    type: formData.type || "income",
                });
                const newCategory = response.data;
                setCategories(prev => [...prev, newCategory]);
                setFormData((prev) => ({ ...prev, category_id: newCategory.id, category_name: "" }));
                toast.success(`تم إضافة التصنيف "${value}"`);
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    };

    // ============================================================
    // دوال التصنيف الفرعي (يعمل فقط عند وجود تصنيف أساسي)
    // ============================================================
    const handleSubCategoryInput = async (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, sub_category_name: value, sub_category_id: "" }));

        // إذا لم يكن هناك تصنيف أساسي، نمنع الإضافة
        if (!formData.category_id) {
            toast.warning(lang.selectCategory);
            setFormData((prev) => ({ ...prev, sub_category_name: "" }));
            return;
        }

        // البحث عن تصنيف فرعي موجود بنفس الاسم وتحت نفس الأب
        const existing = categories.find(c =>
            c.name.toLowerCase() === value.toLowerCase() &&
            c.parent_id === parseInt(formData.category_id)
        );
        if (existing) {
            setFormData((prev) => ({ ...prev, sub_category_id: existing.id, sub_category_name: "" }));
            return;
        }

        if (value.length >= 2) {
            try {
                const response = await api.post("/categories", {
                    name: value,
                    parent_id: formData.category_id,
                    type: formData.type || "income",
                });
                const newCategory = response.data;
                setCategories(prev => [...prev, newCategory]);
                setFormData((prev) => ({ ...prev, sub_category_id: newCategory.id, sub_category_name: "" }));
                toast.success(`تم إضافة التصنيف الفرعي "${value}"`);
            } catch (error) {
                console.error("Error adding sub category:", error);
            }
        }
    };

    // ============================================================
    // الحصول على التصنيفات الفرعية المرتبطة بالتصنيف الأساسي الحالي
    // ============================================================
    const getSubCategories = () => {
        if (!formData.category_id) return [];
        return categories.filter(c => c.parent_id === parseInt(formData.category_id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_id) {
            toast.error(lang.selectCustomer);
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error("المبلغ يجب أن يكون أكبر من صفر");
            return;
        }
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                category_id: formData.category_id || null,
                sub_category_id: formData.sub_category_id || null,
            };
            await onSave(dataToSend);
            setFormData({
                customer_id: "",
                type: "receipt",
                amount: "",
                description: "",
                category_id: "",
                category_name: "",
                sub_category_id: "",
                sub_category_name: "",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // دوال العميل
    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCustomer = async () => {
        if (!newCustomer.name.trim()) {
            toast.error(lang.errorNameRequired);
            return;
        }
        setAddingCustomer(true);
        try {
            await api.post("/customers", newCustomer);
            toast.success(lang.successCustomer);
            setShowCustomerModal(false);
            setNewCustomer({ name: "", phone: "", email: "" });
            if (onCustomerAdded) await onCustomerAdded();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.errorCustomer);
        } finally {
            setAddingCustomer(false);
        }
    };

    return (
        <>
            <div className="card p-3 mb-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* العميل */}
                        <div className="col-md-6">
                            <label className="form-label">{lang.customer}</label>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    name="customer_id"
                                    value={formData.customer_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">{lang.selectCustomer}</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowCustomerModal(true)}
                                    disabled={loading}
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    + {lang.addCustomer}
                                </button>
                            </div>
                        </div>

                        {/* النوع */}
                        <div className="col-md-6">
                            <label className="form-label">{lang.type}</label>
                            <select
                                className="form-select"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="receipt">{lang.receipt}</option>
                                <option value="payment">{lang.payment}</option>
                            </select>
                        </div>

                        {/* المبلغ */}
                        <div className="col-md-6">
                            <label className="form-label">{lang.amount}</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="0.00"
                            />
                        </div>

                        {/* ============================================================
                            التصنيف الأساسي - مع إضافة تلقائية عند الكتابة
                        ============================================================ */}
                        <div className="col-md-6">
                            <label className="form-label">{lang.category}</label>
                            <input
                                type="text"
                                className="form-control"
                                list="category-list"
                                value={formData.category_name || categories.find(c => c.id === parseInt(formData.category_id))?.name || ""}
                                onChange={handleCategoryInput}
                                placeholder={lang.selectCategory}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <datalist id="category-list">
                                {categories.filter(c => !c.parent_id).map((cat) => (
                                    <option key={cat.id} value={cat.name} />
                                ))}
                            </datalist>
                        </div>

                        {/* ============================================================
                            التصنيف الفرعي - يظهر فقط عند اختيار تصنيف أساسي
                            ويعمل بنفس ميزة الإضافة التلقائية
                        ============================================================ */}
                        {formData.category_id && (
                            <div className="col-md-6">
                                <label className="form-label">{lang.subCategory}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    list="sub-category-list"
                                    value={formData.sub_category_name || categories.find(c => c.id === parseInt(formData.sub_category_id))?.name || ""}
                                    onChange={handleSubCategoryInput}
                                    placeholder={lang.selectSubCategory}
                                    disabled={loading || !formData.category_id}
                                    autoComplete="off"
                                />
                                <datalist id="sub-category-list">
                                    {getSubCategories().map((sub) => (
                                        <option key={sub.id} value={sub.name} />
                                    ))}
                                </datalist>
                            </div>
                        )}

                        {/* الوصف */}
                        <div className="col-12">
                            <label className="form-label">{lang.description}</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                disabled={loading}
                            />
                        </div>

                        {/* أزرار الحفظ والإلغاء */}
                        <div className="col-12 d-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? lang.saving : lang.save}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                                {lang.cancel}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ============================================================
                مودال إضافة عميل
            ============================================================ */}
            {showCustomerModal && (
                <div className="system-modal-backdrop">
                    <div className="system-modal" style={{ maxWidth: "450px" }}>
                        <div className="system-modal-header">
                            <h3>{lang.newCustomerTitle}</h3>
                            <button className="modal-close" onClick={() => setShowCustomerModal(false)}>×</button>
                        </div>
                        <div className="system-modal-body">
                            <div className="mb-3">
                                <label className="form-label">{lang.name} *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={newCustomer.name}
                                    onChange={handleNewCustomerChange}
                                    disabled={addingCustomer}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{lang.phone}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={newCustomer.phone}
                                    onChange={handleNewCustomerChange}
                                    disabled={addingCustomer}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{lang.email}</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={newCustomer.email}
                                    onChange={handleNewCustomerChange}
                                    disabled={addingCustomer}
                                />
                            </div>
                        </div>
                        <div className="system-modal-footer">
                            <button
                                type="button"
                                className="modal-button modal-button-secondary"
                                onClick={() => setShowCustomerModal(false)}
                                disabled={addingCustomer}
                            >
                                {lang.cancel}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddCustomer}
                                disabled={addingCustomer}
                            >
                                {addingCustomer ? lang.saving : lang.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OperationForm;