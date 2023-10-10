import { differenceInCalendarDays } from 'date-fns';
import { projectsScripts } from './projectsScripts';

const memoryHandler = (function () {
    // Events (start) -
    const placeholderEvents = [
            {
                "title": "Ms. Dodo's Birthday",
                "description": "60th Birthday, food committee",
                "schedule": new Date(),
                "projectTag": "newprojecttest1693267200000",
                "priority": "high",
                "tasks": {
                    "task-1": {
                        "task": "Contact catering and order foods",
                        "status": "done"
                    },
                    "task-2": {
                        "task": "Get cake from bakeshop",
                        "status": "done"
                    },
                    "task-3": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    },
                    "task-4": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    },
                    "task-5": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    },
                    "task-6": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    },
                    "task-7": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    },
                    "task-8": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    }
                },
                "eventId": "ms.dodo'sbirthday1689724800000",
                "eventStatus": 'pending',
            },

            {
                "title": "Do your thing",
                "description": "Do your thing",
                "schedule": new Date(2024, 9, 1),
                "projectTag": "newprojecttest1693267200000",
                "priority": "mid",
                "tasks": {
                    "task-1": {
                        "task": "Hello",
                        "status": "pending"
                    },
                    "task-2": {
                        "task": "Hello World",
                        "status": "done"
                    },
                    "task-3": {
                        "task": "Hello World 123",
                        "status": "done"
                    }
                },
                "eventId": "doyourthing",
                "eventStatus": 'pending',
            },
    ];
    
    const events = [...placeholderEvents];

    const saveEvent = function(newEvent) {
        events.unshift(newEvent);
    };

    const getEvents = function () {
        return events;
    }

    const getEvent = function (id) {
        const events = getEvents();

        const requiredEvent = events.find(event => event.eventId === id);
        return requiredEvent;
    }

    const getEventForMod = function (id) {
        const eventIndex = events.findIndex(event => event.eventId === id);
        const eventObj = events[eventIndex];

        return eventObj;
    }

    const getEventTasks = function (id) {
        const eventObj = getEventForMod(id);
        const eventTasksList = eventObj.tasks;

        return eventTasksList;
    }

    const changeTaskStatus = function (id, number, statusChange) {
        const eventTasksList = getEventTasks(id);
        
        eventTasksList[`${number}`].status = statusChange;
    }

    const changeEventStatus = function (id) {
        const eventObj = getEventForMod(id);
        
        eventObj.eventStatus = 'done';
    }

    const countEvents = function () {
        const eventsCount = getEvents().length;
        return eventsCount;
    }

     // Mark complete an event
     const completeEvent = function (id) {
        const eventObj = getEventForMod(id);

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
    }

    const replaceEvent = function (id, obj) {
        const eventForModIndex = events.findIndex(event => event.eventId === id);
        
        events.splice(eventForModIndex, 1, obj);
    }

    const deleteEvent = function (id) {
        const eventForModIndex = events.findIndex(event => event.eventId === id);
        
        events.splice(eventForModIndex, 1);
    }

    const linkEventToProject = function (eventId, projectId) {
        const eventForMod = getEventForMod(eventId);

        eventForMod.projectTag = projectId;
    }

    const unlinkEventToProject = function (id) {
        const eventId = id;
        getEventForMod(eventId).projectTag = "standalone";
    }


// Events (end) -

// Projects (start) -
const placeholderProjects = [
    {
        "title": "New Project Test",
        "description": "Project Test Description",
        "deadline": new Date(2023, 7, 30),
        "priority": "high",
        "eventLinks": {"event-1": "ms.dodo'sbirthday1689724800000", "event-2": "doyourthing"},
        "projectId": "newprojecttest1693267200000",
        "projectStatus": 'pending',
    },  

    {
        "title": "New Project Test-2",
        "description": "Project Test Description-2",
        "deadline": new Date(2023, 9, 3 ),
        "priority": "high",
        "eventLinks": {},
        "projectId": "newprojecttest1693267200001",
        "projectStatus": 'pending',
    }

];

const projects = [...placeholderProjects];

const saveProject = function (projectObj) {
    projects.unshift(projectObj);
}

const getProjects = function () {
    return projects;
}

const getProject = function (id) {
    const projectObj = getProjects().find(obj => obj.projectId === id);
    return projectObj
}

const countProjects = function () {
    const projectsCount = getProjects().length;
    return projectsCount;
}

const getProjectForMod = function (projectId) {
    // Find the project from the memory
    const projectIndex = projects.findIndex(project => project.projectId === projectId);

    return projects[projectIndex];
}

const addEventToProject = function (projectId, eventId) {
    const projectForMod = getProjectForMod(projectId);

    // Count current number for events for identification
    const eventsCount = projectsScripts.countEventsOfProject(projectForMod);

    // Modify the project by adding a new event link
    projectForMod.eventLinks[`event-${eventsCount + 1}`] = eventId;
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
}

const modifyEventLink = function (eventForMod, newEventId, oldProjectTag, newProjectTag) {
    const projectForMod = getProjectForMod(oldProjectTag);

    if (oldProjectTag === newProjectTag) {
        if (eventForMod === newEventId) {
            return

        } else {
            const projectEvents = projectForMod.eventLinks;

            for (const event in projectEvents) {
                if (projectEvents[event] === eventForMod) {
                    projectEvents[event] = newEventId;
                    break;
                }
            }

            return
        }
    } 

    if (oldProjectTag !== 'standalone' && newProjectTag === 'standalone') {
        deleteEventFromProject(eventForMod, oldProjectTag);

    } else if (oldProjectTag === 'standalone' && newProjectTag !== 'standalone') {
        addEventToProject(newProjectTag, newEventId);

    } else {
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
}

const deleteProject = function (id) {
    const projectForMod = getProjectForMod(id);
    const projectForModIndex = getProjects().findIndex(project => project.projectId === id);
    const projectEvents = projectForMod.eventLinks;
    
    // unlink the project from the events
    for (const key in projectEvents) {
        const eventLink = projectEvents[key];
        unlinkEventToProject(eventLink);
    }

    projects.splice(projectForModIndex, 1);    
}

const replaceProject = function (id, currentObj, newObj) {
    const projectForModIndex  = projects.findIndex(project => project.projectId === `${id}`);

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
      
    projects.splice(projectForModIndex, 1, newObj);
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
            changeEventStatus,
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

