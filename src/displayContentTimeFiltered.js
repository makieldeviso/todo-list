import { memoryHandler } from "./apps/memoryHandler";
import { format } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns' ;
import { displayContent } from "./apps/displayContent";
import { eventsDisplay } from "./apps/eventsDisplay";
import { projectsDisplay } from "./apps/projectsDisplay";

const displayContentTimeFiltered = (function () {

    const displayTimeFiltered = function (action) {
        if (action === 'today-previews') {
            displayToday();
            displayContent.translateSidebar(true);
        } else {
            return;
        }
    }

    const displayToday = function () {
        const todayDate = format(new Date(), 'MMMM, dd, yyyy');
        const itemDisplay = document.querySelector('div#item-display');

        console.log(todayDate);

        const projects = memoryHandler.getProjects();
        const events = memoryHandler.getEvents();

        const todayProjects = projects.filter(project => format(project.deadline, 'MMMM, dd, yyyy') === todayDate);
        const todayEvents = events.filter(event => format(event.schedule, 'MMMM, dd, yyyy') === todayDate);

        // Create and append project previews on itemDisplay
        todayProjects.forEach(project => {
            const projectDisplay = projectsDisplay.createProjectPreview(project);
            projectDisplay.dataset.filter = 'today-view';
            itemDisplay.appendChild(projectDisplay);
        });

        // Create and append event previews on itemDisplay
        todayEvents.forEach(event => {
            const eventDisplay = eventsDisplay.createEventDisplay(event);
            eventDisplay.dataset.filter = 'today-view';
            itemDisplay.appendChild(eventDisplay);
        });

    }


    return {displayTimeFiltered, displayToday}



})();

export {displayContentTimeFiltered}