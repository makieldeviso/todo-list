import { format } from 'date-fns';

import { contentMaker } from "./contentMaker";
import { eventEditForm } from "./eventEditForm";
import { initDelete } from "./initDelete";
import { eventsScript } from "./eventsScript";
import { projectFullView } from "./projectFullView";
import { memoryHandler } from './memoryHandler';
import { showModals } from './showModals';

const eventFullView = (function () {

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

        // Changes memory of event 
        memoryHandler.changeTaskStatus(eventId, taskNumber, newValue);

        // Active change of task counter
        const eventTasks = memoryHandler.getEventTasks(eventId);
        const counter = document.querySelector(`div.fullview.tasks-list p.event-task-count[data-id="${eventId}"]`);
        const counterDone = counter.querySelector('span.done');
          
        const countDone = eventsScript.countDoneTasks(eventTasks);
        counterDone.textContent = `${countDone}`;

        if (eventsScript.tasksCompleted(eventTasks)) {
            counter.classList.add('done');
        } else {
            counter.classList.remove('done');
        }
    }

      // Event Full View Maker
      const createEventFullView = function (eventObj) {
        // Ensures no existing action buttons
        const existingEditBtn = document.querySelector('button[value="edit-event"]');
        const existingDeleteBtn = document.querySelector('button[value="delete-event"]');

        contentMaker.removeActionBtn(existingEditBtn, existingDeleteBtn);
        
        // Conditional don't add edit button if event is completed
        if (eventObj.eventStatus !== 'done') {
            contentMaker.createActionBtn('edit', 'edit-event', eventObj.eventId, eventEditForm.showEditEventForm, 'Edit');
        }
        // Create edit button appended on the action buttons ribbon (end) -

        // Create delete button appended on the action buttons ribbon (start) -
        contentMaker.createActionBtn('delete', 'delete-event', eventObj.eventId, initDelete.showDeleteEventPrompt, 'Delete');
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
        const title = contentMaker.makeText('fullview event-title', eventObj.title);

        const descLabel = contentMaker.makeText('fullview event-desc-label label ', 'Description:');
        const desc = contentMaker.makeText('fullview event-desc', eventObj.description);

        // Create project tag and assign data attributes, then add eventListener
        const projLabel = contentMaker.makeText('fullview proj-label label', 'Project:');
        
        const proj = document.createElement('a');
        proj.setAttribute('class', 'fullview event-proj');
        proj.textContent = `${eventsScript.getEventProjectTitle(eventObj)}`;

        if (eventObj.projectTag !== 'standalone') {
            proj.classList.add('proj-link');
            proj.dataset.id = eventObj.projectTag;
            proj.dataset.mode = 'event-view';
            proj.dataset.link = eventObj.eventId;
            proj.addEventListener( 'click', projectFullView.showFullProject );
        }
        
        // Create priority
        const prioLabel = contentMaker.makeText('fullview prio-label label', 'Priority:');

        const prio = contentMaker.makeText('event-prio', eventObj.priority);
        prio.classList.add('fullview');

        // Create sched (start) --
        const schedLabel = contentMaker.makeText('fullview sched-label label', 'Schedule:');
        const sched = document.createElement('p');
        sched.setAttribute('class', 'fullview event-sched');

        // format schedule
        // Note: use date-fns
        const dateString = format(eventObj.schedule, 'ccc, MMM dd, yyyy');

        contentMaker.createSpan(sched, 'sched-icon', '');
        contentMaker.createSpan(sched, 'sched-date', dateString);
         // Create sched (end) --

        // Create tasks list (start) --
        const tasksListCont = document.createElement('div');
        tasksListCont.setAttribute('class', 'fullview tasks-list');

        // Create Task list header container, label and counter
        const taskHeader = document.createElement('div');
        taskHeader.setAttribute('class', 'task-header');

        const taskLabel = contentMaker.makeText('task-label', 'Tasks');
        const taskCounter = contentMaker.createTaskCounter(eventObj);

        // Append label and counter to task header
        taskHeader.appendChild(taskLabel);
        taskHeader.appendChild(taskCounter);

        // Append tasks header to task list container
        tasksListCont.appendChild(taskHeader);

        // Create Individual task
        const eventTasks = eventObj.tasks // This is an object
        const taskKeys = Object.keys(eventTasks) // Array of keys

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

            const taskText = contentMaker.makeText('task', taskObj.task);
            
            // Add data attributes to the components
            const components = [taskCont, checkBtn, taskText];
            components.forEach(comp => {
                const component = comp;
                component.dataset.id = eventObj.eventId;
                component.dataset.number = key;
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
        const fullviewComponents = [statusMarker, title, descLabel, desc, projLabel, proj, schedLabel, sched, prioLabel, prio, tasksListCont, actionBtnsCont];
        fullviewComponents.forEach(component => newFullEvent.appendChild(component));

        return newFullEvent;
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
                const projectFullViewDiv = document.querySelector('div.project-fullview');
                itemDisplay.removeChild(projectFullViewDiv);
                
                // Adds additional data set to the back button
                backBtn.dataset.mode = this.dataset.mode;

                // Add an id link of the project to the back button
                backBtn.dataset.link = eventsScript.getProperty(previewId, 'projectTag');

                // Remove buttons in the ribbon
                const editBtn = document.querySelector('button[value="edit-project"]');
                const deleteBtn = document.querySelector('button[value="delete-project"]');
                contentMaker.removeActionBtn(editBtn, deleteBtn);

            } 

            // Activate timeFiltered flag, , used for addition attributes to elements
            if (this.hasAttribute('data-filter')) {
                timeFiltered = true;
            } 

        }
         
        // Clear display panel
        contentMaker.createFilterBanner('remove');
        
        // Ensures the event full view is refreshed when changes are applied
        const eventFullViews = document.querySelectorAll('div.event-fullview');
        eventFullViews.forEach(fullview => contentMaker.removeDisplay(fullview));

        // Add attribute to back-button
        backBtn.dataset.action = 'event-fullview';

        //  Get event with the Id specified
        const event = memoryHandler.getEvent(previewId);

        // Create event full view
        const fullView = createEventFullView(event);
        itemDisplay.appendChild(fullView);

        // Additional dataset attribute to buttons if full view was accessed through time filter
        if (timeFiltered) {
            const deleteBtn = document.querySelector('button.delete');

            backBtn.dataset.filter = this.dataset.filter;
            deleteBtn.dataset.filter = this.dataset.filter;
        }

    }

    return { createEventFullView, showFullEvent }
})();

export { eventFullView }