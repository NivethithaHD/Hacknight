// Fetch and display all tasks
async function fetchTasks() {
    const res = await fetch('/tasks/');
    const data = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    data.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title + " - " + (task.description || "");
        li.style.textDecoration = task.completed ? "line-through" : "none";

        // Toggle completed on click
        li.onclick = async () => {
            await fetch('/tasks/' + task.id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    completed: !task.completed
                })
            });
            fetchTasks();
        };

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.onclick = async (e) => {
            e.stopPropagation();
            await fetch('/tasks/' + task.id, { method: 'DELETE' });
            fetchTasks();
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Add a new task
async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const desc = document.getElementById('taskDesc').value.trim();

    if (!title) return alert("Task title is required");

    await fetch('/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, description: desc, completed: false })
    });

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    fetchTasks();
}

// Load tasks on page load
window.onload = fetchTasks;

// Optional: Add task on Enter key press
document.getElementById('taskTitle').addEventListener("keypress", function(e) {
    if(e.key === "Enter") addTask();
});
document.getElementById('taskDesc').addEventListener("keypress", function(e) {
    if(e.key === "Enter") addTask();
});
