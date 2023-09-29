import { memoryHandler } from "./memoryHandler";
import { formatting } from "./formatting";
import { eventsScript } from "./eventsScript";
import { projectsScripts } from "./projectsScripts";
import { format } from 'date-fns';
import { displayContent } from "./displayContent";
import { createModal } from "./createModal";
import { showModals } from "./showModals";
import { eventEditForm } from "./eventEditForm";
import { initDelete } from "./initDelete";

const eventsDisplay = (function () {

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

    // Reusable task counter creator function
    const createTaskCounter = function (event) {
        const newTaskCounter = document.createElement('p');
        newTaskCounter.setAttribute('class', 'event-task-count pending');
        newTaskCounter.dataset.id = event.eventId;

        const tasks = event.tasks; // this is Object
        const done = eventsScript.countDoneTasks(tasks);
        const total = eventsScript.countTasksOfEvent(tasks);

        displayContent.createSpan(newTaskCounter, 'done', `${done}`);
        displayContent.createSpan(newTaskCounter, 'slash', '/');
        displayContent.createSpan(newTaskCounter, 'total', `${total}`);
        displayContent.createSpan(newTaskCounter, 'label', 'tasks');

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
        console.log(eventObj);
        const actionRibbon = document.querySelector('div#action-btns');

        // Ensures no existing action buttons
        const existingEditBtn = document.querySelector('button[value="edit-event"]');
        const existingDeleteBtn = document.querySelector('button[value="delete-event"]');

        displayContent.removeActionBtn(existingEditBtn, existingDeleteBtn);
        
        // Conditional don't add edit button if event is completed
        if (eventObj.eventStatus !== 'done') {
            displayContent.createActionBtn('edit', 'edit-event', eventObj.eventId, eventEditForm.showEditEventForm, 'Edit');
        }
        // Create edit button appended on the action buttons ribbon (end) -

        // Create delete button appended on the action buttons ribbon (start) -
        displayContent.createActionBtn('delete', 'delete-event', eventObj.eventId, initDelete.showDeleteEventPrompt, 'Delete');
        // Create delete button appended on the action buttons ribbon (end) -

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
        const proj = makeText('fullview event-proj', eventsScript.getEventProjectTitle(eventObj));

        const prio = makeText('event-prio', eventObj.priority);
        prio.classList.add('fullview');

        // Create sched (start) --
        const schedLabel = makeText('fullview sched-label label', 'Schedule:');
        const sched = document.createElement('p');
        sched.setAttribute('class', 'fullview event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'ccc, MMM dd, yyyy');

        displayContent.createSpan(sched, 'sched-icon', '');
        displayContent.createSpan(sched, 'sched-date', dateString);
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
        const newMarker = displayContent.createStatusMarker(eventObj);
        // (1) (end)-

        // (2) (start)-
        // Add indicator icon to classify as event or project. UI related
        const newIndicator = displayContent.createIndicatorIcon('events');
        // (2) (end)-

        // (3-6) (start)-
        // Execute makeText and assign to variables  
        const newTitle = makeText('event-title', eventObj.title);
        const newDesc = makeText('event-desc', eventObj.description);
        const newProjTag = makeText('event-proj', eventsScript.getEventProjectTitle(eventObj));
        const newPrio = makeText('event-prio', eventObj.priority);
        // (3-6) (end)-

        // (7) (start)-
        const newSched = document.createElement('p');
        newSched.setAttribute('class', 'event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'MMM dd, yyyy');
        const deadlineAlert = eventsScript.checkDeadline(eventObj.schedule);

        // Checks if event was already completed
        if (eventObj.completion === undefined) {
            displayContent.createSpan(newSched, `sched-icon ${deadlineAlert}`, '');
        } else {
            displayContent.createSpan(newSched, `sched-icon ${eventObj.completion}`, '');
        }

        displayContent.createSpan(newSched, 'sched-date', dateString);
        // (7) (end)-

        // (8) (start)-
        // Create task count p
        const newTaskCount = createTaskCounter(eventObj);
        // (8) (end)-

        // Append preview components to newEvent
        const components = [newMarker, newIndicator, newTitle, newDesc, newProjTag, newPrio, newSched, newTaskCount];
        components.forEach(comp => newEvent.appendChild(comp));

        // Add event listener to newEvent
        showFullEventToDOM(newEvent, true);

        return newEvent
    }

    
    const showFullEvent = function (trigger) {
        const itemDisplay = document.querySelector('div#item-display');
        const backBtn = document.querySelector('button#back-sidebar');

        // Conditional to enable non-eventlistener trigger
        // If trigger is string means non-eventlistener
        
        let previewId;
        let timeFiltered = false;
        if (typeof trigger === 'string') {
            previewId = trigger

        } else {
            previewId = this.dataset.id;

            // If event fullview is accessed through the project view'
            if (this.dataset.mode === 'project-view') {
                const projectFullView = document.querySelector('div.project-fullview');
                itemDisplay.removeChild(projectFullView);
                
                // Adds additional data set to the back button
                backBtn.dataset.mode = this.dataset.mode;

                // Add an id link of the project to the back button
                backBtn.dataset.link = eventsScript.getProperty(previewId, 'projectTag');

                // Remove buttons in the ribbon
                const editBtn = document.querySelector('button[value="edit-project"]');
                const deleteBtn = document.querySelector('button[value="delete-project"]');
                displayContent.removeActionBtn(editBtn, deleteBtn);

            } 

            // Activate timeFiltered flag, , used for addition attributes to elements
            if (this.hasAttribute('data-filter')) {
                timeFiltered = true;
            } 

        }
         
        // Clear display panel
        displayContent.hardClearItemDisplay();
        
        // Ensures the event full view is refreshed when changes are applied
        const eventFullViews = document.querySelectorAll('div.event-fullview');
        eventFullViews.forEach(fullview => displayContent.removeDisplay(fullview));

        // Add attribute to back-button
        backBtn.dataset.action = 'event-fullview';

        //  Get event with the Id specified
        const event = memoryHandler.getEvent(previewId);

        // Create event full view
        const eventFullView = createEventFullView(event);
        itemDisplay.appendChild(eventFullView);

        // Additional dataset attribute to buttons if full view was accessed through time filter
        if (timeFiltered) {
            const deleteBtn = document.querySelector('button.delete');

            backBtn.dataset.filter = this.dataset.filter;
            deleteBtn.dataset.filter = this.dataset.filter;
        }

    }

    const displayEventsToDOM = function () {
        const itemDisplay = document.querySelector('div#item-display');

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

    return {displayEventsToDOM, showFullEvent, createEventDisplay};
})();

export {eventsDisplay}