import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";

const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

function OperationForm({
    onSave,
    onCancel,
    operation = null,
}) {
    const { language } = useLanguage();

    const [formData, setFormData] = useState({
        type: "income",
        amount: "",
        category_id: "",
        operation_date: getToday(),
        description: "",
    });

    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategoryId, setSelectedSubCategoryId] =
        useState("");

    const [loadingCategories, setLoadingCategories] =
        useState(false);
    const [loadingSubCategories, setLoadingSubCategories] =
        useState(false);
    const [saving, setSaving] = useState(false);

    const t = {
        ar: {
            titleCreate: "أضف عملية مالية",
            titleEdit: "عدّل العملية المالية",

            type: "ماذا سجّلت؟",

            income: "دخل",
            expense: "مصروف",

            amount: "كم المبلغ؟",

            mainCategory: "التصنيف الرئيسي",

            selectMainCategory:
                "اختر التصنيف المناسب",

            subCategory: "التصنيف الفرعي",

            noSubCategory:
                "لا يوجد تصنيف فرعي لهذا الاختيار",

            selectSubCategory:
                "اختر التصنيف الفرعي",

            date: "متى حدثت العملية؟",

            description: "ملاحظات",
            
            descriptionPlaceholder:
                "اكتب ملاحظة تساعدك على تذكّر هذه العملية (اختياري)",

            save: "حفظ العملية",
            update: "حفظ التعديلات",

            cancel: "إلغاء",

            saving: "جارٍ حفظ العملية...",

            amountRequired:
                "أدخل مبلغًا صحيحًا أكبر من صفر.",

            categoryRequired:
                "اختر تصنيفًا للعملية حتى يسهل عليك تنظيم أموالك.",

            dateRequired:
                "اختر تاريخ حدوث العملية.",

            error:
                "تعذر تحميل التصنيفات. حاول مرة أخرى.",

            loading:
                "جارٍ تجهيز التصنيفات...",

            selectCategoryFirst:
                "اختر التصنيف الرئيسي أولًا.",
        },

        en: {
            titleCreate: "Add a financial operation",
            titleEdit: "Edit financial operation",

            type: "What did you record?",

            income: "Income",
            expense: "Expense",

            amount: "How much?",

            mainCategory: "Main category",

            selectMainCategory:
                "Choose the category that fits",

            subCategory: "Subcategory",

            noSubCategory:
                "There are no subcategories for this choice",

            selectSubCategory:
                "Choose a subcategory",

            date: "When did it happen?",

            description: "Notes",

            descriptionPlaceholder:
                "Add a note to help you remember this operation (optional)",

            save: "Save operation",
            update: "Save changes",

            cancel: "Cancel",

            saving: "Saving your operation...",

            amountRequired:
                "Please enter a valid amount greater than zero.",

            categoryRequired:
                "Choose a category to help keep your finances organized.",

            dateRequired:
                "Choose the date when this operation happened.",

            error:
                "We couldn't load the categories. Please try again.",

            loading:
                "Getting your categories ready...",

            selectCategoryFirst:
                "Choose a main category first.",
        },
    };

    const lang =
        language === "ar" ? t.ar : t.en;

    const getCategoryName = (category) => {
        if (!category) return "";

        return language === "ar"
            ? category.name_ar
            : category.name_en;
    };

    const resetForm = () => {
        setFormData({
            type: "income",
            amount: "",
            category_id: "",
            operation_date: getToday(),
            description: "",
        });

        setSubCategories([]);
        setSelectedSubCategoryId("");
    };

    const loadMainCategories = async (type) => {
        setLoadingCategories(true);

        try {
            const data =
                await categoryService.getMainCategories(
                    type
                );

            setMainCategories(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Error loading main categories:",
                error
            );

            setMainCategories([]);
            toast.error(lang.error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadSubCategories = async (parentId) => {
        if (!parentId) {
            setSubCategories([]);
            return [];
        }

        setLoadingSubCategories(true);

        try {
            const data =
                await categoryService.getSubcategories(
                    parentId
                );

            const result =
                Array.isArray(data) ? data : [];

            setSubCategories(result);

            return result;
        } catch (error) {
            console.error(
                "Error loading subcategories:",
                error
            );

            setSubCategories([]);
            toast.error(lang.error);

            return [];
        } finally {
            setLoadingSubCategories(false);
        }
    };

    // Load main categories whenever the operation type changes.
    useEffect(() => {
        loadMainCategories(formData.type);
    }, [formData.type]);

    // Initialize create/edit mode.
    useEffect(() => {
        const initialize = async () => {
            if (!operation) {
                resetForm();
                return;
            }

            const operationType =
                operation.type === "expense"
                    ? "expense"
                    : "income";

            const operationDate = operation.operation_date
                ? String(
                      operation.operation_date
                  ).slice(0, 10)
                : getToday();

            const category = operation.category;

            setFormData({
                type: operationType,
                amount: operation.amount ?? "",
                category_id: "",
                operation_date: operationDate,
                description:
                    operation.description ?? "",
            });

            setSubCategories([]);
            setSelectedSubCategoryId("");

            if (!category) {
                return;
            }

            if (category.parent_id) {
                const parentId =
                    String(category.parent_id);

                setFormData((current) => ({
                    ...current,
                    type: operationType,
                    category_id: parentId,
                }));

                const children =
                    await loadSubCategories(
                        category.parent_id
                    );

                const selectedChildExists =
                    children.some(
                        (child) =>
                            String(child.id) ===
                            String(category.id)
                    );

                if (selectedChildExists) {
                    setSelectedSubCategoryId(
                        String(category.id)
                    );
                }
            } else {
                const mainId = String(category.id);

                setFormData((current) => ({
                    ...current,
                    type: operationType,
                    category_id: mainId,
                }));

                await loadSubCategories(
                    category.id
                );
            }
        };

        initialize();
    }, [operation]);

    const handleTypeChange = (event) => {
        const type = event.target.value;

        setFormData((current) => ({
            ...current,
            type,
            category_id: "",
        }));

        setSubCategories([]);
        setSelectedSubCategoryId("");
    };

    const handleMainCategoryChange = async (
        event
    ) => {
        const parentId = event.target.value;

        setFormData((current) => ({
            ...current,
            category_id: parentId,
        }));

        setSelectedSubCategoryId("");

        if (!parentId) {
            setSubCategories([]);
            return;
        }

        await loadSubCategories(parentId);
    };

    const handleSubCategoryChange = (
        event
    ) => {
        setSelectedSubCategoryId(
            event.target.value
        );
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const amount = Number(formData.amount);

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            toast.error(lang.amountRequired);
            return;
        }

        if (!formData.category_id) {
            toast.error(lang.categoryRequired);
            return;
        }

        if (!formData.operation_date) {
            toast.error(lang.dateRequired);
            return;
        }

        const finalCategoryId =
            selectedSubCategoryId ||
            formData.category_id;

        setSaving(true);

        try {
            await onSave({
                type: formData.type,
                amount,
                category_id:
                    Number(finalCategoryId),
                operation_date:
                    formData.operation_date,
                description:
                    formData.description.trim() ||
                    null,
            });
        } catch (error) {
            // Parent component handles the API error
            // and displays the appropriate toast.
            console.error(
                "Error saving operation:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const selectedMainCategory =
        mainCategories.find(
            (category) =>
                String(category.id) ===
                String(formData.category_id)
        );

    return (
        <div className="card p-3 p-md-4 mb-4">
            <div className="mb-4">
                <h5 className="mb-1">
                    {operation
                        ? lang.titleEdit
                        : lang.titleCreate}
                </h5>
            </div>

            {loadingCategories && (
                <div className="text-muted mb-3">
                    {lang.loading}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    {/* Type */}
                    <div className="col-md-6">
                        <label className="form-label">
                            {lang.type}
                        </label>

                        <select
                            className="form-select"
                            value={formData.type}
                            onChange={
                                handleTypeChange
                            }
                            disabled={
                                saving ||
                                loadingCategories
                            }
                        >
                            <option value="income">
                                {lang.income}
                            </option>

                            <option value="expense">
                                {lang.expense}
                            </option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="col-md-6">
                        <label className="form-label">
                            {lang.amount}
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            disabled={saving}
                        />
                    </div>

                    {/* Main category */}
                    <div className="col-md-6">
                        <label className="form-label">
                            {lang.mainCategory}
                        </label>

                        <select
                            className="form-select"
                            value={
                                formData.category_id
                            }
                            onChange={
                                handleMainCategoryChange
                            }
                            required
                            disabled={
                                saving ||
                                loadingCategories
                            }
                        >
                            <option value="">
                                {
                                    lang.selectMainCategory
                                }
                            </option>

                            {mainCategories.map(
                                (category) => (
                                    <option
                                        key={category.id}
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

                    {/* Subcategory */}
                    <div className="col-md-6">
                        <label className="form-label">
                            {lang.subCategory}
                        </label>

                        <select
                            className="form-select"
                            value={
                                selectedSubCategoryId
                            }
                            onChange={
                                handleSubCategoryChange
                            }
                            disabled={
                                saving ||
                                !formData.category_id ||
                                loadingSubCategories ||
                                subCategories.length ===
                                    0
                            }
                        >
                            <option value="">
                                {subCategories.length >
                                0
                                    ? lang.selectSubCategory
                                    : lang.noSubCategory}
                            </option>

                            {subCategories.map(
                                (category) => (
                                    <option
                                        key={category.id}
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

                        {!formData.category_id && (
                            <small className="text-muted d-block mt-1">
                                {
                                    lang.selectCategoryFirst
                                }
                            </small>
                        )}

                        {selectedMainCategory &&
                            subCategories.length ===
                                0 && (
                                <small className="text-muted d-block mt-1">
                                    {
                                        lang.noSubCategory
                                    }
                                </small>
                            )}
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                        <label className="form-label">
                            {lang.date}
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="operation_date"
                            value={
                                formData.operation_date
                            }
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <label className="form-label">
                            {lang.description}
                        </label>

                        <textarea
                            className="form-control"
                            name="description"
                            rows="3"
                            maxLength="5000"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder={
                                lang.descriptionPlaceholder
                            }
                            disabled={saving}
                        />
                    </div>

                    {/* Actions */}
                    <div className="col-12 d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                saving ||
                                loadingCategories
                            }
                        >
                            {saving
                                ? lang.saving
                                : operation
                                  ? lang.update
                                  : lang.save}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            {lang.cancel}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default OperationForm;