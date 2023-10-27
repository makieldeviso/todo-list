import { format } from "date-fns";
import { createFormComponents } from "./createFormComponents";

import { addEventToProject } from "./addEventToProject";
import { modalUX } from "./modalUX";
import { memoryHandler } from "./memoryHandler";
import { displayContent } from "./displayContent";
import { closeModal } from "./closeModal";
import { projectFullView } from "./projectFullView";
import { showModals } from "./showModals";
import { onLoadScreen } from "./onLoadScreen";


const addProjectForm = (function () {
    // Basic Form Components
    const projectFormComp = function () {
        const title = {
            inputType: 'input',
            label: 'Title',
            id: 'project-title',

            type: 'text',
            'max-length': '50',
        }

        const desc = {
            inputType: 'textarea',
            label: 'Description',
            id: 'project-desc',

            cols: '30',
            rows: '3',
        }

        const deadline = {
            inputType: 'input',
            label: 'Deadline',
            id: 'project-deadline',

            type: 'date'
        }

        return [title, desc, deadline];
    }

    // Save form values (start) - 
        // Validates project form input fields
        const validateProjectForm = function () {
            const titleInput = document.querySelector('#project-title');
            const schedInput = document.querySelector('#project-deadline');
            const inputsArray = [titleInput, schedInput];
            
            const errors = []
            const emptyRegex = /^\s*$/;
    
            const validateEmpty = function (inputField) {
                if (emptyRegex.test(inputField.value)) {
    
                    // If input is empty or whitespace only
                    const activeValidation = function () {
                        validateEmpty(this);
                    }
    
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
    
        // Link events to project
        const linkEventsToProject = function (projectObj) {
            const projectEventsKeys = Object.keys(projectObj.eventLinks); // Array;
    
            projectEventsKeys.forEach((key) => {
                memoryHandler.linkEventToProject(projectObj.eventLinks[key], projectObj.projectId);
            });
        }
    
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
            const createProject = function (title, description, deadline, priority, creationDate) {
                return {title, description, deadline, priority, creationDate}
            }
    
            // Reusable DOM value getter function
            const valueGet = function (selector) {
                const { value } = document.querySelector(`${selector}`);
                return value
            }
    
            // Execute createEvent with valueGet
            const newProject = createProject (
                valueGet('#project-title'), 
                valueGet('#project-desc'),
                (new Date(valueGet('#project-deadline'))).valueOf(),
                valueGet('button.prio-btn[data-selected="selected"]'),
                (new Date()).valueOf(),
            );
    
            // Add eventLinks object as property to newProject
            newProject.eventLinks = addEventToProject.getProjectEvents();
    
            // Create an id for the newProject object
            const projectId = function (object) {
                const projectTitle = object.title;
                const projectDeadline = object.deadline;
                const timeStamp = format(new Date(), 'HHmmss');
    
                const titleId = projectTitle.split(" ").map(word => `${word.toLowerCase()}`).join('');
                let newProjectId = `${titleId + projectDeadline + timeStamp}`;
    
                // Double check and ensure no duplication of id
                // If same title and due date is created add additional id indicator
                const projects = memoryHandler.getProjects();
                const sameId = projects.filter(project => project.projectId.includes(newProjectId));
    
                if (projectForModId === undefined) {
                    if (sameId.length > 0) {
                        newProjectId = `${titleId + projectDeadline}(${sameId.length + 1})`;
                    }
                }
    
                return newProjectId;
            }
    
            // Executes project id maker then assign return value as projectId property
            newProject.projectId = projectId(newProject); 
    
            // Add default project status
            newProject.projectStatus = 'pending';
    
            if (saveType === 'save-new-project') {
                // Save the project in array memory
                memoryHandler.saveProject(newProject);
    
                // Link events to the project
                linkEventsToProject(newProject);
    
                // Close Modal
                closeModal.closeAddModal();    
    
                // Direct item display to the full view of newly created project
                displayContent.showDisplay('projects-previews', true);
                projectFullView.showFullProject(newProject.projectId);
    
            } else if ('save-edit-project') {
                const currentObj = memoryHandler.getProject(this.dataset.project);
    
                // Replace old project obj with new obj, then link link/relink events to project
                memoryHandler.replaceProject(projectForModId, currentObj, newProject);
    
                // Close Modal
                showModals.closeProjectEdit();
    
                // Display newly edited project full view
                projectFullView.showFullProject(newProject.projectId);
                
            }
    
            // Execute other display project counters
            onLoadScreen.loadCounters();
        }
    
        // Clear project form
        const clearProjectForm = function () {
            addProjectForm.removeProjectForm();
            addProjectForm.newProjectForm('new-project');
        }
    
        // Add event listeners to the save/clear buttons
        const addSaveProjectFormEvent = function (btnsCont, assignDataId) {
            const clearBtn = btnsCont.querySelector(`button#clear-${assignDataId}`);
            const saveBtn = btnsCont.querySelector(`button#save-${assignDataId}`);
    
            clearBtn.addEventListener('click', clearProjectForm);
            saveBtn.addEventListener('click', saveProjectForm);
        }
    // Save form values (end) -

    const newProjectForm = function (trigger) {

        const buttonClick = this.value === 'new-project';
        let assignDataId = 'new-project';
        if (trigger === 'default' || buttonClick ) {
           assignDataId = 'new-project';
        } else {
            assignDataId = trigger;
        }

        const modalCont = document.querySelector('div.modal-cont');

        // Conditions when executing newProjectForm
        const eventForm = document.querySelector('form#event-form');
        const existingForm = document.querySelector('form#project-form');

        // If add Event Form is existing, cancel execution
        if (existingForm !== null) {
            return;
        }

        // Removes event form if it exists  
        if (eventForm !== null) {
            modalCont.removeChild(eventForm);
        }

        // Creates the parent form element
        const projectForm = createFormComponents.createFormElement('project-form');

        // Add form components
        // Note: creates multiple from array of objects
        const newBasicComps = projectFormComp().map(comp => {
            const component = createFormComponents.createBasicComponent(comp, assignDataId);
            return component;
         }); 

        //  Add priority tag
        const newPrioBtns = createFormComponents.createPriorityBtns(assignDataId, 'Project Priority');
        modalUX.addPriorityBtnEvent(newPrioBtns);

        //  Add event adder components then add linked event listeners to respective components 
        const newEventAdder = createFormComponents.createEventAdder(assignDataId);
        const eventAdderBtn = newEventAdder.querySelector('button#add-event-btn');
        addEventToProject.addEventToProjectEvent(eventAdderBtn);
        // Resets newProjectEvents stored temporary linked events
        addEventToProject.resetProjectEvents();

        // Add save/ clear buttons and corresponding event listeners
        const newSaveBtns = createFormComponents.createSaveFormBtns(assignDataId);
        addSaveProjectFormEvent(newSaveBtns, assignDataId);

        // Appends the components to the parent form
        const allComp = [...newBasicComps, newPrioBtns, newEventAdder, newSaveBtns];
        allComp.forEach(component => projectForm.appendChild(component));

        // Appends the form to the modal Cont
        modalCont.appendChild(projectForm);
    }

    const removeProjectForm = function () {
        const modalCont = document.querySelector('div.modal-cont');
        const form = document.querySelector('form#project-form');
        modalCont.removeChild(form);
    }

    const addProjectFormEvent = function() {
        const newEventBtn = document.querySelector('button#new-project');
        newEventBtn.addEventListener('click', newProjectForm);
    }

    return { newProjectForm, addProjectFormEvent, removeProjectForm }

})();

export { addProjectForm }