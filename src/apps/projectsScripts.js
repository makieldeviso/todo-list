import { differenceInCalendarDays } from 'date-fns' ;
import { memoryHandler } from "./memoryHandler";
import { formatting } from './formatting';

const projectsScripts = (function () {

    const getProperty = function (id, prop) {
        const projectObj = memoryHandler.getProject(id);
        const projectProperty = projectObj[prop];
        return projectProperty;
    }

    const checkDeadline = function (dateToCheck) {
        const today = new Date();
        
        const daysApart = differenceInCalendarDays(dateToCheck, today);

        let deadlineAlert;

        if (daysApart < 0) {
            deadlineAlert = 'overdue';
        } else if (daysApart === 0) {
            deadlineAlert = 'today';
        } else if (daysApart > 0 && daysApart <= 7) {
            deadlineAlert = 'upcoming';
        } else if (daysApart > 7) {
            deadlineAlert = 'far';
        }

        return deadlineAlert;
    }

    const getProjectEvents = function (project) {
        const projectEvents = getProperty(project.projectId, 'eventLinks');
        const eventsKeys = Object.keys(projectEvents);
        const eventsLinks = eventsKeys.map(key => project.eventLinks[key]);

        const eventsFromMemory = memoryHandler.getEvents();

        const projectEventObj = [];

        for (let i = 0; i < eventsLinks.length; i++) {
            const eventSearch = eventsFromMemory.find(obj => obj.eventId === eventsLinks[i]);
            projectEventObj.push(eventSearch);
        }
        
        // Sort events from earliest to farthest schedule
        const sortedEvents = formatting.sortProjectsAndEvents(projectEventObj);

        return sortedEvents; // return array of objects
    }

    const countEventsOfProject = function (project) {
        const projectEvents = getProperty(project.projectId, 'eventLinks');
        const eventsKeys = Object.keys(projectEvents);
        const eventsCount = eventsKeys.length;

        return eventsCount
    }

    const countDoneEvents = function (project) {
        const projectEvents = getProjectEvents(project);
    
        const doneEvents = projectEvents.filter(event => event.eventStatus === 'done');
        const doneEventsCount = doneEvents.length;

        return doneEventsCount;
    }

    const projectEventsCompleted = function (project) {
        let result = false;

        const doneEvents = countDoneEvents(project);
        const eventsOfProject = countEventsOfProject(project);

        if (doneEvents === eventsOfProject) {
            result = true;
        } 

        return result;
    }

    return {getProperty, checkDeadline, countEventsOfProject, countDoneEvents, getProjectEvents, projectEventsCompleted}

})();

export {projectsScripts}