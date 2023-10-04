import { memoryHandler } from "./memoryHandler";
import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { displayContentPriorityFiltered } from "../displayContentPriorityFiltered";
import { formatting } from "./formatting";
import { format, formatDistance } from 'date-fns'

const onLoadScreen = (function () {
    // Display current date info
    const displayDate = function () {
        // Note: create object with selector as keys and date units in string as value
        // Then reiterate over the obj properties using for in.. to assign text contents to the DOM
        const dateObj = {}
        const addDateProp = function (unit, formatter) {
            dateObj[unit] = format(new Date(), `${formatter}`);
        }

        addDateProp('month', 'MMM');
        addDateProp('day', 'dd');
        addDateProp('year', 'yyyy');
        addDateProp('weekday', 'EEEE');

        for (const unit in dateObj) {
            const dateText = document.querySelector(`span#banner-${unit}`);
            dateText.textContent = dateObj[unit];
        }
    }

    // Display counters for projects or events
    // Note: argument requires string (e.g. 'projects', 'events);
    const displayProjectEventCount = function (todoType) {

        const todoTypes = ['events', 'projects'];
        todoTypes.forEach(type => {
            const counter = document.querySelector(`p#${type}-count`);

            // format argument to proper (e.g. projects => Projects);
            const todoProper = formatting.toProper(type);
            const count = memoryHandler[`count${todoProper}`]();

            counter.textContent = `${count}`;
            counter.dataset.count = `${count}`;
        });
    }

    // Display counters for time filter
    // Note: argument requires string (e.g. 'today', 'upcoming', 'someday');
    const displayTimeCount = function () {
        const timeConditions = ['today', 'upcoming', 'someday', 'overdue'];
        timeConditions.forEach(time => {
            const counter = document.querySelector(`p#${time}-count`);
            const count = displayContentTimeFiltered.countTimeFiltered(`${time}`);
            counter.textContent = `${count}`;
            counter.dataset.count = `${count}`;
        });
    }

    // Display counters for time filter
    // Note: argument requires string (e.g. 'today', 'upcoming', 'someday');
    const displayPriorityCount = function () {
        const priorities = ['high', 'mid', 'low'];
        priorities.forEach(prio => {
            const counter = document.querySelector(`p#${prio}-count`);
            const count = displayContentPriorityFiltered.countPriorityFiltered(`${prio}`);
            counter.textContent = `${count}`;
            counter.dataset.count = `${count}`;
        });
    }

    const loadCounters = function () {
        displayDate();
        displayProjectEventCount();
        displayTimeCount();   
        displayPriorityCount();   
    }

    const addOnLoadEvents = function () {
        window.addEventListener('load', loadCounters);
    }

    return {loadCounters,
            addOnLoadEvents,
        };
})();

export {onLoadScreen}