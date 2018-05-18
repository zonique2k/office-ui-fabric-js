"use strict";
exports.__esModule = true;
var ListItem_1 = require("../ListItem/ListItem");
var List = (function () {
    function List(container) {
        this._container = container;
        this._listItemComponents = [];
        var choiceFieldElements = this._container.querySelectorAll(".ms-ListItem");
        for (var i = 0; i < choiceFieldElements.length; i++) {
            this._listItemComponents[i] = new ListItem_1.ListItem(choiceFieldElements[i]);
        }
    }
    return List;
}());
exports.List = List;
