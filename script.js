// Show the habit app after welcome page
function startApp() {
    document.getElementById('welcome').style.display = "none";
    document.getElementById('habitApp').style.display = "block";
    fetchTasks();
}

// Fetch and display all tasks
async function fetchTasks() {
    const res = await fetch('/tasks/');
    const data = await res.json();

    const list = document.getElementById('habitList');
    list.innerHTML = '';

    data.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${task.title}</strong> - ${task.description || ""}`;
        li.style.textDecoration = task.completed ? "line-through" : "none";

        // Toggle completed on click
        li.onclick = async () => {
            await fetch('/tasks/' + task.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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

// Add a new habit
async function addHabit() {
    const title = document.getElementById('habitTitle').value.trim();
    const desc = document.getElementById('habitDesc').value.trim();

    if (!title) return alert("Habit title is required");

    await fetch('/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, description: desc || null, completed: false })
    });

    document.getElementById('habitTitle').value = '';
    document.getElementById('habitDesc').value = '';
    fetchTasks();
}

// Optional: Add habit on Enter key press
document.getElementById('habitTitle').addEventListener("keypress", function(e) {
    if (e.key === "Enter") addHabit();
});
document.getElementById('habitDesc').addEventListener("keypress", function(e) {
    if (e.key === "Enter") addHabit();
});
