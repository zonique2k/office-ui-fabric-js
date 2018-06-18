var Button = (function () {
    function Button(container, clickHandler) {
        this._container = container;
        if (clickHandler) {
            this._clickHandler = clickHandler;
            this._setClick();
        }
    }
    Button.prototype.disposeEvents = function () {
        this._container.removeEventListener("click", this._clickHandler, false);
    };
    Button.prototype._setClick = function () {
        this._container.addEventListener("click", this._clickHandler, false);
    };
    return Button;
}());
export { Button };
