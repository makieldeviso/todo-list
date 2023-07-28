import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";
import { eventsScript } from "./eventsScript";
import { format } from 'date-fns'
import { displayContent } from "./displayContent";

const eventsDisplay = (function () {

    const test = function () {
        const events = memoryHandler.getEvents();
        console.log(events);
        // console.log(document.querySelector('div#item-display'))
        console.log(displayEventsToDOM());
    }
    
    // Event preview/ display  DOM maker
    const createEventDisplay = function (eventObj) {
        
        const newEvent = document.createElement('div');
        newEvent.setAttribute('class', 'event-preview');
        newEvent.setAttribute('data-id', `${eventObj.eventId}`);
        newEvent.dataset.status = eventObj.eventStatus;

        console.log(newEvent);

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const newMarker = document.createElement('div');
        newMarker.setAttribute('class', 'marker');
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

            return newText;
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
        const dateString = format(eventObj.schedule, 'MMM dd, yyyy');

        createSpan(newSched, 'sched-icon', '');
        createSpan(newSched, 'sched-date', dateString);
        // (6) (end)-

        // (7) (start)-
        // Create task count p
        const newTaskCount = document.createElement('p');
        newTaskCount.setAttribute('class', 'event-task-count');

        const tasks = eventObj.tasks; // this is Object
        const done = eventsScript.countDoneTasks(tasks);
        const total = eventsScript.countTasksOfEvent(tasks);

        // Execute create span with already available data
        createSpan(newTaskCount, 'done', `${done}`);
        createSpan(newTaskCount, 'slash', '/');
        createSpan(newTaskCount, 'total', `${total}`);
        createSpan(newTaskCount, 'label', 'tasks');
        // (7) (end)-

        // Append preview components to newEvent
        const components = [newMarker, newTitle, newDesc, newProjTag, newPrio, newSched, newTaskCount];
        components.forEach(comp => newEvent.appendChild(comp));

        // Add event listener to newEvent
        showFullEventToDOM(newEvent, true);

        return newEvent
    }

    const showFullEvent = function () {
        const previewId = this.dataset.id;
        const itemDisplay = document.querySelector('div#item-display');

        // Clear display panel
        const eventPreviews = document.querySelectorAll('div.event-preview');
        eventPreviews.forEach(preview => displayContent.removeDisplay(preview));

        //  Get event with the Id specified
        const event = memoryHandler.getEvent(previewId);
        console.log(event);


    }

    const displayEventsToDOM = function () {
        const itemDisplay = document.querySelector('div#item-display');
        const eventDisplays = document.querySelectorAll('div.event-preview');
        const eventsInDOMArray = Array.from(eventDisplays);

        // Empty display before appending new set
        eventsInDOMArray.forEach(event => displayContent.removeDisplay(event));

        const events = memoryHandler.getEvents();

        events.forEach(event => {
            console.log(event);

            const eventDisplay = createEventDisplay(event);
            itemDisplay.appendChild(eventDisplay);
        });
    }

    const showFullEventToDOM = function (event, action) {
        const eventPreview = event;

        if (action === true) {
            eventPreview.addEventListener('click', showFullEvent);
        } else if (action === false) {
            eventPreview.removeEventListener('click', showFullEvent);
        }
    }

    return {test, displayEventsToDOM};
})();

export {eventsDisplay}