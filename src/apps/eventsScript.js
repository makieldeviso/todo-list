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

    const getDoneTasks = function (event) {
        const tasksArray = taskArrayOfEvent(event);
        const doneTasks = tasksArray.filter(task => task.status === 'done');

        return doneTasks;
    }

    const countDoneTasks = function (event) {
        const doneTasks = getDoneTasks(event);

        return doneTasks.length;
    }

    return {
        taskArrayOfEvent,
        countTasksOfEvent,
        getDoneTasks,
        countDoneTasks,
    }

})();

export {eventsScript};