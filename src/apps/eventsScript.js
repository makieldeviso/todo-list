import { memoryHandler } from "./memoryHandler";

const eventsScript = (function () {

    // const events = memoryHandler.getEvents();

    // Get array of tasks in an event
    const taskArrayOfEvent = function (eventTasks) {
        // Note: tasks is object
        // Convert tasks object to Array
        const taskKeys = Object.keys(eventTasks);
        const tasksArray = taskKeys.map(keys => eventTasks[keys]);

        return tasksArray;
    }

    // Count number of tasks in an event
    const countTasksOfEvent = function (eventTasks) {
        const tasksArray = taskArrayOfEvent(eventTasks);

        return tasksArray.length;
    }

    // Get array of tasks in an event that are done
    const getDoneTasks = function (eventTasks) {
        const tasksArray = taskArrayOfEvent(eventTasks);
        const doneTasks = tasksArray.filter(task => task.status === 'done');

        return doneTasks;
    }

    // Count array of tasks that are done
    const countDoneTasks = function (eventTasks) {
        const doneTasks = getDoneTasks(eventTasks);

        return doneTasks.length;
    }

    // Check completion of tasks
    const tasksCompleted = function (eventTask) {
        let result;

        if (countDoneTasks(eventTask) === countTasksOfEvent(eventTask)) {
            result = true;
        } else {
            result = false;
        }

        return result;
    }


    return {
        taskArrayOfEvent,
        countTasksOfEvent,
        getDoneTasks,
        countDoneTasks,
        tasksCompleted
    }

})();

export {eventsScript};