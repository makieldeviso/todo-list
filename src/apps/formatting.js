const formatting = (function () {
    // Changes string to proper
    const toProper = function (string) {
        const properFormatted = `${string.slice(0,1).toUpperCase()}${string.slice(1)}`;
        return properFormatted;
    }   

    // Merge projectObjs and eventObjs into an array, then sort from upcoming to far time schedule/ deadline
    // Note: projectObj and eventObjs parameter needs array arguments
    const sortProjectsAndEvents = function (objectsArray) {
        const sortedObj = objectsArray.sort((a, b) => {
            let aTime;
            let bTime;

            if (Object.hasOwn(a, 'projectId')) {
                aTime = a.deadline;
            } else if (Object.hasOwn(a, 'eventId')) {
                aTime = a.schedule;
            }

            if (Object.hasOwn(b, 'projectId')) {
                bTime = b.deadline;
            } else if (Object.hasOwn(b, 'eventId')) {
                bTime = b.schedule;
            }
            return aTime - bTime
        });
        
            return sortedObj;
    } 


    return {toProper, sortProjectsAndEvents}
})();

export {formatting}