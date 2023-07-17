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

    const addNewTask = function () {
        const tasksCont = document.querySelector('div#tasks-container');
        const addTaskInput = document.querySelector('input#add-task-input');
        const newTaskValue = addTaskInput.value;

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
        const newTaskMarker = document.createElement('div');
        newTaskMarker.setAttribute('class', 'list-mark');

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

        newTaskComponents.forEach(component => {
            component.dataset.id = newTaskId;
            newTaskCont.appendChild(component);
        })

        tasksCont.appendChild(newTaskCont);

        // Saves to memory new tasks added
        // Create dynamic property assign;
        newTasks[newTaskId] = {
            task: newTaskValue,
            status: 'not done'};

        // Clears text box upon adding
        addTaskInput.value = '';

        console.log(newTasks);
    }

    const editTask = function () {
        const editButtonId =  this.dataset.id;

        const taskTextBox = document.querySelector(`input[data-id='${editButtonId}']`);
        taskTextBox.disabled = false;

        // Refer to tasks array to get value of the task for edit
        const taskValue = newTasks[`${editButtonId}`];

        // Ensures that the cursor is at the end of the text
        // Note: event listener linked function
        const cursorEnd = function () {
            taskTextBox.setSelectionRange(taskValue['task'].length, taskValue['task'].length);
        }
        
        // Saves the edit
        // Note: event listener linked function
        const saveEdit = function () {
            // Assign new value to the edited task
            newTasks[`${editButtonId}`].task = taskTextBox.value;

            //Disables text box upon save
            taskTextBox.disabled = true;

            // Remove focus and blur events on save
            taskTextBox.removeEventListener('focus', cursorEnd);
            taskTextBox.removeEventListener('blur', saveEdit);
        }

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

    return { addNewTaskEvent, getNewTasks, resetNewTasks };
})();

export { addTaskToEvent };