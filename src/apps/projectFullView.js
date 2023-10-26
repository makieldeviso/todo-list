import { format } from 'date-fns';

import { projectsScripts } from './projectsScripts';
import { contentMaker } from "./contentMaker";
import { memoryHandler } from "./memoryHandler";
import { projectEditForm } from "./projectEditForm";
import { initDelete } from "./initDelete";

import { eventsDisplay } from './eventsDisplay';
import { showModals } from './showModals';
import { changeCategory } from './changeCategory';

const projectFullView = (function () {

    const createProjectFullView = function (projectObj) {
        // Ensures no existing action buttons
        const existingEditBtn = document.querySelector('button[value="edit-project"]');
        const existingDeleteBtn = document.querySelector('button[value="delete-project"]');

        contentMaker.removeActionBtn(existingEditBtn, existingDeleteBtn);

        // Conditional don't add edit button if event is completed
        if (projectObj.projectStatus !== 'done') {
            contentMaker.createActionBtn('edit', 'edit-project', projectObj.projectId, projectEditForm.showEditProjectForm, 'Edit');
        }
        // Create edit button appended on the action buttons ribbon (end) -

        // Create delete button appended on the action buttons ribbon (start) -
        contentMaker.createActionBtn('delete', 'delete-project', projectObj.projectId, initDelete.showDeleteProjectPrompt, 'Delete');
        // Create delete button appended on the action buttons ribbon (end) -

        // Create project full view container
        const newFullProject = document.createElement('div');
        newFullProject.setAttribute('class', "project-fullview");
        newFullProject.dataset.id = projectObj.projectId;
        newFullProject.dataset.status = projectObj.projectStatus;

        // Create status marker
        const statusMarker = document.createElement('div');
        statusMarker.setAttribute('class', 'project-status');

        // Create event title, description
        const title = contentMaker.makeText('fullview project-title', projectObj.title);

        const descLabel = contentMaker.makeText('fullview desc-label label ', 'Description:');
        const desc = contentMaker.makeText('fullview project-desc', projectObj.description);

        const prioLabel = contentMaker.makeText('fullview project-prio-label label ', 'Priority:');

        const prio = contentMaker.makeText('project-prio', projectObj.priority);
        prio.classList.add('fullview');

        // Create sched (start) --
        const deadlineLabel = contentMaker.makeText('fullview deadline-label label', 'Deadline:');
        const deadline = document.createElement('p');
        deadline.setAttribute('class', 'fullview project-deadline');

        // format schedule
        // Note: use date-fns
        const dateString = format(projectObj.deadline, 'ccc, MMM dd, yyyy');

        contentMaker.createSpan(deadline, 'deadline-icon', '');
        contentMaker.createSpan(deadline, 'deadline-date', dateString);
         // Create sched (end) --

        // Create events list (start) --
        const eventsListCont = document.createElement('div');
        eventsListCont.setAttribute('class', 'fullview events-list');

        // Create Task list header container, label and counter
        const eventHeader = document.createElement('div');
        eventHeader.setAttribute('class', 'event-header');

        const eventLabel = contentMaker.makeText('event-label', 'Events');
        const eventCounter = contentMaker.createEventCounter(projectObj);

        // Append label and counter to event header
        eventHeader.appendChild(eventLabel);
        eventHeader.appendChild(eventCounter);

        // Append event header to event list container
        eventsListCont.appendChild(eventHeader);

        // Create Individual events 
        // Note: projectEvents is an Array of eventObj linked to this project
        const projectEvents = projectsScripts.getProjectEvents(projectObj); 

        projectEvents.forEach(event => {
            // Create event preview using eventsDisplay module
            const eventPreview = eventsDisplay.createEventDisplay(event);
            eventPreview.dataset.mode = 'project-view';

            // Append preview to the eventsList Cont
            eventsListCont.appendChild(eventPreview);
        });
        
        // Create action btns (start) --
        const actionBtnsCont = document.createElement('div');
        actionBtnsCont.setAttribute('class', 'project-action');

        if (projectObj.projectStatus !== 'done') {
            const completeBtn = document.createElement('button');
            completeBtn.dataset.id = projectObj.projectId;
            completeBtn.setAttribute('value', 'complete-project');
            completeBtn.textContent = 'Complete Project';

            const countDoneEvents = projectsScripts.countDoneEvents(projectObj);
            const countEvents = projectsScripts.countEventsOfProject(projectObj);

            if (countDoneEvents !== countEvents) {
                completeBtn.disabled = true;

                const message = document.createElement('p');
                message.setAttribute('class', 'message incomplete');
                message.innerHTML = 'Accomplish events to enable project completion.';
                actionBtnsCont.appendChild(message);
            }

            // Add event listener through module
            // Note: modal activities here
            showModals.addCompletionPromptProject(completeBtn);

            actionBtnsCont.appendChild(completeBtn);

        } else {
            const message = document.createElement('p');
            message.setAttribute('class', 'message');
            message.innerHTML = 'You have completed this project.<br/>Well Done!';

            actionBtnsCont.appendChild(message);
        }

        // Create action btns (end) --

        // Note: components must be arranged according to order inside the array
        const fullviewComponents = [statusMarker, title, descLabel, desc, deadlineLabel, deadline, prioLabel, prio, eventsListCont, actionBtnsCont];
        fullviewComponents.forEach(component => newFullProject.appendChild(component));

        return newFullProject;
    }

    // Shows full project to the DOM
    const showFullProject = function (trigger) {

        const itemDisplay = document.querySelector('div#item-display');
        const backBtn = document.querySelector('button#back-sidebar');
        
        // Conditional to enable non-eventlistener trigger
        // If trigger is string means non-eventlistener
        let projectId;
        let timeFiltered = false;
        if (typeof trigger === 'string') {
            projectId = trigger
        } else {
            projectId = this.dataset.id;
            
            // If full view was accessed by clicking project tag link from event full view
            if (this.dataset.mode === 'event-view') {
                // Change category to projects
                // Note: Clear display to initiate category change
                changeCategory.defaultDisplay();

                // highlight projects category
                const projectsCategory = document.querySelector('div.category#projects');
                changeCategory.highlightCategory(projectsCategory);
            }

            // Activate timeFilter flag, used for addition attributes to elements
            if (this.hasAttribute('data-filter')) {
                timeFiltered = true;
            } 
        }

        // Clear display panel
        contentMaker.createFilterBanner('remove');
        
        // Ensures the project full view is refreshed when changes is applied
        const projectFullViews = document.querySelectorAll('div.project-fullview');
       projectFullViews.forEach(fullview => contentMaker.removeDisplay(fullview));

        // Add attribute to back-button
        backBtn.dataset.action = 'project-fullview';

        //  Get project with the Id specified
        const projectObj = memoryHandler.getProject(projectId);
        
        // Create and append project full view
        const fullView = createProjectFullView(projectObj);
        itemDisplay.appendChild(fullView);

        // Additional dataset attribute to buttons if full view was accessed through time filter
        if (timeFiltered) {
            const deleteBtn = document.querySelector('button.delete');

            backBtn.dataset.filter = this.dataset.filter;
            deleteBtn.dataset.filter = this.dataset.filter;
        }
    }

    return { showFullProject }



})();

export { projectFullView }