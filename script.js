// Set a target due date (3 days from "today" in 2026)
// Current context is April 10, 2026. Let's set it to April 13.
const targetDate = new Date("2026-04-13T18:00:00");

function updateDisplay() {
  const now = new Date();
  const diff = targetDate - now;

  // Format Due Date
  const options = { month: "short", day: "numeric", year: "numeric" };
  document.getElementById("dueDate").textContent =
    targetDate.toLocaleDateString("en-US", options);
  document
    .getElementById("dueDate")
    .setAttribute("datetime", targetDate.toISOString());

  // Calculate Time Remaining Text
  const timeHint = document.getElementById("timeRemaining");
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  if (diff < 0) {
    const overdueHours = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
    timeHint.textContent = `Overdue by ${overdueHours} hours`;
    timeHint.style.color = "var(--danger)";
  } else if (days > 0) {
    timeHint.textContent = `Due in ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    timeHint.textContent = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    timeHint.textContent = "Due now!";
  }
}

// Handle Completion Toggle
const checkbox = document.getElementById("todo-complete");
const card = document.querySelector(".todo-card");
const statusLabel = document.querySelector('[data-testid="test-todo-status"]');

checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    card.classList.add("is-done");
    statusLabel.textContent = "Done";
  } else {
    card.classList.remove("is-done");
    statusLabel.textContent = "In Progress";
  }
});

// Initialize and setup interval
updateDisplay();
setInterval(updateDisplay, 60000);

// Dummy Edit log
document.querySelector('[data-testid="test-todo-edit-button"]').onclick = () =>
  console.log("edit clicked");
