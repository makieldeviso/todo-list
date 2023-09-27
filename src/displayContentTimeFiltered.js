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

    // Merge projectObjs and eventObjs into an array, then sort from upcoming to far time schedule/ deadline
    // Note: projectObj and eventObjs parameter needs array arguments
    const sortProjectsAndEvents = function (projectObjs, eventObjs) {
        const consolidatedObj = [...projectObjs, ...eventObjs];
        const sortedObj = consolidatedObj.sort((a, b) => {
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

        const projects = memoryHandler.getProjects();
        const events = memoryHandler.getEvents();

        const todayProjects = projects.filter(project => format(project.deadline, 'MMMM, dd, yyyy') === todayDate);
        const todayEvents = events.filter(event => format(event.schedule, 'MMMM, dd, yyyy') === todayDate);

        displayContent.createFilterBanner('append', 'today');

        // Create and append project previews on itemDisplay
        createFilteredPreview(todayProjects, 'today-view');

        // Create and append event previews on itemDisplay
        createFilteredPreview(todayEvents, 'today-view');
    }

    const displayUpcoming = function () {

        const projects = memoryHandler.getProjects();
        const events = memoryHandler.getEvents();

        // Filters upcoming projects
        const upcomingProjects = projects.filter(project => {
            const projectDeadline = project.deadline;
            const dayDiff = differenceInCalendarDays(projectDeadline, new Date());
            
            if (dayDiff <= 7 && dayDiff > 0) {
                return project;
            }
        });

         // Filters upcoming events
        const upcomingEvents = events.filter(event => {
            const eventSched = event.schedule;
            const dayDiff = differenceInCalendarDays(eventSched, new Date());

            if (dayDiff <= 7 && dayDiff > 0) {
                return event;
            }
        });

        const sortedObj = sortProjectsAndEvents(upcomingProjects, upcomingEvents);

        displayContent.createFilterBanner('append', 'upcoming');

        // Create and append upcoming projects and events previews
        createFilteredPreview(sortedObj, 'upcoming-view');
    }

    const displaySomeday = function () {
        const projects = memoryHandler.getProjects();
        const events = memoryHandler.getEvents();

        // Filters someday projects
        const somedayProjects = projects.filter(project => {
            const projectDeadline = project.deadline;
            const dayDiff = differenceInCalendarDays(projectDeadline, new Date());
            
            if (dayDiff >= 1 ) {
                return project;
            }
        });

         // Filters someday events
        const somedayEvents = events.filter(event => {
            const eventSched = event.schedule;
            const dayDiff = differenceInCalendarDays(eventSched, new Date());

            if (dayDiff >= 1) {
                return event;
            }
        });

        displayContent.createFilterBanner('append', 'someday');

        // Create and append someday projects preview
        createFilteredPreview(somedayProjects, 'someday-view');

        // Create and append someday events preview
        createFilteredPreview(somedayEvents, 'someday-view')

    }


    return {displayTimeFiltered, displayToday, displayUpcoming, displaySomeday}

})();

export {displayContentTimeFiltered}