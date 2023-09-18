import { eventsScript } from "./eventsScript";
import { memoryHandler } from "./memoryHandler";
import { modalUX } from "./modalUX";
import { projectsScripts } from "./projectsScripts";

const createModal = (function () {
    // Create modal and append to the 'main'
    const createNewModal = function (assignId) {
        const newModal = document.createElement('dialog'); 
        newModal.setAttribute('id', `${assignId}-prompt`);

        const modalCont = document.createElement('div');
        modalCont.setAttribute('class', 'modal-cont');

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'close-modal');
        closeBtn.setAttribute('value', `close-${assignId}`);
        closeBtn.setAttribute('id', `close-${assignId}`);

        // Assemble the modal parts
        modalCont.appendChild(closeBtn);    
        newModal.appendChild(modalCont);

        // Append modal to the 'main'
        const main = document.querySelector('main');
        main.appendChild(newModal);
    } 

    // Create 'Add Options' buttons and append to modal container
    const createAddOptionsBtns = function () {
        // Create buttons container
        const container = document.createElement('div');
        container.setAttribute('id', 'add-options');

        // Create and append buttons to container function
        const addBtn = function (assignId, label) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('id', assignId);
            newBtn.setAttribute('value', assignId);

            // Set new-event as default
            if (assignId === 'new-event') {
                newBtn.dataset.selected = 'selected';
            }

            const btnIcon = document.createElement('span');
            btnIcon.classList.add('add-icon');
            newBtn.appendChild(btnIcon);

            const btnLabel = document.createElement('span');
            btnLabel.classList.add('add-label');
            btnLabel.textContent = label;
            newBtn.appendChild(btnLabel);

            container.append(newBtn);
        }

        addBtn('new-event', 'New Event');
        addBtn('new-project', 'New Project');

        // Appends add options buttons to the modal cont
        const modalCont = document.querySelector('div.modal-cont');
        modalCont.appendChild(container);
    }

    // Executable function, Creates two choice btns
    // Note: Parameter requires object
    const createTwoChoiceBtn = function (btnProp) {
        const btnsCont = document.createElement('div');
        btnsCont.setAttribute('class', 'save-cont');
        btnsCont.setAttribute('class', 'save-cont');

        const createBtn = function (assignId, assignClass, assignValue, label) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('class', assignClass);
            newBtn.setAttribute('value', assignValue);
            newBtn.dataset.id = assignId;
            newBtn.textContent = label;

            btnsCont.appendChild(newBtn);
        }

        createBtn(btnProp.assignId, btnProp.neg.class, btnProp.neg.value, btnProp.neg.label);
        createBtn(btnProp.assignId, btnProp.pos.class, btnProp.pos.value, btnProp.pos.label);
    
        return btnsCont;
    }

    // Create Edit Event Banner 
    const createBanner = function (bannerText) {
        const banner = document.createElement('p');
        banner.setAttribute('class', 'modal-banner');

        banner.textContent = bannerText;
        return banner
    }

    // Events prompts (start)
    // Creates event completion prompt
    const createEventCompletionPrompt = function (eventId) {

        const eventObj = memoryHandler.getEvent(eventId);
        const totalTasks = eventsScript.countTasksOfEvent(eventObj.tasks);
        const eventTasksCompleted = eventsScript.tasksCompleted(eventObj.tasks);

        // Create dialog element with addition elements
        createNewModal('complete-event');

        const promptModal = document.querySelector('dialog#complete-event-prompt');
        const modalCont = promptModal.querySelector('div.modal-cont');

        const promptHeader = createBanner('Complete Event');

        const content = document.createElement('div');
        content.setAttribute('class', 'completion-content');

        const reminder = document.createElement('p');
        reminder.setAttribute('class', 'reminder');

        // Conditional reminder depending on tasks status
        if (totalTasks === 0) {
            reminder.textContent = 'Mark this event as completed?';

        } else if (eventTasksCompleted) {
            reminder.textContent = 'You have accomplished all the task. Complete this event?';

        } else if (!eventTasksCompleted) {
            reminder.textContent = 'You have not yet accomplished all the tasks. Mark event as completed anyway?'
        }

        // Executes createTwoChoiceBtn
        const confirmBtnsCont = createTwoChoiceBtn({
            assignId: eventId,
            pos: {
                class: 'save',
                value: 'confirm-complete',
                label: 'Yes',
                },
            neg: {
                class: 'clear',
                value: 'dont-complete',
                label: 'No',
                }
        });

        content.appendChild(reminder); //Append reminder message to content div
        content.appendChild(confirmBtnsCont); //Append buttons container to content div

        const components = [promptHeader, content];
        components.forEach(comp => modalCont.appendChild(comp));
    }

    // Creates event delete prompt
    const createEventDeletePrompt = function (eventId) {

        const eventObj = memoryHandler.getEvent(eventId);

        const eventStatus = eventObj.eventStatus;

        // Create dialog element with addition elements
        createNewModal('delete-event');

        const promptModal = document.querySelector('dialog#delete-event-prompt');
        const modalCont = promptModal.querySelector('div.modal-cont');

        const promptHeader = createBanner('Delete Event');

        const content = document.createElement('div');
        content.setAttribute('class', 'delete-content');

        const reminder = document.createElement('p');
        reminder.setAttribute('class', 'reminder');

        // Conditional reminder depending on tasks status
        if (eventStatus === 'pending') {
            reminder.textContent = 'You have not yet completed this event. Are you sure you want to delete event?';

        } else if (eventStatus === 'done') {
            reminder.textContent = 'Good job! You have already completed this event. Confirm event deletion?';
        }

        // Executes createTwoChoiceBtn
        const confirmBtnsCont = createTwoChoiceBtn({
            assignId: eventId,
            pos: {
                class: 'save',
                value: 'confirm-delete',
                label: 'Yes',
                },
            neg: {
                class: 'clear',
                value: 'dont-delete',
                label: 'No',
                }
        });

        content.appendChild(reminder); //Append reminder message to content div
        content.appendChild(confirmBtnsCont); //Append buttons container to content div

        const components = [promptHeader, content];
        components.forEach(comp => modalCont.appendChild(comp));
    }
    // Events prompts (end)

    // Projects prompts (start)
    // Creates event completion prompt
    const createProjectCompletionPrompt = function (projectId) {
        console.log(projectId);
        const projectObj = memoryHandler.getProject(projectId);
        const totalEvents = projectsScripts.countEventsOfProject(projectObj);
        const projectEventsCompleted = projectsScripts.projectEventsCompleted(projectObj);

        // Create dialog element with addition elements
        createNewModal('complete-project');

        const promptModal = document.querySelector('dialog#complete-project-prompt');
        const modalCont = promptModal.querySelector('div.modal-cont');

        const promptHeader = createBanner('Complete Project');

        const content = document.createElement('div');
        content.setAttribute('class', 'completion-content');

        const reminder = document.createElement('p');
        reminder.setAttribute('class', 'reminder');

        // Conditional reminder depending on tasks status
        if (totalEvents === 0) {
            reminder.textContent = 'Mark this project as completed?';

        } else if (projectEventsCompleted) {
            reminder.textContent = 'You have accomplished all the events. Complete this project?';
        } 

        // Executes createTwoChoiceBtn
        const confirmBtnsCont = createTwoChoiceBtn({
            assignId: projectId,
            pos: {
                class: 'save',
                value: 'confirm-complete',
                label: 'Yes',
                },
            neg: {
                class: 'clear',
                value: 'dont-complete',
                label: 'No',
                }
        });

        content.appendChild(reminder); //Append reminder message to content div
        content.appendChild(confirmBtnsCont); //Append buttons container to content div

        const components = [promptHeader, content];
        components.forEach(comp => modalCont.appendChild(comp));
    }

    // Creates project delete prompt
    const createProjectDeletePrompt = function (projectId) {

        const projectObj = memoryHandler.getProject(projectId);

        const projectStatus = projectObj.projectStatus;

        // Create dialog element with addition elements
        createNewModal('delete-project');

        const promptModal = document.querySelector('dialog#delete-project-prompt');
        const modalCont = promptModal.querySelector('div.modal-cont');

        const promptHeader = createBanner('Delete Project');

        const content = document.createElement('div');
        content.setAttribute('class', 'delete-content');

        const reminder = document.createElement('p');
        reminder.setAttribute('class', 'reminder');

        // Conditional reminder depending on tasks status
        if (projectStatus === 'pending') {
            reminder.textContent = 'You have not yet completed this project. Are you sure you want to delete project?';

        } else if (projectStatus === 'done') {
            reminder.textContent = 'Good job! You have already completed this project. Confirm event deletion?';
        }

        // Executes createTwoChoiceBtn
        const confirmBtnsCont = createTwoChoiceBtn({
            assignId: projectId,
            pos: {
                class: 'save',
                value: 'confirm-delete',
                label: 'Yes',
                },
            neg: {
                class: 'clear',
                value: 'dont-delete',
                label: 'No',
                }
        });

        content.appendChild(reminder); //Append reminder message to content div
        content.appendChild(confirmBtnsCont); //Append buttons container to content div

        const components = [promptHeader, content];
        components.forEach(comp => modalCont.appendChild(comp));
    }

     // Projects prompts (end)

    return { createNewModal, 
            createAddOptionsBtns,
            createEventCompletionPrompt, 
            createBanner, 
            createEventDeletePrompt,
        
            createProjectCompletionPrompt,
            createProjectDeletePrompt,
        }

})();

export { createModal };