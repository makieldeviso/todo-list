import { formatting } from "./formatting";
import { format } from 'date-fns';
import { projectsScripts } from "./projectsScripts";
import { memoryHandler } from "./memoryHandler";

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
        // showFullEventToDOM(newProject, true);

        return newProject
    }

    const displayProjectsToDOM = function () {
        const itemDisplay = document.querySelector('div#item-display');
        const projectDisplays = document.querySelectorAll('div.project-preview');
        const projectsInDOMArray = Array.from(projectDisplays);

        // Empty display before appending new set
        projectsInDOMArray.forEach(project => displayContent.removeDisplay(project));

        const projects = memoryHandler.getProjects();

        projects.forEach(project => {
            const projectDisplay = createProjectPreview(project);
            itemDisplay.appendChild(projectDisplay);
        });
    }


    return {displayProjectsToDOM};



})();

export {projectsDisplay}