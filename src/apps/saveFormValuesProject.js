import { addEventToProject } from "./addEventToProject";
import { memoryHandler } from "./memoryHandler";
import { projectsDisplay } from "./projectsDisplay";
import { showModals } from "./showModals";
import { onLoadScreen } from "./onLoadScreen";
import { displayContent } from "./displayContent";

import { format, differenceInCalendarDays } from 'date-fns';

const saveFormValuesProject = (function () {

    // Validates project form input fields
    const validateProjectForm = function () {
        const titleInput = document.querySelector('#project-title');
        const schedInput = document.querySelector('#project-deadline');
        const inputsArray = [titleInput, schedInput];
        
        const errors = []
        const emptyRegex = /^\s*$/;

        const activeValidation = function () {
            validateEmpty(this);
        }

        const validateEmpty = function (inputField) {
            if (emptyRegex.test(inputField.value)) {
                // If input is empty or whitespace only
                errors.push(inputField);
                inputField.classList.add('error');
                inputField.addEventListener('blur', activeValidation);
                inputField.addEventListener('change', activeValidation);

            } else {
                inputField.classList.remove('error');
            }
        }

        // Execute validation using validateEmpty function
        inputsArray.forEach(input => validateEmpty(input));

        // Scrolls the form to the first error found
        const firstInstanceError = document.querySelector('.error');
        if (firstInstanceError !== null) {
            firstInstanceError.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        
        return errors;
    };

    // Save project form values
    // Note: validated first
    const saveProjectForm = function () {
        const saveType = this.getAttribute('id');
        const projectForModId = this.dataset.project;

        // Validates form before saving
        const validationErrors = validateProjectForm();
        if (validationErrors.length !== 0) {
            return
        }

        // Factory function to create initial project object
        const createProject = function (title, description, deadline, priority) {
            return {title, description, deadline, priority}
        }

        // Reusable DOM value getter function
        const valueGet = function (selector) {
            const value = document.querySelector(`${selector}`).value;
            return value
        }

        // Execute createEvent with valueGet
        const newProject = createProject (
            valueGet('#project-title'), 
            valueGet('#project-desc'),
            new Date(valueGet('#project-deadline')),
            valueGet('button.prio-btn[data-selected="selected"]')
        );

        // Add eventLinks object as property to newProject
        newProject['eventLinks'] = addEventToProject.getProjectEvents();

        // Create an id for the newProject object
        const projectId = function (object) {
            const projectTitle = object.title;
            const projectDeadline = object.deadline.valueOf();
            const timeStamp = format(new Date(), 'Hms');

            const titleId = projectTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
            let newProjectId = `${titleId + projectDeadline + timeStamp}`;

            // Double check and ensure no duplication of id
            // If same title and due date is created add additional id indicator
            const projects = memoryHandler.getProjects();
            const sameId = projects.filter(project => project['projectId'].includes(newProjectId));

            if (projectForModId === undefined) {
                if (sameId.length > 0) {
                    newProjectId = `${titleId + projectDeadline}(${sameId.length + 1})`;
                }
            }

            object['projectId'] = newProjectId;
        }
        projectId(newProject); // Executes project id maker

        //Add default project status
        newProject['projectStatus'] = 'pending';

        
        if (saveType === 'save-new-project') {
            // Save the project in array memory
            memoryHandler.saveProject(newProject);

            // Link events to the project
            linkEventsToProject(newProject);

            // Close Modal
            showModals.closeModal();    

            // Direct item display to the full view of newly created project
            displayContent.showDisplay('projects-previews', true);
            projectsDisplay.showFullProject(newProject.projectId);

        } else if ('save-edit-project') {
            const currentObj = memoryHandler.getProject(this.dataset.project);

            // Replace old project obj with new obj, then link link/relink events to project
            memoryHandler.replaceProject(projectForModId, currentObj, newProject);

            // Close Modal
            showModals.closeProjectEdit();

            // Display newly edited project full view
            projectsDisplay.showFullProject(newProject.projectId);
            
        }

        // Execute other display project counters
        onLoadScreen.loadCounters();
    }

    // Link events to project
    const linkEventsToProject = function (projectObj) {
        const projectEventsKeys = Object.keys(projectObj.eventLinks); //Array;

        projectEventsKeys.forEach((key) => {
            memoryHandler.linkEventToProject(projectObj.eventLinks[key], projectObj.projectId);
        });
    }

    // Clear project form
    const clearProjectForm = function () {
        console.log('clear project! - test');
    }

    // Add event listeners to the save/clear buttons
    const addSaveProjectFormEvent = function (btnsCont, assignDataId) {
        const clearBtn = btnsCont.querySelector(`button#clear-${assignDataId}`);
        const saveBtn = btnsCont.querySelector(`button#save-${assignDataId}`);

        clearBtn.addEventListener('click', clearProjectForm);
        saveBtn.addEventListener('click', saveProjectForm);
    }
    
    return {addSaveProjectFormEvent}
})();

export {saveFormValuesProject}

