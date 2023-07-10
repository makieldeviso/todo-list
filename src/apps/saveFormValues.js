import { memoryHandler } from "./memoryHandler";

const saveFormValues = (function () {

    const saveEventForm = function () {

        // Factory function to create event object
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
            
        // Add tasks to the event object
        const tasks = document.querySelectorAll('#tasks-container input.new-task');
        tasks.forEach(task => {
            newEvent[`${task.dataset.id}`] = task.value;
        })

        // Create an id for the event object
        const eventId = function (object) {
            const eventTitle = object.title;
            const eventSchedule = object.schedule.valueOf();

            const titleId = eventTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
            const newEventId = `${titleId + eventSchedule}`;

            object['eventId'] = newEventId;
        }
        eventId(newEvent); // Executes event id maker

        memoryHandler.saveEvent(newEvent);
    }

    const addSaveEventFormEvent = function (action) {
        const saveEventBtn = document.querySelector('button#save-form-new-event');
        const clearFormBtn = document.querySelector('button#clear-form-new-event');

        // Ensures if addTaskBtn exists
        if (saveEventBtn !== null) {
            if (action === true) {
                saveEventBtn.addEventListener('click', saveEventForm);
            } else if (action === false) {
                saveEventBtn.removeEventListener('click', saveEventForm);
            }
        }
    }


    return { addSaveEventFormEvent }
})();

export {saveFormValues}