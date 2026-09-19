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
    initialType = "expense",
}) {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [formData, setFormData] = useState({
        type: initialType,
        amount: "",
        category_id: "",
        operation_date: getToday(),
        description: "",
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] =
        useState(false);
    const [saving, setSaving] = useState(false);

    const text = isArabic
        ? {
              titleCreate: "إضافة عملية",
              titleEdit: "تعديل العملية",

              income: "دخل",
              expense: "مصروفات",

              amount: "المبلغ",

              category: "التصنيف",
              selectCategory: "اختر التصنيف",

              date: "التاريخ",

              description: "الملاحظات",
              descriptionPlaceholder:
                  "أضف ملاحظة اختيارية عن العملية...",

              save: "حفظ العملية",
              update: "حفظ التعديلات",
              cancel: "إلغاء",
              saving: "جارٍ الحفظ...",

              loading:
                  "جارٍ تحميل التصنيفات...",

              amountRequired:
                  "يرجى إدخال مبلغ صحيح أكبر من صفر.",

              categoryRequired:
                  "يرجى اختيار التصنيف.",

              dateRequired:
                  "يرجى اختيار التاريخ.",

              error:
                  "حدث خطأ أثناء تحميل التصنيفات.",
          }
        : {
              titleCreate: "Add Operation",
              titleEdit: "Edit Operation",

              income: "Income",
              expense: "Expenses",

              amount: "Amount",

              category: "Category",
              selectCategory: "Select category",

              date: "Date",

              description: "Notes",
              descriptionPlaceholder:
                  "Add an optional note about the operation...",

              save: "Save Operation",
              update: "Save Changes",
              cancel: "Cancel",
              saving: "Saving...",

              loading:
                  "Loading categories...",

              amountRequired:
                  "Please enter an amount greater than zero.",

              categoryRequired:
                  "Please select a category.",

              dateRequired:
                  "Please select the date.",

              error:
                  "An error occurred while loading categories.",
          };

    const getCategoryName = (category) => {
        if (!category) {
            return "";
        }

        return isArabic
            ? category.name_ar || category.name_en
            : category.name_en || category.name_ar;
    };

    const loadCategories = async (type) => {
        setLoadingCategories(true);

        try {
            const data =
                await categoryService.getByType(type);

            setCategories(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Error loading categories:",
                error
            );

            setCategories([]);
            toast.error(text.error);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const type =
                operation?.type === "income"
                    ? "income"
                    : operation?.type === "expense"
                      ? "expense"
                      : initialType;

            await loadCategories(type);

            setFormData({
                type,
                amount:
                    operation?.amount ?? "",
                category_id:
                    operation?.category?.id
                        ? String(
                              operation.category.id
                          )
                        : operation?.category_id
                          ? String(
                                operation.category_id
                            )
                          : "",
                operation_date:
                    operation?.operation_date
                        ? String(
                              operation.operation_date
                          ).slice(0, 10)
                        : getToday(),
                description:
                    operation?.description ?? "",
            });
        };

        initialize();
    }, [operation, initialType]);

    const handleTypeChange = async (type) => {
        setFormData((current) => ({
            ...current,
            type,
            category_id: "",
        }));

        await loadCategories(type);
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
            toast.error(text.amountRequired);
            return;
        }

        if (!formData.category_id) {
            toast.error(text.categoryRequired);
            return;
        }

        if (!formData.operation_date) {
            toast.error(text.dateRequired);
            return;
        }

        try {
            setSaving(true);

            await onSave({
                type: formData.type,
                amount,
                category_id:
                    Number(formData.category_id),
                operation_date:
                    formData.operation_date,
                description:
                    formData.description.trim() ||
                    null,
            });
        } catch (error) {
            console.error(
                "Error saving operation:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="operation-form">
            <div className="operation-form-heading">
                <h3>
                    {operation
                        ? text.titleEdit
                        : text.titleCreate}
                </h3>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="operation-type-tabs">
                    <button
                        type="button"
                        className={
                            formData.type ===
                            "expense"
                                ? "active expense"
                                : ""
                        }
                        onClick={() =>
                            handleTypeChange(
                                "expense"
                            )
                        }
                        disabled={saving}
                    >
                        {text.expense}
                    </button>

                    <button
                        type="button"
                        className={
                            formData.type ===
                            "income"
                                ? "active income"
                                : ""
                        }
                        onClick={() =>
                            handleTypeChange(
                                "income"
                            )
                        }
                        disabled={saving}
                    >
                        {text.income}
                    </button>
                </div>

                <div className="operation-form-grid">
                    <div className="operation-field">
                        <label>
                            {text.amount}
                        </label>

                        <input
                            type="number"
                            name="amount"
                            min="0.01"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="operation-field">
                        <label>
                            {text.category}
                        </label>

                        <select
                            name="category_id"
                            value={
                                formData.category_id
                            }
                            onChange={handleChange}
                            disabled={
                                saving ||
                                loadingCategories
                            }
                            required
                        >
                            <option value="">
                                {loadingCategories
                                    ? text.loading
                                    : text.selectCategory}
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

                    <div className="operation-field">
                        <label>
                            {text.date}
                        </label>

                        <input
                            type="date"
                            name="operation_date"
                            value={
                                formData.operation_date
                            }
                            onChange={handleChange}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="operation-field full-width">
                        <label>
                            {text.description}
                        </label>

                        <textarea
                            name="description"
                            rows="3"
                            maxLength="5000"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder={
                                text.descriptionPlaceholder
                            }
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="operation-form-actions">
                    <button
                        type="button"
                        className="finance-secondary-button"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {text.cancel}
                    </button>

                    <button
                        type="submit"
                        className="finance-primary-button"
                        disabled={
                            saving ||
                            loadingCategories
                        }
                    >
                        {saving
                            ? text.saving
                            : operation
                              ? text.update
                              : text.save}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OperationForm;