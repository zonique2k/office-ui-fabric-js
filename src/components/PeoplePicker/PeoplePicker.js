import { ContextualHost } from "../ContextualHost/ContextualHost";
var MODAL_POSITION = "bottom";
var TOKEN_CLASS = "ms-Persona--token";
var PeoplePicker = (function () {
    function PeoplePicker(container) {
        this._container = container;
        this._peoplePickerMenu = this._container.querySelector(".ms-PeoplePicker-results");
        this._peoplePickerSearch = this._container.querySelector(".ms-TextField-field");
        this._peoplePickerSearchBox = this._container.querySelector(".ms-PeoplePicker-searchBox");
        this._selectedPeople = this._container.querySelector(".ms-PeoplePicker-selectedPeople");
        this._assignClicks();
        if (this._selectedPeople) {
            this._assignRemoveHandler();
            this._selectedCount = this._container.querySelector(".ms-PeoplePicker-selectedCount");
            this._selectedPlural = this._container.querySelector(".ms-PeoplePicker-selectedCountPlural");
        }
        if (this._peoplePickerMenu) {
            this._peoplePickerMenu.setAttribute("style", "display: none;");
        }
    }
    PeoplePicker.prototype._createModalHost = function (e) {
        e.stopPropagation();
        this._peoplePickerMenu.setAttribute("style", "display: block;");
        this._contextualHostView = new ContextualHost(this._peoplePickerMenu, MODAL_POSITION, this._peoplePickerSearchBox, false, [""], true, this._contextHostCallBack.bind(this));
        this._peoplePickerSearchBox.classList.add("is-active");
        this._isContextualMenuOpen = true;
    };
    PeoplePicker.prototype._clickHandler = function (e) {
        this._createModalHost(e);
        var peoplePickerResults = this._peoplePickerMenu.querySelector(".ms-PeoplePicker-result");
        var resultsParent = peoplePickerResults.parentNode;
        var resultsClone = resultsParent.cloneNode(true);
        resultsParent.parentNode.replaceChild(resultsClone, resultsParent);
        this._peoplePickerResults = this._peoplePickerMenu.querySelectorAll(".ms-PeoplePicker-result");
        for (var i = 0; i < this._peoplePickerResults.length; i++) {
            var personaResult = this._peoplePickerResults[i].querySelector(".ms-Persona");
            var removeButton = this._peoplePickerResults[i].querySelector(".ms-PeoplePicker-resultAction");
            personaResult.addEventListener("click", this._selectResult.bind(this), true);
            removeButton.addEventListener("click", this._removeItem.bind(this), true);
        }
    };
    PeoplePicker.prototype._selectResult = function (e) {
        e.stopPropagation();
        var currentResult = this._findElement(e.target, "ms-Persona");
        var clonedResult = currentResult.cloneNode(true);
        if (this._container.classList.contains("ms-PeoplePicker--facePile")) {
            this._addResultToMembers(clonedResult);
        }
        else {
            this._tokenizeResult(clonedResult);
        }
        this._updateCount();
        this._contextualHostView.disposeModal();
    };
    PeoplePicker.prototype._findElement = function (childObj, className) {
        var currentElement = childObj.parentNode;
        while (!currentElement.classList.contains(className)) {
            currentElement = currentElement.parentNode;
        }
        return currentElement;
    };
    PeoplePicker.prototype._addRemoveBtn = function (persona, token) {
        var actionBtn;
        var actionIcon = document.createElement("i");
        if (token) {
            actionBtn = document.createElement("div");
            actionBtn.classList.add("ms-Persona-actionIcon");
            actionBtn.addEventListener("click", this._removeToken.bind(this), true);
        }
        else {
            actionBtn = document.createElement("button");
            actionBtn.classList.add("ms-PeoplePicker-resultAction");
            actionBtn.addEventListener("click", this._removeResult.bind(this), true);
        }
        actionIcon.classList.add("ms-Icon", "ms-Icon--Cancel");
        actionBtn.appendChild(actionIcon);
        persona.appendChild(actionBtn);
    };
    PeoplePicker.prototype._removeToken = function (e) {
        var currentToken = this._findElement(e.target, "ms-Persona");
        currentToken.remove();
    };
    PeoplePicker.prototype._removeResult = function (e) {
        var currentResult = this._findElement(e.target, "ms-PeoplePicker-selectedPerson");
        currentResult.remove();
        this._updateCount();
    };
    PeoplePicker.prototype._removeItem = function (e) {
        var currentItem = this._findElement(e.target, "ms-PeoplePicker-result");
        currentItem.remove();
    };
    PeoplePicker.prototype._updateCount = function () {
        if (this._selectedPeople) {
            var count = this._selectedPeople.querySelectorAll(".ms-PeoplePicker-selectedPerson").length;
            this._selectedCount.textContent = count.toString();
            this._selectedPlural.style.display = (count === 1) ? "none" : "inline";
        }
    };
    PeoplePicker.prototype._tokenizeResult = function (tokenResult) {
        var searchBox = this._container.querySelector(".ms-PeoplePicker-searchBox");
        var textField = searchBox.querySelector(".ms-TextField");
        tokenResult.classList.add(TOKEN_CLASS, "ms-PeoplePicker-persona");
        this._addRemoveBtn(tokenResult, true);
        if (tokenResult.classList.contains("ms-Persona--sm")) {
            tokenResult.classList.remove("ms-Persona--sm");
            tokenResult.classList.add("ms-Persona--xs");
        }
        searchBox.insertBefore(tokenResult, textField);
    };
    PeoplePicker.prototype._addResultToMembers = function (persona) {
        var membersList = this._container.querySelector(".ms-PeoplePicker-selectedPeople");
        var firstMember = membersList.querySelector(".ms-PeoplePicker-selectedPerson");
        var selectedItem = document.createElement("li");
        selectedItem.classList.add("ms-PeoplePicker-selectedPerson");
        selectedItem.tabIndex = 1;
        selectedItem.appendChild(persona);
        this._addRemoveBtn(selectedItem, false);
        selectedItem.querySelector(".ms-PeoplePicker-resultAction").addEventListener("click", this._removeResult.bind(this), true);
        membersList.insertBefore(selectedItem, firstMember);
    };
    PeoplePicker.prototype._assignClicks = function () {
        var _this = this;
        this._peoplePickerSearch.addEventListener("click", this._clickHandler.bind(this), true);
        this._peoplePickerSearch.addEventListener("keyup", function (e) {
            if (e.keyCode !== 27 && !_this._isContextualMenuOpen) {
                _this._clickHandler(e);
            }
        }, true);
    };
    PeoplePicker.prototype._assignRemoveHandler = function () {
        var selectedPeople = this._selectedPeople.querySelectorAll(".ms-PeoplePicker-selectedPerson");
        for (var i = 0; i < selectedPeople.length; i++) {
            selectedPeople[i].querySelector(".ms-PeoplePicker-resultAction").addEventListener("click", this._removeResult.bind(this), true);
        }
    };
    PeoplePicker.prototype._contextHostCallBack = function () {
        this._peoplePickerSearchBox.classList.remove("is-active");
        this._isContextualMenuOpen = false;
    };
    return PeoplePicker;
}());
export { PeoplePicker };
