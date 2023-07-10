import { createFormComponents } from "./createFormComponents";
import { modalUX } from "./modalUX";

const addEventForm = (function () {

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

    const addProjectOptions = function (value) {
        const newOption = document.createElement('option');
        newOption.setAttribute('value', value);
        newOption.textContent = `${value.slice(0,1).toUpperCase()}${value.slice(1)}`;

        const projectSelect = document.querySelector('select#event-project');
        projectSelect.appendChild(newOption);
    }

    const newEventForm = function() {
        const modalCont = document.querySelector('div.modal-cont');
        // Conditions when executing newEventForm
        const projectForm = document.querySelector('form#project-form');
        const existingForm = document.querySelector('form#event-form');

        // If add Event Form is existing, cancel execution
        if (existingForm !== null) {
            console.log('nope');
            return;
        }

        // Removes project form if it exist
        if (projectForm !== null) {
            modalCont.removeChild(projectForm);
        }

        // Creates the parent form element
        const eventForm = createFormComponents.createFormElement('event-form');

        // Add form components
        // Note: creates multiple from array of objects
        const newBasicComps = eventFormComp().map(comp => {
           const component = createFormComponents.createBasicComponent(comp, 'new-event');
           return component;
        }); 

        // Add Priority
        const newPriority = createFormComponents.createPriorityBtns('new-event');

        // Add task
        const newTaskAdder = createFormComponents.createTaskAdder('new-event');

        // Add Save and Clear Buttons
        const newSaveBtns = createFormComponents.createSaveFormBtns('new-event');

        // Appends the components to the parent form
        const allComp = [...newBasicComps, newPriority, newTaskAdder, newSaveBtns];
        allComp.forEach(component => eventForm.appendChild(component));

        // Appends the form to the modal Cont
        modalCont.appendChild(eventForm);

        // Add to project options to the Add to Project Dropdown
        addProjectOptions('standalone');

        // Adds event listeners to the created form
        modalUX.addModalUX();
    }

    const removeEventForm = function () {
        const modalCont = document.querySelector('div.modal-cont');
        const form = document.querySelector('form#event-form');
    
        // Ensures that the form is present in the DOM
        if (form !== null) {
            modalCont.removeChild(form);
        } else {
            return;
        }
    }

    const addEventFormEvent = function() {
        const newEventBtn = document.querySelector('button#new-event');
        newEventBtn.addEventListener('click', newEventForm);
    }

    return { newEventForm, addEventFormEvent, removeEventForm }

})();

export { addEventForm }