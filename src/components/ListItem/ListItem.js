var ListItem = (function () {
    function ListItem(container) {
        this._container = container;
        this._toggleElement = this._container.querySelector(".ms-ListItem-selectionTarget");
        this._addListeners();
    }
    ListItem.prototype.removeListeners = function () {
        this._toggleElement.removeEventListener("click", this._toggleHandler.bind(this));
    };
    ListItem.prototype._addListeners = function () {
        this._toggleElement.addEventListener("click", this._toggleHandler.bind(this), false);
    };
    ListItem.prototype._toggleHandler = function () {
        this._container.classList.toggle("is-selected");
    };
    return ListItem;
}());
export { ListItem };
