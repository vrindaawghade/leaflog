// LeafLog Garden Tools - JavaScript (ES6)

// ---------- Helpers (arrow functions) ----------
const $ = (id) => document.getElementById(id);
const show = (id, html) => { $(id).innerHTML = html; };

// Ask for a whole number with prompt(); warn with alert() if it is not valid
const askNumber = (message, start, min, max) => {
  const input = prompt(message, start);          // Prompt box
  if (input === null) return null;               // Cancel was pressed
  const n = Number(input);
  if (input.trim() === "" || !Number.isInteger(n) || n < min || n > max) {
    alert(`Please enter a whole number between ${min} and ${max}.`);   // Alert box
    return null;
  }
  return n;
};

// ---------- 1. Garden calendar: display current date ----------
const seasonTips = [
  "January: Water less in the cool weather and keep plants in sunlight.",
  "February: A good time to start pruning and refreshing the soil.",
  "March: Warm days begin. Increase watering slowly.",
  "April: Plant herbs like tulsi and mint in bright light.",
  "May: Peak summer. Water early in the morning.",
  "June: Monsoon is near. Check that pots can drain.",
  "July: Heavy rain. Avoid overwatering your plants.",
  "August: Humid weather. Watch for fungus on leaves.",
  "September: A good time to repot and add compost.",
  "October: Pleasant weather. Start new seeds.",
  "November: Cooler days. Reduce watering a little.",
  "December: Move delicate plants to a sunny, sheltered spot.",
];
const showDate = () => {
  const now = new Date();
  const date = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  show("dateOut", `<strong>${date}</strong><br>${time}<br><span class="muted">${seasonTips[now.getMonth()]}</span>`);
};

// ---------- 2. Pot arrangements: factorial (recursive arrow function) ----------
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const showArrangements = () => {
  const n = askNumber("How many pots do you want to arrange in a row? (1-15)", 5, 1, 15);
  if (n === null) return;
  const steps = Array.from({ length: n }, (_, i) => n - i).join(" × ");
  show("factOut", `${n} pots can be arranged in <strong>${factorial(n).toLocaleString("en-IN")}</strong> different ways.<br><span class="muted">${n}! = ${steps}</span>`);
};

// ---------- 3. Watering planner: multiplication table (anonymous function) ----------
const buildTable = function (perPlant) {
  let rows = "";
  for (let plants = 1; plants <= 10; plants++) {
    rows += `<tr><td>${plants} × ${perPlant} ml</td><td>${plants * perPlant} ml</td></tr>`;
  }
  return `<table class="mini">${rows}</table>`;
};
const showTable = function () {
  const ml = askNumber("How much water does one plant need? (in ml, 1-5000)", 250, 1, 5000);
  if (ml === null) return;
  show("tableOut", buildTable(ml));
};

// ---------- 4. Seed bed planner: sum of N numbers ----------
const sumOfN = (n) => (n * (n + 1)) / 2;
const showSeedBed = () => {
  const rows = askNumber("How many rows will your triangular seed bed have? (1-100)", 10, 1, 100);
  if (rows === null) return;
  const ok = confirm(`Row 1 gets 1 seed, row 2 gets 2 seeds ... row ${rows} gets ${rows} seeds.\nCalculate the total seeds needed?`);   // Confirm box
  if (!ok) {
    show("sumOut", "Calculation cancelled.");
    return;
  }
  show("sumOut", `A ${rows}-row seed bed needs <strong>${sumOfN(rows)}</strong> seeds.<br><span class="muted">1 + 2 + ... + ${rows} = ${sumOfN(rows)}</span>`);
};

// ---------- 5. Garden summary: arrays (map, filter, reduce, sort) ----------
const garden = [
  { name: "Tulsi", everyDays: 2, ml: 200 },
  { name: "Aloe Vera", everyDays: 7, ml: 100 },
  { name: "Money Plant", everyDays: 4, ml: 150 },
  { name: "Snake Plant", everyDays: 10, ml: 100 },
  { name: "Mint", everyDays: 2, ml: 180 },
];
const showSummary = () => {
  const weekly = garden.map(({ name, everyDays, ml }) => ({ name, perWeek: Math.round((7 / everyDays) * ml) }));
  const total = weekly.reduce((sum, p) => sum + p.perWeek, 0);
  const thirsty = garden.filter((p) => p.everyDays <= 3).map((p) => p.name);
  const names = garden.map((p) => p.name).sort((a, b) => a.localeCompare(b));
  show("arrOut",
    `<ul class="list">${weekly.map((p) => `<li>${p.name}: ${p.perWeek} ml per week</li>`).join("")}</ul>` +
    `<p><strong>Total: ${total} ml per week</strong><br>` +
    `Plants needing water every 3 days or less: ${thirsty.join(", ")}<br>` +
    `<span class="muted">A to Z: ${names.join(", ")}</span></p>`);
};

// ---------- 6. Watering reminders: events, prompt, confirm, alert ----------
const reminders = [];
const renderReminders = () => {
  const list = $("remList");
  list.innerHTML = "";
  if (reminders.length === 0) {
    list.innerHTML = '<li class="muted">No reminders yet.</li>';
    return;
  }
  reminders.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
};

// ---------- Events ----------
document.addEventListener("DOMContentLoaded", () => {
  showDate();
  renderReminders();
});
$("dateBtn").addEventListener("click", showDate);
$("factBtn").addEventListener("click", showArrangements);
$("tableBtn").addEventListener("click", showTable);
$("sumBtn").addEventListener("click", showSeedBed);
$("arrBtn").addEventListener("click", showSummary);

$("remBtn").addEventListener("click", function () {
  const name = prompt("Which plant needs watering today?");
  if (name === null) return;
  if (name.trim() === "") {
    alert("Please type a plant name.");
    return;
  }
  if (confirm(`Remind you to water ${name.trim()} today?`)) {
    reminders.push(`${name.trim()} · ${new Date().toLocaleDateString("en-IN")}`);
    renderReminders();
    alert(`Reminder saved for ${name.trim()} 🌱`);
    $("notice").textContent = "Reminder saved!";
    setTimeout(function () { $("notice").textContent = ""; }, 3000);   // anonymous function
  }
});

$("clearBtn").addEventListener("click", () => {
  if (reminders.length === 0) {
    alert("There are no reminders to clear.");
    return;
  }
  if (confirm("Clear all reminders?")) {
    reminders.length = 0;
    renderReminders();
  }
});
