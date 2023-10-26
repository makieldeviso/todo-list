const editUsername = (function () {
    // display username
    const displayUsername = function () {
        const username = JSON.parse(localStorage.getItem('username'));
    
        const usernameDisplay = document.querySelector('input#username');
        const greetings = document.querySelector('p#user-greet');

        if (username !== null) {
            greetings.textContent = 'Hello';
            usernameDisplay.value = username;
        } else {
            greetings.textContent = 'Welcome';
            usernameDisplay.value = 'New User';

            // Setups new user in the local storage
            localStorage.setItem('username', JSON.stringify('User'));
        }
    }

    const getUsername = function () {
        const inputBox = document.querySelector('input#username');

        // Change button UI
        if (this.dataset.action === 'save') {
            // Initialize save username
            inputBox.disabled = true;
        
        } else if (this.dataset.action === 'edit') {
            // Set username input box ready for edit
            inputBox.disabled = false;
            inputBox.focus();
            inputBox.setSelectionRange(inputBox.value.length, inputBox.value.length);
            this.dataset.action = 'save';

            inputBox.addEventListener('blur', saveUsername);
        }
    }

    const saveUsername = function () {
        const inputBox = document.querySelector('input#username');
        const saveEditBtn = document.querySelector('button#edit-username');

        // Change username edit UI
        inputBox.disabled = true;
        saveEditBtn.dataset.action = 'edit';
        
        // Remove event listener of username input field
        inputBox.removeEventListener('blur', saveUsername);

        // Temporarily remove click listener to edit button to remove conflict with blur event
        saveEditBtn.removeEventListener('click', getUsername);
        setTimeout(() => saveEditBtn.addEventListener('click', getUsername), 200);
        
        // Save username to local storage
        const newUsername = JSON.stringify(inputBox.value);
        localStorage.setItem('username', newUsername);
        
        // Load display of new username
        displayUsername();
    }

    const addUsernameEditEvent = function () {
        const usernameEditBtn = document.querySelector('button#edit-username');
        usernameEditBtn.addEventListener('click', getUsername);
    }

    return {addUsernameEditEvent, displayUsername}

})();

export {editUsername}