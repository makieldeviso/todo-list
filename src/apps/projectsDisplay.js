import { format } from 'date-fns';
import { formatting } from "./formatting";
import { projectsScripts } from "./projectsScripts";
import { memoryHandler } from "./memoryHandler";
import { contentMaker } from "./contentMaker";
import { projectFullView } from './projectFullView';

const projectsDisplay = (function () {

    // Event preview/ display  DOM maker
    const createProjectPreview = function (projectObj) {

        const newProject = document.createElement('div');
        newProject.setAttribute('class', 'project-preview');
        newProject.setAttribute('data-id', `${projectObj.projectId}`);
        
        // Check pending if overdue
        const deadlineAlert = projectsScripts.checkDeadline(projectObj.deadline);

        if (projectObj.projectStatus === 'pending' && deadlineAlert === 'overdue' ) {
            newProject.dataset.status = 'overdue';
        } else {
            newProject.dataset.status = projectObj.projectStatus;
        }

        // (1) (start)-
        // Add event marking to indicate if 'pending' or 'done'
        const newMarker = contentMaker.createStatusMarker(projectObj);
        // (1) (end)-

        // (2) (start) -
        // Add indicator icon to classify as event or project. UI related
        const newIndicator = contentMaker.createIndicatorIcon('projects');
        // (2) (end) -

        // (3-5) (start)-
        // Execute contentMaker.makeText and assign to variables  
        const newTitle = contentMaker.makeText('project-title', projectObj.title);
        const newDesc = contentMaker.makeText('project-desc', projectObj.description);
        const newPrio = contentMaker.makeText('project-prio', projectObj.priority);
        // (3-5) (end)-

        // (6) (start)-
        const newDeadline = document.createElement('p');
        newDeadline.setAttribute('class', 'project-deadline');

        // format schedule
        // Note: use date-fns
        const dateString = format(projectObj.deadline, 'MMM dd, yyyy');

        // Checks if event was already completed
        let deadlineTitleAttr;
        if (projectObj.completion === undefined) {
            contentMaker.createSpan(newDeadline, `deadline-icon ${deadlineAlert}`, '');
            deadlineTitleAttr = deadlineAlert;
        } else {
            contentMaker.createSpan(newDeadline, `deadline-icon ${projectObj.completion}`, '');
            deadlineTitleAttr = `${projectObj.completion} completion`;
        }

        contentMaker.createSpan(newDeadline, 'deadline-date', dateString);
        const deadlineIcon = newDeadline.querySelector('span.deadline-icon');
        deadlineIcon.setAttribute('title', formatting.toProper(deadlineTitleAttr));
        // (6) (end)-

        // (7) (start)-
        // Create task count p
        const newEventCount = contentMaker.createEventCounter(projectObj);
        // (7) (end)-

        // Append preview components to newProject
        const components = [newMarker, newIndicator, newTitle, newDesc, newPrio, newDeadline, newEventCount];
        components.forEach(comp => newProject.appendChild(comp));

        // Add event listener to newProject
        newProject.addEventListener('click', projectFullView.showFullProject);

        return newProject
    }

    // Display project previews on DOM
    const displayProjectsToDOM = function () {
        const previewsCont = document.querySelector('div#previews-container');
        
        const projects = memoryHandler.getProjects();
        // Sorts projects for display from latest creation date to oldest
        const sortedProjects = projects.toSorted((a, b) => b.creationDate - a.creationDate);

        if (projects.length !== 0) {
            sortedProjects.forEach(project => {
                const projectDisplay = createProjectPreview(project);
                previewsCont.appendChild(projectDisplay);
            });
        } else {
            const emptyNotif = contentMaker.createEmptyPreviews('projects');
            previewsCont.appendChild(emptyNotif);
        }
    }


    return {displayProjectsToDOM, createProjectPreview};



})();

export {projectsDisplay}