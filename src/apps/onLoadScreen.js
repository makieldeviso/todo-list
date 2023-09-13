import { memoryHandler } from "./memoryHandler";


const onLoadScreen = (function () {

    const displayEventsCount = function () {
        const eventsCounter = document.querySelector('p#events-count');
        const eventsCount = memoryHandler.countEvents();
        eventsCounter.textContent = `${eventsCount}`;
    }

    const displayProjectsCount = function () {
        const projectsCounter = document.querySelector('p#projects-count');
        const projectsCount = memoryHandler.countProjects();
        projectsCounter.textContent = `${projectsCount}`;
    }

    const addOnLoadEvents = function () {
        window.addEventListener('load', displayEventsCount);
        window.addEventListener('load', displayProjectsCount);
    }
    

    return {displayEventsCount,
            displayProjectsCount,
            addOnLoadEvents};
})();

export {onLoadScreen}