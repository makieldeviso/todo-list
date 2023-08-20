import { memoryHandler } from "./memoryHandler";
import { eventsDisplay } from "./eventsDisplay";
import { onLoadScreen } from "./onLoadScreen";
import { showModals } from "./showModals";

const eventDelete = (function () {
    const showDeletePrompt = function () {
        const eventId = this.dataset.id;

        // memoryHandler.deleteEvent(eventId);
        // onLoadScreen.displayEventsCount();

        // eventsDisplay.displayEventsToDOM();

        // Show/ Display confirm delete prompt modal
        showModals.showEventDeletePrompt(eventId);

    }

    return {showDeletePrompt};
})();

export {eventDelete};