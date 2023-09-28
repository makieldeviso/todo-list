import { memoryHandler } from "./memoryHandler";
import { displayContentTimeFiltered } from "../displayContentTimeFiltered";


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

    // Display counters for time filter
    // Note: argument requires string (e.g. 'today', 'upcoming', 'someday');
    const displayTimeCount = function (timeFilter) {
        const counter = document.querySelector(`p#${timeFilter}-count`);
        const count = displayContentTimeFiltered.countTimeFiltered(`${timeFilter}`);
        counter.textContent = `${count}`;
    }

    const loadCounters = function () {
        displayEventsCount();
        displayProjectsCount();
        displayTimeCount('today');   
        displayTimeCount('upcoming');
        displayTimeCount('someday');     
    }

    const addOnLoadEvents = function () {
        window.addEventListener('load', loadCounters);
    }

    return {loadCounters,
            addOnLoadEvents,
        };
})();

export {onLoadScreen}