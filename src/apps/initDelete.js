import { showModals } from "./showModals";
import { memoryHandler } from "./memoryHandler";

const initDelete = (function () {
    const showDeleteEventPrompt = async function () {
        const eventId = this.dataset.id;

        // Show/ Display confirm delete prompt modal
        // Then save delete button in variable
        // Note: uses promise as return value for showProjectDeletePrompt function
        const deleteBtn = await showModals.showEventDeletePrompt(eventId);

        // Add addtional datasets if event full view was accessed through project view
        const backBtn = document.querySelector('button#back-sidebar');
        const confirmDeleteBtn = document.querySelector('button.save');
         
        if (backBtn.hasAttribute('data-mode') && backBtn.hasAttribute('data-link')) {
            confirmDeleteBtn.dataset.mode = backBtn.dataset.mode;
            confirmDeleteBtn.dataset.link = backBtn.dataset.link;
        }

        const timeFilter = this.dataset.filter;
        if (timeFilter !== undefined) {
            deleteBtn.dataset.filter = timeFilter;
        }

    }

    const showDeleteProjectPrompt = async function () {
        const projectId = this.dataset.id;

        // Show/ Display confirm delete prompt modal
        // Then save delete button in variable
        // Note: uses promise as return value for showProjectDeletePrompt function
        const deleteBtn = await showModals.showProjectDeletePrompt(projectId);

        const timeFilter = this.dataset.filter;
        if (timeFilter !== undefined) {
            deleteBtn.dataset.filter = timeFilter;
        }

    }

    return {showDeleteEventPrompt, showDeleteProjectPrompt};
})();

export {initDelete};