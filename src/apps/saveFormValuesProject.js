const saveFormValuesProject = (function () {

    // Validates project form input fields
    const validateProjectForm = function () {
        const titleInput = document.querySelector('#project-title');
        const schedInput = document.querySelector('#project-deadline');
        const inputsArray = [titleInput, schedInput];
        
        const errors = []
        const emptyRegex = /^\s*$/;

        const activeValidation = function () {
            validateEmpty(this);
        }

        const validateEmpty = function (inputField) {
            if (emptyRegex.test(inputField.value)) {
                // If input is empty or whitespace only
                errors.push(inputField);
                inputField.classList.add('error');
                inputField.addEventListener('blur', activeValidation);
                inputField.addEventListener('change', activeValidation);

            } else {
                inputField.classList.remove('error');
            }
        }

        // Execute validation using validateEmpty function
        inputsArray.forEach(input => validateEmpty(input));

        // Scrolls the form to the first error found
        const firstInstanceError = document.querySelector('.error');
        if (firstInstanceError !== null) {
            firstInstanceError.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
        
        return errors;
    };

    // Save project form values
    // Note: validated first
    const saveProjectForm = function () {
        const saveType = this.getAttribute('id');

        // Validates form before saving
        const validationErrors = validateProjectForm();
        if (validationErrors.length !== 0) {
            return
        }

        // Factory function to create initial project object
        const createProject = function (title, description, deadline, priority) {
            return {title, description, deadline, priority}
        }

        // Reusable DOM value getter function
        const valueGet = function (selector) {
            const value = document.querySelector(`${selector}`).value;
            return value
        }

        // Execute createEvent with valueGet
        const newProject = createProject (
            valueGet('#project-title'), 
            valueGet('#project-desc'),
            new Date(valueGet('#project-deadline')),
            valueGet('button.prio-btn[data-selected="selected"]')
        );

        console.log(newProject);
    }

    // Clear project form
    const clearProjectForm = function () {
        console.log('clear project! - test');
    }

    // Add event listeners to the save/clear buttons
    const addSaveProjectFormEvent = function (btnsCont) {
        const clearBtn = btnsCont.querySelector('button#clear-new-project');
        const saveBtn = btnsCont.querySelector('button#save-new-project');

        clearBtn.addEventListener('click', clearProjectForm);
        saveBtn.addEventListener('click', saveProjectForm);
    }

    return {addSaveProjectFormEvent}
})();

export {saveFormValuesProject}

