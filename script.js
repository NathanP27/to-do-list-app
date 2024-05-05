let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTaskFromModal() {
  const taskName = document.getElementById("taskName").value.trim();
  const taskDescription = document
    .getElementById("taskDescription")
    .value.trim();
  const taskDeadline = document.getElementById("taskDeadline").value.trim();

  if (taskName !== "") {
    const task = {
      id: Date.now(), // Unique ID for each task
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      status: "active",
    };
    tasks.push(task);
    saveTasks();
    displayTask(task);

    // Clear modal input fields
    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDeadline").value = "";

    // Close the modal
    $("#addTaskModal").modal("hide");
  } else {
    alert("Please enter a task name!");
  }
}

// Update the displayTask function
// Update the displayTask function with the correct event listener for the checkbox
function displayTask(task) {
  const taskList = document.getElementById('taskList');

  const li = document.createElement('li');

  const taskContent = document.createElement('div'); // Container for task details
  taskContent.className = "task-content";

  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.className = "form-check-input";
  checkbox.addEventListener('change', function() {
    task.status = this.checked ? 'completed' : 'active';
    saveTasks();
    updateTaskStyles(li, task);
    updateTaskCount();
  });

  const taskName = document.createElement('label');
  taskName.textContent = task.name;
  taskName.className = "form-check-label task-name";

  const taskDescription = document.createElement('p');
  taskDescription.textContent = task.description;
  taskDescription.className = "task-description";

  const taskDeadline = document.createElement('p');
  taskDeadline.textContent = "Deadline: " + task.deadline;
  taskDeadline.className = "task-deadline";

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = "btn btn-danger ml-2";
  deleteBtn.addEventListener('click', function() {
    deleteTask(task);
    taskList.removeChild(li); // Remove the task from the UI
    updateTaskCount();
  });

  taskContent.appendChild(checkbox); // Add checkbox to taskContent first
  taskContent.appendChild(taskName);
  taskContent.appendChild(taskDescription);
  taskContent.appendChild(taskDeadline);

  li.className = "list-group-item d-flex justify-content-between align-items-start";
  li.appendChild(taskContent);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  updateTaskStyles(li, task);
  updateTaskCount();
}

function updateTaskStyles(taskElement, task) {
  taskElement.classList.toggle("completed-task", task.status === "completed");
  const currentDate = new Date();
  const deadlineDate = new Date(task.deadline);
  if (deadlineDate > currentDate) {
    taskElement.classList.add("deadline-future");
    taskElement.classList.remove("deadline-past");
  } else {
    taskElement.classList.add("deadline-past");
    taskElement.classList.remove("deadline-future");
  }
}

function updateTaskCount() {
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((task) => task.status === "active").length;
  const completedTasks = totalTasks - activeTasks;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("activeTasks").textContent = activeTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
}

function deleteTask(taskToDelete) {
  tasks = tasks.filter((task) => task !== taskToDelete);
  saveTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => task.status === "active");
  saveTasks();
  loadTasks(); // Reload tasks to update the UI
}

// Load tasks from localStorage
function loadTasks() {
  const tasksData = localStorage.getItem("tasks");
  if (tasksData) {
    tasks = JSON.parse(tasksData);
    tasks.forEach((task) => {
      displayTask(task);
    });
    updateTaskCount();
  }
}

// Call loadTasks when the page loads
window.onload = loadTasks;