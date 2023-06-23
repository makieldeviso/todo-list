const modalUX = (function () {

    // Closes/ unselect all buttons from given nodeList
    const closeBtns = function (nodeList) {
        nodeList.forEach(btn => {
            if (btn.dataset.selected === 'selected') {
                btn.dataset.selected = "";
            }
        });
    }

    // Set the default selected button on modal closing
    // Note: includes closeBtns function, 1st argument is nodeList
    const setDefaultBtn = function (nodeList, defaultBtn) {
        // Ensures other buttons are closed
        closeBtns(nodeList);

        // Defaults newEventBtn as selected
        defaultBtn.dataset.selected = 'selected';
    }

    // "Add" Options buttons UX
    const addOptionsBtns = function (action) {
        const optionsBtns = document.querySelectorAll('div#add-options button');
        const newEventBtn = document.querySelector('button#new-event');

        const markBtn = function () {
            const selectedBtn = this;

            // Ensures other buttons are closed
            closeBtns(optionsBtns);

            // Change UI for selected Btn
            selectedBtn.dataset.selected = 'selected';
        }

        if (action === true) {
            optionsBtns.forEach(btn => btn.addEventListener('click', markBtn));

        } else if (action === false) {
            setDefaultBtn(optionsBtns, newEventBtn); // Sets newEventBtn on modal closing
            optionsBtns.forEach(btn => btn.removeEventListener('click', markBtn));
        }
    }

    // UX for select event priority
    const addPriorityBtnEvent = function (action) {
        const prioBtns = document.querySelectorAll('button.prio-btn');
        const midPrioBtn = document.querySelector('button[data-id="mid"]');

        const markBtn = function () {
            const prioButnId = this.dataset.id;
            const thisPrioBtn = document.querySelector(`button[data-id='${prioButnId}']`);
        
            // Ensures only one container is marked
            closeBtns(prioBtns);
        
            // Marks container with checked radio
            thisPrioBtn.setAttribute('data-selected', 'selected');
        }


        // Conditional for adding and removing eventListeners
        if (action === true) {
            prioBtns.forEach(btn => btn.addEventListener('click', markBtn));

        } else if (action === false) {
            setDefaultBtn(prioBtns, midPrioBtn); // Sets midPrioBtn on modal closing
            prioBtns.forEach(btn => btn.removeEventListener('click', markBtn));
        }
    }

    // Compiled function to add all necessary listeners and UX
    const addModalUX = function () {

        // Reminder: true argument to add eventListeners, false means remove
        addPriorityBtnEvent(true);
        addOptionsBtns(true);
    }

    // Compiled function to remove all listeners and UX
    const removeModalUX = function () {

        // Reminder: false to remove eventListeners
        addPriorityBtnEvent(false);
        addOptionsBtns(false);
    }

    return { addModalUX, removeModalUX }
})();

export { modalUX };