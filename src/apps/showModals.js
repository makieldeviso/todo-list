import { createModal } from "./createModal";
import { addEventForm } from "./addEventForm";
import { modalUX } from "./modalUX";
import { addProjectForm } from "./addProjectForm";
import { memoryHandler } from "./memoryHandler";
import { eventsDisplay } from "./eventsDisplay";

import { onLoadScreen } from "./onLoadScreen";
import { projectsDisplay } from "./projectsDisplay";

import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { displayContentPriorityFiltered } from "../displayContentPriorityFiltered";

import { contentMaker } from "./contentMaker";
import { projectFullView } from "./projectFullView";
import { eventFullView } from "./eventFullView";
import { clearItemDisplay } from "./clearItemDisplay";
import { closeModal } from "./closeModal";

const showModals = (function () {
    
    // Opens Modal and adds required eventListeners to elements inside the modal
    const showAddOptions = function () {

        // Note: action type refers if the screen size is the small or large
        // Used since add prompt layout is different for small and large screen  
        let actionType;
        let bannerText;
        if (this.id === 'new-event-front') {
            actionType = 'largeScEvent';
            bannerText = 'Create New Event';
        } else if (this.id === 'new-project-front') {
            actionType = 'largeScProject';
            bannerText = 'Create New Project';
        } else {
            actionType = 'smallSc';
        }

        // Create dialog/ modal element
        createModal.createNewModal('add');

        const addPromptModal = document.querySelector('dialog#add-prompt');
        const modalCont = document.querySelector('div.modal-cont');
        const closeBtn = document.querySelector('button#close-add');
        
        if (actionType === 'smallSc') {
            // Note: executes this conditional on smaller screen
            createModal.createAddOptionsBtns();

            const addOptionsBtns = document.querySelectorAll('div#add-options button');

            // Add UX related event to add options buttons
            addOptionsBtns.forEach(btn => btn.addEventListener('click', modalUX.markAddOptionsBtn))

            // Opens modal with add new event form as default
            addEventForm.newEventForm('default');

            // Add additional event listeners upon show modal
            addEventForm.addEventFormEvent();
            addProjectForm.addProjectFormEvent();

        } else {
            // Note: executes this conditional on larger screen
            // Adds additional class to dialog element for styling
            addPromptModal.classList.add('individual');
            
            // Adds new  banner
            const newEventBanner = createModal.createBanner(bannerText);
            modalCont.appendChild(newEventBanner);

            if (actionType === 'largeScEvent') {
                // Adds new event form
                addEventForm.newEventForm('default');

            } else if (actionType === 'largeScProject') {
                // Adds new project form
                addProjectForm.newProjectForm('default');
            }
        }

        addPromptModal.showModal();

        // Add eventListener to close-add/ close modal button
        closeBtn.addEventListener('click', closeModal.closeAddModal);
    } 

    // Opens prompt before completing an event (start)
    const showEventCompletionPrompt = function () {
        const eventId = this.dataset.id;

        // Create prompt modal before completion
        createModal.createEventCompletionPrompt(eventId);

        const promptModal = document.querySelector('dialog#complete-event-prompt');
        const closeBtn = document.querySelector('button#close-complete-event');
        const dontCompleteBtn = document.querySelector('button[value="dont-complete"]');
        const completeBtn = document.querySelector('button[value="confirm-complete"]');

        promptModal.showModal();

        // Add eventListener to close-complete-event/ close modal button
        closeBtn.addEventListener('click', closeCompletion);

        // Add eventlistener to save and don't save buttons;
        dontCompleteBtn.addEventListener('click', closeCompletion);
       
        // Note: When user confirm completion confirmEventCompletion which
        // modifies event object, closes confirm modal then display new event full view
        completeBtn.addEventListener('click', confirmEventCompletion);
    }

    const confirmEventCompletion = function () {
        const eventId = this.dataset.id;

        // Modify event object
        memoryHandler.completeEvent(eventId);

        // Close Modal
        closeCompletion();

        // Display new event full view
        eventFullView.showFullEvent(eventId);

        // reload counters
        onLoadScreen.loadCounters();
    }

    const closeCompletion = function () {
        // Closes modal
        const completionPromptModal = document.querySelector('dialog#complete-event-prompt');
        completionPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(completionPromptModal);
    }
    // Opens prompt before completing an event (end)

    // Show edit event form modal 
    const showEventEditModal = function (id) {
        const eventId = id;
        
        // Creates modal first before showing
        createModal.createNewModal('edit-event');
        const editModal = document.querySelector('dialog#edit-event-prompt');
        const modalCont = editModal.querySelector('div.modal-cont');
        const closeBtn = editModal.querySelector('button.close-modal');

        // Add Modal Banner
        const editBanner = createModal.createBanner('Edit Event');
        modalCont.appendChild(editBanner);

        // Add default event form and assign data-id
        addEventForm.newEventForm('edit-event');
        const editForm = document.querySelector('form#event-form');
        editForm.dataset.id = eventId;
        
        // Add close modal event listener
        closeBtn.addEventListener('click', closeModal.closeEventEdit);

        // Show Modal created
        editModal.showModal();
    }

    // Show event delete prompt modal (start) - 
    const showEventDeletePrompt = function (id) {
        const eventId = id;

        // Create prompt modal before completion
        createModal.createEventDeletePrompt(eventId);

        const promptModal = document.querySelector('dialog#delete-event-prompt');
        const closeBtn = document.querySelector('button#close-delete-event');
        const dontDeleteBtn = document.querySelector('button[value="dont-delete"]');
        const deleteBtn = document.querySelector('button[value="confirm-delete"]');

        promptModal.showModal();

        // Add eventListener to close-delete-event/ close modal button
        closeBtn.addEventListener('click', closeEventDelete);

        // Add eventlistener to delete and don't delete buttons;
        dontDeleteBtn.addEventListener('click', closeEventDelete);
       
        // Note: When user confirm deletion confirmEventDeletion which
        // modifies event object, closes confirm modal then display new event preview
        deleteBtn.addEventListener('click', confirmEventDelete);

        return new Promise(resolve => resolve(deleteBtn));
    }

    const confirmEventDelete = function () {
        const eventId = this.dataset.id;

        // Modify project object linked to this event
        const projectId = memoryHandler.getEvent(eventId).projectTag;
        if (projectId !== 'standalone') {
            memoryHandler.deleteEventFromProject(eventId, projectId);
        }
        
        // Modify event object
        memoryHandler.deleteEvent(eventId);

        // Close Modal
        closeEventDelete();

        // Removes current event full view in the DOM
        clearItemDisplay.clear('event-fullview');

        // Change back button action
        // Note: Item display depends on where event full view was accessed
        // Note: since item display returns to previews page, back button dataset is changed

        const backBtn = document.querySelector('button#back-sidebar');

        if (this.hasAttribute('data-link')) {
            backBtn.dataset.action = 'project-fullview';
            backBtn.removeAttribute('data-mode');
            backBtn.removeAttribute('data-link');

            // Display project fullview
            projectFullView.showFullProject(this.dataset.link);

        } else {

            if (this.hasAttribute('data-filter')) {

                if (this.dataset.filter.includes('prio')) {
                    const prioFilter = displayContentPriorityFiltered.convertDataSet(this.dataset.filter);
                    backBtn.dataset.action = `${prioFilter}-prio-previews`;

                    // Display prio filtered previews
                    displayContentPriorityFiltered.displayPriorityFiltered(prioFilter);
                    
                } else {
                    const timeFilter = displayContentTimeFiltered.convertDataSet(this.dataset.filter);
                    backBtn.dataset.action = `${timeFilter}-previews`;

                    // Display time filtered previews
                    displayContentTimeFiltered.displayTimeFiltered(timeFilter);
                }

            } else {
                backBtn.dataset.action = 'events-previews';

                // Display events previews
                contentMaker.createFilterBanner('append', 'events');
                eventsDisplay.displayEventsToDOM();
            }
        }

        // Execute onload/ sidebar counters
        onLoadScreen.loadCounters();

    }

    const closeEventDelete = function () {
        // Closes modal
        const deletePromptModal = document.querySelector('dialog#delete-event-prompt');
        deletePromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(deletePromptModal);
    }
    // Show event delete prompt modal (end) - 

    // Adds event listener to addButton
    const addButtonEvent = function () {
        const addBtn = document.querySelector('button#add');
        const newEventBtn = document.querySelector('button#new-event-front');
        const newProjectBtn = document.querySelector('button#new-project-front');

        const btnsArray = [addBtn, newEventBtn, newProjectBtn];
        btnsArray.forEach(btn => btn.addEventListener('click', showAddOptions));
    }

    // Add event listener to event completion button
    const addCompletionPromptEvent = function (button) {
        button.addEventListener('click', showEventCompletionPrompt);
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // PROJECT DELETION
    // Show project delete prompt modal (start) - 
    const showProjectDeletePrompt = function (id) {
        const projectId = id;

        // Create prompt modal before completion
        createModal.createProjectDeletePrompt(projectId);

        const promptModal = document.querySelector('dialog#delete-project-prompt');
        const closeBtn = document.querySelector('button#close-delete-project');
        const dontDeleteBtn = document.querySelector('button[value="dont-delete"]');
        const deleteBtn = document.querySelector('button[value="confirm-delete"]');

        promptModal.showModal();

        // Add eventListener to close-delete-project/ close modal button
        closeBtn.addEventListener('click', closeProjectDelete);

        // Add eventlistener to delete and don't delete buttons;
        dontDeleteBtn.addEventListener('click', closeProjectDelete);
       
        // Note: When user confirm deletion confirmProjectDeletion which
        // modifies project object, closes confirm modal then display new projects preview
        deleteBtn.addEventListener('click', confirmProjectDelete);

        return new Promise(resolve => resolve(deleteBtn));
    }

    const closeProjectDelete = function () {
        // Closes modal
        const deletePromptModal = document.querySelector('dialog#delete-project-prompt');
        deletePromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(deletePromptModal);
    }

    const confirmProjectDelete = function () {
        const projectId = this.dataset.id;

        const eventsForDelete = Array.from(document.querySelectorAll('input:checked'));
        const eventsForDeleteId = eventsForDelete.map(input => input.value );

        // Delete project from memory and modifies events linked to this project 
        memoryHandler.deleteProject(projectId);

        // Delete the events the user wants to delete with this project
        eventsForDeleteId.forEach(eventId => memoryHandler.deleteEvent(eventId));
        
        // Close Modal
        closeProjectDelete();

        // Removes current project full view in the DOM
        clearItemDisplay.clear('project-fullview');

        // Change back button action
        // Note: Item display depends on where event full view was accessed
        // Note: since item display returns to previews page, back button dataset is changed

        const backBtn = document.querySelector('button#back-sidebar');

        
        if (this.hasAttribute('data-filter')) {

            if (this.dataset.filter.includes('prio')) {
                const prioFilter = displayContentPriorityFiltered.convertDataSet(this.dataset.filter);
                backBtn.dataset.action = `${prioFilter}-prio-previews`;
                displayContentPriorityFiltered.displayPriorityFiltered(prioFilter);

            } else {
                const timeFilter = displayContentTimeFiltered.convertDataSet(this.dataset.filter);
                backBtn.dataset.action = `${timeFilter}-previews`;
                displayContentTimeFiltered.displayTimeFiltered(timeFilter);
            }
            
        } else {
            backBtn.dataset.action = 'projects-previews';
            contentMaker.createFilterBanner('append', 'projects');
            projectsDisplay.displayProjectsToDOM();
        }

        // Execute onload/ sidebar counters
        onLoadScreen.loadCounters();

    }

    // Show edit project form modal 
    const showProjectEditModal = function (id) {
        const projectId = id;
        
        // Creates modal first before showing
        createModal.createNewModal('edit-project');
        const editModal = document.querySelector('dialog#edit-project-prompt');
        const modalCont = editModal.querySelector('div.modal-cont');
        const closeBtn = editModal.querySelector('button.close-modal');

        // Add Modal Banner
        const editBanner = createModal.createBanner('Edit Project');
        modalCont.appendChild(editBanner);

        // Add default event form and assign data-id
        addProjectForm.newProjectForm('edit-project');
        const editForm = document.querySelector('form#project-form');

        editForm.dataset.id = projectId;
        
        // Add close modal event listener
        closeBtn.addEventListener('click', closeProjectEdit);

        // Show Modal created
        editModal.showModal();
    }

    // Closes project edit modal
    const closeProjectEdit = function () {
        // Closes modal
        const editProjectModal = document.querySelector('dialog#edit-project-prompt');
        editProjectModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(editProjectModal);
    }

    // PROJECT COMPLETION
    // Opens prompt before completing an event (start)
    const showProjectCompletionPrompt = function () {
        const projectId = this.dataset.id;

        // Create prompt modal before completion
        createModal.createProjectCompletionPrompt(projectId);

        const promptModal = document.querySelector('dialog#complete-project-prompt');
        const closeBtn = document.querySelector('button#close-complete-project');
        const dontCompleteBtn = document.querySelector('button[value="dont-complete"]');
        const completeBtn = document.querySelector('button[value="confirm-complete"]');

        promptModal.showModal();

        // Add eventListener to close-complete-event/ close modal button
        closeBtn.addEventListener('click', closeProjectCompletion);

        // Add eventlistener to save and don't save buttons;
        dontCompleteBtn.addEventListener('click', closeProjectCompletion);
       
        // Note: When user confirm completion confirmProjectCompletion which
        // modifies event object, closes confirm modal then display new event full view
        completeBtn.addEventListener('click', confirmProjectCompletion);
    }

    const confirmProjectCompletion = function () {
        const projectId = this.dataset.id;

        // Modify event object
        memoryHandler.completeProject(projectId);

        // Close Modal
        closeProjectCompletion();   

        // Display new event full view
        projectFullView.showFullProject(projectId);

        // Reload counter
        // Note: useful when reloading count for overdue filter
        onLoadScreen.loadCounters();
    }

    const closeProjectCompletion = function () {
        // Closes modal
        const completionPromptModal = document.querySelector('dialog#complete-project-prompt');
        completionPromptModal.close();

        // Removes modal from the DOM
        const main = document.querySelector('main');
        main.removeChild(completionPromptModal);
    }
    // Opens prompt before completing an event (end)

    // Add event listener to project completion button
    const addCompletionPromptProject = function (button) {
        button.addEventListener('click', showProjectCompletionPrompt);
    }

    return { addButtonEvent, 
            addCompletionPromptEvent, 
            showEventEditModal,
            showEventDeletePrompt,
        
            addCompletionPromptProject,
            showProjectDeletePrompt,
            showProjectEditModal,
            closeProjectEdit,
        }
})();

export { showModals };