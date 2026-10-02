// ================= LeafLog - Client-side validation =================

const form = document.getElementById("regForm");

// Get all fields
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");
const plantType = document.getElementById("plantType");
const terms = document.getElementById("terms");

// ---------- Regular expressions ----------
const nameRegex = /^[A-Za-z ]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const passRegex = /^(?=.*\d).{6,}$/;

// ---------- Show valid / invalid state on a field ----------
function setState(input, isValid) {
  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);
  return isValid;
}

// ---------- Individual validators ----------
const validateName = () => setState(nameInput, nameRegex.test(nameInput.value.trim()));
const validateEmail = () => setState(emailInput, emailRegex.test(emailInput.value.trim()));
const validatePhone = () => setState(phoneInput, phoneRegex.test(phoneInput.value.trim()));
const validatePass = () => setState(passInput, passRegex.test(passInput.value));
const validateConfirm = () =>
  setState(confirmInput, confirmInput.value !== "" && confirmInput.value === passInput.value);
const validatePlant = () => setState(plantType, plantType.value !== "");

function validateGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  document.getElementById("genderError").classList.toggle("d-none", !!selected);
  return !!selected;
}

function validateTerms() {
  document.getElementById("termsError").classList.toggle("d-none", terms.checked);
  return terms.checked;
}

// ---------- Live validation while typing ----------
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, ""); // allow digits only
  validatePhone();
});
passInput.addEventListener("input", () => {
  validatePass();
  updateStrength();
  if (confirmInput.value !== "") validateConfirm();
});
confirmInput.addEventListener("input", validateConfirm);
plantType.addEventListener("change", validatePlant);

// ---------- Password strength meter ----------
function updateStrength() {
  const p = passInput.value;
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let score = 0;
  if (p.length >= 6) score++;
  if (/\d/.test(p)) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  const levels = [
    { w: "0%", cls: "", label: "" },
    { w: "25%", cls: "bg-danger", label: "Weak" },
    { w: "50%", cls: "bg-warning", label: "Fair" },
    { w: "75%", cls: "bg-info", label: "Good" },
    { w: "100%", cls: "bg-success", label: "Strong" }
  ];
  const lvl = p === "" ? levels[0] : levels[score] || levels[1];

  bar.style.width = lvl.w;
  bar.className = "progress-bar " + lvl.cls;
  text.textContent = lvl.label;
}

// ---------- Show / hide password ----------
document.getElementById("togglePass").addEventListener("click", function () {
  const hidden = passInput.type === "password";
  passInput.type = hidden ? "text" : "password";
  confirmInput.type = hidden ? "text" : "password";
  this.textContent = hidden ? "Hide" : "Show";
});

// ---------- Form submit ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // run every validator (no short-circuit so all errors show at once)
  const results = [
    validateName(),
    validatePhone(),
    validateEmail(),
    validatePass(),
    validateConfirm(),
    validatePlant(),
    validateGender(),
    validateTerms()
  ];

  const msg = document.getElementById("successMsg");

  if (results.every(Boolean)) {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    msg.textContent = `Welcome to LeafLog, ${nameInput.value.trim()}! Your account has been created.`;
    msg.classList.remove("d-none");

    // print the submitted data in the console (useful for the lab screenshot)
    console.log("Registration data:", {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value,
      plantType: plantType.value,
      gender: gender
    });

    form.reset();
    form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
    updateStrength();
  } else {
    msg.classList.add("d-none");
  }
});
