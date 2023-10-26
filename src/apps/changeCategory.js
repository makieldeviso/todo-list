import { clearItemDisplay } from "./clearItemDisplay";

const changeCategory = (function () {
    
    // Revert display to default
    const defaultDisplay = function () {
        
        // Clears display
        clearItemDisplay.clear('category-change');

        // Removes dataset on the back button
        const backBtn = document.querySelector('button#back-sidebar');
        backBtn.dataset.action = 'default';
        const addedDataset = ['filter', 'mode', 'link'];
        addedDataset.forEach(dataset => {
            if (backBtn.hasAttribute(`data-${dataset}`)) {
                backBtn.removeAttribute(`data-${dataset}`);
            }
        });
    }

    // Add UI highlight to selected category/ filter
    const highlightCategory = function (categoryNode) {
        const categories = Array.from(document.querySelectorAll('div.category'));
        // Remove selected class of previous category
        categories.some(node => {
            let found;
            if (node.getAttribute('class').includes('selected')) {
                node.classList.remove('selected');
                found = true;
            }
            return found
        });

        // Add selected class to new selected node 
        categoryNode.classList.add('selected');
    }

    return { defaultDisplay, highlightCategory }
})();

export { changeCategory }