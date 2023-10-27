import { format } from "date-fns";
import { addTaskToEvent } from "./addTaskToEvent";
import { closeModal } from "./closeModal";
import { createFormComponents } from "./createFormComponents";
import { displayContent } from "./displayContent";
import { eventFullView } from "./eventFullView";
import { eventsScript } from "./eventsScript";
import { formatting } from "./formatting";
import { memoryHandler } from "./memoryHandler";
import { modalUX } from "./modalUX";
import { onLoadScreen } from "./onLoadScreen";

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


    // Save Form values scripts (start) -
    // Reusable DOM value getter function
    const valueGet = function (selector) {
        const { value } = document.querySelector(`${selector}`);
        return value;
    }

    // Validates event form input fields
    const validateEventForm = function () {
        const titleInput = document.querySelector('#event-title');
        const schedInput = document.querySelector('#event-schedule');
        const inputsArray = [titleInput, schedInput];
        
        const errors = []
        const emptyRegex = /^\s*$/;

        const validateEmpty = function (inputField) {
            if (emptyRegex.test(inputField.value)) {
                // If input is empty or whitespace only

                const activeValidation = function () {
                    validateEmpty(this);
                }

                errors.push(inputField);
                inputField.classList.add('error');
                inputField.addEventListener('blur', activeValidation);
                inputField.addEventListener('change', activeValidation);

            } else {
                inputField.classList.remove('error');
            }
        }

        // Execute validation using validateEmpty function
        inputsArray.forEach(input => validateEmpty(input));

        // Scrolls the form to the first error found
        const firstInstanceError = document.querySelector('.error');
        if (firstInstanceError !== null) {
            firstInstanceError.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        
        return errors;
    };

    // Saves the form values when save button is pressed
    const saveEventForm = function () {
        const saveType = this.getAttribute('id');
        const eventForModId = this.dataset.event;

        // Validates form before saving
        const validationErrors = validateEventForm();
        if (validationErrors.length !== 0) {
            return
        }

        // Factory function to create initial event object
        const createEvent = function (title, description, schedule, projectTag, priority, creationDate) {
            return {title, description, schedule, projectTag, priority, creationDate}
        }

        // Execute factory function, to make event object
        // Note: arguments depends on valueGet function to get values from DOM
        const newEvent = createEvent(
            valueGet('#event-title'),
            valueGet('#event-desc'),
            (new Date(valueGet('#event-schedule'))).valueOf(), // object date
            valueGet('#event-project'),
            valueGet('button.prio-btn[data-selected="selected"]'),
            (new Date()).valueOf(),
        )
    
        // Add tasks to the newEvent object
        const tasks = addTaskToEvent.getNewTasks();
        newEvent.tasks = tasks;

        // Add default status = pending to newEvent;
        newEvent.eventStatus = 'pending';

        // Create an id for the newEvent object
        const eventId = function (object) {
            const eventTitle = object.title;
            const eventSchedule = object.schedule;
            const timeStamp = format(new Date(), 'HHmmss');

            const titleId = eventTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
            let newEventId = `${titleId + eventSchedule + timeStamp}`;

            // Double check and ensure no duplication of id
            // If same title and due date is created add additional id indicator
            const events = memoryHandler.getEvents();
            const sameId = events.filter(event => event.eventId.includes(newEventId));
            
            if (eventForModId === undefined) {
                if (sameId.length > 0) {
                    newEventId = `${titleId + eventSchedule}(${sameId.length + 1})`;
                }
            }

            return newEventId;
        }
        // Executes event id maker then assign return value as eventId property
        newEvent.eventId = eventId(newEvent);

        // Save newEvent Object using the memory handler module
        // If save button was from edit event
        // This replaces the old eventObj with new eventObj
        if (eventForModId === undefined) {
            memoryHandler.saveEvent(newEvent);

            if (newEvent.projectTag !== 'standalone') {
                // Adds the event to the project object
                memoryHandler.addEventToProject(newEvent.projectTag, newEvent.eventId);
            }

        } else {
            const oldProjectTag = eventsScript.getProperty(eventForModId, 'projectTag');

            memoryHandler.replaceEvent(eventForModId, newEvent);

            // Modify event link to project
            memoryHandler.modifyEventLink(eventForModId, newEvent.eventId, oldProjectTag, newEvent.projectTag);
        }

        // Closes modal upon successful save
        // If edit event modal is open, upon closing show full display of new event
        if (saveType === 'save-new-event') {
            closeModal.closeAddModal();

            // Direct user to events previews first, then
            // Direct item display to the full view of newly created event
            // Note: direct user to events preview first to allow UI sequence
            displayContent.showDisplay('events-previews', true);
            eventFullView.showFullEvent(newEvent.eventId);
            
        } else if (saveType === 'save-edit-event') {
            closeModal.closeEventEdit();
            eventFullView.showFullEvent(newEvent.eventId);
        }

        // Execute other display events counters
        onLoadScreen.loadCounters();
    }

    // Clears input field
    const clearEventForm = async function () {
        addEventForm.removeEventForm();
        addEventForm.newEventForm('new-event');
    }

    // Adds event listener
    const addSaveEventFormEvent = function (btnsCont, assignDataId) { 
        const clearBtn = btnsCont.querySelector(`button#clear-${assignDataId}`);
        const saveBtn = btnsCont.querySelector(`button#save-${assignDataId}`);

        clearBtn.addEventListener('click', clearEventForm);
        saveBtn.addEventListener('click', saveEventForm);
    }
    // Save Form values scripts (end) -

    // Creates New Event Form (start) -
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
        addSaveEventFormEvent(newSaveBtns, assignDataId);
        
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

    // Creates New Event Form (start) -
    

    return { newEventForm, addEventFormEvent, removeEventForm }

})();

export { addEventForm }
