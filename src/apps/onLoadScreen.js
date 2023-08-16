import { memoryHandler } from "./memoryHandler";


const onLoadScreen = (function () {

    const displayEventsCount = function () {
        const eventsCounter = document.querySelector('p#events-count');
        const eventsCount = memoryHandler.countEvents();

        eventsCounter.textContent = `${eventsCount}`;
    }

    const addOnLoadEvents = function () {
        window.addEventListener('load', displayEventsCount);
    }
    

    return {displayEventsCount, addOnLoadEvents};
})();

export {onLoadScreen}