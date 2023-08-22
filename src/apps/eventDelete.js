import { showModals } from "./showModals";

const eventDelete = (function () {
    const showDeletePrompt = function () {
        const eventId = this.dataset.id;

        // Show/ Display confirm delete prompt modal
        showModals.showEventDeletePrompt(eventId);

    }

    return {showDeletePrompt};
})();

export {eventDelete};