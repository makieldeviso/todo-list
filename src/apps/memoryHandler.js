const memoryHandler = (function () {

    const events = [];


    const placeholderEvents = [
            {
                "title": "Ms. Dodo's Birthday",
                "description": "60th Birthday, food committee",
                "schedule": new Date("2023-07-20T00:00:00.000Z"),
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
                "eventId": "ms.dodo'sbirthday1689724800000"
            },
    ];


    const saveEvent = function(newEvent) {
        events.push(newEvent);

        console.log(placeholderEvents);
        console.log(events);
    };

    const getEvents = function () {
        return placeholderEvents
    }


    return {getEvents, saveEvent};
})();

export {memoryHandler}

