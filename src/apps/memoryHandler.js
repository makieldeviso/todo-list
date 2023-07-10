const memoryHandler = (function () {

    const events = [];

    const saveEvent = function(newEvent) {
        events.push(newEvent);

        console.log(events);
    };

    const getEvents = function () {
        return events
    }


    return {getEvents, saveEvent};
})();

export {memoryHandler}