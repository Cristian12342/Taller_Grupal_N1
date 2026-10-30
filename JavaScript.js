// Arreglo de tareas iniciales (establecidas)
let tasks = [
    { id: 1, title: "Enviar reporte semanal", section: "Trabajo", difficulty: "didficl", date: "2026-06-01", completed: false },
    { id: 2, title: "Comprar pan", section: "Personal", difficulty: "facil", date: "2026-06-02", completed: true },
    { id: 3, title: "Repasar HTML", section: "Estudios", difficulty: "meda", date: "2026-06-03", completed: false }
];

// Variable global para controlar el filtro seleccionado
let currentFilter = 'all';

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Comprueba si una tarea no completada ya pasó de la fecha límite
function isTaskOverdue(task) {
    const todayStr = getTodayString();
    return !task.completed && task.date < todayStr;
}

// Función para agregar nuevas tareas desde el formulario
function addNewTask(event) {
    event.preventDefault(); // Evita recargar la página

    const title = document.getElementById('task-title').value;
    const section = document.getElementById('task-section').value;
    const difficulty = document.getElementById('task-difficulty').value;
    const date = document.getElementById('task-date').value;

    const newTask = {
        id: Date.now(),
        title: title,
        section: section,
        difficulty: difficulty,
        date: date,
        completed: false
    };

    tasks.push(newTask);

    // Limpia los campos del formulario
    document.getElementById('task-title').value = '';
    document.getElementById('task-date').value = '';

    render();
}

// Cambia el estado de una tarea (Completada / Pendiente)
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    render();
}

// Elimina una tarea de la lista
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

// Cambia el filtro desde el selector principal de la vista
function applyFilter() {
    const selectElement = document.getElementById('filter-select');
    if (selectElement) {
        currentFilter = selectElement.value;
        render();
    }
}

// Cambia el filtro desde los enlaces del menú lateral izquierdo
function filterByMenu(filterType) {
    currentFilter = filterType;
    const selectElement = document.getElementById('filter-select');
    if (selectElement) {
        selectElement.value = filterType;
    }
    render();
}

// Función principal de renderizado que actualiza la pantalla y contadores
function render() {
    const ul = document.getElementById('list-tasks');
    if (!ul) return;
    
    ul.innerHTML = '';

    // Cálculo de contadores
    let totalCount = tasks.length;
    let completedCount = tasks.filter(t => t.completed).length;
    let overdueCount = tasks.filter(t => isTaskOverdue(t)).length;
    let pendingCount = tasks.filter(t => !t.completed && !isTaskOverdue(t)).length;

    // Actualización de los indicadores en pantalla
    if (document.getElementById('total-tasks')) document.getElementById('total-tasks').textContent = totalCount;
    if (document.getElementById('completed-tasks')) document.getElementById('completed-tasks').textContent = completedCount;
    if (document.getElementById('overdue-tasks')) document.getElementById('overdue-tasks').textContent = overdueCount;
    if (document.getElementById('pending-tasks')) document.getElementById('pending-tasks').textContent = pendingCount;

    // Filtrar tareas según la opción elegida (Todas, Por hacer, Completadas, Atrasadas)
    const filteredTasks = tasks.filter(t => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'completed') return t.completed;
        if (currentFilter === 'pending') return !t.completed && !isTaskOverdue(t);
        if (currentFilter === 'overdue') return isTaskOverdue(t);
        return true;
    });

    // Dibujar las tareas en el HTML dentro del contenedor de la lista
    if (filteredTasks.length === 0) {
        ul.innerHTML = '<li style="color: #aaa; text-align: center; display: block; padding: 15px;">No hay tareas para mostrar.</li>';
    } else {
        filteredTasks.forEach(t => {
            const li = document.createElement('li');
            
            let statusLabel = '';
            let styleText = '';

            if (t.completed) {
                styleText = 'text-decoration: line-through; color: #888;';
            } else if (isTaskOverdue(t)) {
                statusLabel = ' <strong style="color: #e63946;">(Atrasada)</strong>';
            }

            li.innerHTML = `
                <span style="${styleText}">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
                    <strong>${t.title}</strong> [${t.section}] - Prioridad: ${t.difficulty} - Fecha: ${t.date}${statusLabel}
                </span>
                <button onclick="deleteTask(${t.id})">Eliminar</button>
            `;
            ul.appendChild(li);
        });
    }
}

// Ejecutar el renderizado inicial cuando el documento HTML termine de cargar
document.addEventListener('DOMContentLoaded', () => {
    render();
});