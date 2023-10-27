const closeModal = (function () {

    // Closes Modal, removes eventListeners to elements inside the modal then removes the modal in the DOM
    const closeAddModal = function () {
        // Closes modal
        const addPromptModal = document.querySelector('dialog#add-prompt');
        addPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(addPromptModal);
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


    return { closeAddModal, closeEventEdit }
})();

export { closeModal }