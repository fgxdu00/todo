const STORAGE_KEY = 'taska_tasks';

let tasks = [];
let currentFilter = 'all';
let editingId = null;

const form = document.getElementById('add-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const statsDone = document.getElementById('stats-done');
const statsLeft = document.getElementById('stats-left');
const clearBtn = document.getElementById('clear-completed');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        tasks = raw ? JSON.parse(raw) : [];
    } catch {
        tasks = [];
    }
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getPriority() {
    return document.querySelector('input[name="priority"]:checked').value;
}

function addTask(text) {
    const task = {
        id: uid(),
        text: text.trim(),
        completed: false,
        priority: getPriority(),
        createdAt: new Date().toISOString()
    };
    tasks.unshift(task);
    save();
    render();
}

function deleteTask(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
        el.classList.add('task-item--removing');
        el.addEventListener('animationend', () => {
            tasks = tasks.filter(t => t.id !== id);
            save();
            render();
        }, { once: true });
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        save();
        updateStats();
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.classList.toggle('task-item--completed', task.completed);
        }
    }
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingId = id;
    modalInput.value = task.text;
    modalOverlay.classList.add('modal-overlay--visible');
    modalInput.focus();
    modalInput.setSelectionRange(modalInput.value.length, modalInput.value.length);
}

function closeModal() {
    modalOverlay.classList.remove('modal-overlay--visible');
    editingId = null;
    modalInput.value = '';
}

function saveEdit() {
    const newText = modalInput.value.trim();
    if (!newText || !editingId) return;
    const task = tasks.find(t => t.id === editingId);
    if (task) {
        task.text = newText;
        save();
        render();
    }
    closeModal();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    save();
    render();
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getFiltered() {
    if (currentFilter === 'active')    return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

function updateStats() {
    const done = tasks.filter(t => t.completed).length;
    const left = tasks.filter(t => !t.completed).length;
    statsDone.textContent = done;
    statsLeft.textContent = left;
}

function render() {
    const filtered = getFiltered();

    taskList.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.add('empty-state--visible');
    } else {
        emptyState.classList.remove('empty-state--visible');
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' task-item--completed' : '');
            li.dataset.id = task.id;

            li.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    aria-label="Mark as ${task.completed ? 'incomplete' : 'complete'}"
                >
                <div class="task-body">
                    <p class="task-text">${escapeHtml(task.text)}</p>
                    <div class="task-meta">
                        <span class="task-priority task-priority--${task.priority}">${task.priority}</span>
                        <span class="task-date">${formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn task-action-btn--edit" data-id="${task.id}" aria-label="Edit task" title="Edit">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="task-action-btn task-action-btn--delete" data-id="${task.id}" aria-label="Delete task" title="Delete">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M2 4h11M6 4V2.5h3V4M5 4v8h5V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;

            li.querySelector('.task-checkbox').addEventListener('change', () => toggleTask(task.id));
            li.querySelector('.task-action-btn--edit').addEventListener('click', () => openEditModal(task.id));
            li.querySelector('.task-action-btn--delete').addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });
    }

    updateStats();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    addTask(text);
    taskInput.value = '';
    taskInput.focus();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn--active').classList.remove('filter-btn--active');
        btn.classList.add('filter-btn--active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

clearBtn.addEventListener('click', clearCompleted);

modalSave.addEventListener('click', saveEdit);
modalCancel.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && editingId) closeModal();
    if (e.key === 'Enter' && e.ctrlKey && editingId) saveEdit();
});

load();
render();