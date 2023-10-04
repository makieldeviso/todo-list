import { showModals } from "./showModals";
import { memoryHandler } from "./memoryHandler";
import { format, formatDistance } from 'date-fns';
import { modalUX } from "./modalUX";
import { addEventToProject } from "./addEventToProject";

const projectEditForm = (function () {

    const assignInitProjectValues = function (obj) {
        const projectObj = obj;

        const editForm = document.querySelector(`form#project-form[data-id="${projectObj.projectId}"]`);

        const titleField = editForm.querySelector('input[name="project-title"]');
        titleField.value = projectObj.title;

        const descriptionField = editForm.querySelector('textarea[name="project-desc"]');
        descriptionField.value = projectObj.description;

        const deadlineField = editForm.querySelector('input[name="project-deadline"]');
        const formattedDate = format(projectObj.deadline, 'yyyy-MM-dd');
        deadlineField.value = formattedDate;

        const priorityBtns = editForm.querySelectorAll('button.prio-btn');
        // Close/ deselect default selected button
        modalUX.closeBtns(priorityBtns);

        // Query select button with the value equal to the current object priority
        // Then assign data-selected
        const priorityBtnSelected = editForm.querySelector(`button.prio-btn[value="${projectObj.priority}"]`);
        priorityBtnSelected.dataset.selected = 'selected';

        // Add eventsLinks preview to the DOM
        const eventLinks = projectObj.eventLinks;
        for (const event in eventLinks) {
            const eventId = eventLinks[event];
            const eventObj = memoryHandler.getEvent(eventId);

            // default select does not include project linked events. So add these project events as options 
            const eventSelect = editForm.querySelector('select#add-event-select');
            const eventOption = document.createElement('option');
            eventOption.setAttribute('value', `${eventObj.eventId}`);
            eventOption.textContent = `${eventObj.title}`;
            eventSelect.appendChild(eventOption);

            addEventToProject.addEvent(eventId);
        }

    }


    // Initiate project edit modal with form
    const showEditProjectForm = function () {
        const projectId = this.dataset.id;
        const projectObj = memoryHandler.getProject(projectId);

        // Note: pass projectId as argument to showModals module
        // This create a project form with necessary attribute values
        showModals.showProjectEditModal(projectId);

        // Assign values to the form fields according to the saved event properties
        assignInitProjectValues(projectObj);

        // Note: edit project actually replaces the old project obj
        // Add current event ID to save button as data-event
        const saveBtn = document.querySelector('button#save-edit-project');
        saveBtn.dataset.project = projectId;

        // Removes clear button from form
        // Note: creating edit form actually utilizes same function as adding new form, 
        // thus clear button exist initially, must remove for edit event form
        const saveBtnsCont = document.querySelector('div.save-cont');
        const clearBtn = document.querySelector('button#clear-edit-project');
        saveBtnsCont.removeChild(clearBtn);
    }

    return {showEditProjectForm}
})();

export {projectEditForm}