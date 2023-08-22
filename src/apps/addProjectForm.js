import { createFormComponents } from "./createFormComponents";
import { saveFormValuesProject } from "./saveFormValuesProject";
import { addEventToProject } from "./addEventToProject";
import { modalUX } from "./modalUX";


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

    const newProjectForm = function () {
        const modalCont = document.querySelector('div.modal-cont');

        // Conditions when executing newEventForm
        const eventForm = document.querySelector('form#event-form');
        const existingForm = document.querySelector('form#project-form');

        // If add Event Form is existing, cancel execution
        if (existingForm !== null) {
            console.log('nope');
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
            const component = createFormComponents.createBasicComponent(comp, 'new-project');
            return component;
         }); 

        //  Add priority tag
        const newPrioBtns = createFormComponents.createPriorityBtns('new-project', 'Project Priority');
        modalUX.addPriorityBtnEvent(newPrioBtns);

        //  Add event adder components then add linked event listeners to respective components 
        const newEventAdder = createFormComponents.createEventAdder('new-project');
        const eventAdderBtn = newEventAdder.querySelector('button#add-event-btn');
        addEventToProject.addEventToProjectEvent(eventAdderBtn);


        // Add save/ clear buttons and corresponding event listeners
        const newSaveBtns = createFormComponents.createSaveFormBtns('new-project');
        saveFormValuesProject.addSaveProjectFormEvent(newSaveBtns);

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

export {addProjectForm}