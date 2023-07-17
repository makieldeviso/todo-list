import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";

const eventsDisplay = (function () {

    const events = memoryHandler.getEvents();

    const test = function () {
        console.log(events);
    }
    
    const createEventDisplay = function (eventObj) {
        
        const newEvent = document.createElement('div');
        newEvent.setAttribute('class', 'event-preview');
        newEvent.setAttribute('id', `${eventObj.eventId}`);

        const makeText = function (assignClass, text) {
            const newText = document.createElement('p');
            newText.setAttribute('class', assignClass);
            newText.textContent = text;

            if (assignClass === 'event-prio') {
                newText.classList.add(`${text}`);
                newText.textContent = formatting.toProper(text);
            }
        }

        const newTitle = makeText('event-title', eventObj.title);
        const newDesc = makeText('event-desc', eventObj.description);
        const newProjTag = makeText('event-proj', eventObj.projectTag);
        const newPrio = makeText('event-prio', eventObj.priority);

        const taskCount = document.createElement('p');
        taskCount.setAttribute('class', 'event-task-count');

    }


    return {test}
})();

export {eventsDisplay}