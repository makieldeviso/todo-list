import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { modalUX } from "./modalUX";
import { addProjectForm } from "./addProjectForm";
import { saveFormValues } from "./saveFormValues";

const showModals = (function () {
    
    // Opens Modal and adds required eventListeners to elements inside the modal
    const showAddOptions = function () {

        // Create dialog/ modal element
        createModal.createNewModal('add');
        createModal.createAddOptionsBtns();
        
        const addPromptModal = document.querySelector('dialog#add-prompt');
        const closeBtn = document.querySelector('button#close-add');

        addPromptModal.showModal();

        // Add eventListener to close-add/ close modal button
        closeBtn.addEventListener('click', closeModal);

        // Opens modal with add new event form as default
        addEventForm.newEventForm();

        // Add additional event listeners upon show modal
        addEventForm.addEventFormEvent();
        addProjectForm.addProjectFormEvent();

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

    const saveEvent = function () {

    }


    // Adds event listener to addButton
    const addButtonEvent = function () {
        const addButton = document.querySelector('button#add');
        addButton.addEventListener('click', showAddOptions);
    }

    return { addButtonEvent }
})();

export { showModals };