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

    const createPriorityBtns = function (dataId) {
        // Creates container - parent
        const container = createContainer('comp-container', dataId);

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
        const btnValues = ['low', 'mid', 'high'];
        btnValues.forEach(value => addBtns(value));

        // Assemble the component
        container.appendChild(label);
        container.appendChild(btnCont);

        return container;
    }

    const createTaskAdder = function (dataId) {
         // lvl-1 parent
         const container = createContainer('comp-container', dataId); 

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

    const createSaveFormBtns = function (dataId) {
        // Create container lvl-1 parent
        const container = createContainer('comp-container save-cont', dataId);

        // Creates and appends buttons
        const addBtn = function (assignClass, dataId, label) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('class', assignClass);
            newBtn.dataset.id = dataId;
            newBtn.textContent = label;

            newBtn.setAttribute('type', 'button');

            container.appendChild(newBtn);
        }

        // Execute addBtn function
        addBtn('clear-form', dataId, 'Clear');
        addBtn('save-form', dataId, 'Save');

        return container;
    }

    return { createFormElement, createBasicComponent, createPriorityBtns, createTaskAdder, createSaveFormBtns }
})();


export { createFormComponents }