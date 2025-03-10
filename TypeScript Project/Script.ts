interface Task {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    status: string; 
}

document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm") as HTMLFormElement;
    const taskInput = document.getElementById("taskInput") as HTMLInputElement;
    const startDate = document.getElementById("startDate") as HTMLInputElement;
    const endDate = document.getElementById("endDate") as HTMLInputElement;
    const taskList = document.getElementById("taskList") as HTMLTableSectionElement;
    const getTasksButton = document.getElementById("getTasks") as HTMLButtonElement;
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

    const editPopup = document.getElementById("editPopup") as HTMLDivElement;
    const closePopup = document.getElementById("closePopup") as HTMLElement;
    const saveEditButton = document.getElementById("saveEditButton") as HTMLElement;
    const editTaskInput = document.getElementById("editTaskInput") as HTMLInputElement;
    const editStartDate = document.getElementById("editStartDate") as HTMLInputElement;
    const editEndDate = document.getElementById("editEndDate") as HTMLInputElement;

    let editingTaskId: number | null = null;


    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskRow = document.createElement("tr");
            taskRow.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="task-title">${task.title}</td>
                <td>${task.startDate}</td>
                <td>${task.endDate}</td>
                <td class="task-status">${task.status}</td>
                <td>
                    <button class="btn btn-warning edit-btn" data-id="${task.id}">Edit</button>
                    <button class="btn btn-success finish-btn" data-id="${task.id}">Finish</button>
                    <button class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
                </td>
            `;
            taskList.appendChild(taskRow);
        });
    }


    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newTask: Task = {
            id: Date.now(),
            title: taskInput.value,
            startDate: startDate.value,
            endDate: endDate.value,
            status: "In progress"
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();

        taskInput.value = "";
        startDate.value = "";
        endDate.value = "";
    });


    taskList.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains("edit-btn")) {
            const taskId = Number(target.getAttribute("data-id"));
            const task = tasks.find((task) => task.id === taskId);

            if (task) {
                editingTaskId = taskId;
                editTaskInput.value = task.title;
                editStartDate.value = task.startDate;
                editEndDate.value = task.endDate;
                editPopup.style.display = "block";
            }
        }

    
        if (target.classList.contains("finish-btn")) {
            const taskId = Number(target.getAttribute("data-id"));
            const task = tasks.find((task) => task.id === taskId);

            if (task) {
                task.status = "Finished";
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        }

   
        if (target.classList.contains("delete-btn")) {
            const taskId = Number(target.getAttribute("data-id"));
            const taskIndex = tasks.findIndex((task) => task.id === taskId);

            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        }
    });

    saveEditButton.addEventListener("click", () => {
        if (editingTaskId !== null) {
            const task = tasks.find((task) => task.id === editingTaskId);
            if (task) {
                task.title = editTaskInput.value;
                task.startDate = editStartDate.value;
                task.endDate = editEndDate.value;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        }
        editPopup.style.display = "none";
    });

    closePopup.addEventListener("click", () => {
        editPopup.style.display = "none";
    });

    getTasksButton.addEventListener("click", () => {
        renderTasks();
    });

    renderTasks();
});
