// Care Assistant logic - plain ES6 (no React)
import { daysSince } from "./utils";

const DAY = 86400000; // milliseconds in one day

// Small helper: "1 day" / "3 days"
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Days left until the next watering (negative = overdue)
export const daysLeft = (plant) => plant.wateringEveryDays - daysSince(plant.lastWatered);

// Overdue, due today or not due yet
export const getStatus = (plant) => {
  const left = daysLeft(plant);
  if (left < 0) return { key: "overdue", label: "Overdue", text: `Overdue by ${plural(-left, "day")}`, left };
  if (left === 0) return { key: "due", label: "Due today", text: "Needs water today", left };
  return { key: "ok", label: "Not due yet", text: `Due in ${plural(left, "day")}`, left };
};

// Status of every plant, most urgent first
export const checkPlants = (plants) => {
  const checked = plants.map((plant) => ({ plant, status: getStatus(plant) }));
  checked.sort(function (a, b) {
    return a.status.left - b.status.left;
  });
  return checked;
};

// Text shown in the watering reminder alert
export const reminderMessage = (checked) => {
  const needWater = checked.filter((item) => item.status.key !== "ok");
  if (needWater.length === 0) return "All your plants are fine. Nothing needs watering today.";

  const names = needWater.map((item) => item.plant.name).join(", ");
  const overdue = needWater.filter((item) => item.status.key === "overdue").length;
  let message = `${plural(needWater.length, "plant")} need${needWater.length === 1 ? "s" : ""} water: ${names}.`;
  if (overdue > 0) message += ` ${overdue} of them ${overdue === 1 ? "is" : "are"} overdue.`;
  return message;
};

// Plant health check: symptoms and general advice
export const symptoms = [
  { id: "healthy", label: "Healthy", advice: "Your plant looks good. Keep following its regular watering schedule." },
  { id: "drooping", label: "Drooping leaves", advice: "Drooping can mean thirst or too much water. Check the soil: water if it is dry, or let it drain if it is soggy." },
  { id: "yellow", label: "Yellow leaves", advice: "Yellow leaves usually mean overwatering. Let the soil dry out and make sure the pot drains well." },
  { id: "dry", label: "Dry soil", advice: "Water slowly until water comes out of the bottom of the pot, then empty the tray." },
  { id: "brown", label: "Brown leaf tips", advice: "Brown tips can mean dry air or irregular watering. Water on a regular schedule and keep the plant away from heaters." },
];

// Advice for the chosen plant and symptom (uses the plant's real watering status)
export const careAdvice = (plant, symptomId) => {
  const symptom = symptoms.find((item) => item.id === symptomId);
  const status = getStatus(plant);
  let text = `${plant.name}: ${symptom.advice}`;
  if (symptomId !== "healthy" && status.key !== "ok") {
    text += ` It is also due for watering (${status.text.toLowerCase()}).`;
  }
  return text;
};

// Watering plan for today and the next N days, built from the real plants
export const buildPlan = (plants, days) => {
  const plan = Array.from({ length: days + 1 }, (_, day) => ({ day, plants: [] })); // day 0 = today
  plants.forEach((plant) => {
    let day = Math.max(daysLeft(plant), 0); // overdue plants are watered today
    while (day <= days) {
      plan[day].plants.push(plant.name);
      day += plant.wateringEveryDays; // repeat watering inside the period
    }
  });
  return plan.filter((entry) => entry.plants.length > 0);
};

// Total number of waterings in a plan
export const planTotal = (plan) =>
  plan.reduce(function (total, entry) {
    return total + entry.plants.length;
  }, 0);

// "Today", "Tomorrow" or a short date
export const dayLabel = (offset) => {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  return new Date(Date.now() + offset * DAY).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

// Date of the next watering after a plant has been watered
export const nextWateringDate = (plant) =>
  new Date(new Date(plant.lastWatered).getTime() + plant.wateringEveryDays * DAY).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
