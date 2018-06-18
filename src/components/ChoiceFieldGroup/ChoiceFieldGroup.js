import { RadioButton } from "../RadioButton/RadioButton";
var ChoiceFieldGroup = (function () {
    function ChoiceFieldGroup(container) {
        this._choiceFieldGroup = container;
        this._choiceFieldComponents = [];
        this._initalSetup();
        this._addListeners();
    }
    ChoiceFieldGroup.prototype.removeListeners = function () {
        this._choiceFieldGroup.removeEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this));
    };
    ChoiceFieldGroup.prototype._initalSetup = function () {
        var choiceFieldElements = this._choiceFieldGroup.querySelectorAll(".ms-RadioButton");
        for (var i = 0; i < choiceFieldElements.length; i++) {
            this._choiceFieldComponents[i] = new RadioButton(choiceFieldElements[i]);
        }
    };
    ChoiceFieldGroup.prototype._addListeners = function () {
        document.addEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this), false);
    };
    ChoiceFieldGroup.prototype._ChoiceFieldHandler = function (event) {
        var name = event.detail.name;
        var selectedChoice = event.detail.item;
        if (this._choiceFieldGroup.id === name) {
            for (var i = 0; i < this._choiceFieldComponents.length; i++) {
                this._choiceFieldComponents[i].unCheck();
            }
            selectedChoice.check();
        }
    };
    return ChoiceFieldGroup;
}());
export { ChoiceFieldGroup };
