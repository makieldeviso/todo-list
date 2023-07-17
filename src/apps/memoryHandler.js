const memoryHandler = (function () {

    const events = [];


    const placeholderEvents = [
        {
            "title": "Ms. Dodo's Birthday",
            "description": "60th Birthday, food committee",
            "schedule": "2023-07-14T00:00:00.000Z",
            "projectTag": "standalone",
            "priority": "high",
            "task-1": "Contact catering and order foods",
            "task-2": "Get cake from bakeshop",
            "task-3": "Buy fruits for salad at the market",
            "eventId": "msdodo'sbirthday1689292800000"
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

