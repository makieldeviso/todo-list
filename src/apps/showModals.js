import { modalUX } from "./modalUX";

const showModals = (function () {

    // Opens Modal and adds required eventListeners to elements inside the modal
    const showAddOptions = function () {
        const addPromptModal = document.querySelector('dialog#add-prompt');
        const closeBtn = document.querySelector('button#close-add');

        addPromptModal.showModal();

        // Add eventListener to close-add/ close modal button
        closeBtn.addEventListener('click', closeModal);

        // Add additional event listeners upon show modal
        modalUX.addModalUX();
    } 

    // Closes Modal and removes eventListeners to elements inside the modal
    const closeModal = function () {
        // Removes event listeners from elements inside modal
        modalUX.removeModalUX();

        // Closes modal
        const addPromptModal = document.querySelector('dialog#add-prompt');
        addPromptModal.close();
    }

    // Adds event listener to addButton
    const addButtonEvent = function () {
        const addButton = document.querySelector('button#add');
        addButton.addEventListener('click', showAddOptions);
    }

    
    return { addButtonEvent }
})();

export { showModals };