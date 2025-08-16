from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Union, List
from uuid import uuid4
from datetime import datetime

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    description: Union[str, None] = None
    completed: bool = False

class Task(TaskCreate):
    id: str
    created_at: datetime

# In-memory database
tasks: List[Task] = []

# Serve HTML page
@app.get("/", response_class=HTMLResponse)
def get_index():
    with open("templates/index.html", "r") as f:
        return f.read()

# CRUD Endpoints
@app.post("/tasks/", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    new_task = Task(
        id=str(uuid4()),
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=datetime.now()
    )
    tasks.append(new_task)
    return new_task

@app.get("/tasks/", response_model=List[Task])
def read_tasks():
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task: TaskCreate):
    for existing_task in tasks:
        if existing_task.id == task_id:
            existing_task.title = task.title
            existing_task.description = task.description
            existing_task.completed = task.completed
            return existing_task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    for i, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(i)
            return {"detail": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

