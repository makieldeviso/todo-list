import { memoryHandler } from "./memoryHandler";

const projectScripts = (function () {


    const getProperty = function (id, prop) {
        const projectObj = memoryHandler.getProject(id);
        const projectProperty =projectObj[prop];
        return projectProperty;
    }

    return {getProperty}


})();

export {projectScripts}