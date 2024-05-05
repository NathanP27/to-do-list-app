let tasks = [];

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    // Handle local storage errors
    displayNotification('Error saving tasks. Please try again.');
  }
}

function addTaskFromModal() {
  // Get the values from the input fields
  const taskName = document.getElementById('taskName').value.trim();
  const taskDescription = document.getElementById('taskDescription').value.trim();
  const taskDeadline = document.getElementById('taskDeadline').value.trim();

  // Validate the task name input
  if (taskName) {
    // Create a new task object
    const task = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      status: 'active',
    };

    // Add the new task to the array and update local storage
    tasks.push(task);
    saveTasks();

    // Update the UI with the new task
    displayTask(task);

    // Clear the input fields and close the modal
    clearModalFields();
    $('#addTaskModal').modal('hide');
  } else {
    // Display an error message if the task name is empty
    displayNotification('Please enter a task name!');
  }
}

function clearModalFields() {
  document.getElementById('taskName').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDeadline').value = '';
}

// Update the displayTask function
// Update the displayTask function with the correct event listener for the checkbox
const displayTask = (task) => {
  const taskList = document.getElementById('taskList');
  const fragment = document.createDocumentFragment();

  const card = document.createElement('div');
  card.className = "card bg-dark text-white mb-3";

  const cardBody = document.createElement('div');
  cardBody.className = "card-body d-flex justify-content-between align-items-center";

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

  cardBody.className = "list-group-item d-flex justify-content-between align-items-start";
  cardBody.appendChild(taskContent);
  cardBody.appendChild(deleteBtn);
  card.appendChild(cardBody);
  fragment.appendChild(card)
  taskList.appendChild(fragment);

  updateTaskStyles(card, task);
  updateTaskCount();
}

const updateTaskStyles = (taskElement, task) => {
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

const updateTaskCount = () => {
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((task) => task.status === "active").length;
  const completedTasks = totalTasks - activeTasks;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("activeTasks").textContent = activeTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
}

const deleteTask = (taskToDelete) => {
  tasks = tasks.filter((task) => task !== taskToDelete);
  saveTasks();
}

const clearCompletedTasks = () => {
  tasks = tasks.filter((task) => task.status === "active");
  saveTasks();
  loadTasks(); // Reload tasks to update the UI
}

// Load tasks from localStorage
const loadTasks = () => {
  const tasksData = localStorage.getItem("tasks");
  if (tasksData) {
    tasks = JSON.parse(tasksData);
    tasks.forEach((task) => {
      displayTask(task);
    });
    updateTaskCount();
  }
}

$(document).ready(function() {
  $('#addTaskModal').modal();
}); 

window.addEventListener('DOMContentLoaded', loadTasks);