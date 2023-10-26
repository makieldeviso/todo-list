import { formatting } from "./formatting";

import pendingIcon from '../assets/pending-white.svg';
import pendingOrangeIcon from '../assets/pending-orange.svg';
import doneIcon from '../assets/done.svg';
import projectsIcon from '../assets/projects-icon.svg'
import eventsIcon from '../assets/events-icon.svg'
import emptyIcon from '../assets/empty.svg';

import { projectsScripts } from "./projectsScripts";
import { eventsScript } from "./eventsScript";

const contentMaker = (function () {

    // Reusable p text maker function
    const makeText = function (assignClass, text) {
        const newText = document.createElement('p');
        newText.setAttribute('class', assignClass);
        newText.textContent = text;

        if ( assignClass.includes('prio') ) {
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

    const removeDisplay = function (item) {
        const itemDisplay = document.querySelector('div#item-display');
        itemDisplay.removeChild(item);
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
        if (Object.hasOwn(obj, 'projectId')) {
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

        let assignClass;
        if (todoType === 'projects') {
            icon.src = projectsIcon;
            assignClass = 'indicator';

        } else if (todoType === 'events') {
            icon.src = eventsIcon;
            assignClass = 'indicator';

        } else if (todoType === 'empty') {
            icon.src = emptyIcon;
            assignClass = 'indicator-empty';
        }
 
        icon.setAttribute('alt', `${todoType}-icon`);
        icon.setAttribute('class', `${assignClass}-icon`);

        return icon;
    }

        // Create and append/ remove Filter Banner
    // Note: Whenever a banner is created/ removed a previews-container is also created/ removed
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

            const previewsCont = document.createElement('div');
            previewsCont.setAttribute('id', 'previews-container');
            itemDisplay.appendChild(previewsCont);

        } else if (action === 'remove') {
            const banner = document.querySelector('h3#filter-banner');
            const previewsCont = document.querySelector('div#previews-container');
            if (banner !== null) {
                itemDisplay.removeChild(banner);
                itemDisplay.removeChild(previewsCont);
            }
        }
    }

    // Create empty previews notification
    const createEmptyPreviews = function (category) {
        const notifCont = document.createElement('div');
        notifCont.setAttribute('class', 'empty-notif');

        const icon = createIndicatorIcon('empty');
        const messageText = document.createElement('p');
        messageText.setAttribute('class', 'empty-msg');
        messageText.textContent = `No ${formatting.toProper(category)}`;

        const components = [icon, messageText];
        components.forEach(comp => notifCont.appendChild(comp));

        return notifCont;
    }

    // Reusable task counter creator function
    const createEventCounter = function (project) {
        const newEventCounter = document.createElement('p');
        newEventCounter.setAttribute('class', 'project-event-count pending');
        newEventCounter.dataset.id = project.projectId;

        const done = projectsScripts.countDoneEvents(project);
        const total = projectsScripts.countEventsOfProject(project);

        createSpan(newEventCounter, 'done', `${done}`);
        createSpan(newEventCounter, 'slash', '/');
        createSpan(newEventCounter, 'total', `${total}`);
        createSpan(newEventCounter, 'label', 'events');

        if (done === total) {
            newEventCounter.classList.remove('pending');
            newEventCounter.classList.add('done');
        } 

        return newEventCounter;
    }

        // Reusable task counter creator function
        const createTaskCounter = function (event) {
            const newTaskCounter = document.createElement('p');
            newTaskCounter.setAttribute('class', 'event-task-count pending');
            newTaskCounter.dataset.id = event.eventId;
    
            const { tasks } = event; // this is Object
            const done = eventsScript.countDoneTasks(tasks);
            const total = eventsScript.countTasksOfEvent(tasks);
    
            contentMaker.createSpan(newTaskCounter, 'done', `${done}`);
            contentMaker.createSpan(newTaskCounter, 'slash', '/');
            contentMaker.createSpan(newTaskCounter, 'total', `${total}`);
            contentMaker.createSpan(newTaskCounter, 'label', 'tasks');
    
            if (done === total) {
                newTaskCounter.classList.remove('pending');
                newTaskCounter.classList.add('done');
            } 
    
            return newTaskCounter;
        }

        
    

    return { 
        makeText,
        createSpan, 
        removeDisplay, 
        removeActionBtn, 
        createActionBtn, 
        createStatusMarker,
        createIndicatorIcon,
        createFilterBanner,
        createEmptyPreviews,
        createEventCounter,
        createTaskCounter,
    }

})();

export { contentMaker }