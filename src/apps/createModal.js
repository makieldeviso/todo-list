import { eventsScript } from "./eventsScript";
import { memoryHandler } from "./memoryHandler";
import { modalUX } from "./modalUX";

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

    // Create Edit Event Banner 
    const createBanner = function (bannerText) {
        const banner = document.createElement('p');
        banner.setAttribute('class', 'modal-banner');

        banner.textContent = bannerText;
        return banner
    };

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

        // executable function
        const createTwoChoiceBtn = function (btnProp) {
            const btnsCont = document.createElement('div');
            btnsCont.setAttribute('class', 'save-cont');
            btnsCont.setAttribute('class', 'save-cont');

            const createBtn = function (eventId, assignClass, assignValue, label) {
                const newBtn = document.createElement('button');
                newBtn.setAttribute('class', assignClass);
                newBtn.setAttribute('value', assignValue);
                newBtn.dataset.id = eventId;
                newBtn.textContent = label;

                btnsCont.appendChild(newBtn);
            }

            createBtn(btnProp.eventId, btnProp.neg.class, btnProp.neg.value, btnProp.neg.label);
            createBtn(btnProp.eventId, btnProp.pos.class, btnProp.pos.value, btnProp.pos.label);
        
            return btnsCont;
        }

        // Executes createTwoChoiceBtn
        const confirmBtnsCont = createTwoChoiceBtn({
            eventId: eventId,
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

    return { createNewModal, createAddOptionsBtns, createEventCompletionPrompt, createBanner }

})();

export { createModal };