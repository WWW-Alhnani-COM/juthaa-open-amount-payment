# Juthaa AI — Stripe Payment Link-inspired checkout

واجهة عربية متجاوبة مستوحاة من تخطيط Stripe Payment Links: شريط التاجر، نموذج الدفع، ملخص الطلب، المساحات والحدود والألوان الهادئة.

## الملفات
- `index.html`
- `styles.css`
- `app.js`

## تشغيل محلي
```bash
python -m http.server 5500
```
افتح `http://localhost:5500`.

## تكامل بوابة الدفع
الواجهة غير متصلة حالياً ببوابة دفع. أنشئ Backend endpoint:
`POST /api/create-payment-session`

يستقبل:
```json
{ "amount": 120.00, "currency": "SAR" }
```
ويتحقق من المبلغ والعملة على الخادم، ثم ينشئ طلب PayMeGate ويرجع:
```json
{ "checkoutUrl": "https://..." }
```
بعد اختبار endpoint، اضبط `apiConnected: true` في `app.js`.

لا تضع مفاتيح API السرية في ملفات الواجهة. لا تجمع بيانات البطاقة هنا؛ استخدم صفحة الدفع المستضافة من مزود الدفع.

**تنبيه:** هذا تصميم مستوحى من نمط Stripe Payment Link وليس نسخة مطابقة أو صفحة تابعة لـ Stripe. وسائل الدفع الظاهرة في الواجهة مجرد وصف توضيحي ويجب مواءمتها مع طرق الدفع التي يدعمها حساب PayMeGate فعلياً.
