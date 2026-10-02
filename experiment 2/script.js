// ================= Experiment 2: JavaScript ES6 =================

const output = document.getElementById("output");

// Helper (arrow function): show text in the output box
const show = (text) => { output.textContent = text; };

// ---------- 1. Display Current Date (Arrow function) ----------
const showDate = () => {
  const today = new Date();
  const text =
    `Current Date : ${today.toDateString()}\n` +
    `Current Time : ${today.toLocaleTimeString()}`;
  show(text);
  alert(text);                       // Alert box
};

// ---------- 2. Factorial (Arrow function + recursion) ----------
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

const showFactorial = () => {
  const input = prompt("Enter a number to find its factorial:");   // Prompt box
  if (input === null) return;        // user pressed Cancel
  const n = Number(input);
  if (input.trim() === "" || isNaN(n) || n < 0 || !Number.isInteger(n)) {
    alert("Please enter a valid non-negative whole number!");
    return;
  }
  show(`Factorial of ${n} = ${factorial(n)}`);
};

// ---------- 3. Multiplication Table (Anonymous function) ----------
const showTable = function () {
  const input = prompt("Enter a number for its multiplication table:");
  if (input === null) return;
  const n = Number(input);
  if (input.trim() === "" || isNaN(n)) {
    alert("Invalid number!");
    return;
  }
  let text = `Multiplication Table of ${n}\n-----------------------\n`;
  for (let i = 1; i <= 10; i++) {
    text += `${n} x ${i} = ${n * i}\n`;
  }
  show(text);
};

// ---------- 4. Sum of N Numbers (Arrow function + Confirm box) ----------
const sumOfN = (n) => (n * (n + 1)) / 2;

const showSum = () => {
  const input = prompt("Enter N to find the sum of the first N numbers:");
  if (input === null) return;
  const n = Number(input);
  if (input.trim() === "" || isNaN(n) || n < 1 || !Number.isInteger(n)) {
    alert("Please enter a positive whole number!");
    return;
  }
  if (confirm(`Do you want to calculate the sum of 1 to ${n}?`)) {  // Confirm box
    show(`Sum of first ${n} numbers = ${sumOfN(n)}`);
  } else {
    show("Calculation cancelled.");
  }
};

// ---------- 5. Arrays (map, filter, reduce) ----------
const showArray = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const squares = numbers.map((n) => n * n);
  const evens = numbers.filter((n) => n % 2 === 0);
  const total = numbers.reduce((sum, n) => sum + n, 0);
  show(
    `Original : [${numbers}]\n` +
    `Squares  : [${squares}]\n` +
    `Evens    : [${evens}]\n` +
    `Total    : ${total}`
  );
};

// ---------- 6. LeafLog: next watering date (ties to the project) ----------
const nextWatering = (lastWatered, everyDays) => {
  const next = new Date(lastWatered);
  next.setDate(next.getDate() + everyDays);
  return next;
};

const showPlant = () => {
  const plants = [
    { name: "Money Plant", every: 3 },
    { name: "Aloe Vera", every: 7 },
    { name: "Tulsi", every: 2 }
  ];
  const today = new Date();
  const lines = plants.map(({ name, every }) => {
    const next = nextWatering(today, every);
    return `${name.padEnd(12)} -> water every ${every} days, next on ${next.toDateString()}`;
  });
  show(`Plants watered today:\n\n${lines.join("\n")}`);
};

// ---------- Events ----------
document.getElementById("btnDate").addEventListener("click", showDate);
document.getElementById("btnFact").addEventListener("click", showFactorial);
document.getElementById("btnTable").addEventListener("click", showTable);
document.getElementById("btnSum").addEventListener("click", showSum);
document.getElementById("btnArray").addEventListener("click", showArray);
document.getElementById("btnPlant").addEventListener("click", showPlant);
document.getElementById("btnClear").addEventListener("click", () => show("Click a button to run a program..."));
