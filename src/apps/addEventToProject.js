import { memoryHandler } from "./memoryHandler";
import { eventsDisplay } from "./eventsDisplay";

const addEventToProject = (function () {
    let newProjectEvents = {};

    const resetProjectEvents = function () {
        newProjectEvents = {};
    }

    const getProjectEvents = function () {
        return newProjectEvents;
    }

    const getEventsCount = function () {
        const eventsCount = Object.keys(getProjectEvents()).length;
        return eventsCount;
    }

    const addEventsToDOM = function (obj) {
        const eventObj = obj;

        const eventsCont = document.querySelector('div#events-link-container');

        // Create new event container div
        const newEventCont = document.createElement('div');
        newEventCont.setAttribute('data-id', `${eventObj.eventId}`);
        newEventCont.setAttribute('class', 'event-link-project');

        // Create event preview
        // Note: this utilizes same function as event preview creator form eventsDisplay module
        const newEventPreview = eventsDisplay.createEventDisplay(eventObj);
        newEventPreview.classList.add('event-project');

        // Note: Remove showFullEvent linked function to newEventCont
        newEventPreview.removeEventListener('click', eventsDisplay.showFullEvent);

        //Create unlink button, then add eventListener
        const unlinkButton = document.createElement('button');
        unlinkButton.setAttribute('type', 'button');
        unlinkButton.setAttribute('class', 'unlink-event');
        unlinkButton.dataset.id = eventObj.eventId;
        unlinkButton.addEventListener('click', unlinkEvent);

        //Append components to newEventCont
        const components = [newEventPreview, unlinkButton];
        components.forEach(comp => newEventCont.appendChild(comp));

        // //Append newEventCont to eventsCont
        eventsCont.appendChild(newEventCont);
    }

    const addEvent = function () {
        const eventSelect = document.querySelector('select#add-event-select');
        
        // Check if value was selected or not
        if (eventSelect.value === '') {
            return;
        }

        const eventOption = eventSelect.querySelector(`option[value="${eventSelect.value}"]`);
        const defaultOption = eventSelect.querySelector('option[value=""]');

        const eventObj = memoryHandler.getEvents().find((event) => event.eventId === eventSelect.value );

        // Create an event identifier object
        // Save an event Id to an object
        newProjectEvents[`event-${getEventsCount() + 1}`] = eventSelect.value;

        // Disables the selected event from choices, the turn the select to default value
        defaultOption.selected = true;
        eventOption.disabled = true;

        addEventsToDOM(eventObj);
    }

    const unlinkEvent = function () {
        // Note: this data set is assigned to the close button in the DOM element creation
        const eventObjLink = this.dataset.id;

        const eventsCont = document.querySelector('div#events-link-container');
        const eventPreview = document.querySelector(`div[data-id="${eventObjLink}"].event-link-project`);
        const eventOption = document.querySelector(`option[value="${eventObjLink}"]`);

        // Save current events obj
        const currentEvents = getProjectEvents();

        const eventKeys = Object.keys(currentEvents);
        const remainingEvents = eventKeys.filter((key) => currentEvents[`${key}`] !== eventObjLink)

        // Create new eventsLink Obj based on remainingEvents
        const newEventObj = {}
        for (let i = 0; i < remainingEvents.length; i++) {
            newEventObj[`event-${i + 1}`] = currentEvents[`${remainingEvents[i]}`];
        }

        // Reassign newProjectEvents with new event object
        newProjectEvents = newEventObj;

        // Remove event preview from the DOM
        eventsCont.removeChild(eventPreview);

        // Reactivate option from the selection
        eventOption.disabled = false;
    }

    // Link new event to a project
    // const linkNewEvent = function (projId) {
    //     const projectId = projId;

    //     const 


    // }


    const addEventToProjectEvent = function (btn) {
        const adderBtn = btn;
        adderBtn.addEventListener('click', addEvent);
    }

    return {addEvent, addEventToProjectEvent, getProjectEvents, resetProjectEvents}

})();

export { addEventToProject }