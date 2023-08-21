import { memoryHandler } from "./memoryHandler";


const addEventToProject = (function () {

    const addEventsToDOM = function (obj) {
        const eventObj = obj;

        console.log(eventObj);
    }

    const addEvent = function () {
        const eventSelect = document.querySelector('select#add-event-select');

        // Check if value was selected or not
        if (eventSelect.value === '') {
            return;
        }

        const eventObj = memoryHandler.getEvents().find((event) => event.eventId === eventSelect.value );

        addEventsToDOM(eventObj);
    }

    const addEventToProjectEvent = function (btn) {
        const adderBtn = btn;
        adderBtn.addEventListener('click', addEvent);
    }

    return {addEvent, addEventToProjectEvent}

})();

export { addEventToProject }