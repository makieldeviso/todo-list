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

    return {getProperty, checkDeadline}

})();

export {projectsScripts}