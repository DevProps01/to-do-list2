// Add to script.js after the initial render

// Make the task list sortable
new Sortable(taskList, {
    animation: 150,
    onEnd: function() {
        // Get the new order of task IDs
        const newOrder = Array.from(taskList.children).map(item => parseInt(item.dataset.id));
        
        // Reorder the tasks array
        tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
        saveTasks();
    }
});
