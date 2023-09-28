import { memoryHandler } from "./apps/memoryHandler";
import { format, differenceInCalendarDays  } from 'date-fns';
import { displayContent } from "./apps/displayContent";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

const displayContentTimeFiltered = (function () {

    const displayTimeFiltered = function (action) {

        if (action === 'today-previews') {
            displayToday();
            displayContent.translateSidebar(true);

        } else if (action === 'upcoming-previews') {
            displayUpcoming();
            displayContent.translateSidebar(true);

        } else if (action === 'someday-previews') {
            displaySomeday();
            displayContent.translateSidebar(true);

        } else {
            return;
        }
    }
    
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

    const timeFilter = function (objArray, condition) {
        const filteredObj = objArray.filter(obj => {
            let objDeadline;
            if (obj.hasOwnProperty('projectId')) {
                objDeadline = obj.deadline;
            } else if (obj.hasOwnProperty('eventId')) {
                objDeadline = obj.schedule;
            }

            const dayDiff = differenceInCalendarDays(objDeadline, new Date());
            
            if (condition === 'upcoming') {
                if (dayDiff <= 7 && dayDiff > 0) {
                    return obj;
                }
            } else if (condition === 'someday') {
                if (dayDiff >= 1) {
                    return obj;
                }
            } else if (condition === 'today') {
                const todayDateFormatted = format(new Date(),'MMMM, dd, yyyy');
                const objDeadlineFormatted = format(objDeadline,'MMMM, dd, yyyy');

                if (todayDateFormatted === objDeadlineFormatted) {
                    return obj;
                }
            }
        });

        return filteredObj
    }

    // Merge projectObjs and eventObjs into an array, then sort from upcoming to far time schedule/ deadline
    // Note: projectObj and eventObjs parameter needs array arguments
    const sortProjectsAndEvents = function (objectsArray) {
        const sortedObj = objectsArray.sort((a, b) => {
            let aTime;
            let bTime;

            if (a.hasOwnProperty('projectId')) {
                aTime = a.deadline;
            } else if (a.hasOwnProperty('eventId')) {
                aTime = a.schedule;
            }

            if (b.hasOwnProperty('projectId')) {
                bTime = b.deadline;
            } else if (b.hasOwnProperty('eventId')) {
                bTime = b.schedule;
            }
            return aTime - bTime
        });
        
            return sortedObj;
        }
    

    const displayToday = function () {
        const todayDate = format(new Date(), 'MMMM, dd, yyyy');

        const todoArray = memoryHandler.getAll();

        // Filter today projects and events
        const todayObjArray = timeFilter(todoArray, 'today');

        displayContent.createFilterBanner('append', 'today');

        // Create and append project previews on itemDisplay
        // Note: todayArray is not sorted, order is projects then events
        createFilteredPreview(todayObjArray, 'today-view');
    }

    const displayUpcoming = function () {
        const todoArray = memoryHandler.getAll();

        // Filters upcoming projects and events
        const upcomingObjArray = timeFilter(todoArray, 'upcoming');

        // Sort project and event objects from upcoming to farthest time
        const sortedObj = sortProjectsAndEvents(upcomingObjArray);

        displayContent.createFilterBanner('append', 'upcoming');

        // Create and append upcoming projects and events previews
        createFilteredPreview(sortedObj, 'upcoming-view');
    }

    const displaySomeday = function () {
        const todoArray = memoryHandler.getAll();

        // Filters someday projects and events
        const somedayObjArray = timeFilter(todoArray, 'someday');

        // Sort project and event objects from upcoming to farthest time
        const sortedObj = sortProjectsAndEvents(somedayObjArray);

        displayContent.createFilterBanner('append', 'someday');

        // Create and append someday projects and events previews
        createFilteredPreview(sortedObj, 'someday-view');
    }


    return {displayTimeFiltered, displayToday, displayUpcoming, displaySomeday}

})();

export {displayContentTimeFiltered}