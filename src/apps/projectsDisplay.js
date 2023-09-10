import { formatting } from "./formatting";
import { format } from 'date-fns';
import { projectsScripts } from "./projectsScripts";
import { memoryHandler } from "./memoryHandler";
import { displayContent } from "./displayContent";
import { eventsDisplay } from "./eventsDisplay";

const projectsDisplay = (function () {

    // Reusable p text maker function
    const makeText = function (assignClass, text) {
        const newText = document.createElement('p');
        newText.setAttribute('class', assignClass);
        newText.textContent = text;

        if (assignClass === 'project-prio') {
            newText.classList.add(`${text}`);
            newText.textContent = formatting.toProper(text);
        }

        return newText;
    }

    // Reusable create and append span function
    const createSpan = function (parentP, assignClass, text) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', assignClass);
        newSpan.textContent = text;

        parentP.appendChild(newSpan);
    }

    // Reusable task counter creator function
    const createEventCounter = function (project) {
        const newEventCounter = document.createElement('p');
        newEventCounter.setAttribute('class', 'project-event-count pending');
        newEventCounter.dataset.id = project.projectId;

        const events = project.eventLinks; // this is Object
        const done = projectsScripts.countDoneEvents(project);
        const total = projectsScripts.countEventsOfProject(project);

        createSpan(newEventCounter, 'done', `${done}`);
        createSpan(newEventCounter, 'slash', '/');
        createSpan(newEventCounter, 'total', `${total}`);
        createSpan(newEventCounter, 'label', 'events');

        if (done === total) {
            newEventCounter.classList.remove('pending');
            newEventCounter.classList.add('done');
        } 

        return newEventCounter;
    }

    // Event preview/ display  DOM maker
    const createProjectPreview = function (projectObj) {

        projectsScripts.countDoneEvents(projectObj)
        
        const newProject = document.createElement('div');
        newProject.setAttribute('class', 'project-preview');
        newProject.setAttribute('data-id', `${projectObj.projectId}`);
        newProject.dataset.status = projectObj.projectStatus;

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const newMarker = document.createElement('div');
        newMarker.setAttribute('class', 'marker');
        // (1) (end)-

        // (2-5) (start)-
        // Execute makeText and assign to variables  
        const newTitle = makeText('project-title', projectObj.title);
        const newDesc = makeText('project-desc', projectObj.description);
        // const newProjTag = makeText('project-proj', getEventProjectTitle(projectObj));
        const newPrio = makeText('project-prio', projectObj.priority);
        // (2-5) (end)-

        // (6) (start)-
        const newDeadline = document.createElement('p');
        newDeadline.setAttribute('class', 'project-deadline');

        // format schedule
        // Note: use date-fns
        const dateString = format(projectObj.deadline, 'MMM dd, yyyy');
        const deadlineAlert = projectsScripts.checkDeadline(projectObj.deadline);

        // Checks if event was already completed
        if (projectObj.completion === undefined) {
            createSpan(newDeadline, `deadline-icon ${deadlineAlert}`, '');
        } else {
            createSpan(newDeadline, `deadline-icon ${projectObj.completion}`, '');
        }

        createSpan(newDeadline, 'deadline-date', dateString);
        // (6) (end)-

        // (7) (start)-
        // Create task count p
        const newEventCount = createEventCounter(projectObj);
        // (7) (end)-

        // Append preview components to newProject
        const components = [newMarker, newTitle, newDesc, newPrio, newDeadline, newEventCount];
        components.forEach(comp => newProject.appendChild(comp));

        // Add event listener to newProject
        newProject.addEventListener('click', showFullProject);

        return newProject
    }

    const showFullProject = function (trigger) {

    // Conditional to enable non-eventlistener trigger
        // If trigger is string means non-eventlistener
        let projectId;
        if (typeof trigger === 'string') {
            projectId = trigger
        } else {
            projectId = this.dataset.id;
        }

        const itemDisplay = document.querySelector('div#item-display');
    
        // Clear display panel
        const projectPreviews = document.querySelectorAll('div.project-preview');
        projectPreviews.forEach(preview => displayContent.removeDisplay(preview));
        
        // Ensures the project full view is refreshed when changes is applied
        const projectFullViews = document.querySelectorAll('div.project-fullview');
       projectFullViews.forEach(fullview => displayContent.removeDisplay(fullview));

        // Add attribute to back-button
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.dataset.action = 'project-fullview';

        //  Get project with the Id specified
        const projectObj = memoryHandler.getProject(projectId);

        // Create project full view
        const projectFullView = createProjectFullView(projectObj);
        itemDisplay.appendChild(projectFullView);

    }

    const createProjectFullView = function (projectObj) {
        // Create edit button appended on the action buttons ribbon (start) -
        console.log(projectObj);
        const actionRibbon = document.querySelector('div#action-btns');

        // Ensures no existing action buttons
        const existingEditBtn = document.querySelector('button[value="edit-project"]');
        if (existingEditBtn !== null) {
            displayContent.removeActionBtn(existingEditBtn);
        }

        // Conditional don't add edit button if event is completed
        // if (projectObj.projectStatus !== 'done') {
        //     createActionBtn('edit', 'edit-project', projectObj.projectId, projectEditForm.showEditProjectForm, 'Edit');
        // }
        // Create edit button appended on the action buttons ribbon (end) -

        // Create delete button appended on the action buttons ribbon (start) -
        // createActionBtn('delete', 'delete-project', projectObj.projectId, projectDelete.showDeletePrompt, 'Delete');
        // Create delete button appended on the action buttons ribbon (end) -

        // Create project full view container
        const newFullProject = document.createElement('div');
        newFullProject.setAttribute('class', "project-fullview");
        newFullProject.dataset.id = projectObj.projectId;
        newFullProject.dataset.status = projectObj.projectStatus;

        // Create status marker
        const statusMarker = document.createElement('div');
        statusMarker.setAttribute('class', 'project-status');

        // Create event title, description, project
        const title = makeText('fullview project-title', projectObj.title);

        const descLabel = makeText('fullview desc-label label ', 'Description:');
        const desc = makeText('fullview project-desc', projectObj.description);

        // const projLabel = makeText('fullview proj-label label', 'Project:');
        // const proj = makeText('fullview event-proj', getEventProjectTitle(projectObj));

        const prio = makeText('project-prio', projectObj.priority);
        prio.classList.add('fullview');

        // Create sched (start) --
        const deadlineLabel = makeText('fullview deadline-label label', 'Deadline:');
        const deadline = document.createElement('p');
        deadline.setAttribute('class', 'fullview project-deadline');

        // format schedule
        // Note: use date-fns
        const dateString = format(projectObj.deadline, 'ccc, MMM dd, yyyy');

        createSpan(deadline, 'deadline-icon', '');
        createSpan(deadline, 'deadline-date', dateString);
         // Create sched (end) --

        // Create tasks list (start) --
        const eventsListCont = document.createElement('div');
        eventsListCont.setAttribute('class', 'fullview events-list');

        // Create Task list header container, label and counter
        const eventHeader = document.createElement('div');
        eventHeader.setAttribute('class', 'event-header');

        const eventLabel = makeText('event-label', 'Events');
        const eventCounter = createEventCounter(projectObj);

        // Append label and counter to event header
        eventHeader.appendChild(eventLabel);
        eventHeader.appendChild(eventCounter);

        // Append event header to event list container
        eventsListCont.appendChild(eventHeader);

        // Create Individual events 
        // Note: projectEvents is an Array of eventObj linked to this project
        const projectEvents = projectsScripts.getProjectEvents(projectObj); 

        const eventsPreviews = projectEvents.forEach(event => {
            // Create event preview using eventsDisplay module
            const eventPreview = eventsDisplay.createEventDisplay(event);
            eventPreview.dataset.mode = 'project-view';

            // Append preview to the eventsList Cont
            eventsListCont.appendChild(eventPreview);
        });
        

        // const tasksArray = taskKeys.map(key => {
        //     // Note: key is string e.g. task-1, task-2
        //     const taskObj = eventTasks[key]; // this is the object for individual task

        //     const taskCont = document.createElement('div');
        //     taskCont.setAttribute('class', 'task');
            
        //     const checkBtn = document.createElement('button');
        //     checkBtn.setAttribute('class', 'check');
        //     checkBtn.setAttribute('value', taskObj.status);

        //     // Conditional if event is not yet done, add eventlistener to tasks
        //     if (projectObj.eventStatus !== 'done') {
        //         checkBtn.addEventListener('click', changeTaskStatus);
        //     }

        //     const taskText = makeText('task', taskObj.task);
            
        //     // Add data attributes to the components
        //     const components = [taskCont, checkBtn, taskText];
        //     components.forEach(comp => {
        //         comp.dataset.id = projectObj.eventId;
        //         comp.dataset.number = key;
        //     });

        //     // Appends other components to the taskCont
        //     for (let i = 1; i < components.length; i++) {
        //         components[0].appendChild(components[i]);
        //     }

        //     return taskCont;
        // });

        // Append individual tasks to the tasksListCont
        // tasksArray.forEach(task => tasksListCont.appendChild(task));

        // Create tasks list (end) --

        // Create action btns (start) --
        const actionBtnsCont = document.createElement('div');
        actionBtnsCont.setAttribute('class', 'project-action');

        if (projectObj.eventStatus !== 'done') {
            const completeBtn = document.createElement('button');
            completeBtn.dataset.id = projectObj.projectId;
            completeBtn.setAttribute('value', 'complete-project');
            completeBtn.textContent = 'Complete Project';

            // Add event listener through module
            // Note: modal activities here
            // showModals.addCompletionPromptEvent(completeBtn);

            actionBtnsCont.appendChild(completeBtn);
        } else {
            const message = document.createElement('p');
            message.setAttribute('class', 'message');
            

            // if (projectScript.eventsCompleted(projectObj.tasks)) {
            //     message.innerHTML = 'You have completed this event.<br/>Well Done!';
            // } else {
            //     message.innerHTML = 'You have completed this event without accomplishing all tasks.<br/>Living dangerously, are we?'
            // }

            actionBtnsCont.appendChild(message);
        }

        // Create action btns (end) --

        // Note: components must be arranged according to order inside the array
        const fullviewComponents = [statusMarker, title, descLabel, desc, deadlineLabel, deadline, prio, eventsListCont, actionBtnsCont];
        fullviewComponents.forEach(component => newFullProject.appendChild(component));

        return newFullProject;

    }





    const displayProjectsToDOM = function () {
        const itemDisplay = document.querySelector('div#item-display');
        
        const projects = memoryHandler.getProjects();

        projects.forEach(project => {
            const projectDisplay = createProjectPreview(project);
            itemDisplay.appendChild(projectDisplay);
        });
    }


    return {displayProjectsToDOM};



})();

export {projectsDisplay}