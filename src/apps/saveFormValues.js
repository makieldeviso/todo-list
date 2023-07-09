const saveFormValues = (function () {

    const saveEventForm = function () {

        const valueGet = function (selector) {
            const value = document.querySelector(`${selector}`).value;
            return value
        }

        const title = valueGet('#event-title');
        const description = valueGet('#event-desc');
        const schedule = valueGet('#event-schedule');
        const projectTag = valueGet('#event-project');
        const priority = valueGet('button.prio-btn[data-selected="selected"]');

        console.log({title, description, schedule, projectTag, priority});
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