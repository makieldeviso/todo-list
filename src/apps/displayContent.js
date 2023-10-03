import { eventsDisplay } from "./eventsDisplay";
import { projectsDisplay } from "./projectsDisplay";
import { memoryHandler } from "./memoryHandler";
import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { displayContentPriorityFiltered } from "../displayContentPriorityFiltered";
import { formatting } from "./formatting";

import pendingIcon from '../assets/pending-white.svg';
import pendingOrangeIcon from '../assets/pending-orange.svg';
import doneIcon from '../assets/done.svg';
import projectsIcon from '../assets/projects-icon.svg'
import eventsIcon from '../assets/events-icon.svg'

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
        const backAction = this.dataset.action;

        // Check conditions first on how the backSideBar function will execute
        const checkActionType = function (action) {
            const time = ['today', 'upcoming', 'someday', 'overdue'];
            const timeFiltered = time.some(condition => action.includes(condition));
            const todoType = ['event', 'project'];
            const typeFiltered = todoType.some(condition => action.includes(condition));

            let filterType;
            if (action.includes('prio')) {
                filterType = 'priority-filtered';

            } else if (timeFiltered) {
                filterType = 'time-filtered';

            } else if (typeFiltered) {
                filterType = 'type-filtered';
            }

            let condition
            if (action.includes('fullview')) {
                condition = `${filterType}-fullview`;

            } else if (action.includes('preview')) {
                condition = `${filterType}-preview`;
            }

            return condition;
        }
        const backCondition = checkActionType(backAction);
        
        if (backCondition === 'type-filtered-preview') {
            translateSidebar(false);
            clearItemDisplay(backAction);

        } else if (backCondition === 'type-filtered-fullview') {
            
            const mode = this.dataset.mode;
            const todoLink = this.dataset.link;
            const filter = this.dataset.filter;

            if (mode !== undefined) {
                clearItemDisplay(backAction);   

                // Removes the additional datasets after executing clearItemDisplay function
                this.removeAttribute('data-mode');
                this.removeAttribute('data-link');

                // Show corresponding display, depending of the mode and action
                if (mode === 'project-view') {
                    projectsDisplay.showFullProject(todoLink);

                } else if (mode === 'event-view') {
                    eventsDisplay.showFullEvent(todoLink);
                }
            
            } else if (filter !== undefined) {
                // This executes when using time filter
                clearItemDisplay(backAction);

                if (filter.includes('prio')) {
                    const priority = displayContentPriorityFiltered.convertDataSet(filter);

                    // Display priority filtered previews and add data-action to back-btn
                    displayContentPriorityFiltered.displayPriorityFiltered(priority);
                    this.dataset.action = `${priority}-prio-previews`;

                } else {
                    const time = displayContentTimeFiltered.convertDataSet(filter);

                    // Display time filtered previews and add data-action to back-btn
                    displayContentTimeFiltered.displayTimeFiltered(time);
                    this.dataset.action = `${time}-previews`;
                }

                // Removes the additional datasets after executing clearItemDisplay function
                this.removeAttribute('data-filter');


            } else {
                clearItemDisplay(backAction);

                if (backAction === 'event-fullview') {
                    showDisplay('events-previews');

                } else if (backAction === 'project-fullview') {
                    showDisplay('projects-previews');
                }
            }

        } else if (
            backCondition === 'time-filtered-preview'|| 
            backCondition === 'priority-filtered-preview') {      

            translateSidebar(false);
            clearItemDisplay('events-previews');
            clearItemDisplay('projects-previews');
        }
    }

    // Reusable create and append span function
    const createSpan = function (parentP, assignClass, text) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('class', assignClass);
        newSpan.textContent = text;

        parentP.appendChild(newSpan);
    }

    // Create and append/ remove Filter Banner
    const createFilterBanner = function (action, text) {
        const itemDisplay = document.querySelector('div#item-display');
        
        if (action === 'append') {
            const banner = document.createElement('h3');
            banner.setAttribute('id', 'filter-banner');

            if (text.includes('prio')) {
                createSpan(banner, `${text} icon`, '');
                createSpan(banner, 'main-text', `${formatting.toProper(text).slice(0,-5)} Priority`);
                
            } else {
                createSpan(banner, `${text} icon`, '');
                createSpan(banner, 'main-text', formatting.toProper(text));
            }
            

            itemDisplay.appendChild(banner);

        } else if (action === 'remove') {
            const banner = document.querySelector('h3#filter-banner');
            if (banner !== null) {
                itemDisplay.removeChild(banner);
            }
        }
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

    // Reusable status indicator icon maker
    const createStatusMarker = function (obj) {
        let todoType;
        if (obj.hasOwnProperty('projectId')) {
            todoType = 'project';
        } else {
            todoType = 'event';
        }

        const marker = new Image();
        marker.setAttribute('class', 'marker');
        let altAttr;
        let titleAttr;

        if (obj[`${todoType}Status`] === 'pending') {
            if (todoType === 'project') {
                marker.src = pendingIcon;
            } else {
                marker.src = pendingOrangeIcon;
            }
            
            altAttr = `${formatting.toProper(todoType)} status icon: Pending`;
            titleAttr = 'Pending';
        } else if (obj[`${todoType}Status`] === 'done') {
            marker.src = doneIcon;
            altAttr = `${formatting.toProper(todoType)} status icon: Completed`;
            titleAttr = 'Completed';
        }

        marker.setAttribute('alt', altAttr);
        marker.setAttribute('title', titleAttr);

        return marker;
    }

    // Create event and project icon for user indicator, UI related distinguish events and projects
    // Note: Parameter is string. Either 'events' or 'projects'
    const createIndicatorIcon = function (todoType) {
        const icon = new Image();

        if (todoType === 'projects') {
            icon.src = projectsIcon;
        } else {
            icon.src = eventsIcon;
        }
 
        icon.setAttribute('alt', `${todoType}-icon`);
        icon.setAttribute('class', 'indicator-icon');

        return icon;
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

            removeDisplay(projectFullView);

            // Note: removeActionBtn accepts multiple buttons argument
            removeActionBtn(editBtn, deleteBtn);

        }

        // Remove filter banner
        createFilterBanner('remove');
    }

    // Manually clear display panel of previews
    // Removes projects and events previews
    const hardClearItemDisplay = function () {
        // Clear display panel
        const projectPreviews = document.querySelectorAll('div.project-preview');
        const eventPreviews = document.querySelectorAll('div.event-preview');

        projectPreviews.forEach(preview => removeDisplay(preview));
        eventPreviews.forEach(event => {
            // if event preview is not part of a project fullview
            if (event.dataset.mode !== 'project-view') {
                removeDisplay(event);
            }
        });

        // Clear Filter Banner
        createFilterBanner('remove');
            
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
        
        backBtn.dataset.action = assignAction;

        if (assignAction === 'events-previews') {
            createFilterBanner('append', 'events');
            eventsDisplay.displayEventsToDOM();
            translateSidebar(true);
            
        } else if (assignAction === 'projects-previews') {
            createFilterBanner('append', 'projects');
            projectsDisplay.displayProjectsToDOM();
            translateSidebar(true);

        } else {

            if (assignAction.includes('prio')) {
                displayContentPriorityFiltered.displayPriorityFiltered(assignAction);

            } else {
                displayContentTimeFiltered.displayTimeFiltered(assignAction);
            }
            
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
            translateSidebar,
            backBtnEvents, 

            removeDisplay, 
            removeActionBtn, 
            clearItemDisplay, 
            hardClearItemDisplay,

            createActionBtn,
            createSpan,
            createFilterBanner,
            createStatusMarker,
            createIndicatorIcon,
        }

})();

export { displayContent };