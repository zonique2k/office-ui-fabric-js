import { Panel } from "../Panel/Panel";
var DROPDOWN_CLASS = "ms-Dropdown";
var DROPDOWN_TITLE_CLASS = "ms-Dropdown-title";
var DROPDOWN_LABEL_HELPER = "ms-Dropdown-truncator";
var DROPDOWN_ITEMS_CLASS = "ms-Dropdown-items";
var DROPDOWN_ITEM_CLASS = "ms-Dropdown-item";
var DROPDOWN_SELECT_CLASS_SELECTOR = ".ms-Dropdown-select";
var PANEL_CLASS = "ms-Panel";
var IS_OPEN_CLASS = "is-open";
var IS_DISABLED_CLASS = "is-disabled";
var IS_SELECTED_CLASS = "is-selected";
var ANIMATE_IN_CLASS = "animate-in";
var SMALL_MAX_WIDTH = 479;
var Dropdown = (function () {
    function Dropdown(container) {
        this._container = container;
        this._dropdownLabelHelper = document.createElement("span");
        this._dropdownLabelHelper.classList.add(DROPDOWN_LABEL_HELPER);
        this._dropdownLabelHelper.classList.add(DROPDOWN_TITLE_CLASS);
        this._newDropdownLabel = document.createElement("span");
        this._newDropdownLabel.classList.add(DROPDOWN_TITLE_CLASS);
        this._newDropdown = document.createElement("ul");
        this._newDropdown.classList.add(DROPDOWN_ITEMS_CLASS);
        this._dropdownItems = [];
        this._originalDropdown = container.querySelector(DROPDOWN_SELECT_CLASS_SELECTOR);
        var _originalOptions = this._originalDropdown.querySelectorAll("option");
        this._onCloseDropdown = this._onCloseDropdown.bind(this);
        this._onItemSelection = this._onItemSelection.bind(this);
        this._onOpenDropdown = this._onOpenDropdown.bind(this);
        for (var i = 0; i < _originalOptions.length; ++i) {
            var option = _originalOptions[i];
            if (option.selected) {
                this._newDropdownLabel.innerHTML = option.text;
            }
            var newItem = document.createElement("li");
            newItem.classList.add(DROPDOWN_ITEM_CLASS);
            if (option.disabled) {
                newItem.classList.add(IS_DISABLED_CLASS);
            }
            if (option.selected) {
                newItem.classList.add(IS_SELECTED_CLASS);
            }
            newItem.innerHTML = option.text;
            newItem.addEventListener("click", this._onItemSelection);
            this._newDropdown.appendChild(newItem);
            this._dropdownItems.push({
                oldOption: option,
                newItem: newItem
            });
        }
        container.appendChild(this._newDropdownLabel);
        container.appendChild(this._newDropdown);
        container.appendChild(this._dropdownLabelHelper);
        this._newDropdownLabel.addEventListener("click", this._onOpenDropdown);
        this._checkTruncation();
        this._setWindowEvent();
    }
    Dropdown.prototype._setWindowEvent = function () {
        var _this = this;
        window.addEventListener("resize", function () {
            _this._doResize();
            _this._checkTruncation();
        }, false);
    };
    Dropdown.prototype._checkTruncation = function () {
        var selected = this._newDropdown.querySelector("." + IS_SELECTED_CLASS);
        var origText = (selected ?
            selected.textContent :
            this._newDropdown.querySelectorAll("." + DROPDOWN_ITEM_CLASS)[0].textContent);
        this._dropdownLabelHelper.textContent = origText;
        if (this._dropdownLabelHelper.offsetHeight > this._newDropdownLabel.offsetHeight) {
            var i = 0;
            var ellipsis = "...";
            var newText = void 0;
            do {
                i--;
                newText = origText.slice(0, i);
                this._dropdownLabelHelper.textContent = newText + ellipsis;
            } while (this._dropdownLabelHelper.offsetHeight > this._newDropdownLabel.offsetHeight);
        }
        this._newDropdownLabel.textContent = this._dropdownLabelHelper.textContent;
    };
    Dropdown.prototype._getScreenSize = function () {
        var w = window;
        var wSize = {
            x: 0,
            y: 0
        };
        var d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
        wSize.x = w.innerWidth || e.clientWidth || g.clientWidth;
        wSize.y = w.innerHeight || e.clientHeight || g.clientHeight;
        return wSize;
    };
    Dropdown.prototype._doResize = function () {
        var isOpen = this._container.classList.contains(IS_OPEN_CLASS);
        if (!isOpen) {
            return;
        }
        var screenSize = this._getScreenSize().x;
        if (screenSize <= SMALL_MAX_WIDTH) {
            this._openDropdownAsPanel();
        }
        else {
            this._removeDropdownAsPanel();
        }
    };
    Dropdown.prototype._openDropdownAsPanel = function () {
        if (this._panel === undefined) {
            this._panelContainer = document.createElement("div");
            this._panelContainer.classList.add(PANEL_CLASS);
            this._panelContainer.classList.add(DROPDOWN_CLASS);
            this._panelContainer.classList.add(IS_OPEN_CLASS);
            this._panelContainer.classList.add(ANIMATE_IN_CLASS);
            this._panelContainer.appendChild(this._newDropdown);
            this._panel = new Panel(this._panelContainer);
        }
    };
    Dropdown.prototype._removeDropdownAsPanel = function (evt) {
        var _this = this;
        if (this._panel !== undefined) {
            if (evt && evt.target === this._panel.panelHost.overlay.overlayElement) {
                this._container.appendChild(this._newDropdown);
            }
            else {
                this._panel.dismiss(function () {
                    _this._container.appendChild(_this._newDropdown);
                });
            }
            this._panel = undefined;
        }
    };
    Dropdown.prototype._onOpenDropdown = function (evt) {
        var isDisabled = this._container.classList.contains(IS_DISABLED_CLASS);
        var isOpen = this._container.classList.contains(IS_OPEN_CLASS);
        if (!isDisabled && !isOpen) {
            evt.stopPropagation();
            this._closeOtherDropdowns();
            this._container.classList.add(IS_OPEN_CLASS);
            document.addEventListener("click", this._onCloseDropdown);
            var screenSize = this._getScreenSize().x;
            if (screenSize <= SMALL_MAX_WIDTH) {
                this._openDropdownAsPanel();
            }
        }
    };
    Dropdown.prototype._closeOtherDropdowns = function () {
        var dropdowns = document.querySelectorAll("." + DROPDOWN_CLASS + "." + IS_OPEN_CLASS);
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove(IS_OPEN_CLASS);
        }
    };
    Dropdown.prototype._onCloseDropdown = function (evt) {
        this._removeDropdownAsPanel(evt);
        this._container.classList.remove(IS_OPEN_CLASS);
        document.removeEventListener("click", this._onCloseDropdown);
    };
    Dropdown.prototype._onItemSelection = function (evt) {
        var item = evt.target;
        var isDropdownDisabled = this._container.classList.contains(IS_DISABLED_CLASS);
        var isOptionDisabled = item.classList.contains(IS_DISABLED_CLASS);
        if (!isDropdownDisabled && !isOptionDisabled) {
            for (var i = 0; i < this._dropdownItems.length; ++i) {
                if (this._dropdownItems[i].newItem === item) {
                    this._dropdownItems[i].newItem.classList.add(IS_SELECTED_CLASS);
                    this._dropdownItems[i].oldOption.selected = true;
                }
                else {
                    this._dropdownItems[i].newItem.classList.remove(IS_SELECTED_CLASS);
                    this._dropdownItems[i].oldOption.selected = false;
                }
            }
            this._newDropdownLabel.innerHTML = item.textContent;
            this._checkTruncation();
            var changeEvent = document.createEvent("HTMLEvents");
            changeEvent.initEvent("change", false, true);
            this._originalDropdown.dispatchEvent(changeEvent);
        }
    };
    return Dropdown;
}());
export { Dropdown };
