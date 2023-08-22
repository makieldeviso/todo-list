import { memoryHandler } from "./memoryHandler";


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

    const createEventObj = function () {
    }

    const addEventsToDOM = function (obj) {
        const eventObj = obj;

        const eventsCont = document.querySelector('div#events-container');

        // Create new event container div
        const newEventCont = document.createElement('div');
        newEventCont.setAttribute('data-id', 'event-1');
        newEventCont.setAttribute('class', 'event-link-project');

        // Create icon
        const eventIcon = document.createElement('div');
        eventIcon.setAttribute('class', 'event-icon');

        // Create event title
        const eventTitle = document.createElement('p');
        eventTitle.setAttribute('class','project-event');
        eventTitle.textContent = eventObj.title;
        
        //Create unlink button
        const unlinkButton = document.createElement('button');
        unlinkButton.setAttribute('type', 'button');
        unlinkButton.setAttribute('class', 'unlink-event');
        unlinkButton.dataset.id = eventObj.eventId;

        //Append components to newEventCont
        const components = [eventIcon, eventTitle, unlinkButton];
        components.forEach(comp => newEventCont.appendChild(comp));

        //Append newEventCont to eventsCont
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
        newProjectEvents[`event-${getEventsCount() + 1}`] = eventSelect.value;
        console.log(getProjectEvents());

        // Disables the selected event from choices, the turn the select to default value
        defaultOption.selected = true;
        eventOption.disabled = true;


        addEventsToDOM(eventObj);
    }

    const addEventToProjectEvent = function (btn) {
        const adderBtn = btn;
        adderBtn.addEventListener('click', addEvent);
    }

    return {addEvent, addEventToProjectEvent}

})();

export { addEventToProject }