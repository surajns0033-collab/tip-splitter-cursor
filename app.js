const billInput = document.getElementById("bill");
const customTipInput = document.getElementById("customTip");
const tipButtons = document.querySelectorAll("#tipButtons button");
const peopleInput = document.getElementById("people");
const minusBtn = document.getElementById("minusPeople");
const plusBtn = document.getElementById("plusPeople");
const tipAmountEl = document.getElementById("tipAmount");
const totalEl = document.getElementById("total");
const perPersonEl = document.getElementById("perPerson");
const errorEl = document.getElementById("error");
const resetBtn = document.getElementById("reset");
const themeToggle = document.getElementById("themeToggle");

let tipPercent = 10;

const formatMoney = (n) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function calculate() {
  const bill = parseFloat(billInput.value) || 0;
  const people = parseInt(peopleInput.value, 10);

  if (bill < 0) {
    errorEl.textContent = "Bill amount can't be negative.";
    return;
  }
  if (!people || people < 1) {
    errorEl.textContent = "Split between at least 1 person.";
    return;
  }
  errorEl.textContent = "";

  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;

  tipAmountEl.textContent = formatMoney(tip);
  totalEl.textContent = formatMoney(total);
  perPersonEl.textContent = formatMoney(total / people);
}

function setActiveButton(value) {
  tipButtons.forEach((btn) =>
    btn.classList.toggle("active", Number(btn.dataset.tip) === value)
  );
}

tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipPercent = Number(btn.dataset.tip);
    customTipInput.value = "";
    setActiveButton(tipPercent);
    calculate();
  });
});

customTipInput.addEventListener("input", () => {
  const value = parseFloat(customTipInput.value);
  if (customTipInput.value === "" || isNaN(value)) {
    tipPercent = 10;
    setActiveButton(10);
  } else {
    tipPercent = Math.min(Math.max(value, 0), 100);
    setActiveButton(null);
  }
  calculate();
});

billInput.addEventListener("input", calculate);
peopleInput.addEventListener("input", calculate);

minusBtn.addEventListener("click", () => {
  peopleInput.value = Math.max(1, (parseInt(peopleInput.value, 10) || 1) - 1);
  calculate();
});

plusBtn.addEventListener("click", () => {
  peopleInput.value = (parseInt(peopleInput.value, 10) || 0) + 1;
  calculate();
});

resetBtn.addEventListener("click", () => {
  billInput.value = "";
  customTipInput.value = "";
  peopleInput.value = 1;
  tipPercent = 10;
  setActiveButton(10);
  calculate();
  billInput.focus();
});

// Dark mode with persistence
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

calculate();
