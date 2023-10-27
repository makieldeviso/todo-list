import { format } from 'date-fns';
import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";
import { eventsScript } from "./eventsScript";
import { contentMaker } from "./contentMaker";
import { eventFullView } from './eventFullView';

const eventsDisplay = (function () {

    // Event preview/ display  DOM maker
    const createEventDisplay = function (eventObj) {
        
        const newEvent = document.createElement('div');
        newEvent.setAttribute('class', 'event-preview');
        newEvent.setAttribute('data-id', `${eventObj.eventId}`);
        newEvent.dataset.status = eventObj.eventStatus;

        // Check pending if overdue
        const deadlineAlert = eventsScript.checkDeadline(eventObj.schedule);

        if (eventObj.eventStatus === 'pending' && deadlineAlert === 'overdue' ) {
            newEvent.dataset.status = 'overdue';
        } else {
            newEvent.dataset.status = eventObj.eventStatus;
        }

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const newMarker = contentMaker.createStatusMarker(eventObj);
        // (1) (end)-

        // (2) (start)-
        // Add indicator icon to classify as event or project. UI related
        const newIndicator = contentMaker.createIndicatorIcon('events');
        // (2) (end)-

        // (3-6) (start)-
        // Execute contentMaker.makeText and assign to variables  
        const newTitle = contentMaker.makeText('event-title', eventObj.title);
        const newDesc = contentMaker.makeText('event-desc', eventObj.description);
        const newProjTag = contentMaker.makeText('event-proj', eventsScript.getEventProjectTitle(eventObj));
        const newPrio = contentMaker.makeText('event-prio', eventObj.priority);
        // (3-6) (end)-

        // (7) (start)-
        const newSched = document.createElement('p');
        newSched.setAttribute('class', 'event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'MMM dd, yyyy');

        // Checks if event was already completed
        let deadlineTitleAttr;
        if (eventObj.completion === undefined) {
            contentMaker.createSpan(newSched, `sched-icon ${deadlineAlert}`, '');
            deadlineTitleAttr = deadlineAlert;
        } else {
            contentMaker.createSpan(newSched, `sched-icon ${eventObj.completion}`, '');
            deadlineTitleAttr = `${eventObj.completion} completion`;
        }

        contentMaker.createSpan(newSched, 'sched-date', dateString);
        const deadlineIcon = newSched.querySelector('span.sched-icon');
        deadlineIcon.setAttribute('title', formatting.toProper(deadlineTitleAttr));
        // (7) (end)-

        // (8) (start)-
        // Create task count p
        const newTaskCount = contentMaker.createTaskCounter(eventObj);
        // (8) (end)-

        // Append preview components to newEvent
        const components = [newMarker, newIndicator, newTitle, newDesc, newProjTag, newPrio, newSched, newTaskCount];
        components.forEach(comp => newEvent.appendChild(comp));

        // Add event listener to newEvent
        showFullEventToDOM(newEvent, true);

        return newEvent
    }

    const displayEventsToDOM = function () {
        const previewsCont = document.querySelector('div#previews-container');

        const events = memoryHandler.getEvents();
        // Sorts events for display from latest creation date to oldest
        const sortedEvents = events.toSorted((a, b) => b.creationDate - a.creationDate); 

        if (events.length !== 0) {
            sortedEvents.forEach(event => {
                const eventDisplay = createEventDisplay(event);
                previewsCont.appendChild(eventDisplay);
            });

        } else {
            const emptyNotif = contentMaker.createEmptyPreviews('events');
            previewsCont.appendChild(emptyNotif);
        }
    }

    const showFullEventToDOM = function (event, action) {
        const eventPreview = event;

        if (action === true) {
            eventPreview.addEventListener('click', eventFullView.showFullEvent);
        } else if (action === false) {
            eventPreview.removeEventListener('click', eventFullView.showFullEvent);
        }
    }

    return {displayEventsToDOM, createEventDisplay, showFullEventToDOM};
})();

export {eventsDisplay}