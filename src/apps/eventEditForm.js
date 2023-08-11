import { memoryHandler } from "./memoryHandler";
import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { showModals } from "./showModals";
import { format, formatDistance } from 'date-fns'
import { modalUX } from "./modalUX";
import { addTaskToEvent } from "./addTaskToEvent";

const eventEditForm = (function () {
    
    // Assign values to the event edit form
    const assignInitEventValues = function (id, obj) {
        const eventId = id;
        const eventObj = obj;

        console.log(eventObj);

        const editForm = document.querySelector(`form#event-form[data-id="${eventId}"]`);

        const titleField = editForm.querySelector('input[name="event-title"]');
        titleField.value = eventObj.title;

        const descriptionField = editForm.querySelector('textarea[name="event-desc"]');
        descriptionField.value = eventObj.description;

        const schedField = editForm.querySelector('input[name="event-schedule"]');
        const formattedDate = format(eventObj.schedule, 'yyyy-MM-dd');
        schedField.value = formattedDate;

        // !!!!!!!!!!!!!!!!!!ADD PROJECT EDITING FEATURE!!!!!!!!!!!!!!!!!

        const priorityBtns = editForm.querySelectorAll('button.prio-btn');

        // Close/ deselect default selected button
        modalUX.closeBtns(priorityBtns);

        // Query select button with the value equal to the current object event priority
        // Then assign data-selected
        const priorityBtnSelected = editForm.querySelector(`button.prio-btn[value="${eventObj.priority}"]`);
        priorityBtnSelected.dataset.selected = 'selected';

        const tasksObj = eventObj.tasks;
        console.log(tasksObj);

        for (const individualTask in tasksObj) {
            addTaskToEvent.addNewTask(tasksObj[individualTask].task);
        }

    }



    // Initiate event edit modal with form
    const showEditEventForm = function () {
        const eventId = this.dataset.id;
        const eventObj = memoryHandler.getEvent(eventId);

        // Note: pass eventId and eventObj as argument to showModals module
        showModals.showEventEditModal(eventId, eventObj);

        assignInitEventValues(eventId, eventObj);

    }



    return {showEditEventForm}
})();

export {eventEditForm}