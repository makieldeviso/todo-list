const addTaskToEvent = (function () {
    let newTasks = {};

    const resetNewTasks = function () {
        newTasks = {};
    }

    const getNewTasks = function () {
        // Note: run the ResetNewTasks when no longer needed for current use,
        // refresh object for reuse
        const saveTasks = newTasks;
        return saveTasks;
    }

    // addNewTask (start) -
    const changeTaskStatus = function () {
        const taskForMod = newTasks[`${this.dataset.id}`];
        const taskStatus = taskForMod.status;   

        if (taskStatus === 'pending') {
            this.dataset.status = 'done';
            taskForMod.status = 'done';
        } else if (taskStatus === 'done') {
            this.dataset.status = 'pending';
            taskForMod.status = 'pending';
        }
    }

    const editTask = function () {
        const editBtn = this;
        const editBtnId =  this.dataset.id;

        // Change icon while awaiting edit
        editBtn.classList.add('wait-save');

        const taskTextBox = document.querySelector(`input[data-id='${editBtnId}']`);
        taskTextBox.disabled = false;

        // Refer to tasks array to get value of the task for edit
        const taskValue = newTasks[`${editBtnId}`];

        // Ensures that the cursor is at the end of the text
        // Note: event listener linked function
        const cursorEnd = function () {
            taskTextBox.setSelectionRange(taskValue.task.length, taskValue.task.length);
        }
        
        // Saves the edit
        // Note: event listener linked function
        const saveEdit = function () {
            // Assign new value to the edited task
            newTasks[`${editBtnId}`].task = taskTextBox.value;

            // Disables text box upon save
            taskTextBox.disabled = true;

            // Remove changed icon
            editBtn.classList.remove('wait-save');

            // Remove focus and blur events on save
            taskTextBox.removeEventListener('focus', cursorEnd);
            taskTextBox.removeEventListener('blur', saveEdit);

            // Return the editTask linked function  to this button
            // Note: setTimeout trick to defer these function
            setTimeout(() => {
                editBtn.addEventListener('click', editTask); 
            }, 200);
        }

        // Temporarily disable linked edit function on this button
        editBtn.removeEventListener('click', editTask); 

        // Add focus and blur events to the text Box
        taskTextBox.addEventListener('focus', cursorEnd);
        taskTextBox.addEventListener('blur', saveEdit);  

        // Focus to text box when edit button is clicked
        taskTextBox.focus();
    }
    
    const deleteTask = function () {
        const buttonId = this.dataset.id;

        // Remove task from the newTasks Obj;
        delete newTasks[`${buttonId}`];

        const oldTaskKeys = Object.keys(newTasks); // Array of the newTasks property keys

        // Rename newTasks properties
        // Create temporary object for the new properties
        const tempObj = {}
        for (let i = 0; i < oldTaskKeys.length; i++) {
            // Save value
            const savedValue = newTasks[oldTaskKeys[i]];
            
            tempObj[`task-${i + 1}`] = savedValue;
        }

        // Deletes old task
        oldTaskKeys.forEach( key => delete newTasks[key] );

        // Replace the newTasks properties with new from tempObj
        for (let i = 0; i < oldTaskKeys.length; i++) {
            newTasks[`task-${i + 1}`] = tempObj[`task-${i + 1}`];
        }

        // Remove task from the DOM
        const tasksCont = document.querySelector('div#tasks-container');
        const taskForDeleteCont = document.querySelector(`div[data-id='${buttonId}']`);
        tasksCont.removeChild(taskForDeleteCont);

        // Replace data-id to components
        const taskElement = document.querySelectorAll('div.new-task');
        for(let i = 0; i < taskElement.length; i++) {
            const container = taskElement[i];
            const listMark = taskElement[i].querySelector('button.list-mark');
            const input = taskElement[i].querySelector('input.new-task');
            const editBtn= taskElement[i].querySelector('button.edit-task');
            const deleteBtn= taskElement[i].querySelector('button.delete-task');

            const components = [listMark, input, editBtn, deleteBtn, container];
            components.forEach(comp => {
                const component = comp;
                component.dataset.id = `task-${i + 1}`
            });
        }
    }

    const addNewTask = function (taskValue, taskStatus) {
        const tasksCont = document.querySelector('div#tasks-container');
        const addTaskInput = document.querySelector('input#add-task-input');
        const adderBtn = document.querySelector('button#add-task-btn');
        
        // Note: conditional to enable execution from non-eventlistener
        let newTaskValue;
        let newTaskStatus;
        let newTaskMark;
        const buttonClicked = this === adderBtn;
        if (buttonClicked) {
            newTaskValue = addTaskInput.value;
            newTaskStatus = 'pending';
            newTaskMark = 'new';
        } else {
            newTaskValue = taskValue;
            newTaskStatus = taskStatus;
            newTaskMark = taskStatus;
        }

        // Validate empty text box, does not add new task
        if (newTaskValue === '') {
            return
        }

        // New task ID counter
        const newTaskCount = Object.keys(newTasks).length;
        const newTaskId = `task-${newTaskCount + 1}`;

        // Create new task DOM Component
        const newTaskCont = document.createElement('div');
        newTaskCont.dataset.id = newTaskId;
        newTaskCont.setAttribute('class', 'new-task');
        
        // Create task marker
        const newTaskMarker = document.createElement('button');
        newTaskMarker.setAttribute('type', 'button');
        newTaskMarker.setAttribute('class', 'list-mark');
        newTaskMarker.dataset.status = newTaskMark;
        newTaskMarker.addEventListener('click', changeTaskStatus);

        // Creates the input text box
        const newTaskText = document.createElement('input');
        newTaskText.setAttribute('class', 'new-task');
        newTaskText.setAttribute('type', 'text');
        newTaskText.disabled = true;
        newTaskText.setAttribute('value', `${newTaskValue}`);

        // Creates edit button (start) -
        const newTaskEditBtn = document.createElement('button');
        newTaskEditBtn.setAttribute('class', 'edit-task');
        newTaskEditBtn.setAttribute('type', 'button');

        // Adds event listener to edit button
        newTaskEditBtn.addEventListener('click', editTask);

        // Creates delete button (start) -
        const newTaskDeleteBtn = document.createElement('button');
        newTaskDeleteBtn.setAttribute('class', 'delete-task');
        newTaskDeleteBtn.setAttribute('type', 'button');

        // Adds event listener to delete button
        newTaskDeleteBtn.addEventListener('click', deleteTask);

        // Adds data-id to the components then assemble it to the container
        const newTaskComponents = [newTaskMarker, newTaskText, newTaskEditBtn, newTaskDeleteBtn];

        newTaskComponents.forEach(comp => {
            const component = comp;
            component.dataset.id = newTaskId;
            newTaskCont.appendChild(component);
        })

        tasksCont.appendChild(newTaskCont);

        // Saves to memory new tasks added
        // Create dynamic property assign;
        newTasks[newTaskId] = {
            task: newTaskValue,
            status: newTaskStatus};

        // Clears text box upon adding
        addTaskInput.value = '';
    }

    const addNewTaskEvent = function (action) {
        const addTaskBtn = document.querySelector('button#add-task-btn');
        // Ensures if addTaskBtn exists
        if (addTaskBtn !== null) {
            if (action === true) {
                addTaskBtn.addEventListener('click', addNewTask);
            } else if (action === false) {
                addTaskBtn.removeEventListener('click', addNewTask);
            }
        }
    }

    return { addNewTaskEvent, getNewTasks, resetNewTasks, addNewTask };
})();

export { addTaskToEvent };