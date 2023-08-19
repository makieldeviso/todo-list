const eventDelete = (function () {
    const showDeletePrompt = function () {
        const eventId = this.dataset.id;
        console.log(eventId);
    }


    return {showDeletePrompt};
})();

export {eventDelete};