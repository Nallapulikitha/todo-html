const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const API_URL = "http://localhost:5000/tasks"; // Change this when deploying

// Load tasks from backend
async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    taskList.innerHTML = ""; // Clear list

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.innerHTML = task.title;
        if (task.completed) listItem.classList.add("checked");

        listItem.addEventListener("click", () => toggleTask(task.id));

        let span = document.createElement("span");
        span.innerHTML = `&times;`;
        span.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        listItem.appendChild(span);
        taskList.appendChild(listItem);
    });
}

// Add a task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return alert("Please enter a task");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    taskInput.value = "";
    loadTasks();
});

// Toggle task completion
async function toggleTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "PUT" });
    loadTasks();
}

// Delete task
async function deleteTask(taskId) {
    await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
    loadTasks();
}

// Load tasks on startup
loadTasks();
