import { memoryHandler } from "./memoryHandler";

const eventsScript = (function () {

    // const events = memoryHandler.getEvents();

    const taskArrayOfEvent = function (event) {
        // Note: tasks is object
        // Convert tasks object to Array
        const taskKeys = Object.keys(event);
        const tasksArray = taskKeys.map(keys => event[keys]);
        
        return tasksArray;
    }

    const countTasksOfEvent = function (event) {
        const tasksArray = taskArrayOfEvent(event);

        return tasksArray.length;
    }

    const getRemainingTasks = function (event) {
        const tasksArray = taskArrayOfEvent(event);
        const remainingTasks = tasksArray.filter(task => task.status === 'not done');

        return remainingTasks;
    }

    const countRemainingTasks = function (event) {
        const remainingTasks = getRemainingTasks(event);

        return remainingTasks.length;
    }

    return {
        taskArrayOfEvent,
        countTasksOfEvent,
        getRemainingTasks,
        countRemainingTasks,
    }

})();

export {eventsScript};