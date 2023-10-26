import { formatting } from "./formatting";
import { memoryHandler } from "./memoryHandler";

const createFormComponents = (function () {

    const createFormElement = function (assignId) {
        const newForm = document.createElement('form');
        newForm.setAttribute('id', assignId);

        return newForm;
    }

    // Create component container
    const createContainer = function (assignClass, dataId) {
        const container = document.createElement('div');
        container.setAttribute('class', assignClass);
        container.dataset.id = dataId;

        return container
    }

    const createBasicComponent = function (compDetailsObj, dataId) {
        // Note: compDetailsObj argument is obj with component details
        // [0] -> component input type
            // [1] -> component title
            // [2] -> component id

            // Creates container - parent
            const container = createContainer('comp-container', dataId);

            // Save object keys for reference
            const objKeys = Object.keys(compDetailsObj);

            // Creates label - child 1
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', compDetailsObj.id);
            newLabel.textContent = `${compDetailsObj.label}:`;

            // Creates input field - child 2
            const newInput = document.createElement(compDetailsObj.inputType);
            // Note: Did not include to loop to avoid specific properties in argument object
            newInput.setAttribute('name', compDetailsObj.id); 
            newInput.dataset.id = dataId;

            // for loop starts at 3rd / [2] property
            for (let i = 2; i < objKeys.length; i++ ) {
                newInput.setAttribute(`${objKeys[i]}`, `${compDetailsObj[objKeys[i]]}`);
            }

            // Assemble the container with the label and input field inside

            container.appendChild(newLabel);
            container.appendChild(newInput);

            return container;
    }

    const createPriorityBtns = function (dataId, assignLabel) {
        // Creates container - parent
        const container = createContainer('comp-container', dataId);

        // Create p as label
        const label = document.createElement('p');
        label.textContent = `${assignLabel}:`;

        // Create another container for the buttons
        const btnCont = document.createElement('div');
        btnCont.setAttribute('id', 'prio-btns-cont');

        // Create buttons and append to btns container
        const addBtns = function (btnValue) {
            const newBtn= document.createElement('button');
            newBtn.setAttribute('class', 'prio-btn');
            newBtn.setAttribute('type', 'button');
            newBtn.setAttribute('value', btnValue);
            newBtn.dataset.id = btnValue;
            newBtn.textContent = formatting.toProper(btnValue);

            if (btnValue === 'mid') {
                newBtn.dataset.selected = 'selected';
            }

            btnCont.appendChild(newBtn);
        }
        // Execute addBtns
        const btnValues = ['low', 'mid', 'high'];
        btnValues.forEach(value => addBtns(value));

        // Assemble the component
        container.appendChild(label);
        container.appendChild(btnCont);

        return container;
    }

    const adderBtn = function (dataId) {
        const newBtn = document.createElement('button');
        newBtn.setAttribute('type', 'button');
        newBtn.setAttribute('id', dataId);
        newBtn.setAttribute('class', 'adder-btn');

        return newBtn;
    }
    
    const createTaskAdder = function (dataId) {
         // lvl-1 parent
         const container = createContainer('comp-container', dataId); 

         // Create p as label - lvl-1 child
         const label = document.createElement('p');
         label.textContent = 'Tasks:'

        //  Create empty tasks container - lvl-1 child
        const tasksCont = document.createElement('div');
        tasksCont.setAttribute('id', 'tasks-container');

        // Create add task input container - lvl-1 child, - lvl-2 parent 
        const inputCont = document.createElement('div');
        inputCont.setAttribute('id', 'add-task');
        inputCont.setAttribute('class', 'adder-comp');

        // Create input field - lvl-2 child
        const taskInput = document.createElement('input');
        taskInput.setAttribute('id', 'add-task-input');
        taskInput.setAttribute('type', 'text');
        // taskInput.setAttribute('maxlength', '50');

        // Create create task button - lvl-2 child, lvl-3 parent
        const addTaskBtn = adderBtn('add-task-btn');

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

    const createEventAdder = function (dataId) {
        const container = createContainer('comp-container', dataId);

        // Create p as label - lvl-1 child
        const label = document.createElement('p');
        label.textContent = 'Add Event:'

        //  Create empty tasks container - lvl-1 child
        const eventsCont = document.createElement('div');
        eventsCont.setAttribute('id', 'events-link-container');

        // Create add task input container - lvl-1 child, - lvl-2 parent 
        const inputCont = document.createElement('div');
        inputCont.setAttribute('id', 'add-event');
        inputCont.setAttribute('class', 'adder-comp');

        // Create dropdown select event
        const eventSelect = document.createElement('select');
        eventSelect.setAttribute('id', 'add-event-select'); 

        // Create options for events select (start) -
        // addOption function is reusable executable
        const addOption = function (event) {
            const eventOption = document.createElement('option');
            let optionValue;
            let optionText;
            if (event === '') {
                optionValue = '';
                optionText = '-- Select event to Add in your project. --';

            } else {
                optionValue = event.eventId;
                optionText = event.title;
            }

            eventOption.setAttribute('value', optionValue);
            eventOption.textContent = optionText;
            eventSelect.appendChild(eventOption);
        }

        // Create blank value first then refer to saved events to add more options
        addOption('');
        
        const events = memoryHandler.getEvents();
        const standaloneEvents = events.filter((eventObj) => eventObj.projectTag === 'standalone');
        standaloneEvents.forEach(event => addOption(event));
        // Create options for events select (end) -

        // Create add event btn then link corresponding evenListener
        const addEventBtn = adderBtn('add-event-btn');

        const inputParts = [eventSelect, addEventBtn];
        inputParts.forEach(part => inputCont.appendChild(part));

        const eventAdderParts = [label, eventsCont, inputCont];
        eventAdderParts.forEach(part => container.appendChild(part));

        return container
    }

    // Create and append project select options
    const createProjectOptions = function (parentSelect) {
        const projects = memoryHandler.getProjects();
        const pendingProjects = projects.filter(project => project.projectStatus !== 'done');
        
        const projectOptions = pendingProjects.map(project => {
            const projectOption = document.createElement('option');
            projectOption.setAttribute('value', project.projectId);
            projectOption.textContent = `${project.title}`;

            return projectOption;
        });

        const projectSelect = parentSelect;
        projectOptions.forEach(option => projectSelect.appendChild(option));
        
    }

    const createSaveFormBtns = function (dataId) {
        // Create container lvl-1 parent
        const container = createContainer('comp-container save-cont', dataId);

        // Creates and appends buttons
        const addBtn = function (assignClass, assignDataId, label) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('class', assignClass);
            newBtn.dataset.id = assignDataId;
            newBtn.setAttribute('id', `${assignClass}-${assignDataId}`);
            newBtn.textContent = label;

            newBtn.setAttribute('type', 'button');

            container.appendChild(newBtn);
        }

        // Execute addBtn function
        addBtn('clear', dataId, 'Clear');
        addBtn('save', dataId, 'Save');

        return container;
    }

    return { createFormElement, 
            createBasicComponent, 
            createPriorityBtns, 
            createTaskAdder, 
            createEventAdder, 
            createProjectOptions, 
            createSaveFormBtns }
})();


export { createFormComponents }