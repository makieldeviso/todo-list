import { memoryHandler } from "./memoryHandler";
import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { formatting } from "./formatting";

const onLoadScreen = (function () {

    // Display counters for projects or events
    // Note: argument requires string (e.g. 'projects', 'events);
    const displayProjectEventCount = function (todoType) {
        const counter = document.querySelector(`p#${todoType}-count`);

        // format argument to proper (e.g. projects => Projects);
        const todoProper = formatting.toProper(todoType);
        const count = memoryHandler[`count${todoProper}`]();

        counter.textContent = `${count}`;
        counter.dataset.count = `${count}`;
    }

    // Display counters for time filter
    // Note: argument requires string (e.g. 'today', 'upcoming', 'someday');
    const displayTimeCount = function (timeFilter) {
        const counter = document.querySelector(`p#${timeFilter}-count`);
        const count = displayContentTimeFiltered.countTimeFiltered(`${timeFilter}`);
        counter.textContent = `${count}`;
        counter.dataset.count = `${count}`;
    }

    const loadCounters = function () {
        displayProjectEventCount('events');
        displayProjectEventCount('projects');
        displayTimeCount('today');   
        displayTimeCount('upcoming');
        displayTimeCount('someday');  
        displayTimeCount('overdue');    
    }

    const addOnLoadEvents = function () {
        window.addEventListener('load', loadCounters);
    }

    return {loadCounters,
            addOnLoadEvents,
        };
})();

export {onLoadScreen}