import { format, differenceInCalendarDays } from 'date-fns';
import { memoryHandler } from "./apps/memoryHandler";
import { formatting } from './apps/formatting';

import { displayContent } from "./apps/displayContent";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

import { contentMaker } from './apps/contentMaker';

const displayContentTimeFiltered = (function () {

    // Dataset converter
    const convertDataSet = function (datasetString) {
        const timeConditions = ['today', 'upcoming', 'someday', 'overdue'];

        const assignAction = timeConditions.find(time => datasetString.includes(time));

        return assignAction;
    }

    // Reusable create and append filtered preview to the item display
    const createFilteredPreview = function (objArray, filterName) {
        // Create and append project previews on itemDisplay
        const previewsCont = document.querySelector('div#previews-container');

        if (objArray.length !== 0) {
            objArray.forEach(obj => {
                // Note: conditional detect if obj is eventObj or projectObj
                let preview;
                if (Object.hasOwn(obj, 'projectId')) {
                    preview = projectsDisplay.createProjectPreview(obj);
    
                } else if (Object.hasOwn(obj, 'eventId')) {
                    preview = eventsDisplay.createEventDisplay(obj);
                }
    
                preview.dataset.filter = filterName;
                previewsCont.appendChild(preview);
            });

        } else {
            const emptyNotif = contentMaker.createEmptyPreviews(convertDataSet(filterName));
            previewsCont.appendChild(emptyNotif);
        }
         
    }

    // Return array of todoItems(objects) filtered by time condition argument
    const timeFilter = function (objArray, condition) {
        const filteredObj = objArray.filter(obj => {
            let objDeadline;
            let objStatus;
            if (Object.hasOwn(obj, 'projectId')) {
                objDeadline = obj.deadline;
                objStatus = obj.projectStatus;

            } else if (Object.hasOwn(obj, 'eventId')) {
                objDeadline = obj.schedule;
                objStatus = obj.eventStatus;
            }

            const dayDiff = differenceInCalendarDays(objDeadline, new Date());
            
            let requiredObj;
            if (condition === 'upcoming') {
                if (dayDiff <= 7 && dayDiff > 0) {
                    requiredObj = obj;
                }
            } else if (condition === 'someday') {
                if (dayDiff >= 1) {
                    requiredObj = obj;
                }
            } else if (condition === 'today') {
                const todayDateFormatted = format(new Date(),'MMMM, dd, yyyy');
                const objDeadlineFormatted = format(objDeadline,'MMMM, dd, yyyy');

                if (todayDateFormatted === objDeadlineFormatted) {
                    requiredObj = obj;
                }
            } else if (condition === 'overdue' && objStatus === 'pending') {
                if (dayDiff < 0) {
                    requiredObj = obj;
                }
            }

            return requiredObj;
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

    // Reminder: As much as possible don't pass converted argument, use dataset
    const displayTimeFiltered = function (action) {

        // Executable function
        // Note: Decided to write as function, easier to read
        const initiateFilter = function (time) {
            const todoArray = memoryHandler.getAll();
            
            // Filters projects and events according to time filter
            const timeObjArray = timeFilter(todoArray, time);
            
            // Create and append time filter banner to item display
            contentMaker.createFilterBanner('append', time);

            // Sort project and event objects from upcoming to farthest time
            // Note: todayArray is not sorted by schedule/ deadline, order is sorted with creation date
            let sortedObj;
            if (time !== 'today') {
                sortedObj = formatting.sortProjectsAndEvents(timeObjArray);
            } else {
                sortedObj = timeObjArray.sort((a, b) => b.creationDate - a.creationDate);
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
            timeFilter, 
            countTimeFiltered,
            convertDataSet,
        }

})();

export {displayContentTimeFiltered}