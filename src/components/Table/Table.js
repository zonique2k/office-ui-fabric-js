var Table = (function () {
    function Table(container) {
        this.container = container;
        if (this.container.className.indexOf("ms-Table--selectable") !== -1) {
            this._addListeners();
        }
    }
    Table.prototype._addListeners = function () {
        this.container.addEventListener("click", this._toggleRowSelection.bind(this), false);
    };
    Table.prototype._toggleRowSelection = function (event) {
        var selectedRow = event.target.parentElement;
        if (selectedRow.tagName === "TR") {
            var selectedStateClass = "is-selected";
            if (selectedRow.className === selectedStateClass) {
                selectedRow.className = "";
            }
            else {
                selectedRow.className = selectedStateClass;
            }
        }
    };
    return Table;
}());
export { Table };
