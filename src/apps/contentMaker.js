import { formatting } from "./formatting";

import pendingIcon from '../assets/pending-white.svg';
import pendingOrangeIcon from '../assets/pending-orange.svg';
import doneIcon from '../assets/done.svg';
import projectsIcon from '../assets/projects-icon.svg'
import eventsIcon from '../assets/events-icon.svg'
import emptyIcon from '../assets/empty.svg';

const contentMaker = (function () {

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

            contentMaker.createSpan(newBtn, 'icon', '');
            contentMaker.createSpan(newBtn, 'text', text);

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
                contentMaker.createSpan(banner, `${text} icon`, '');
                contentMaker.createSpan(banner, 'main-text', `${formatting.toProper(text).slice(0,-5)} Priority`);
                
            } else {
                contentMaker.createSpan(banner, `${text} icon`, '');
                contentMaker.createSpan(banner, 'main-text', formatting.toProper(text));
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

        const icon = contentMaker.createIndicatorIcon('empty');
        const messageText = document.createElement('p');
        messageText.setAttribute('class', 'empty-msg');
        messageText.textContent = `No ${formatting.toProper(category)}`;

        const components = [icon, messageText];
        components.forEach(comp => notifCont.appendChild(comp));

        return notifCont;
    }

    return { 
        createSpan, 
        removeDisplay, 
        removeActionBtn, 
        createActionBtn, 
        createStatusMarker,
        createIndicatorIcon,
        createFilterBanner,
        createEmptyPreviews
    }

})();

export { contentMaker }