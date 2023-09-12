import { showModals } from "./showModals";

const eventDelete = (function () {
    const showDeletePrompt = function () {
        const eventId = this.dataset.id;

        // Show/ Display confirm delete prompt modal
        showModals.showEventDeletePrompt(eventId);

        // Add addtional datasets if event full view was accessed through project view
        const backBtn = document.querySelector('button#back-sidebar');
        const confirmDeleteBtn = document.querySelector('button.save');
         
        if (backBtn.hasAttribute('data-mode') && backBtn.hasAttribute('data-link')) {
            confirmDeleteBtn.dataset.mode = backBtn.dataset.mode;
            confirmDeleteBtn.dataset.link = backBtn.dataset.link;
        }

    }

    return {showDeletePrompt};
})();

export {eventDelete};