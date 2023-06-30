const tempMemory = (function () {

    const projects = [];

    const setProjects = function(newProject) {
        projects.push(newProject);
    };

    const getProjects = function () {
        return projects
    }


    return (getProjects, setProjects);
})();

export {tempMemory}