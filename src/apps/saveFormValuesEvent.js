import { memoryHandler } from "./memoryHandler";
import { showModals } from "./showModals";
import { addEventForm } from "./addEventForm";
import { addTaskToEvent } from "./addTaskToEvent";
import { eventsDisplay } from "./eventsDisplay";
import { onLoadScreen } from "./onLoadScreen";
import { eventsScript } from "./eventsScript";
import { displayContent } from "./displayContent";

import { format, differenceInCalendarDays } from 'date-fns';

const saveFormValuesEvent = (function () {

    // Reusable DOM value getter function
    const valueGet = function (selector) {
        const value = document.querySelector(`${selector}`).value;
        return value;
    }

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
        const saveType = this.getAttribute('id');
        const eventForModId = this.dataset.event;

        // Validates form before saving
        const validationErrors = validateEventForm();
        if (validationErrors.length !== 0) {
            return
        }

        // Factory function to create initial event object
        const createEvent = function (title, description, schedule, projectTag, priority) {
            return {title, description, schedule, projectTag, priority}
        }

        // Execute factory function, to make event object
        // Note: arguments depends on valueGet function to get values from DOM
        const newEvent = createEvent(
            valueGet('#event-title'),
            valueGet('#event-desc'),
            (new Date(valueGet('#event-schedule'))).valueOf(), // object date
            valueGet('#event-project'),
            valueGet('button.prio-btn[data-selected="selected"]')
        )
    
        // Add tasks to the newEvent object
        const tasks = addTaskToEvent.getNewTasks();
        newEvent['tasks'] = tasks;

        // Add default status = pending to newEvent;
        newEvent[`eventStatus`] = 'pending';

        // Create an id for the newEvent object
        const eventId = function (object) {
            const eventTitle = object.title;
            const eventSchedule = object.schedule;
            const timeStamp = format(new Date(), 'Hms');

            const titleId = eventTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
            let newEventId = `${titleId + eventSchedule + timeStamp}`;

            // Double check and ensure no duplication of id
            // If same title and due date is created add additional id indicator
            const events = memoryHandler.getEvents();
            const sameId = events.filter(event => event['eventId'].includes(newEventId));
            
            if (eventForModId === undefined) {
                if (sameId.length > 0) {
                    newEventId = `${titleId + eventSchedule}(${sameId.length + 1})`;
                }
            }

            object['eventId'] = newEventId;
        }
        eventId(newEvent); // Executes event id maker

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
            showModals.closeModal();

            // Direct item display to the full view of newly created event
            displayContent.showDisplay('events-previews', true);
            eventsDisplay.showFullEvent(newEvent.eventId);
            
        } else if (saveType === 'save-edit-event') {
            showModals.closeEventEdit();
            eventsDisplay.showFullEvent(newEvent.eventId);
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

    return { addSaveEventFormEvent, clearEventForm, saveEventForm}
})();

export {saveFormValuesEvent}