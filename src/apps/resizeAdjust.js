const resizeAdjust = (function () {

    const adjustMainSize = function () {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        
        const headerHeight = header.clientHeight;

        main.style.height = `${headerHeight}px`
    }

    const addResizeEvent = function () {
        window.addEventListener('load', adjustMainSize);
        window.addEventListener('resize', adjustMainSize);
    }

    return {addResizeEvent}
})();

export { resizeAdjust }