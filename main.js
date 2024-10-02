document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('[data-input]');
    const taskAddBtn = document.querySelector('[data-add-btn]');
    const taskList = document.querySelector('[data-list]');
    const taskClearBtn = document.querySelector('[data-clear-tasks-btn');

    taskList.addEventListener('click', removeTask); 
    taskClearBtn.addEventListener('click', clearTasks);
    taskAddBtn.addEventListener('click', addTask);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && document.activeElement === taskInput) {
            event.preventDefault();
            addTask();
        }
    });

    function addTask()
    {
        const task = taskInput.value;

        if (task.trim() !== '') {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.dataset.task = '';
            taskDiv.draggable = true; // Enable dragging

            const taskContentDiv = document.createElement('div');
            taskContentDiv.classList.add('task-content');
            taskContentDiv.textContent = task;

            const taskRemoveIcon = document.createElement('i');
            taskRemoveIcon.classList.add('fas', 'fa-trash-alt');

            const taskRemoveBtn = document.createElement('button');
            taskRemoveBtn.classList.add('remove-task-btn');
            taskRemoveBtn.dataset.removeBtn = '';
            taskRemoveBtn.appendChild(taskRemoveIcon);
            
            taskDiv.appendChild(taskContentDiv);
            taskDiv.appendChild(taskRemoveBtn);
            taskList.appendChild(taskDiv);
            
            taskInput.value = ''; // clear input field

            taskDiv.addEventListener('dragstart', handleDragStart);
            taskDiv.addEventListener('dragover', handleDragOver);
            taskDiv.addEventListener('drop', handleDrop);
            taskDiv.addEventListener('dragend', handleDragEnd);

            updateClearBtnVisibility();
        } else {
            alert('Please enter a task.');
        }
    }

    function removeTask(event) // Uses event delegation
    {
        const removeBtn = event.target.closest('[data-remove-btn]');
        if (removeBtn) {
            const taskDiv = removeBtn.closest('[data-task]');
            taskDiv.remove();
            updateClearBtnVisibility();
        }
    }

    function clearTasks()
    {
        taskList.innerHTML = '';
        updateClearBtnVisibility();
    }

    function updateClearBtnVisibility() 
    {
        if (taskList.children.length > 0) {
            taskClearBtn.style.display = 'block';
        } else {
            taskClearBtn.style.display = 'none';
        }
    }

    function handleDragStart(event) 
    {
        event.dataTransfer.setData('text/plain', event.target.dataset.task); 
        event.target.classList.add('dragging');

        const blankImage = document.createElement('img');
        blankImage.src = '';
        event.dataTransfer.setDragImage(blankImage, 0, 0); // prevent ghost image
    }

    function handleDragOver(event) 
    {
        event.preventDefault(); // Prevent default to allow drop
        const draggingElement = document.querySelector('.dragging'); // element being dragged
        const hoveredOverElement = event.target.closest('[data-task]');

        if (hoveredOverElement && hoveredOverElement !== draggingElement) {
            const bounding = hoveredOverElement.getBoundingClientRect();
            const offset = bounding.y + bounding.height / 2;
            if (event.clientY - offset > 0) {
                hoveredOverElement.insertAdjacentElement('afterend', draggingElement);
            } else {
                hoveredOverElement.insertAdjacentElement('beforebegin', draggingElement);
            }
        }
    }

    function handleDrop(event) 
    {
        event.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        draggingElement.classList.remove('dragging'); 
    }

    function handleDragEnd(event) 
    {
        const draggingElement = document.querySelector('.dragging');
        if (draggingElement) {
            draggingElement.classList.remove('dragging'); // Ensure class is removed on drag end
        }
    }
});
