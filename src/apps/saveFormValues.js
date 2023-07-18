import { memoryHandler } from "./memoryHandler";
import { showModals } from "./showModals";
import { addEventForm } from "./addEventForm";
import { addTaskToEvent } from "./addTaskToEvent";

const saveFormValues = (function () {

    // Validates event form input fields
    const validateEventForm = function () {
        const titleInput = document.querySelector('#event-title');
        const schedInput = document.querySelector('#event-schedule');
        const inputsArray = [titleInput, schedInput];
        
        const errors = []
        const emptyRegex = /^\s*$/;

        const activeValidation = function () {
            validateEmpty(this);
        }

        const validateEmpty = function (inputField) {
            if (emptyRegex.test(inputField.value)) {
                // If input is empty or whitespace only
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

        // Validates form before saving
        const validationErrors = validateEventForm();
        if (validationErrors.length !== 0) {
            return
        }

        // Factory function to create initial event object
        const createEvent = function (title, description, schedule, projectTag, priority) {
            return {title, description, schedule, projectTag, priority}
        }

        // Reusable DOM value getter function
        const valueGet = function (selector) {
            const value = document.querySelector(`${selector}`).value;
            return value
        }

        // Execute factory function, to make event object
        // Note: arguments depends on valueGet function to get values from DOM
        const newEvent = createEvent(
            valueGet('#event-title'),
            valueGet('#event-desc'),
            new Date(valueGet('#event-schedule')), // object date
            valueGet('#event-project'),
            valueGet('button.prio-btn[data-selected="selected"]')
        )
            
        // Add tasks to the newEvent object
        const tasks = addTaskToEvent.getNewTasks();
        newEvent['tasks'] = tasks;
        // Refresh tasks for next batch/ new use 
        addTaskToEvent.resetNewTasks();

        // Add default status = pending to newEvent;
        newEvent[`eventStatus`] = 'pending';

        // Create an id for the newEvent object
        const eventId = function (object) {
            const eventTitle = object.title;
            const eventSchedule = object.schedule.valueOf();

            const titleId = eventTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
            const newEventId = `${titleId + eventSchedule}`;

            object['eventId'] = newEventId;
        }
        eventId(newEvent); // Executes event id maker

        // Save newEvent Object using the memory handler module
        memoryHandler.saveEvent(newEvent);

        // Closes modal upon successful save
        showModals.closeModal();
    }

    // Clears input field
    const clearEventForm = function () {
        addEventForm.removeEventForm();
        addEventForm.newEventForm();
    }

    // Adds event listener
    const addSaveEventFormEvent = function (action) {
        const saveEventBtn = document.querySelector('button#save-form-new-event');
        const clearEventFormBtn = document.querySelector('button#clear-form-new-event');

        // Ensures if addTaskBtn exists
        if (saveEventBtn !== null) {
            if (action === true) {
                saveEventBtn.addEventListener('click', saveEventForm);
                clearEventFormBtn.addEventListener('click', clearEventForm);
            } else if (action === false) {
                saveEventBtn.removeEventListener('click', saveEventForm);
                clearEventFormBtn.removeEventListener('click', clearEventForm);
            }
        }
    }

    return { addSaveEventFormEvent }
})();

export {saveFormValues}