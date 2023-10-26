import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { displayContentPriorityFiltered } from "../displayContentPriorityFiltered";

import { contentMaker } from "./contentMaker";

import { projectsDisplay } from "./projectsDisplay";
import { projectFullView } from "./projectFullView";

import { changeCategory } from "./changeCategory";

import { eventsDisplay } from "./eventsDisplay";
import { eventFullView } from "./eventFullView";
import { clearItemDisplay } from "./clearItemDisplay";

const displayContent = (function () {

    const translateSidebar = function (action) {
        const sidebar = document.querySelector('div#sidebar');
        const backBtn = document.querySelector('button#back-sidebar');
        
        if (action === true) {
            sidebar.classList.add('hidden');

        } else if (action === false) {
            sidebar.classList.remove('hidden');
            backBtn.dataset.action = 'default';
        }
    }

    // Note: button event triggered function
    const showDisplay = function (action, newSave) {
        const backBtn = document.querySelector('button#back-sidebar');
        
        // Add action attribute to back button
        // Note: this function can be linked with eventListener or not
        let assignAction;
        if (typeof action === 'string') {
            assignAction = action;

            if (newSave) {
                // If a new project is created, redirect user to project full view of new project
                const category = action.slice(0, -9);

                const categorySelected = document.querySelector(`div.category#${category}`);
                changeCategory.highlightCategory(categorySelected);
                changeCategory.defaultDisplay();
            }

        } else {
            // Note: Stop execution when category is currently selected,
            // is currently in previews view and is larger 768 (px);
            const selected = this.getAttribute('class').includes('selected');
            const previewView = document.querySelector('h3#filter-banner') !== null;
            const largeScreen = window.innerWidth >= 768;
            
            if (selected && previewView && largeScreen ) {
                return;
            }

            assignAction = `${this.getAttribute('id')}-previews`;

            changeCategory.highlightCategory(this);
            changeCategory.defaultDisplay();
        }
        
        backBtn.dataset.action = assignAction;

        if (assignAction === 'events-previews') {
            contentMaker.createFilterBanner('append', 'events');

            eventsDisplay.displayEventsToDOM();
            translateSidebar(true);
            
        } else if (assignAction === 'projects-previews') {
            contentMaker.createFilterBanner('append', 'projects');

            projectsDisplay.displayProjectsToDOM();
            translateSidebar(true);

        } else if (assignAction.includes('prio-previews')) {
            displayContentPriorityFiltered.displayPriorityFiltered(assignAction);
            
        } else {
            displayContentTimeFiltered.displayTimeFiltered(assignAction);
        }
    }

    const backSideBar = function () {
        const backAction = this.dataset.action;

        if (backAction === 'default') {
            return;   
        }
        
        if (backAction.includes('previews')) {
            translateSidebar(false);

        } else if (backAction.includes('fullview')) {
            
            const {mode, filter, link} = this.dataset;

            if (mode !== undefined) {
                clearItemDisplay.clear(backAction);   

                // Removes the additional datasets after executing clearItemDisplay function
                this.removeAttribute('data-mode');
                this.removeAttribute('data-link');

                // Show corresponding display, depending of the mode and action
                if (mode === 'project-view') {
                    projectFullView.showFullProject(link);

                } else if (mode === 'event-view') {
                    eventFullView.showFullEvent(link);
                }
            
            } else if (filter !== undefined) {
                // This executes when using time filter
                clearItemDisplay.clear(backAction);

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
                clearItemDisplay.clear(backAction);

                if (backAction === 'event-fullview') {
                    showDisplay('events-previews');

                } else if (backAction === 'project-fullview') {
                    showDisplay('projects-previews');
                }
            }
        } 
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
        }

})();

export { displayContent };