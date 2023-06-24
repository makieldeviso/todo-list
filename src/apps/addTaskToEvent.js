const addTaskToEvent = (function () {
    const newTasks = [];

    const addNewTask = function () {
        const tasksCont = document.querySelector('div#tasks-container');
        const addTaskInput = document.querySelector('input#add-task-input');
        const newTaskValue = addTaskInput.value;

        // Validate empty text box, does not add new task
        if (newTaskValue === '') {
            return
        }

        // New task ID counter
        const newTaskCount = newTasks.length;
        const newTaskId = `task-${newTaskCount + 1}`;

        // Create new task DOM Component
        const newTaskCont = document.createElement('div');
        newTaskCont.dataset.id = newTaskId;
        newTaskCont.setAttribute('class', 'new-task');
        
        // Create task marker
        const newTaskMarker = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newTaskMarker.setAttribute('class', 'list-mark');
        newTaskMarker.setAttribute('viewBox', '0 0 24 24');
        newTaskMarker.innerHTML = '<title>checkbox-blank-outline</title><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"></path>';

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

        // Add edit button icon
        const taskEditIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        taskEditIcon.setAttribute('viewBox', '0 0 24 24');
        taskEditIcon.innerHTML = '<title>pencil-outline</title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"></path>';
        newTaskEditBtn.appendChild(taskEditIcon);
        // Creates edit button (end) -

        // Creates delete button (start) -
        const newTaskDeleteBtn = document.createElement('button');
        newTaskDeleteBtn.setAttribute('class', 'delete-task');
        newTaskDeleteBtn.setAttribute('type', 'button');

        const taskDeleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        taskDeleteIcon.setAttribute('viewBox', '0 0 24 24');
        taskDeleteIcon.innerHTML = '<title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"></path>';
        newTaskDeleteBtn.appendChild(taskDeleteIcon);
        // Creates delete button (end) -

        // Adds data-id to the components then assemble it to the container
        const newTaskComponents = [newTaskMarker, newTaskText, newTaskEditBtn, newTaskDeleteBtn];

        newTaskComponents.forEach(component => {
            component.dataset.id = newTaskId;
            newTaskCont.appendChild(component);
        })

        tasksCont.appendChild(newTaskCont);

        // Saves to memory new tasks added
        // Create dynamic property assign;
        const newTaskObj = {};
        newTaskObj[newTaskId] = newTaskValue;

        newTasks.push(newTaskObj);

        // Clears text box upon adding
        addTaskInput.value = '';
    }

    const editTask = function () {
        console.log(this);
    }






    const addNewTaskEvent = function () {
        const addTaskBtn = document.querySelector('button#add-task-btn');
        addTaskBtn.addEventListener('click', addNewTask);
    }


    return {addNewTaskEvent}
})();

export { addTaskToEvent };