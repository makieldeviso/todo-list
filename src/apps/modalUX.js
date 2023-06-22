const modalUX = (function () {

    // UX for select event priority
    const addPriorityButtonEvent = function () {
        const prioBtns = document.querySelectorAll('button.prio-btn');

        const markButton = function () {
            console.log(this);

            const prioButnId = this.dataset.id;
            const thisPrioBtn = document.querySelector(`button[data-id='${prioButnId}']`);
        
            // Ensures only one container is marked
            prioBtns.forEach(btn => {
                if (btn.hasAttribute('data-selected')) {
                    btn.removeAttribute('data-selected');
                }
            });
        
            // Marks container with checked radio
            thisPrioBtn.setAttribute('data-selected', 'selected');
        }
        
        prioBtns.forEach(radio => radio.addEventListener('click', markButton));
    }

    return { addPriorityButtonEvent }
})();

export { modalUX };