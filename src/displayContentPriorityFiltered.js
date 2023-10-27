import { memoryHandler } from "./apps/memoryHandler";
import { formatting } from "./apps/formatting";

import { displayContent } from "./apps/displayContent";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

import { contentMaker } from "./apps/contentMaker";

const displayContentPriorityFiltered = (function () {

    // Dataset converter
    const convertDataSet = function (priorityString) {
        const priorityConditions = ['high', 'mid', 'low'];

        const priority = priorityConditions.find(prio => priorityString.includes(prio));

        return priority;
    }

    // Reusable create and append filtered preview to the item display
    const createFilteredPreview = function (objArray, filterName) {
        // Create and append project previews on itemDisplay
        const previewsCont = document.querySelector('div#previews-container');

        if (objArray.length !== 0) {
            objArray.forEach(obj => {
                // Note: conditional detect if obj is eventObj or projectObj
                let preview;
                if ( Object.hasOwn(obj, 'projectId') ) {
                    preview = projectsDisplay.createProjectPreview(obj);
    
                } else if ( Object.hasOwn(obj, 'eventId') ) {
                    preview = eventsDisplay.createEventDisplay(obj);
                }
    
                preview.dataset.filter = filterName;
                previewsCont.appendChild(preview);
            });

        } else {
            const emptyNotif = contentMaker.createEmptyPreviews(`${convertDataSet(filterName)} Priority`);
            previewsCont.appendChild(emptyNotif);
        }
    }

    // Return array of todoItems(objects) filtered by priority condition argument
    const priorityFilter = function (objArray, condition) {
        const filteredArray = objArray.filter(obj => obj.priority === condition);

        return filteredArray;
    }
    
    // Count priority filtered todo (array.length)
    // Note: needs condition argument, then return the length of the filtered array
    const countPriorityFiltered = function (condition) {
        const todoArray = memoryHandler.getAll();
        const filteredArray = priorityFilter(todoArray, condition);
        return filteredArray.length;
    }

    const displayPriorityFiltered = function (action) {

        const initiateFilter = function (priority) {
            const todoArray = memoryHandler.getAll();

            // filter todo items according to priority
            const filteredObj = priorityFilter(todoArray, priority);

            // Sort project and event objects from upcoming to farthest time
            const sortedObj = formatting.sortProjectsAndEvents(filteredObj);

            // Create and append time filter banner to item display
            contentMaker.createFilterBanner('append', `${priority}-prio`);

            // Create and append filtered projects and events previews
            createFilteredPreview(sortedObj, `${priority}-prio-view`);
        }
        
        const priority = convertDataSet(action);
        initiateFilter(priority);

        if (action.includes('previews')) {
            displayContent.translateSidebar(true);
        }
        
    }

    return {displayPriorityFiltered, 
            convertDataSet,
            countPriorityFiltered,
        }

})();

export {displayContentPriorityFiltered};