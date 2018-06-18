var Toggle = (function () {
    function Toggle(container) {
        this._container = container;
        this._toggleField = this._container.querySelector(".ms-Toggle-field");
        this._addListeners();
    }
    Toggle.prototype.removeListeners = function () {
        this._toggleField.removeEventListener("click", this._toggleHandler.bind(this));
    };
    Toggle.prototype._addListeners = function () {
        var _this = this;
        this._toggleField.addEventListener("click", this._toggleHandler.bind(this), false);
        this._toggleField.addEventListener("keyup", function (e) { return (e.keyCode === 32) ? _this._toggleHandler() : null; }, false);
    };
    Toggle.prototype._toggleHandler = function () {
        this._toggleField.classList.toggle("is-selected");
    };
    return Toggle;
}());
export { Toggle };
