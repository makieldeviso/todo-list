const memoryHandler = (function () {

    const placeholderEvents = [
            {
                "title": "Ms. Dodo's Birthday",
                "description": "60th Birthday, food committee",
                "schedule": new Date("2023-12-20T00:00:00.000Z"),
                "projectTag": "standalone",
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
                    }
                },
                "eventId": "ms.dodo'sbirthday1689724800000",
                "eventStatus": 'pending',
            },

            {
                "title": "Do your thing",
                "description": "Do your thing",
                "schedule": new Date("2023-07-20T00:00:00.000Z"),
                "projectTag": "standalone",
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
        events.push(newEvent);
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

        console.log(eventObj);
    }

     // Mark complete an event
     const completeEvent = function (id) {
        const eventObj = getEventForMod(id);

        eventObj.eventStatus = 'done';
        console.log(eventObj);
    }

    const replaceEvent = function (id, obj) {
        const eventForModIndex = events.findIndex(event => event.eventId === id);
        
        events.splice(eventForModIndex, 1, obj);

        console.log(getEvents());

    }


    return {getEvents, 
            saveEvent, 
            getEvent, 
            changeTaskStatus, 
            getEventTasks, 
            changeEventStatus,
            completeEvent,
            replaceEvent};
})();

export {memoryHandler}

