import { Overlay } from "../Overlay/Overlay";
var Dialog = (function () {
    function Dialog(dialog) {
        this._dialog = dialog;
        this._closeButtonElement = this._dialog.querySelector(".ms-Dialog-buttonClose");
        this._actionButtonElements = this._dialog.querySelectorAll(".ms-Dialog-action");
        if (this._closeButtonElement) {
            this._closeButtonElement.addEventListener("click", this.close.bind(this), false);
        }
        for (var i = 0; i < this._actionButtonElements.length; i++) {
            this._actionButtonElements[i].addEventListener("click", this.close.bind(this), false);
        }
    }
    Dialog.prototype.close = function () {
        this._overlay.remove();
        this._dialog.classList.remove("is-open");
        document.body.classList.remove("ms-u-overflowHidden");
        this._overlay.overlayElement.removeEventListener("click", this.close.bind(this));
    };
    Dialog.prototype.open = function () {
        this._dialog.classList.add("is-open");
        this._overlay = new Overlay();
        if (!this._dialog.classList.contains("ms-Dialog--blocking")) {
            this._overlay.overlayElement.addEventListener("click", this.close.bind(this), false);
            this._overlay.show();
            document.body.classList.add("ms-u-overflowHidden");
        }
        this._dialog.parentElement.appendChild(this._overlay.overlayElement);
    };
    return Dialog;
}());
export { Dialog };
