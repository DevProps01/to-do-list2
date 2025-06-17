document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCount = document.getElementById('task-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initial render
    renderTasks();
    updateTaskCount();
    
    // Add task event
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks();
        });
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Function to add a new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
            updateTaskCount();
        }
    }
    
    // Function to render tasks based on filter
    function renderTasks() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        let filteredTasks = tasks;
        if (activeFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (activeFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to checkboxes, edit and delete buttons
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskComplete);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editTask);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    // Function to toggle task completion status
    function toggleTaskComplete(e) {
        const taskId = parseInt(e.target.closest('.task-item').dataset.id);
        const task = tasks.find(task => task.id === taskId);
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Function to edit a task
    function editTask(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);
        const task = tasks.find(task => task.id === taskId);
        const taskText = taskItem.querySelector('.task-text');
        
        const currentText = task.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        taskText.replaceWith(input);
        input.focus();
        
        function saveEdit() {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                task.text = newText;
                saveTasks();
            }
            renderTasks();
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }
    
    // Function to delete a task
    function deleteTask(e) {
        const taskId = parseInt(e.target.closest('.task-item').dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Function to clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Function to update task counter
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'item' : 'items'} left`;
    }
    
    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
