const createModal = (function () {
    // Create modal and append to the 'main'
    const createNewModal = function (assignId) {
        const newModal = document.createElement('dialog'); 
        newModal.setAttribute('id', `${assignId}-prompt`);

        const modalCont = document.createElement('div');
        modalCont.setAttribute('class', 'modal-cont');

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'close-modal');
        closeBtn.setAttribute('value', `close-${assignId}`);
        closeBtn.setAttribute('id', `close-${assignId}`);

        const closeBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        closeBtnIcon.setAttribute('viewBox', '0 0 24 24');
        closeBtnIcon.innerHTML = '<title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>';
        closeBtn.appendChild(closeBtnIcon);

        // Assemble the modal parts
        modalCont.appendChild(closeBtn);
        newModal.appendChild(modalCont);

        // Append modal to the 'main'
        const main = document.querySelector('main');
        main.appendChild(newModal);
    } 

    // Create 'Add Options' buttons and append to modal container
    const createAddOptionsBtns = function () {
        // Create buttons container
        const container = document.createElement('div');
        container.setAttribute('id', 'add-options');

        // Create and append buttons to container function
        const addBtn = function (assignId, label) {
            const newBtn = document.createElement('button');
            newBtn.setAttribute('id', assignId);
            newBtn.setAttribute('value', assignId);

            // Set new-event as default
            if (assignId === 'new-event') {
                newBtn.dataset.selected = 'selected';
            }

            const btnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            btnIcon.setAttribute('viewBox', '0 0 24 24');
            btnIcon.innerHTML = '<title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>'
            newBtn.appendChild(btnIcon);

            const btnLabel = document.createElement('span');
            btnLabel.textContent = label;
            newBtn.appendChild(btnLabel);

            container.append(newBtn);
        }

        addBtn('new-event', 'New Event');
        addBtn('new-project', 'New Project');

        // Appends add options buttons to the modal cont
        const modalCont = document.querySelector('div.modal-cont');
        modalCont.appendChild(container);
    }

    return { createNewModal, createAddOptionsBtns }

})();

export { createModal };