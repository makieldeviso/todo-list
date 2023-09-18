import { eventsDisplay } from "./eventsDisplay";
import { projectsDisplay } from "./projectsDisplay";
import { memoryHandler } from "./memoryHandler";

const displayContent = (function () {

    const translateSidebar = function (action) {
        const sidebar = document.querySelector('div#sidebar');
        
        if (action === true) {
            sidebar.classList.add('hidden');

        } else if (action === false) {
            sidebar.classList.remove('hidden');
        }
    }

    const backSideBar = function () {
        // if false recur using backSideBar function
        const backAction = this.dataset.action;

        if (backAction === 'events-previews' || backAction === 'projects-previews') {
            translateSidebar(false);
            clearItemDisplay(backAction);

        } else if (backAction === 'event-fullview' || backAction === 'project-fullview') {
            
            const mode = this.dataset.mode;
            const projectLink = this.dataset.link;

            if (mode !== undefined) {
                clearItemDisplay(backAction);

                // Removes the additional datasets after executing clearItemDisplay function
                this.removeAttribute('data-mode');
                this.removeAttribute('data-link');

                // Show corresponding display, depending of the mode and action
                if (mode === 'project-view') {
                    projectsDisplay.showFullProject(projectLink);

                } 
            
            } else {
                clearItemDisplay(backAction);

                if (backAction === 'event-fullview') {
                    showDisplay('events-previews');

                } else if (backAction === 'project-fullview') {
                    showDisplay('projects-previews');
                }
            }

        }
    }

    // Reusable create and append span function
    const createSpan = function (parentP, assignClass, text) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', assignClass);
        newSpan.textContent = text;

        parentP.appendChild(newSpan);
    }

    // Reusable action buttons maker
    // Note: auto append to action btn ribbon
    const createActionBtn = function (assignClass, assignValue, linkedId, linkedFunc, text) {
        const actionRibbon = document.querySelector('div#action-btns');

        // Condition check to detect if button exist 
        const existingBtn = document.querySelector(`button.action-btn.${assignClass}`);

        if (existingBtn === null) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('class', `action-btn ${assignClass}`);
            newBtn.setAttribute('value', assignValue);
            newBtn.dataset.id = linkedId;
            newBtn.addEventListener('click', linkedFunc);

            createSpan(newBtn, 'icon', '');
            createSpan(newBtn, 'text', text);

            actionRibbon.appendChild(newBtn);
        } 
    }

    const clearItemDisplay = function (action) {
        
        // Reusable function
        const clearPreview = function (previewSelector) {
            // Note: previewSelector parameter is string used for querySelector
            const displays = document.querySelectorAll(`div.${previewSelector}`);

            displays.forEach(preview => removeDisplay(preview));
        }

        if (action === 'projects-previews') {
            clearPreview('project-preview');

        } else if (action === 'events-previews') {
            clearPreview('event-preview');
            
        } else if (action === 'event-fullview') {
            // Close/ remove event full view
            const eventFullView = document.querySelector('div.event-fullview');
            const editBtn = document.querySelector('button[value="edit-event"]');
            const deleteBtn = document.querySelector('button[value="delete-event"]');

            removeDisplay(eventFullView);

            // Note: removeActionBtn accepts multiple buttons argument
            removeActionBtn(editBtn, deleteBtn);
  
        } else if (action === 'project-fullview') {
            // Close/ remove event full view
            const projectFullView = document.querySelector('div.project-fullview');
            const editBtn = document.querySelector('button[value="edit-project"]');
            const deleteBtn = document.querySelector('button[value="delete-project"]');

            console.log(action);

            removeDisplay(projectFullView);

            // Note: removeActionBtn accepts multiple buttons argument
            removeActionBtn(editBtn, deleteBtn);

        }
    }

    // Note: button event triggered function
    const showDisplay = function (action) {
        const backBtn = document.querySelector('button#back-sidebar');
        
        // Add action attribute to back button
        // Note: this function can be linked with eventListener or not
        let assignAction;
        if (typeof action === 'string') {
            assignAction = action;

        } else {
            assignAction = `${this.getAttribute('id')}-previews`;
        }
        
        console.log(assignAction);
        backBtn.dataset.action = assignAction;

        if (assignAction === 'events-previews') {
            eventsDisplay.displayEventsToDOM();
            translateSidebar(true);

        } else if (assignAction === 'projects-previews') {
            projectsDisplay.displayProjectsToDOM();
            translateSidebar(true);

        } else {
            return; //!!!!!!!!!!!!! TEMPORARY RETURN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
        
    }

    const removeActionBtn = function (...btns) {
        const actionBtnsRibbon = document.querySelector('div#action-btns');

        const btnsArray = btns; 
        btnsArray.forEach(btn => {
            if (btn !== null) {
                actionBtnsRibbon.removeChild(btn);
            }
        });
    }

    const removeDisplay = function (item) {
        const itemDisplay = document.querySelector('div#item-display');
        itemDisplay.removeChild(item);
    }   

    const addSidebarEvents = function () {
        const eventsBtn = document.querySelectorAll('div.category');
        eventsBtn.forEach(btn => btn.addEventListener('click', showDisplay));
    }

    const backBtnEvents = function () {
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.addEventListener('click', backSideBar);
    }

    return {showDisplay, 
            addSidebarEvents, 
            removeDisplay, 
            backBtnEvents, 
            removeActionBtn, 
            clearItemDisplay, 
            createActionBtn,
            createSpan,
        }

})();

export { displayContent };