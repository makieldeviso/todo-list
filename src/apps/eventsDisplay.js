import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";
import { eventsScript } from "./eventsScript";
import { format } from 'date-fns'
import { displayContent } from "./displayContent";
import { createModal } from "./createModal";
import { showModals } from "./showModals";
import { eventEditForm } from "./eventEditForm";

const eventsDisplay = (function () {

    const test = function () {
        // const events = memoryHandler.getEvents();
        // console.log(events);
        // // console.log(document.querySelector('div#item-display'))
        // console.log(displayEventsToDOM());
    }

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

    // Reusable create and append span to newTaskCount function
    const createSpan = function (parentP, assignClass, text) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', assignClass);
        newSpan.textContent = text;

        parentP.appendChild(newSpan);
    }

    // Reusable task counter creator function
    const createTaskCounter = function (event) {
        const newTaskCounter = document.createElement('p');
        newTaskCounter.setAttribute('class', 'event-task-count pending');
        newTaskCounter.dataset.id = event.eventId;

        const tasks = event.tasks; // this is Object
        const done = eventsScript.countDoneTasks(tasks);
        const total = eventsScript.countTasksOfEvent(tasks);

        createSpan(newTaskCounter, 'done', `${done}`);
        createSpan(newTaskCounter, 'slash', '/');
        createSpan(newTaskCounter, 'total', `${total}`);
        createSpan(newTaskCounter, 'label', 'tasks');

        if (done === total) {
            newTaskCounter.classList.remove('pending');
            newTaskCounter.classList.add('done');
        } 

        return newTaskCounter;
    }

    // Changes status of task of an event
    // Note: Event listener linked function
    const changeTaskStatus = function () {
        const eventId = this.dataset.id;
        const taskNumber = this.dataset.number;
        let newValue;

        // Toggles task status
        if (this.value === 'pending') {
            newValue = 'done';
            this.value = newValue;
        } else {
            newValue = 'pending';
            this.value = newValue;
        }

        const eventTasks = memoryHandler.getEventTasks(eventId);

        // Changes memory of event 
        memoryHandler.changeTaskStatus(eventId, taskNumber, newValue);

        // Active change of task counter
        const counter = document.querySelector(`div.fullview.tasks-list p.event-task-count[data-id="${eventId}"]`);
        const counterDone = counter.querySelector('span.done');
          
        const countDone = eventsScript.countDoneTasks(eventTasks);
        counterDone.textContent = `${countDone}`;

        if (eventsScript.tasksCompleted(eventTasks)) {
            counter.classList.add('done');
        } else {
            counter.classList.remove('done');
        }

        console.log(memoryHandler.getEvents());
    }

    // Event Full View Maker
    const createEventFullView = function (eventObj) {
        // Create edit button appended on the action buttons ribbon (start) -
        const actionRibbon = document.querySelector('div#action-btns');

        // Ensures no existing action buttons
        const existingEditBtn = document.querySelector('button[value="edit-event"]');
        if (existingEditBtn !== null) {
            displayContent.removeActionBtn(existingEditBtn);
        }

        // Conditional don't add edit button if event is completed
        if (eventObj.eventStatus !== 'done') {
            const editEventBtn = document.createElement('button');
            editEventBtn.setAttribute('class', 'action-btn edit');
            editEventBtn.setAttribute('value', 'edit-event');
            editEventBtn.dataset.id = eventObj.eventId;
            editEventBtn.addEventListener('click', eventEditForm.showEditEventForm);

            createSpan(editEventBtn, 'icon', '');
            createSpan(editEventBtn, 'text', 'Edit');

            actionRibbon.appendChild(editEventBtn);
        }
        // Create edit button appended on the action buttons ribbon (end) -

        // Create event full view container
        const newFullEvent = document.createElement('div');
        newFullEvent.setAttribute('class', "event-fullview");
        newFullEvent.dataset.id = eventObj.eventId;
        newFullEvent.dataset.status = eventObj.eventStatus;

        // Create status marker
        const statusMarker = document.createElement('div');
        statusMarker.setAttribute('class', 'event-status');

        // Create event title, description, project
        const title = makeText('fullview event-title', eventObj.title);

        const descLabel = makeText('fullview desc-label label ', 'Description:');
        const desc = makeText('fullview event-desc', eventObj.description);

        const projLabel = makeText('fullview proj-label label', 'Project:');
        const proj = makeText('fullview event-proj', eventObj.projectTag);

        const prio = makeText('event-prio', eventObj.priority);
        prio.classList.add('fullview');

        // Create sched (start) --
        const schedLabel = makeText('fullview sched-label label', 'Schedule:');
        const sched = document.createElement('p');
        sched.setAttribute('class', 'fullview event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'ccc, MMM dd, yyyy');

        createSpan(sched, 'sched-icon', '');
        createSpan(sched, 'sched-date', dateString);
         // Create sched (end) --

        // Create tasks list (start) --
        const tasksListCont = document.createElement('div');
        tasksListCont.setAttribute('class', 'fullview tasks-list');

        // Create Task list header container, label and counter
        const taskHeader = document.createElement('div');
        taskHeader.setAttribute('class', 'task-header');

        const taskLabel = makeText('task-label', 'Tasks');
        const taskCounter = createTaskCounter(eventObj);

        // Append label and counter to task header
        taskHeader.appendChild(taskLabel);
        taskHeader.appendChild(taskCounter);

        // Append tasks header to task list container
        tasksListCont.appendChild(taskHeader);

        // Create Individual task
        const eventTasks = eventObj.tasks // This is an object
        const taskKeys = Object.keys(eventTasks) //Array of keys

        const tasksArray = taskKeys.map(key => {
            // Note: key is string e.g. task-1, task-2
            const taskObj = eventTasks[key]; // this is the object for individual task

            const taskCont = document.createElement('div');
            taskCont.setAttribute('class', 'task');
            
            const checkBtn = document.createElement('button');
            checkBtn.setAttribute('class', 'check');
            checkBtn.setAttribute('value', taskObj.status);

            // Conditional if event is not yet done, add eventlistener to tasks
            if (eventObj.eventStatus !== 'done') {
                checkBtn.addEventListener('click', changeTaskStatus);
            }

            const taskText = makeText('task', taskObj.task);
            
            // Add data attributes to the components
            const components = [taskCont, checkBtn, taskText];
            components.forEach(comp => {
                comp.dataset.id = eventObj.eventId;
                comp.dataset.number = key;
            });

            // Appends other components to the taskCont
            for (let i = 1; i < components.length; i++) {
                components[0].appendChild(components[i]);
            }

            return taskCont;
        });

        // Append individual tasks to the tasksListCont
        tasksArray.forEach(task => tasksListCont.appendChild(task));

        // Create tasks list (end) --

        // Create action btns (start) --
        const actionBtnsCont = document.createElement('div');
        actionBtnsCont.setAttribute('class', 'event-action');

        if (eventObj.eventStatus !== 'done') {
            const completeBtn = document.createElement('button');
            completeBtn.dataset.id = eventObj.eventId;
            completeBtn.setAttribute('value', 'complete-event');
            completeBtn.textContent = 'Complete Event';

            // Add event listener through module
            // Note: modal activities here
            showModals.addCompletionPromptEvent(completeBtn);

            actionBtnsCont.appendChild(completeBtn);
        } else {
            const message = document.createElement('p');
            message.setAttribute('class', 'message');
            

            if (eventsScript.tasksCompleted(eventObj.tasks)) {
                message.innerHTML = 'You have completed this event.<br/>Well Done!';
            } else {
                message.innerHTML = 'You have completed this event without accomplishing all tasks.<br/>Living dangerously, are we?'
            }

            actionBtnsCont.appendChild(message);
        }

        // Create action btns (end) --

        // Note: components must be arranged according to order inside the array
        const fullviewComponents = [statusMarker, title, descLabel, desc, projLabel, proj, schedLabel, sched, prio, tasksListCont, actionBtnsCont];
        fullviewComponents.forEach(component => newFullEvent.appendChild(component));

        return newFullEvent;
    }
    
    // Event preview/ display  DOM maker
    const createEventDisplay = function (eventObj) {
        
        const newEvent = document.createElement('div');
        newEvent.setAttribute('class', 'event-preview');
        newEvent.setAttribute('data-id', `${eventObj.eventId}`);
        newEvent.dataset.status = eventObj.eventStatus;

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const newMarker = document.createElement('div');
        newMarker.setAttribute('class', 'marker');
        // (1) (end)-

        // (2-5) (start)-
        // Execute makeText and assign to variables
        const newTitle = makeText('event-title', eventObj.title);
        const newDesc = makeText('event-desc', eventObj.description);
        const newProjTag = makeText('event-proj', eventObj.projectTag);
        const newPrio = makeText('event-prio', eventObj.priority);
        // (2-5) (end)-

        // (6) (start)-
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
        const newTaskCount = createTaskCounter(eventObj);
        // (7) (end)-

        // Append preview components to newEvent
        const components = [newMarker, newTitle, newDesc, newProjTag, newPrio, newSched, newTaskCount];
        components.forEach(comp => newEvent.appendChild(comp));

        // Add event listener to newEvent
        showFullEventToDOM(newEvent, true);

        return newEvent
    }

    
    const showFullEvent = function (trigger) {
        // Conditional to enable non-eventlistener trigger
        // If trigger is string means non-eventlistener
        let previewId;
        if (typeof trigger === 'string') {
            previewId = trigger
        } else {
            previewId = this.dataset.id;
        }

        const itemDisplay = document.querySelector('div#item-display');

        // Clear display panel
        const eventPreviews = document.querySelectorAll('div.event-preview');
        eventPreviews.forEach(preview => displayContent.removeDisplay(preview));
        
        // Ensures the event full view is refreshed when changes is applied
        const eventFullViews = document.querySelectorAll('div.event-fullview');
        eventFullViews.forEach(fullview => displayContent.removeDisplay(fullview));

        // Add attribute to back-button
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.dataset.action = 'event-fullview';

        //  Get event with the Id specified
        const event = memoryHandler.getEvent(previewId);

        // Create event full view
        const eventFullView = createEventFullView(event);
        itemDisplay.appendChild(eventFullView);

    }

    const displayEventsToDOM = function () {
        const itemDisplay = document.querySelector('div#item-display');
        const eventDisplays = document.querySelectorAll('div.event-preview');
        const eventsInDOMArray = Array.from(eventDisplays);

        // Empty display before appending new set
        eventsInDOMArray.forEach(event => displayContent.removeDisplay(event));

        const events = memoryHandler.getEvents();

        events.forEach(event => {
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

    return {test, displayEventsToDOM, showFullEvent};
})();

export {eventsDisplay}