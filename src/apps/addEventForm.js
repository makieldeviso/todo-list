const addEventForm = (function () {

    const newEventBtn = document.querySelector('button#new-event');

    const eventFormComp = function () {
        const title = {
            inputType: 'input',
            label: 'Title',
            id: 'event-title',

            type: 'text',
            'max-length': '50',
        }

        const description = {
            inputType: 'textarea',
            label: 'Description',
            id: 'event-desc',
            
            cols: '30',
            rows: '3',
        }

        const schedule = {
            inputType: 'input',
            label: 'Schedule',
            id: 'event-schedule',
            type: 'date',
        }

        const addToProject = {
            inputType: 'select',
            label: 'Add to project',
            id: 'event-project',
        }

        return [title, description, schedule, addToProject];
    }

    const newEventForm = function() {
        // Conditions when executing newEventForm
        const eventBtnSelected = newEventBtn.dataset.selected === 'selected';
        const newEventClicked = this === newEventBtn;

        if (eventBtnSelected && newEventClicked) {
            return;
        }

        const modalCont = document.querySelector('div.modal-cont');
        // Creates the form
        const eventForm = document.createElement('form');
        eventForm.setAttribute('id', 'event-form');

        // Create component container
        const createContainer = function (assignClass, dataID) {
            const container = document.createElement('div');
            container.setAttribute('class', assignClass );
            container.dataset.id = dataID;

            return container
        }

        // Add form components function
        const addFormComponent = function (detailsObj) {
            // [0] -> component input type
            // [1] -> component title
            // [2] -> component id

            // Creates container - parent
            const container = createContainer('comp-container', 'new-event');

            // Save object keys for reference
            const objKeys = Object.keys(detailsObj);

            // Creates label - child 1
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', detailsObj.id);
            newLabel.textContent = `${detailsObj.label}:`;

            // Creates input field - child 2
            const newInput = document.createElement(detailsObj['inputType']);
            // Note: Did not include to loop to avoid name property in argument
            newInput.setAttribute('name', detailsObj.id); 
            newInput.dataset.id = 'new-event';

            // for loop starts at second 3nd / [2] property
            for (let i = 2; i < objKeys.length; i++ ) {
                newInput.setAttribute(`${objKeys[i]}`, `${detailsObj[objKeys[i]]}`);
            }

            // Assemble the container with the label and input field inside

            container.appendChild(newLabel);
            container.appendChild(newInput);

            return container;
        }


        // Add specified form components
        // Add Priority
        const addPriority = function () {
            // Creates container - parent
            const container = createContainer('comp-container', 'new-event');

            //Create p as label
            const label = document.createElement('p');
            label.textContent = 'Event Priority:'

            //Create another container for the buttons
            const btnCont = document.createElement('div');
            btnCont.setAttribute('id', 'prio-btns-cont');

            // Create buttons and append to btns container
            const addBtns = function (btnValue) {
                const newBtn= document.createElement('button');
                newBtn.setAttribute('class', 'prio-btn');
                newBtn.setAttribute('type', 'button');
                newBtn.setAttribute('value', btnValue);
                newBtn.dataset.id = btnValue;
                newBtn.textContent = `${btnValue.slice(0, 1).toUpperCase()}${btnValue.slice(1)}`;

                if (btnValue === 'mid') {
                    newBtn.dataset.selected = 'selected';
                }

                btnCont.appendChild(newBtn);
            }
            // Execute addBtns
            addBtns('low');
            addBtns('mid');
            addBtns('high');

            // Assemble the component
            container.appendChild(label);
            container.appendChild(btnCont);

            return container;
        }

        // Add task
        const addTask = function () {
            // lvl-1 parent
            const container = createContainer('comp-container', 'new-event'); 

             //Create p as label - lvl-1 child
             const label = document.createElement('p');
             label.textContent = 'Tasks:'

            //  Create empty tasks container - lvl-1 child
            const tasksCont = document.createElement('div');
            tasksCont.setAttribute('id', 'tasks-container');

            // Create add task input container - lvl-1 child, - lvl-2 parent 
            const inputCont = document.createElement('div');
            inputCont.setAttribute('id', 'add-task');

            // Create input field - lvl-2 child
            const taskInput = document.createElement('input');
            taskInput.setAttribute('id', 'add-task-input');
            taskInput.setAttribute('type', 'text');
            taskInput.setAttribute('maxlength', '50');

            //Create create task button - lvl-2 child, lvl-3 parent
            const addTaskBtn = document.createElement('button');
            addTaskBtn.setAttribute('type', 'button');
            addTaskBtn.setAttribute('id', 'add-task-btn');

            // Create and append button icon - lvl-3 child
            const buttonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            buttonIcon.setAttribute('viewBox', '0 0 24 24');
            buttonIcon.innerHTML = '<title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>'
            addTaskBtn.appendChild(buttonIcon);

            // Assemble component
            // lvl-2
            inputCont.appendChild(taskInput);
            inputCont.appendChild(addTaskBtn);

            // lvl-1
            container.appendChild(label);
            container.appendChild(tasksCont);
            container.appendChild(inputCont);

            return container;
        }

        const addSaveButton = function () {
            // Create container lvl-1 parent
            const container = createContainer('comp-container save-cont', 'new-event');

            // Creates and appends buttons
            const addBtn = function (assignClass, dataId, label) {
                const newBtn = document.createElement('button');
                newBtn.setAttribute('class', assignClass);
                newBtn.dataset.id = 'new-event';
                newBtn.textContent = label;

                container.appendChild(newBtn);
            }

            // Execute addBtn function
            addBtn('clear-form', 'new-event', 'Clear');
            addBtn('save-form', 'new-event', 'Save');

            return container;
        }

        const newBasicComp = eventFormComp().map(component => addFormComponent(component));
        const newPrio = addPriority();
        const newTask = addTask();
        const newSaveBtns = addSaveButton();

        // Appends the components to the modal container
        const allComp = [...newBasicComp, newPrio, newTask, newSaveBtns];
        allComp.forEach(component => eventForm.appendChild(component));

        // Appends the modal container to the dialog element
        modalCont.appendChild(eventForm);
    }

    const removeForm = function () {
        const modalCont = document.querySelector('div.modal-cont');
        const form = document.querySelector('form#event-form');

        modalCont.removeChild(form);
    }

    const addFormEvent = function() {
        newEventBtn.addEventListener('click', newEventForm);
    }

    return { newEventForm, addFormEvent, removeForm }

})();

export { addEventForm }
