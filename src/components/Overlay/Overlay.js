var Overlay = (function () {
    function Overlay(overlayElement) {
        if (overlayElement) {
            this.overlayElement = overlayElement;
        }
        else {
            var overlayContainer = document.createElement("div");
            overlayContainer.setAttribute("class", "ms-Overlay");
            this.overlayElement = overlayContainer;
        }
        this.overlayElement.addEventListener("click", this.hide.bind(this), false);
    }
    Overlay.prototype.remove = function () {
        this.overlayElement.parentElement.removeChild(this.overlayElement);
    };
    Overlay.prototype.show = function () {
        this.overlayElement.classList.add("is-visible");
        document.body.classList.add("ms-u-overflowHidden");
    };
    Overlay.prototype.hide = function () {
        this.overlayElement.classList.remove("is-visible");
        document.body.classList.remove("ms-u-overflowHidden");
    };
    return Overlay;
}());
export { Overlay };
