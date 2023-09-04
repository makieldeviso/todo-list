import { memoryHandler } from "./memoryHandler";
import { eventsScript } from "./eventsScript";

const projectsScripts = (function () {


    const getProperty = function (id, prop) {
        const projectObj = memoryHandler.getProject(id);
        const projectProperty =projectObj[prop];
        return projectProperty;
    }

    const checkDeadline = function (dateToCheck) {
        // Note: Borrows function from eventsScript module
        // Decided to bring in this module to remove confusion
        return eventsScript.checkDeadline(dateToCheck);
    }

    // const getEventStatus = function () {
        
    // }

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
        
        return projectEventObj; //return array of objects
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



    return {getProperty, checkDeadline, countEventsOfProject, countDoneEvents}

})();

export {projectsScripts}