import { memoryHandler } from "./memoryHandler";
import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { showModals } from "./showModals";
import { format, formatDistance } from 'date-fns'
import { modalUX } from "./modalUX";
import { addTaskToEvent } from "./addTaskToEvent";
import { saveFormValuesEvent } from "./saveFormValuesEvent";

const eventEditForm = (function () {
    
    // Assign values to the event edit form
    const assignInitEventValues = function (id, obj) {
        const eventId = id;
        const eventObj = obj;

        const editForm = document.querySelector(`form#event-form[data-id="${eventId}"]`);

        const titleField = editForm.querySelector('input[name="event-title"]');
        titleField.value = eventObj.title;

        const descriptionField = editForm.querySelector('textarea[name="event-desc"]');
        descriptionField.value = eventObj.description;

        const schedField = editForm.querySelector('input[name="event-schedule"]');
        const formattedDate = format(eventObj.schedule, 'yyyy-MM-dd');
        schedField.value = formattedDate;

        const projectLinked = editForm.querySelector(`option[value='${eventObj.projectTag}']`);
        projectLinked.selected = true;

        const priorityBtns = editForm.querySelectorAll('button.prio-btn');

        // Close/ deselect default selected button
        modalUX.closeBtns(priorityBtns);

        // Query select button with the value equal to the current object event priority
        // Then assign data-selected
        const priorityBtnSelected = editForm.querySelector(`button.prio-btn[value="${eventObj.priority}"]`);
        priorityBtnSelected.dataset.selected = 'selected';

        const tasksObj = eventObj.tasks;

        for (const individualTask in tasksObj) {
            const task = tasksObj[individualTask].task;
            const status = tasksObj[individualTask].status;
            addTaskToEvent.addNewTask(task, status);
        }
    } 


    // Initiate event edit modal with form
    const showEditEventForm = function () {
        const eventId = this.dataset.id;
        const eventObj = memoryHandler.getEvent(eventId);

        // Note: pass eventId as argument to showModals module
        // This create an event form with necessary attribute values
        showModals.showEventEditModal(eventId);

        // Assign values to the form fields according to the saved event properties
        assignInitEventValues(eventId, eventObj);

        // Note: edit event actually replaces the old event obj
        // Add current event ID to save button as data-event
        const saveBtn = document.querySelector('button#save-edit-event');
        saveBtn.dataset.event = eventId;

        // Removes clear button from form
        // Note: creating edit form actually utilizes same function as adding new form, 
        // thus clear button exist initially, must remove for edit event form
        const saveBtnsCont = document.querySelector('div.save-cont');
        const clearBtn = document.querySelector('button#clear-edit-event');
        saveBtnsCont.removeChild(clearBtn);
    }

    return {showEditEventForm}
})();

export {eventEditForm}