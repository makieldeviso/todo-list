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
                        "status": "not done"
                    },
                    "task-2": {
                        "task": "Get cake from bakeshop",
                        "status": "not done"
                    },
                    "task-3": {
                        "task": "Buy fruits for salad at the market",
                        "status": "done"
                    }
                },
                "eventId": "ms.dodo'sbirthday1689724800000",
                "eventStatus": 'done',
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
                        "status": "done"
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



    return {getEvents, saveEvent, getEvent};
})();

export {memoryHandler}

