import { createFormComponents } from "./createFormComponents";

const addEventForm = (function () {

    const newEventBtn = document.querySelector('button#new-event');
    const modalCont = document.querySelector('div.modal-cont');

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
        const existingForm = document.querySelector('form#event-form');

        // If add Button is clicked or newEvent
        if ((eventBtnSelected && newEventClicked) || (existingForm !== null)) {
            console.log('nope')
            return;
        }

        // Creates the parent form element
        const eventForm = createFormComponents.createFormElement('event-form');

        // Add form components
        // Note: creates multiple from array of objects
        const newBasicComps = eventFormComp().map(comp => {
           const component = createFormComponents.createBasicComponent(comp, 'event-form');
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
    }

    const removeForm = function () {
        const form = document.querySelector('form#event-form');
        modalCont.removeChild(form);
    }

    const addFormEvent = function() {
        newEventBtn.addEventListener('click', newEventForm);
    }

    return { newEventForm, addFormEvent, removeForm }

})();

export { addEventForm }
