# نظام إدارة النقد (Cash Management System)

نظام ويب لإدارة العمليات المالية (دخل/خرج)، العملاء، المستخدمين، الصلاحيات، مع لوحة تحكم وتقارير.

---

## المتطلبات التقنية

- **Node.js** >= 18  
- **PHP** >= 8.2  
- **Composer**  
- **MySQL**  
- **Laravel** 12 (للباكند)

---

## تشغيل المشروع محلياً

### 1. تشغيل الباكند (Laravel)

```bash
cd cash-system-backend
composer install
cp .env.example .env
# عدل ملف .env (اسم قاعدة البيانات، المستخدم، كلمة المرور)
php artisan key:generate
php artisan migrate --seed
php artisan serve