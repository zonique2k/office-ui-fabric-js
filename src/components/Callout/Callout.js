import { ContextualHost } from "../ContextualHost/ContextualHost";
var STATE_HIDDEN = "is-hidden";
var CLOSE_BUTTON_CLASS = ".ms-Callout-close";
var MODIFIER_OOBE_CLASS = "ms-Callout--OOBE";
var Callout = (function () {
    function Callout(container, addTarget, position) {
        this._container = container;
        this._addTarget = addTarget;
        this._position = position;
        this._closeButton = container.querySelector(CLOSE_BUTTON_CLASS);
        this._setOpener();
    }
    Callout.prototype._setOpener = function () {
        this._addTarget.addEventListener("click", this._clickHandler.bind(this), true);
        this._addTarget.addEventListener("keyup", this._keyupHandler.bind(this), true);
    };
    Callout.prototype._openContextMenu = function () {
        var modifiers = [];
        if (this._hasModifier(MODIFIER_OOBE_CLASS)) {
            modifiers.push("primaryArrow");
        }
        this._container.classList.remove(STATE_HIDDEN);
        this._contextualHost = new ContextualHost(this._container, this._position, this._addTarget, true, modifiers);
        if (this._closeButton) {
            this._closeButton.addEventListener("click", this._closeHandler.bind(this), false);
        }
    };
    Callout.prototype._hasModifier = function (modifierClass) {
        return this._container.classList.contains(modifierClass);
    };
    Callout.prototype._closeHandler = function (e) {
        if (this._contextualHost != null) {
            this._contextualHost.disposeModal();
        }
        this._closeButton.removeEventListener("click", this._closeHandler.bind(this), false);
        this._addTarget.removeEventListener("click", this._clickHandler.bind(this), true);
        this._addTarget.removeEventListener("keyup", this._keyupHandler.bind(this), true);
    };
    Callout.prototype._clickHandler = function (e) {
        this._openContextMenu();
    };
    Callout.prototype._keyupHandler = function (event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
            event.preventDefault();
            this._openContextMenu();
        }
        else {
            this._closeHandler(event);
        }
    };
    return Callout;
}());
export { Callout };
