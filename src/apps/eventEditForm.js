import { memoryHandler } from "./memoryHandler";
import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { showModals } from "./showModals";

const eventEditForm = (function () {
    
    // const addEditEventForm = function () {

    // }

    const showEditEventForm = function () {
        const eventId = this.dataset.id;
        const eventObj = memoryHandler.getEvent(eventId);

        // Note: pass eventId and eventObj as argument to showModals module
        showModals.showEventEditModal(eventId, eventObj);

    }



    return {showEditEventForm}
})();

export {eventEditForm}