import { modalUX } from "./modalUX";

const showModals = (function () {

    const showAddOptions = function () {
        const addPromptModal = document.querySelector('dialog#add-prompt');
        addPromptModal.showModal();

        // Add additional event listeners upon show modal
        modalUX.addPriorityButtonEvent();
    } 

    const addButtonEvent = function () {
        const addButton = document.querySelector('button#add');
        addButton.addEventListener('click', showAddOptions);
    }

    
    return { showAddOptions, addButtonEvent }
})();

export { showModals };