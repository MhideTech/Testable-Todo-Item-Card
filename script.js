// --- STATE MANAGEMENT ---
let state = {
  title: "Launch Project Orion",
  description:
    "Finalize the documentation for the Orion module. This includes the API references, deployment guides, and the security audit summary. Ensure all stakeholders are looped in before the Friday deadline.",
  priority: "High",
  status: "In Progress",
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 50)
    .toISOString()
    .slice(0, 16), // 50 hours from now
  isEditing: false,
  isExpanded: false,
};

const DOM = {
  card: document.getElementById("todoCard"),
  title: document.querySelector('[data-testid="test-todo-title"]'),
  desc: document.querySelector('[data-testid="test-todo-description"]'),
  prioText: document.querySelector(".priority-text"),
  prioDot: document.querySelector(".priority-indicator"),
  dueDate: document.getElementById("dueDateDisplay"),
  timeRem: document.getElementById("timeRemaining"),
  statusSel: document.getElementById("statusSelect"),
  checkbox: document.getElementById("mainCheckbox"),
  expandBtn: document.getElementById("expandToggle"),
  descCont: document.getElementById("descContainer"),
  editForm: document.getElementById("editForm"),
  // Edit fields
  inTitle: document.getElementById("editTitle"),
  inDesc: document.getElementById("editDesc"),
  inPrio: document.getElementById("editPriority"),
  inDate: document.getElementById("editDate"),
};

function updateUI() {
  // Update Text
  DOM.title.textContent = state.title;
  DOM.desc.textContent = state.description;
  DOM.prioText.textContent = state.priority;
  DOM.statusSel.value = state.status;
  DOM.checkbox.checked = state.status === "Done";

  // Visual Priority & Status
  DOM.card.className = `todo-card status-${state.status.toLowerCase().replace(" ", "-")}`;
  if (state.isEditing) DOM.card.classList.add("is-editing");

  const colors = {
    High: "var(--prio-high)",
    Medium: "var(--prio-med)",
    Low: "var(--prio-low)",
  };
  DOM.prioDot.style.backgroundColor = colors[state.priority];
  DOM.card.style.borderLeftColor = colors[state.priority];

  // Expand/Collapse logic
  if (state.description.length < 100) {
    DOM.expandBtn.style.display = "none";
    DOM.descCont.classList.add("expanded");
  } else {
    DOM.expandBtn.style.display = "block";
    DOM.expandBtn.textContent = state.isExpanded ? "Show Less" : "Show More";
    DOM.expandBtn.setAttribute("aria-expanded", state.isExpanded);
    state.isExpanded
      ? DOM.descCont.classList.add("expanded")
      : DOM.descCont.classList.remove("expanded");
  }

  // Date Formatting
  const d = new Date(state.dueDate);
  DOM.dueDate.textContent = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  updateTimeRemaining();
}

function updateTimeRemaining() {
  if (state.status === "Done") {
    DOM.timeRem.textContent = "Completed";
    DOM.timeRem.style.color = "var(--prio-low)";
    DOM.card.classList.remove("is-overdue");
    return;
  }

  const now = new Date();
  const due = new Date(state.dueDate);
  const diff = due - now;
  const isOverdue = diff < 0;

  DOM.card.classList.toggle("is-overdue", isOverdue);

  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / 86400000);
  const hrs = Math.floor((absDiff % 86400000) / 3600000);
  const mins = Math.floor((absDiff % 3600000) / 60000);

  let str = isOverdue ? "Overdue by " : "Due in ";
  if (days > 0) str += `${days}d ${hrs}h`;
  else if (hrs > 0) str += `${hrs}h ${mins}m`;
  else str += `${mins}m`;

  DOM.timeRem.textContent = str;
  DOM.timeRem.style.color = isOverdue ? "var(--danger)" : "var(--primary)";
}

// --- EVENTS ---

// Sync Checkbox & Status
DOM.checkbox.onchange = (e) => {
  state.status = e.target.checked ? "Done" : "Pending";
  updateUI();
};

DOM.statusSel.onchange = (e) => {
  state.status = e.target.value;
  updateUI();
};

// Expand/Collapse
DOM.expandBtn.onclick = () => {
  state.isExpanded = !state.isExpanded;
  updateUI();
};

// Edit Mode Toggle
document.getElementById("editBtn").onclick = () => {
  state.isEditing = true;
  DOM.inTitle.value = state.title;
  DOM.inDesc.value = state.description;
  DOM.inPrio.value = state.priority;
  DOM.inDate.value = state.dueDate;
  updateUI();
  DOM.inTitle.focus(); // Focus Trap Start
};

document.getElementById("cancelBtn").onclick = () => {
  state.isEditing = false;
  updateUI();
  document.getElementById("editBtn").focus(); // Return Focus
};

DOM.editForm.onsubmit = (e) => {
  e.preventDefault();
  state.title = DOM.inTitle.value;
  state.description = DOM.inDesc.value;
  state.priority = DOM.inPrio.value;
  state.dueDate = DOM.inDate.value;
  state.isEditing = false;
  updateUI();
  document.getElementById("editBtn").focus();
};

// Initialize
updateUI();
setInterval(updateTimeRemaining, 30000); // 30s updates
