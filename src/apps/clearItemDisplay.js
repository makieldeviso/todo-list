import { contentMaker } from "./contentMaker";

const clearItemDisplay = (function () {

    const clear = function (action) {
        // Note: These variables might return null, conditions are specified which nodes will be used
        const projectFullView = document.querySelector('div.project-fullview');
        const eventFullView = document.querySelector('div.event-fullview');
        const editEventBtn = document.querySelector('button[value="edit-event"]');
        const deleteEventBtn = document.querySelector('button[value="delete-event"]');
        const editProjectBtn = document.querySelector('button[value="edit-project"]');
        const deleteProjectBtn = document.querySelector('button[value="delete-project"]');

        if (action === 'projects-previews' || action === 'events-previews' ) {
            // Remove filter banner and previews
            contentMaker.createFilterBanner('remove');

        } else if (action === 'event-fullview') {
            // Close/ remove event full view
            contentMaker.removeDisplay(eventFullView);

            // Note: contentMaker.removeActionBtn accepts multiple buttons argument
            contentMaker.removeActionBtn(editEventBtn, deleteEventBtn);

        } else if (action === 'project-fullview') {
            // Close/ remove event full view
            contentMaker.removeDisplay(projectFullView);

            // Note: contentMaker.removeActionBtn accepts multiple buttons argument
            contentMaker.removeActionBtn(editProjectBtn, deleteProjectBtn);

        } else if (action === 'category-change') {
            // Note: Removes all possible items on the item display

            // Remove full views or previews
            const allFullViews = [projectFullView, eventFullView];
            allFullViews.forEach(item => {
                if (item !== null) {
                    contentMaker.removeDisplay(item);
                }
        });

        // Remove filter banner and previews
        contentMaker.createFilterBanner('remove');

            // Remove action buttons
        contentMaker.removeActionBtn(editEventBtn, deleteEventBtn, editProjectBtn, deleteProjectBtn);
        }

    }

    return { clear }
    
})();

export { clearItemDisplay }