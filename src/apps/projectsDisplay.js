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

    // Event preview/ display  DOM maker
    const createProjectPreview = function (projectObj) {
        
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
        const newSched = document.createElement('p');
        newSched.setAttribute('class', 'project-deadline');

        // format schedule
        // Note: use date-fns
        const dateString = format(projectObj.deadline, 'MMM dd, yyyy');
        const deadlineAlert = projectsScripts.checkDeadline(projectObj.deadline);

        // Checks if event was already completed
        if (projectObj.completion === undefined) {
            createSpan(newSched, `sched-icon ${deadlineAlert}`, '');
        } else {
            createSpan(newSched, `sched-icon ${projectObj.completion}`, '');
        }

        createSpan(newSched, 'sched-date', dateString);
        // (6) (end)-

        // (7) (start)-
        // Create task count p
        // const newTaskCount = createTaskCounter(projectObj);
        // (7) (end)-

        // Append preview components to newProject
        const components = [newMarker, newTitle, newDesc, newPrio, newSched];
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