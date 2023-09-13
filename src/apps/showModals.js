import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { modalUX } from "./modalUX";
import { addProjectForm } from "./addProjectForm";
import { memoryHandler } from "./memoryHandler";
import { eventsDisplay } from "./eventsDisplay";
import { saveFormValues } from "./saveFormValuesEvent";
import { addTaskToEvent } from "./addTaskToEvent";
import { displayContent } from "./displayContent";
import { onLoadScreen } from "./onLoadScreen";
import { projectsDisplay } from "./projectsDisplay";

const showModals = (function () {
    
    // Opens Modal and adds required eventListeners to elements inside the modal
    const showAddOptions = function () {

        // Create dialog/ modal element
        createModal.createNewModal('add');
        createModal.createAddOptionsBtns();
        
        const addPromptModal = document.querySelector('dialog#add-prompt');
        const closeBtn = document.querySelector('button#close-add');
        const addOptionsBtns = document.querySelectorAll('div#add-options button');

        addPromptModal.showModal();

        // Add eventListener to close-add/ close modal button
        closeBtn.addEventListener('click', closeModal);

        // Add UX related event to add options buttons
        addOptionsBtns.forEach(btn => btn.addEventListener('click', modalUX.markAddOptionsBtn))

        // Opens modal with add new event form as default
        addEventForm.newEventForm('default');

        // Add additional event listeners upon show modal
        addEventForm.addEventFormEvent();
        addProjectForm.addProjectFormEvent();
    } 

    // Opens prompt before completing an event (start)
    const showEventCompletionPrompt = function () {
        const eventId = this.dataset.id;

        // Create prompt modal before completion
        createModal.createEventCompletionPrompt(eventId);

        const promptModal = document.querySelector('dialog#complete-event-prompt');
        const closeBtn = document.querySelector('button#close-complete-event');
        const dontCompleteBtn = document.querySelector('button[value="dont-complete"]');
        const completeBtn = document.querySelector('button[value="confirm-complete"]');

        promptModal.showModal();

        // Add eventListener to close-complete-event/ close modal button
        closeBtn.addEventListener('click', closeCompletion);

        // Add eventlistener to save and don't save buttons;
        dontCompleteBtn.addEventListener('click', closeCompletion);
       
        // Note: When user confirm completion confirmEventCompletion which
        // modifies event object, closes confirm modal then display new event full view
        completeBtn.addEventListener('click', confirmEventCompletion);
    }

    const confirmEventCompletion = function () {
        const eventId = this.dataset.id;

        // Modify event object
        memoryHandler.completeEvent(eventId);

        // Close Modal
        closeCompletion();

        // Display new event full view
        eventsDisplay.showFullEvent(eventId);

        console.log(memoryHandler.getEvents());
    }

    const closeCompletion = function () {
        // Closes modal
        const completionPromptModal = document.querySelector('dialog#complete-event-prompt');
        completionPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(completionPromptModal);
    }
    // Opens prompt before completing an event (end)

    // Show edit event form modal 
    const showEventEditModal = function (id) {
        const eventId = id;
        
        // Creates modal first before showing
        createModal.createNewModal('edit-event');
        const editModal = document.querySelector('dialog#edit-event-prompt');
        const modalCont = editModal.querySelector('div.modal-cont');
        const closeBtn = editModal.querySelector('button.close-modal');

        // Add Modal Banner
        const editBanner = createModal.createBanner('Edit Event');
        modalCont.appendChild(editBanner);

        // Add default event form and assign data-id
        addEventForm.newEventForm('edit-event');
        const editForm = document.querySelector('form#event-form');
        editForm.dataset.id = eventId;
        
        // Add close modal event listener
        closeBtn.addEventListener('click', closeEventEdit);

        // Show Modal created
        editModal.showModal();
    }

    // Closes event edit modal
    const closeEventEdit = function () {
        // Closes modal
        const editEventModal = document.querySelector('dialog#edit-event-prompt');
        editEventModal.close();

         // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(editEventModal);
    }

    // Show event delete prompt modal (start) - 
    const showEventDeletePrompt = function (id) {
        const eventId = id;

        // Create prompt modal before completion
        createModal.createEventDeletePrompt(eventId);

        const promptModal = document.querySelector('dialog#delete-event-prompt');
        const closeBtn = document.querySelector('button#close-delete-event');
        const dontDeleteBtn = document.querySelector('button[value="dont-delete"]');
        const deleteBtn = document.querySelector('button[value="confirm-delete"]');

        promptModal.showModal();

        // Add eventListener to close-delete-event/ close modal button
        closeBtn.addEventListener('click', closeEventDelete);

        // Add eventlistener to delete and don't delete buttons;
        dontDeleteBtn.addEventListener('click', closeEventDelete);
       
        // Note: When user confirm deletion confirmEventDeletion which
        // modifies event object, closes confirm modal then display new event preview
        deleteBtn.addEventListener('click', confirmEventDelete);
    }

    const confirmEventDelete = function () {
        const eventId = this.dataset.id;

        // Modify project object linked to this event
        const projectId = memoryHandler.getEvent(eventId).projectTag;
        memoryHandler.deleteEventFromProject(eventId, projectId);

        // Modify event object
        memoryHandler.deleteEvent(eventId);

        // Close Modal
        closeEventDelete();

        // Removes current event full view in the DOM
        displayContent.clearItemDisplay('event-fullview');

        // Change back button action
        // Note: Item display depends on where event full view was accessed
        // Note: since item display returns to previews page, back button dataset is changed

        const backBtn = document.querySelector('button#back-sidebar');

        if (this.hasAttribute('data-link')) {
            backBtn.dataset.action = 'project-fullview';
            backBtn.removeAttribute('data-mode');
            backBtn.removeAttribute('data-link');

            // Display project fullview
            projectsDisplay.showFullProject(this.dataset.link);

        } else {
            backBtn.dataset.action = 'events-previews';

            // Display events previews
            eventsDisplay.displayEventsToDOM();
        }

        // Execute onload/ sidebar counters
        onLoadScreen.displayEventsCount();

    }

    const closeEventDelete = function () {
        // Closes modal
        const deletePromptModal = document.querySelector('dialog#delete-event-prompt');
        deletePromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(deletePromptModal);
    }
    // Show event delete prompt modal (end) - 

    // Closes Modal, removes eventListeners to elements inside the modal then removes the modal in the DOM
    const closeModal = function () {
        // Removes form and event listeners from elements inside modal
        modalUX.removeModalUX();
        addEventForm.removeEventForm();

        // Closes modal
        const addPromptModal = document.querySelector('dialog#add-prompt');
        addPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(addPromptModal);
    }

    // Adds event listener to addButton
    const addButtonEvent = function () {
        const addButton = document.querySelector('button#add');
        addButton.addEventListener('click', showAddOptions);
    }

    // Add event listener to event completion button
    const addCompletionPromptEvent = function (button) {
        button.addEventListener('click', showEventCompletionPrompt);
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Opens prompt before completing an event (start)
    const showProjectCompletionPrompt = function () {
        const projectId = this.dataset.id;

        // Create prompt modal before completion
        createModal.createProjectCompletionPrompt(projectId);

        const promptModal = document.querySelector('dialog#complete-project-prompt');
        const closeBtn = document.querySelector('button#close-complete-project');
        const dontCompleteBtn = document.querySelector('button[value="dont-complete"]');
        const completeBtn = document.querySelector('button[value="confirm-complete"]');

        promptModal.showModal();

        // Add eventListener to close-complete-event/ close modal button
        closeBtn.addEventListener('click', closeProjectCompletion);

        // Add eventlistener to save and don't save buttons;
        dontCompleteBtn.addEventListener('click', closeProjectCompletion);
       
        // Note: When user confirm completion confirmProjectCompletion which
        // modifies event object, closes confirm modal then display new event full view
        completeBtn.addEventListener('click', confirmProjectCompletion);
    }

    const confirmProjectCompletion = function () {
        const projectId = this.dataset.id;

        // Modify event object
        memoryHandler.completeProject(projectId);

        // Close Modal
        closeProjectCompletion();

        // Display new event full view
        projectsDisplay.showFullProject(projectId);

        console.log(memoryHandler.getProjects());
    }

    const closeProjectCompletion = function () {
        // Closes modal
        const completionPromptModal = document.querySelector('dialog#complete-project-prompt');
        completionPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(completionPromptModal);
    }
    // Opens prompt before completing an event (end)





// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Add event listener to project completion button
    const addCompletionPromptProject = function (button) {
        button.addEventListener('click', showProjectCompletionPrompt);
    }

    return { addButtonEvent, 
            closeModal, 
            addCompletionPromptEvent, 
            showEventEditModal,
            closeEventEdit,
            showEventDeletePrompt,
        
            addCompletionPromptProject}
})();

export { showModals };