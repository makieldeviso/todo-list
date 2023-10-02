import { memoryHandler } from "./apps/memoryHandler";
import { displayContent } from "./apps/displayContent";
import { displayContentTimeFiltered } from "./displayContentTimeFiltered";
import { formatting } from "./apps/formatting";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

const displayContentPriorityFiltered = (function () {

    // Reusable create and append filtered preview to the item display
    const createFilteredPreview = function (objArray, filterName) {
        // Create and append project previews on itemDisplay
        const itemDisplay = document.querySelector('div#item-display');

         objArray.forEach(obj => {
            // Note: conditional detect if obj is eventObj or projectObj
            let preview;
            if (obj.hasOwnProperty('projectId')) {
                preview = projectsDisplay.createProjectPreview(obj);

            } else if (obj.hasOwnProperty('eventId')) {
                preview = eventsDisplay.createEventDisplay(obj);
            }

            preview.dataset.filter = filterName;
            itemDisplay.appendChild(preview);
        });
    }

    // Dataset converter
    const convertDataSet = function (datasetString) {
        const priorityConditions = ['high', 'mid', 'low'];

        const priority = priorityConditions.find(time => datasetString.includes(time));

        return priority;
    }

    // Return array of todoItems(objects) filtered by priority condition argument
    const priorityFilter = function (objArray, condition) {
        const filteredArray = objArray.filter(obj => obj.priority === condition);

        return filteredArray;
    }

    const displayPriorityFiltered = function (action) {

        const initiateFilter = function (priority) {
            const todoArray = memoryHandler.getAll();

            // filter todo items according to priority
            const filteredObj = priorityFilter(todoArray, priority);

            // Sort project and event objects from upcoming to farthest time
            const sortedObj = displayContentTimeFiltered.sortProjectsAndEvents(filteredObj);

            // Create and append time filter banner to item display
            displayContent.createFilterBanner('append', `${formatting.toProper(priority)} Priority`);

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
        }

})();

export {displayContentPriorityFiltered};