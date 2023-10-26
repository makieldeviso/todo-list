import { createFormComponents } from "./createFormComponents";
import { modalUX } from "./modalUX";
import { formatting } from "./formatting";
import { addTaskToEvent } from "./addTaskToEvent";
import { saveFormValuesEvent } from "./saveFormValuesEvent";

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
        newOption.textContent = formatting.toProper(value);

        const projectSelect = document.querySelector('select#event-project');
        projectSelect.appendChild(newOption);
    }

    const newEventForm = function(trigger) {

        const buttonClick = this.value === 'new-event';
        let assignDataId = 'new-event';
        if (trigger === 'default' || buttonClick ) {
           assignDataId = 'new-event';
        } else {
            assignDataId = trigger;
        }

        const modalCont = document.querySelector('div.modal-cont');
        // Conditions when executing newEventForm
        const projectForm = document.querySelector('form#project-form');
        const existingForm = document.querySelector('form#event-form');

        // If add Event Form is existing, cancel execution
        if (existingForm !== null) {
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
           const component = createFormComponents.createBasicComponent(comp, assignDataId);
           return component;
        });    

        // Add Priority and respective event listeners
        const newPriority = createFormComponents.createPriorityBtns(assignDataId, 'Event Priority');
        modalUX.addPriorityBtnEvent(newPriority);

        // Add task
        const newTaskAdder = createFormComponents.createTaskAdder(assignDataId);
        // Reset tasks memory
        addTaskToEvent.resetNewTasks();

        // Add Save and Clear Buttons and respective event listeners
        const newSaveBtns = createFormComponents.createSaveFormBtns(assignDataId);
        saveFormValuesEvent.addSaveEventFormEvent(newSaveBtns, assignDataId);
        
        // Appends the components to the parent form
        const allComp = [...newBasicComps, newPriority, newTaskAdder, newSaveBtns];
        allComp.forEach(component => eventForm.appendChild(component));

        // Appends the form to the modal Cont
        modalCont.appendChild(eventForm);

        // Add to project options to the Add to Project Dropdown
        addProjectOptions('standalone');
        const projectSelect = eventForm.querySelector('select#event-project');
        createFormComponents.createProjectOptions(projectSelect); // Append options to select parameter

        // Adds event listeners to the created form
        modalUX.addModalUX();
    }

    const removeEventForm = function () {
        const modalCont = document.querySelector('div.modal-cont');
        const form = document.querySelector('form#event-form');
    
        // Ensures that the form is present in the DOM
        if (form !== null) {
            // Remove form from modal
            modalCont.removeChild(form);
        } 
    }

    const addEventFormEvent = function() {
        const newEventBtn = document.querySelector('button#new-event');
        newEventBtn.addEventListener('click', newEventForm);
    }

    return { newEventForm, addEventFormEvent, removeEventForm }

})();

export { addEventForm }
