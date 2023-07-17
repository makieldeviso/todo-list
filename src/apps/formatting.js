const formatting = (function () {

    const toProper = function (string) {
        const properFormatted = `${string.slice(0,1).toUpperCase()}${string.slice(1)}`;
        return properFormatted;
    }   

    return {toProper}
})();

export {formatting}