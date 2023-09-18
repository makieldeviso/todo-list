import { showModals } from "./showModals";
import { memoryHandler } from "./memoryHandler";

const initDelete = (function () {
    const showDeleteEventPrompt = function () {
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

    const showDeleteProjectPrompt = function () {
        const projectId = this.dataset.id;

        // Show/ Display confirm delete prompt modal
        showModals.showProjectDeletePrompt(projectId);


        // memoryHandler.deleteProject(projectId);
    }

    return {showDeleteEventPrompt, showDeleteProjectPrompt};
})();

export {initDelete};