import { addTaskToEvent } from "./addTaskToEvent";

const modalUX = (function () {

    // Closes/ unselect all buttons from given nodeList
    const closeBtns = function (nodeList) {
        nodeList.forEach(btn => {
            const closeBtn = btn
            if (closeBtn.dataset.selected === 'selected') {
                closeBtn.dataset.selected = "";
            }
        });
    }

    // UX for changing add options button  
    const markAddOptionsBtn = function () {
        const optionsBtns = document.querySelectorAll('div#add-options button');
        const selectedBtn = this;

        // Ensures other buttons are closed
        closeBtns(optionsBtns);

        // Change UI for selected Btn
        selectedBtn.dataset.selected = 'selected';
    }

    // UX for select event priority
    const addPriorityBtnEvent = function (btnsContainer) {
        const prioBtns = btnsContainer.querySelectorAll('button.prio-btn');

        const markBtn = function () {
            const prioButnId = this.dataset.id;
            const thisPrioBtn = document.querySelector(`button[data-id='${prioButnId}']`);
        
            // Ensures only one container is marked
            closeBtns(prioBtns);
        
            // Marks container with checked
            thisPrioBtn.setAttribute('data-selected', 'selected');
        }

        prioBtns.forEach(btn => btn.addEventListener('click', markBtn));
    }


    // Compiled function to add all necessary listeners and UX
    const addModalUX = function () {

        // Reminder: true argument to add eventListeners, false means remove
        addTaskToEvent.addNewTaskEvent(true);
    }

    // Compiled function to remove all listeners and UX
    const removeModalUX = function () {

        // Reminder: false to remove eventListeners
        addTaskToEvent.addNewTaskEvent(false);
    }

    return { addModalUX, removeModalUX, markAddOptionsBtn, closeBtns, addPriorityBtnEvent }
})();

export { modalUX };