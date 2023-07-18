import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";
import { eventsScript } from "./eventsScript";
import { format } from 'date-fns'

const eventsDisplay = (function () {

    const events = memoryHandler.getEvents();

    const test = function () {
        const sched = events[0].schedule;
        console.log(sched);
        console.log(typeof sched);

        const newSched = format(sched, "MMMM dd, yyyy");
        console.log(typeof newSched);
    }
    
    // Event preview/ display  DOM maker
    const createEventDisplay = function (eventObj) {
        
        const newEvent = document.createElement('div');
        newEvent.setAttribute('class', 'event-preview');
        newEvent.setAttribute('id', `${eventObj.eventId}`);
        newEvent.dataset.status = eventObj.eventStatus;

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const marker = document.createElement('div');
        marker.setAttribute('class', 'marker');
        // (1) (end)-

        // (2-5) (start)-
        // Reusable p text maker function
        const makeText = function (assignClass, text) {
            const newText = document.createElement('p');
            newText.setAttribute('class', assignClass);
            newText.textContent = text;

            if (assignClass === 'event-prio') {
                newText.classList.add(`${text}`);
                newText.textContent = formatting.toProper(text);
            }
        }

        // Execute makeText and assign to variables
        const newTitle = makeText('event-title', eventObj.title);
        const newDesc = makeText('event-desc', eventObj.description);
        const newProjTag = makeText('event-proj', eventObj.projectTag);
        const newPrio = makeText('event-prio', eventObj.priority);
        // (2-5) (end)-

        // (6) (start)-
        // Reusable create and append span to newTaskCount function
        const createSpan = function (parentP, assignClass, text) {
            const newSpan = document.createElement('span');
            newSpan.setAttribute('class', assignClass);
            newSpan.textContent = text;

            parentP.appendChild(newSpan);
        }

        const newSched = document.createElement('p');
        newSched.setAttribute('class', 'event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'MMMM dd, yyyy');

        createSpan(newSched, 'sched-icon', '');
        createSpan(newSched, 'sched-date', dateString);
        // (6) (end)-

        // (7) (start)-
        // Create task count p
        const newTaskCount = document.createElement('p');
        newTaskCount.setAttribute('class', 'event-task-count');

        const tasks = eventObj.tasks; // this is Object
        const remaining = eventsScript.countRemainingTasks(tasks);
        const total = eventsScript.countTasksOfEvent(tasks);

        // Execute create span with already available data
        createSpan(newTaskCount, 'remain', `${remaining}`);
        createSpan(newTaskCount, 'slash', '/');
        createSpan(newTaskCount, 'total', `${total}`);
        createSpan(newTaskCount, 'label', 'tasks');
        // (7) (end)-



        
    }


    return {test, createEventDisplay}
})();

export {eventsDisplay}