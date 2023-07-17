import { eventsDisplay } from "./eventsDisplay";

const displayContent = (function () {

    const translateSidebar = function (action) {
        const sidebar = document.querySelector('div#sidebar');
        const backBtn = document.querySelector('button#back-sidebar');

        const backSideBar = function () {
            translateSidebar(false);
        }

        if (action === true) {
            sidebar.classList.add('hidden');
            backBtn.addEventListener('click', backSideBar);

        } else if (action === false) {
            sidebar.classList.remove('hidden');
            // if false recur using backSideBar function
            backBtn.removeEventListener('click', backSideBar);
        }
    }

    // Note: button event triggered function
    const showDisplay = function () {
        translateSidebar(true);

        eventsDisplay.test();

    }

    const addSidebarEvents = function () {
        const eventsBtn = document.querySelector('div#events');
        eventsBtn.addEventListener('click', showDisplay);
    }

    return {showDisplay, addSidebarEvents}

})();

export { displayContent };