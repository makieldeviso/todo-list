import { eventsDisplay } from "./eventsDisplay";

const displayContent = (function () {

    const translateSidebar = function (action) {
        const sidebar = document.querySelector('div#sidebar');
        
        if (action === true) {
            sidebar.classList.add('hidden');

        } else if (action === false) {
            sidebar.classList.remove('hidden');
        }
    }

    const backSideBar = function () {
        // if false recur using backSideBar function
        const backAction = this.dataset.action;

        if (backAction === 'event-preview') {
            translateSidebar(false);

        } else if (backAction === 'event-fullview') {
            clearItemDisplay(backAction);
        }
    }

    const clearItemDisplay = function (action) {

        if (action === 'event-fullview') {
            // Close/ remove event full view
            const eventFullView = document.querySelector('div.event-fullview');
            removeDisplay(eventFullView);

            // Return to event preview
            showDisplay();
        }
    }

    // Note: button event triggered function
    const showDisplay = function () {
        const backBtn = document.querySelector('button#back-sidebar');
        translateSidebar(true);
        
        // Add action attribute to back button
        backBtn.dataset.action = "event-preview";

        eventsDisplay.displayEventsToDOM();
    }

    const removeDisplay = function (item) {
        const itemDisplay = document.querySelector('div#item-display');
        itemDisplay.removeChild(item);
    }

    const addSidebarEvents = function () {
        const eventsBtn = document.querySelector('div#events');
        eventsBtn.addEventListener('click', showDisplay);
    }

    const backBtnEvents = function () {
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.addEventListener('click', backSideBar);
    }

    return {showDisplay, addSidebarEvents, removeDisplay, backBtnEvents}

})();

export { displayContent };