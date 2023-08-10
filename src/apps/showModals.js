import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { modalUX } from "./modalUX";
import { addProjectForm } from "./addProjectForm";
import { memoryHandler } from "./memoryHandler";
import { eventsDisplay } from "./eventsDisplay";

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
    const showEventEditModal = function (id, obj) {
        const eventId = id;
        const eventObj = obj;
        
        console.log(eventId);
        console.log(eventObj);

        // Creates modal first before showing
        createModal.createNewModal('edit-event');
        const editModal = document.querySelector('dialog#edit-event-prompt');
        const modalCont = editModal.querySelector('div.modal-cont');
        const closeBtn = editModal.querySelector('button.close-modal');

        // Add Modal Banner
        const editBanner = createModal.createBanner('Edit Event');
        modalCont.appendChild(editBanner);

        // Add default event form
        addEventForm.newEventForm('edit-event');
        
        // Add close modal event listener
        closeBtn.addEventListener('click', closeEventEdit);


        // Show Modal created
        editModal.showModal();


    }

    // Closes event edit modal
    const closeEventEdit = function () {
        const editEventModal = document.querySelector('dialog#edit-event-prompt');
        editEventModal.close();
    }


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

    return { addButtonEvent, closeModal, addCompletionPromptEvent, showEventEditModal }
})();

export { showModals };