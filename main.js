const To_Do_list = document.getElementById("task-list_To_Do");
const In_Progress_list = document.getElementById("In_Progress_task-list");
const Completed_list = document.getElementById("Completed_task-list");

// STEP 1: Define storage key
const STORAGE_KEY = "trello_tasks";

// STEP 2: Function to save all tasks to localStorage
function saveTasks() {
  const tasks = {
    todo: Array.from(To_Do_list.children).map((li) =>
      li.textContent.replace("✕", "").trim(),
    ),
    inProgress: Array.from(In_Progress_list.children).map((li) =>
      li.textContent.replace("✕", "").trim(),
    ),
    completed: Array.from(Completed_list.children).map((li) =>
      li.textContent.replace("✕", "").trim(),
    ),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  console.log("Tasks saved:", tasks);
}

// STEP 3: Function to load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const tasks = JSON.parse(saved);

    // Clear existing tasks
    To_Do_list.innerHTML = "";
    In_Progress_list.innerHTML = "";
    Completed_list.innerHTML = "";

    // Populate lists from saved data
    tasks.todo.forEach((task) => addTaskToList(To_Do_list, task));
    tasks.inProgress.forEach((task) => addTaskToList(In_Progress_list, task));
    tasks.completed.forEach((task) => addTaskToList(Completed_list, task));

    console.log("Tasks loaded from localStorage");
  }
}

// STEP 4: Helper function to create a task item with delete button and an edit button
function createTaskItem(text) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="task-text">${text}</span> <button class="delete-btn" onclick="deleteTask(this)">✕</button>
<button class="edit-btn">✏️</button>`;
  li.querySelector(".edit-btn").addEventListener("click", function () {
    editTask(li);
  });
  return li;
}

// STEP 5: Helper function to add task to a specific list
function addTaskToList(list, taskText) {
  if (taskText.trim() !== "") {
    const li = createTaskItem(taskText);
    list.appendChild(li);
  }
}

// STEP 6: Function to delete a task
function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
}

// STEP 6.5: Function to edit a task
function editTask(li) {
  const taskText = li.querySelector(".task-text");
  const currentText = taskText.textContent;

  // Create an input field
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  // Replace the text with input
  taskText.replaceWith(input);
  input.focus();
  input.select();

  // Function to save changes
  function saveEdit() {
    const newText = input.value.trim();
    if (newText !== "") {
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = newText;
      input.replaceWith(span);
      saveTasks();
    } else {
      // Restore original if empty
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = currentText;
      input.replaceWith(span);
    }
  }

  // Save on Enter key
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });

  // Save on blur (when click outside)
  input.addEventListener("blur", saveEdit);
}

// STEP 7: Function to add new task
function addNewTask() {
  const input = document.getElementById("new-task-input");
  const taskText = input.value.trim();

  if (taskText !== "") {
    addTaskToList(To_Do_list, taskText);
    input.value = "";
    saveTasks();
  }
}

// STEP 8: Allow adding task with Enter key
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("new-task-input");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addNewTask();
      }
    });
  }

  // Load saved tasks when page loads
  loadTasks();
});

// STEP 9: Create Sortable lists and save after changes
Sortable.create(To_Do_list, {
  group: "shared",
  animation: 150,
  onEnd: saveTasks,
});

Sortable.create(In_Progress_list, {
  group: "shared",
  animation: 150,
  onEnd: saveTasks,
});

Sortable.create(Completed_list, {
  group: "shared",
  animation: 150,
  onEnd: saveTasks,
});
