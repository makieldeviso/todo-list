import { eventsDisplay } from "./eventsDisplay";
import { projectsDisplay } from "./projectsDisplay";
import { memoryHandler } from "./memoryHandler";
import { displayContentTimeFiltered } from "../displayContentTimeFiltered";
import { displayContentPriorityFiltered } from "../displayContentPriorityFiltered";
import { formatting } from "./formatting";

import { contentMaker } from "./contentMaker";

const displayContent = (function () {

    const clearItemDisplay = function (action) {
        // Note: These variables might return null, conditions are specified which nodes will be used
        const projectFullView = document.querySelector('div.project-fullview');
        const eventFullView = document.querySelector('div.event-fullview');
        const editEventBtn = document.querySelector('button[value="edit-event"]');
        const deleteEventBtn = document.querySelector('button[value="delete-event"]');
        const editProjectBtn = document.querySelector('button[value="edit-project"]');
        const deleteProjectBtn = document.querySelector('button[value="delete-project"]');

        if (action === 'projects-previews' || action === 'events-previews' ) {
            // Remove filter banner and previews
            contentMaker.createFilterBanner('remove');

        } else if (action === 'event-fullview') {
            // Close/ remove event full view
            contentMaker.removeDisplay(eventFullView);

            // Note: contentMaker.removeActionBtn accepts multiple buttons argument
            contentMaker.removeActionBtn(editEventBtn, deleteEventBtn);
  
        } else if (action === 'project-fullview') {
            // Close/ remove event full view
            contentMaker.removeDisplay(projectFullView);

            // Note: contentMaker.removeActionBtn accepts multiple buttons argument
            contentMaker.removeActionBtn(editProjectBtn, deleteProjectBtn);

        } else if (action === 'category-change') {
            // Note: Removes all possible items on the item display

            // Remove full views or previews
           const allFullViews = [projectFullView, eventFullView];
           allFullViews.forEach(item => {
                if (item !== null) {
                    contentMaker.removeDisplay(item);
                }
           });

           // Remove filter banner and previews
           contentMaker.createFilterBanner('remove');

            // Remove action buttons
           contentMaker.removeActionBtn(editEventBtn, deleteEventBtn, editProjectBtn, deleteProjectBtn);
        }
    }

    // Revert display to default
    const defaultDisplay = function () {
        
        // Clears display
        clearItemDisplay('category-change');

        // Removes dataset on the back button
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.dataset.action = 'default';
        const addedDataset = ['filter', 'mode', 'link'];
        addedDataset.forEach(dataset => {
            if (backBtn.hasAttribute(`data-${dataset}`)) {
                backBtn.removeAttribute(`data-${dataset}`);
            }
        });
    }

    // Add UI highlight to selected category/ filter
    const highlightCategory = function (categoryNode) {
        const categories = Array.from(document.querySelectorAll('div.category'));
        // Remove selected class of previous category
        categories.some(node => {
            let found;
            if (node.getAttribute('class').includes('selected')) {
                node.classList.remove('selected');
                found = true;
            }
            return found
        });

        // Add selected class to new selected node 
        categoryNode.classList.add('selected');
    }

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
                highlightCategory(categorySelected);
                defaultDisplay();
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

            highlightCategory(this);
            
            defaultDisplay();
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
                clearItemDisplay(backAction);   

                // Removes the additional datasets after executing clearItemDisplay function
                this.removeAttribute('data-mode');
                this.removeAttribute('data-link');

                // Show corresponding display, depending of the mode and action
                if (mode === 'project-view') {
                    projectsDisplay.showFullProject(link);

                } else if (mode === 'event-view') {
                    eventsDisplay.showFullEvent(link);
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

            clearItemDisplay, 

            highlightCategory,
            defaultDisplay,
        }

})();

export { displayContent };