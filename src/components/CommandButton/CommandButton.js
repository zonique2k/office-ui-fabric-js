import { ContextualHost } from "../ContextualHost/ContextualHost";
var CONTEXT_CLASS = ".ms-ContextualMenu";
var CB_SPLIT_CLASS = ".ms-CommandButton-splitIcon";
var CB_BUTTON_CLASS = ".ms-CommandButton-button";
var MODAL_POSITION = "bottom";
var CommandButton = (function () {
    function CommandButton(container, contextMenu) {
        this._container = container;
        this._command = this._container;
        this._commandButton = this._command.querySelector(CB_BUTTON_CLASS);
        this._splitButton = this._command.querySelector(CB_SPLIT_CLASS);
        if (contextMenu) {
            this._contextualMenu = contextMenu;
        }
        else {
            this._contextualMenu = this._container.querySelector(CONTEXT_CLASS);
        }
        this._checkForMenu();
    }
    CommandButton.prototype._createModalHostView = function () {
        this._modalHostView = new ContextualHost(this._contextualMenu, MODAL_POSITION, this._command, false);
    };
    CommandButton.prototype._setClick = function () {
        if (this._splitButton) {
            this._splitButton.addEventListener("click", this._createModalHostView.bind(this), false);
        }
        else {
            this._commandButton.addEventListener("click", this._createModalHostView.bind(this), false);
        }
    };
    CommandButton.prototype._checkForMenu = function () {
        if (this._contextualMenu) {
            this._setClick();
        }
    };
    return CommandButton;
}());
export { CommandButton };
