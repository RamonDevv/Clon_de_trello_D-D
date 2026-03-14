const To_Do_list = document.getElementById("task-list_To_Do");
const In_Progress_list = document.getElementById("In_Progress_task-list");
const Completed_list = document.getElementById("Completed_task-list");

// STEP 1: Define storage key | PASO 1: Definir clave de almacenamiento
const STORAGE_KEY = "trello_tasks";

// STEP 2: Function to save all tasks to localStorage | PASO 2: Función para guardar todas las tareas en localStorage
function saveTasks() {
  const tasks = {
    todo: Array.from(To_Do_list.children).map((li) =>
      li.querySelector(".task-text").textContent.trim(),
    ),
    inProgress: Array.from(In_Progress_list.children).map((li) =>
      li.querySelector(".task-text").textContent.trim(),
    ),
    completed: Array.from(Completed_list.children).map((li) =>
      li.querySelector(".task-text").textContent.trim(),
    ),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// STEP 3: Function to load tasks from localStorage | PASO 3: Función para cargar tareas desde localStorage
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const tasks = JSON.parse(saved);

    // Clear existing tasks | Limpiar tareas existentes
    To_Do_list.innerHTML = "";
    In_Progress_list.innerHTML = "";
    Completed_list.innerHTML = "";

    // Populate lists from saved data | Completar listas con datos guardados
    tasks.todo.forEach((task) => addTaskToList(To_Do_list, task));
    tasks.inProgress.forEach((task) => addTaskToList(In_Progress_list, task));
    tasks.completed.forEach((task) => addTaskToList(Completed_list, task));

  }
}

// STEP 4: Helper function to create a task item with delete and edit button | PASO 4: Función auxiliar para crear un elemento de tarea con botón de eliminar y botón de edición
function createTaskItem(text) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="task-text">${text}</span> <button class="delete-btn" onclick="deleteTask(this)">✕</button>
<button class="edit-btn">✏️</button>`;
  li.querySelector(".edit-btn").addEventListener("click", function () {
    editTask(li);
  });
  return li;
}

// STEP 5: Helper function to add task to a specific list | PASO 5: Función auxiliar para agregar tarea a una lista específica
function addTaskToList(list, taskText) {
  if (taskText.trim() !== "") {
    const li = createTaskItem(taskText);
    list.appendChild(li);
  }
}

// STEP 6: Function to delete a task | PASO 6: Función para eliminar una tarea
function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
}

// STEP 6.5: Function to edit a task | PASO 6.5: Función para editar una tarea
function editTask(li) {
  const taskText = li.querySelector(".task-text");
  const currentText = taskText.textContent;

  // Create an input field | Crear un campo de entrada
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  // Replace the text with input | Reemplazar el texto con entrada
  taskText.replaceWith(input);
  input.focus();
  input.select();

  // Function to save changes | Función para guardar cambios
  function saveEdit() {
    const newText = input.value.trim();
    if (newText !== "") {
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = newText;
      input.replaceWith(span);
      saveTasks();
    } else {
      // Restore original if empty | Restaurar original si está vacío
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = currentText;
      input.replaceWith(span);
    }
  }

  // Save on Enter key | Guardar al presionar Enter
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });

  // Save on blur (when click outside) | Guardar al salir del foco (cuando hace clic afuera)
  input.addEventListener("blur", saveEdit);
}

// STEP 7: Function to add new task | PASO 7: Función para agregar nueva tarea
function addNewTask() {
  const input = document.getElementById("new-task-input");
  const taskText = input.value.trim();

  if (taskText !== "") {
    addTaskToList(To_Do_list, taskText);
    input.value = "";
    saveTasks();
  }
}

// STEP 8: Allow adding task with Enter key | PASO 8: Permitir agregar tarea con la tecla Enter
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("new-task-input");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addNewTask();
      }
    });
  }

  // Load saved tasks when page loads | Cargar tareas guardadas cuando se carga la página
  loadTasks();
});

// STEP 9: Create Sortable lists and save after changes | PASO 9: Crear listas ordenables y guardar después de cambios
const sortableOptions = {
  group: "shared",
  animation: 150,
  ghostClass: "sortable-ghost",
  chosenClass: "sortable-chosen",
  dragClass: "sortable-drag",
  forceFallback: false,
  delayOnTouchOnly: true,
  delay: 0,
  onMove: function(evt) {
    // Highlight the target column | Highlight de la columna destino
    document.querySelectorAll(".To_Do_Container, .In_Progress_Container, .Completed_Container").forEach(col => {
      col.classList.remove("column-drag-over");
    });
    evt.to.closest(".To_Do_Container, .In_Progress_Container, .Completed_Container")?.classList.add("column-drag-over");
  },
  onEnd: function(evt) {
    // Remove highlight when drag ends | Remover highlight cuando termina el drag
    document.querySelectorAll(".To_Do_Container, .In_Progress_Container, .Completed_Container").forEach(col => {
      col.classList.remove("column-drag-over");
    });
    saveTasks();
  },
  onStart: function(evt) {
    // Add visual effect when drag starts | Agrega efecto visual cuando comienza el drag
    evt.item.style.opacity = "0.7";
  }
};

Sortable.create(To_Do_list, sortableOptions);
Sortable.create(In_Progress_list, sortableOptions);
Sortable.create(Completed_list, sortableOptions);
