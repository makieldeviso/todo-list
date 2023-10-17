import { differenceInCalendarDays } from 'date-fns';
import { projectsScripts } from './projectsScripts';

const memoryHandler = (function () {
    // Checks validity of local strorage value
    const getStorageArray = function (todoType) {
        const storageStringified = JSON.stringify(localStorage);
        const allItems = JSON.parse(storageStringified);

        if (todoType === 'events') {
            const events = [];
            for (const item in allItems) {
                
                const value = JSON.parse(allItems[item]);
                
                if (value.hasOwnProperty('eventId')) {
                    events.push(value);
                }
            }

            return events;
        } 

        if (todoType === 'projects') {
            const projects = [];
            for (const item in allItems) {
                const value = JSON.parse(allItems[item]);
            
                if (value.hasOwnProperty('projectId')) {
                    projects.push(value);
                }
            }

            return projects;
        }
    }   

    // Replace/ set value of the todo item in the local storage
    // If id does not exist, create new key value pair
    const reassignStorageItem = function (id, newValue ) {
        // Note: id -> localStorage item key
        // newValue -> Object, assigned as a new value for id
        
        localStorage.setItem(id, JSON.stringify(newValue));
    }

    // Events (start) -
    const saveEvent = function(newEvent) {
        // Save new event using reassignStorageItem function
        reassignStorageItem(newEvent.eventId, newEvent);
    };

    const getEvents = function () {
        const events = getStorageArray('events');
        return events;
    }

    const getEvent = function (id) {
        const eventObj = JSON.parse(localStorage.getItem(id));

        return eventObj;
    }

    const getEventTasks = function (id) {
        const eventObj = getEvent(id);
        const eventTasksList = eventObj.tasks;

        return eventTasksList;
    }

    const changeTaskStatus = function (id, number, statusChange) {

        // Get temporary object
        const eventObj = getEvent(id);
        
        // Get tasks list of event for mod then change status
        const eventTasksList = getEventTasks(eventObj.eventId);
        eventTasksList[`${number}`].status = statusChange;

        // Assign tasks value to the temporary event Obj
        eventObj.tasks = eventTasksList;

        // Replace/ set value of the event in the local storage with the changes in tasks list value
        reassignStorageItem(id, eventObj);
    }

    const countEvents = function () {
        const eventsCount = getEvents().length;
        return eventsCount;
    }

    // Mark complete an event
    const completeEvent = function (id) {
        const eventObj = getEvent(id);

        eventObj.eventStatus = 'done';

        // add property completion
        const completionDate = new Date();
        const schedule = eventObj.schedule;
        const deadlineAlert =  differenceInCalendarDays(schedule, completionDate);

        let completionRemark;

        if (deadlineAlert === 0 ) {
            completionRemark = 'on-time';
        } else if (deadlineAlert > 0) {
            completionRemark = 'early';
        } else if (deadlineAlert < 0) {
            completionRemark = 'late';
        }

        eventObj.completion = completionRemark;

        reassignStorageItem(id, eventObj);
    }

    const replaceEvent = function (oldId, newEventObj) {
        localStorage.removeItem(oldId);
        reassignStorageItem(newEventObj.eventId, newEventObj);
    }

    const deleteEvent = function (id) {
        localStorage.removeItem(id);
    }

    const linkEventToProject = function (eventId, projectId) {
        const eventObj = getEvent(eventId);
        eventObj.projectTag = projectId;

        reassignStorageItem(eventId, eventObj);
    }

    const unlinkEventToProject = function (id) {
        const eventObj = getEvent(id);
        eventObj.projectTag = 'standalone';

        reassignStorageItem(id, eventObj);
    }


// Events (end) -

// Projects (start) -

const saveProject = function (projectObj) {
    // Save new event using reassignStorageItem function
    reassignStorageItem(projectObj.projectId, projectObj);
}

const getProjects = function () {
    const projects = getStorageArray('projects')
    return projects;
}

const getProject = function (id) {
    const projectObj = JSON.parse(localStorage.getItem(id));
    return projectObj;
}

const countProjects = function () {
    const projectsCount = getProjects().length;
    return projectsCount;
}

const getProjectForMod = function (projectId) {
    // Find the project from the memory

    let projectForMod;
    if (projectId !== 'standalone') {
        projectForMod = getProject(projectId);

    } else {
        projectForMod = 'standalone';
    }

    return projectForMod;
}

const addEventToProject = function (projectId, eventId) {
    const projectForMod = getProjectForMod(projectId);

    // Count current number for events for identification
    const eventsCount = projectsScripts.countEventsOfProject(projectForMod);

    // Modify the project by adding a new event link
    projectForMod.eventLinks[`event-${eventsCount + 1}`] = eventId;

    reassignStorageItem(projectId, projectForMod);
}

const deleteEventFromProject = function (eventId, projectId) {
    const projectForMod = getProjectForMod(projectId);
    const projectEvents = projectForMod.eventLinks;
    
    // Create temp object that reassign event keys and omit event for deletion
    const tempEvents = {};
    for (const key in projectEvents) {
        if (projectEvents[key] !== eventId) {
            tempEvents[`event-${Object.keys(tempEvents).length + 1}`] = projectEvents[key];
        }
    }

    // Assign new value to the eventLinks
    projectForMod.eventLinks = tempEvents;

    reassignStorageItem(projectId, projectForMod);
}

const modifyEventLink = function (eventForMod, newEventId, oldProjectTag, newProjectTag) {
    const projectForMod = getProjectForMod(oldProjectTag);

    if (oldProjectTag === newProjectTag) {
        // if the same project tag and eventId was not changed or if event is mot linked to a project
        if (eventForMod === newEventId || projectForMod === 'standalone' ) {
            return;

        } else {
            // if projectTag is still the same but the title and/or schedule was changed
            const projectEvents = projectForMod.eventLinks;
            console.log(projectEvents);

            for (const event in projectEvents) {
                if (projectEvents[event] === eventForMod) {
                    projectEvents[event] = newEventId;
                    break;
                }
            }
            projectForMod.eventLinks = projectEvents;
            reassignStorageItem(oldProjectTag, projectForMod);
            
            return
        }
    } 

    if (oldProjectTag !== 'standalone' && newProjectTag === 'standalone') {
        deleteEventFromProject(eventForMod, oldProjectTag);

    } else if (oldProjectTag === 'standalone' && newProjectTag !== 'standalone') {
        addEventToProject(newProjectTag, newEventId);

    } else {
        // Transfer event from one project to another
        deleteEventFromProject(eventForMod, oldProjectTag);
        addEventToProject(newProjectTag, newEventId);
    }

}   

// Mark complete a project
const completeProject = function (id) {
    const projectObj = getProjectForMod(id);

    projectObj.projectStatus = 'done';

    // add property completion
    const completionDate = new Date();
    const schedule = projectObj.deadline;
    const deadlineAlert =  differenceInCalendarDays(schedule, completionDate);

    let completionRemark;

    if (deadlineAlert === 0 ) {
        completionRemark = 'on-time';
    } else if (deadlineAlert > 0) {
        completionRemark = 'early';
    } else if (deadlineAlert < 0) {
        completionRemark = 'late';
    }

    projectObj.completion = completionRemark;

    reassignStorageItem(id, projectObj);
}

const deleteProject = function (id) {
    const projectForMod = getProjectForMod(id);
    const projectEvents = projectForMod.eventLinks;
    
    // unlink the project from the events
    for (const key in projectEvents) {
        const eventLink = projectEvents[key];
        unlinkEventToProject(eventLink);
    }

    localStorage.removeItem(id);   
}

const replaceProject = function (id, currentObj, newObj) {
    // unlink Events
    const currentProjectEvents = currentObj.eventLinks;
    for (const eventKey in currentProjectEvents) {
        unlinkEventToProject(currentProjectEvents[eventKey]);
    }
    
    // relink event
    const newProjectEvents = newObj.eventLinks;
    for (const eventKey in newProjectEvents) {
        linkEventToProject(newProjectEvents[eventKey], newObj.projectId );
    }
    
    // Delete former project then add new keyValue in the local storage
    localStorage.removeItem(id);
    reassignStorageItem(newObj.projectId, newObj);
}

// Get/ return consolidated array of unfiltered and unsorted array of project and event objects
const getAll = function () {
    const projects = getProjects();
    const events = getEvents();

    return [...projects, ...events];
}

// Projects (end) -


    return {
        // Events
            getEvents, 
            saveEvent, 
            getEvent, 
            changeTaskStatus, 
            getEventTasks, 
            // changeEventStatus,
            countEvents,
            completeEvent,
            replaceEvent,
            deleteEvent,
            linkEventToProject,

        // Projects
            saveProject,
            getProjects,
            getProject,
            countProjects,
            addEventToProject,
            deleteEventFromProject,
            modifyEventLink,
            completeProject,
            deleteProject,
            replaceProject,

            getAll,
        };
})();

export {memoryHandler}

