/*
 * Checkout UI only. Connect this page to your own backend.
 * Do not expose PayMeGate secret keys in browser JavaScript.
 */
const CONFIG = {
  endpoint: "/api/create-payment-session",
  apiConnected: false,
  minAmount: 1,
  maxAmount: 100000
};

const form = document.getElementById("payment-form");
const amountField = document.getElementById("amount");
const currencyField = document.getElementById("currency");
const total = document.getElementById("total");
const button = document.getElementById("pay-button");
const buttonLabel = document.getElementById("button-label");
const message = document.getElementById("message");

function currencyText(code) {
  return code === "SAR" ? "ر.س" : "USD";
}
function updateTotal() {
  const amount = Number(amountField.value || 0);
  total.textContent = `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })} ${currencyText(currencyField.value)}`;
}
function showMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle("success", success);
}
amountField.addEventListener("input", updateTotal);
currencyField.addEventListener("change", updateTotal);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");

  const amount = Number(amountField.value);
  const currency = currencyField.value;

  if (!Number.isFinite(amount) || amount < CONFIG.minAmount) {
    showMessage(`الحد الأدنى للمبلغ ${CONFIG.minAmount}.`);
    amountField.focus();
    return;
  }
  if (amount > CONFIG.maxAmount) {
    showMessage(`الحد الأعلى للمبلغ ${CONFIG.maxAmount.toLocaleString("en-US")}.`);
    amountField.focus();
    return;
  }
  if (!CONFIG.apiConnected) {
    showMessage("الواجهة جاهزة، لكن لم يتم ربط خادم الدفع بعد.");
    return;
  }

  button.disabled = true;
  buttonLabel.textContent = "جارٍ تجهيز الدفع";
  try {
    const response = await fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "تعذر إنشاء طلب الدفع.");
    if (!data.checkoutUrl || !/^https:\/\//i.test(data.checkoutUrl)) {
      throw new Error("لم يُرجع الخادم رابط دفع آمنًا.");
    }
    window.location.assign(data.checkoutUrl);
  } catch (error) {
    showMessage(error.message || "حدث خطأ أثناء تجهيز عملية الدفع.");
    button.disabled = false;
    buttonLabel.textContent = "متابعة";
  }
});

for (const id of ["privacy", "terms"]) {
  document.getElementById(id).addEventListener("click", e => e.preventDefault());
}
updateTotal();
