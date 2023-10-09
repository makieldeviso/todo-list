import { memoryHandler } from "./apps/memoryHandler";
import { format, differenceInCalendarDays  } from 'date-fns';
import { displayContent } from "./apps/displayContent";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

const displayContentTimeFiltered = (function () {

    // Reusable create and append filtered preview to the item display
    const createFilteredPreview = function (objArray, filterName) {
        // Create and append project previews on itemDisplay
        const previewsCont = document.querySelector('div#previews-container');

        if (objArray.length !== 0) {
            objArray.forEach(obj => {
                // Note: conditional detect if obj is eventObj or projectObj
                let preview;
                if (obj.hasOwnProperty('projectId')) {
                    preview = projectsDisplay.createProjectPreview(obj);
    
                } else if (obj.hasOwnProperty('eventId')) {
                    preview = eventsDisplay.createEventDisplay(obj);
                }
    
                preview.dataset.filter = filterName;
                previewsCont.appendChild(preview);
            });

        } else {
            const emptyNotif = displayContent.createEmptyPreviews(convertDataSet(filterName));
            previewsCont.appendChild(emptyNotif);
        }
         
    }

    // Return array of todoItems(objects) filtered by time condition argument
    const timeFilter = function (objArray, condition) {
        const filteredObj = objArray.filter(obj => {
            let objDeadline;
            let objStatus;
            if (obj.hasOwnProperty('projectId')) {
                objDeadline = obj.deadline;
                objStatus = obj.projectStatus;
            } else if (obj.hasOwnProperty('eventId')) {
                objDeadline = obj.schedule;
                objStatus = obj.eventStatus;
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
            } else if (condition === 'overdue' && objStatus === 'pending') {
                if (dayDiff < 0) {
                    return obj;
                }
            }
        });

        return filteredObj
    }

    // Count time filtered todo (array.length)
    // Note: needs condition argument, then return the length of the filtered array
    const countTimeFiltered = function (condition) {
        const todoArray = memoryHandler.getAll();
        const filteredArray = timeFilter(todoArray, condition);
        return filteredArray.length;
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
    
    // Dataset converter
    const convertDataSet = function (datasetString) {
        const timeConditions = ['today', 'upcoming', 'someday', 'overdue'];

        const assignAction = timeConditions.find(time => datasetString.includes(time));

        return assignAction;
    }

    // Reminder: As much as possible don't pass converted argument, use dataset
    const displayTimeFiltered = function (action) {

        // Executable function
        // Note: Decided to write as function, easier to read
        const initiateFilter = function (time) {
            const todoArray = memoryHandler.getAll();
            
            // Filters projects and events according to time filter
            const timeObjArray = timeFilter(todoArray, time);
            
            // Create and append time filter banner to item display
            displayContent.createFilterBanner('append', time);

            // Sort project and event objects from upcoming to farthest time
            // Note: todayArray is not sorted, order is projects then events
            let sortedObj;
            if (time !== 'today') {
                sortedObj = sortProjectsAndEvents(timeObjArray);
            } else {
                sortedObj = timeObjArray;
            }
    
            // Create and append filtered projects and events previews
            createFilteredPreview(sortedObj, `${time}-view`);
        }

        // Run initiateFilter function
        const filter = convertDataSet(action);
        initiateFilter(filter);

        if (action.includes('previews')) {
            displayContent.translateSidebar(true);
        }
    }

    return {displayTimeFiltered, 
            sortProjectsAndEvents,
            timeFilter, 
            countTimeFiltered,
            convertDataSet,
        }

})();

export {displayContentTimeFiltered}