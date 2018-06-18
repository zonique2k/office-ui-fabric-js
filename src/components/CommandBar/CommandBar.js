import { SearchBox } from "../SearchBox/SearchBox";
import { CommandButton } from "../CommandButton/CommandButton";
var CONTEXTUAL_MENU = ".ms-ContextualMenu";
var CONTEXTUAL_MENU_ITEM = ".ms-ContextualMenu-item";
var CONTEXTUAL_MENU_LINK = ".ms-ContextualMenu-link";
var CB_SEARCH_BOX = ".ms-SearchBox";
var CB_MAIN_AREA = ".ms-CommandBar-mainArea";
var CB_SIDE_COMMAND_AREA = ".ms-CommandBar-sideCommands";
var CB_ITEM_OVERFLOW = ".ms-CommandBar-overflowButton";
var CB_NO_LABEL_CLASS = "ms-CommandButton--noLabel";
var SEARCH_BOX_CLOSE = ".ms-SearchBox-closeField";
var COMMAND_BUTTON = ".ms-CommandButton";
var COMMAND_BUTTON_LABEL = ".ms-CommandButton-label";
var ICON = ".ms-Icon";
var OVERFLOW_WIDTH = 40;
var OVERFLOW_LEFT_RIGHT_PADDING = 30;
var CommandBar = (function () {
    function CommandBar(container) {
        this.responsiveSizes = {
            "sm-min": 320,
            "md-min": 480,
            "lg-min": 640,
            "xl-min": 1024,
            "xxl-min": 1366,
            "xxxl-min": 1920
        };
        this.visibleCommands = [];
        this.commandWidths = [];
        this.overflowCommands = [];
        this.itemCollection = [];
        this._sideAreaCollection = [];
        this.breakpoint = "sm";
        this._container = container;
        this.responsiveSizes["sm-max"] = this.responsiveSizes["md-min"] - 1;
        this.responsiveSizes["md-max"] = this.responsiveSizes["lg-min"] - 1;
        this.responsiveSizes["lg-max"] = this.responsiveSizes["xl-min"] - 1;
        this.responsiveSizes["xl-max"] = this.responsiveSizes["xxl-min"] - 1;
        this.responsiveSizes["xxl-max"] = this.responsiveSizes["xxxl-min"] - 1;
        this._setElements();
        this._setBreakpoint();
        if (this._elements.overflowCommand) {
            this._initOverflow();
        }
        this._setUIState();
    }
    CommandBar.prototype._runsSearchBox = function (state) {
        if (state === void 0) { state = "add"; }
        this._changeSearchState("is-collapsed", state);
    };
    CommandBar.prototype._runOverflow = function () {
        if (this._elements.overflowCommand) {
            this._saveCommandWidths();
            this._redrawMenu();
            this._updateCommands();
            this._drawCommands();
            this._checkOverflow();
        }
    };
    CommandBar.prototype._initOverflow = function () {
        this._createContextualRef();
        this._createItemCollection(this.itemCollection, CB_MAIN_AREA);
        this._createItemCollection(this._sideAreaCollection, CB_SIDE_COMMAND_AREA);
        this._saveCommandWidths();
        this._updateCommands();
        this._drawCommands();
        this._setWindowEvent();
        this._checkOverflow();
    };
    CommandBar.prototype._hasClass = function (element, cls) {
        return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    };
    CommandBar.prototype._onSearchExpand = function () {
        if (this.breakpoint === "lg") {
            this._container.classList.add("search-expanded");
            this._doResize();
        }
    };
    CommandBar.prototype._onSearchCollapse = function () {
        if (this.breakpoint === "lg") {
            this._container.classList.remove("search-expanded");
            this._doResize();
        }
    };
    CommandBar.prototype._getScreenSize = function () {
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
    CommandBar.prototype._setBreakpoint = function () {
        var screenSize = this._getScreenSize().x;
        switch (true) {
            case (screenSize <= this.responsiveSizes["sm-max"]):
                this.breakpoint = "sm";
                break;
            case (screenSize >= this.responsiveSizes["md-min"] && screenSize <= this.responsiveSizes["md-max"]):
                this.breakpoint = "md";
                break;
            case (screenSize >= this.responsiveSizes["lg-min"] && screenSize <= this.responsiveSizes["lg-max"]):
                this.breakpoint = "lg";
                break;
            case (screenSize >= this.responsiveSizes["xl-min"] && screenSize <= this.responsiveSizes["xl-max"]):
                this.breakpoint = "xl";
                break;
            case (screenSize >= this.responsiveSizes["xxl-min"] && screenSize <= this.responsiveSizes["xxl-max"]):
                this.breakpoint = "xxl";
                break;
            case (screenSize >= this.responsiveSizes["xxxl-min"]):
                this.breakpoint = "xxxl";
                break;
        }
    };
    CommandBar.prototype._createSearchInstance = function () {
        if (this._elements.searchBox) {
            return new SearchBox(this._elements.searchBox);
        }
        else {
            return false;
        }
    };
    CommandBar.prototype._changeSearchState = function (state, action) {
        if (this._elements.searchBox) {
            switch (action) {
                case "remove":
                    this._elements.searchBox.classList.remove(state);
                    break;
                case "add":
                    this._elements.searchBox.classList.add(state);
                    break;
                default:
                    break;
            }
        }
    };
    CommandBar.prototype._setElements = function () {
        var _this = this;
        this._elements = {
            mainArea: this._container.querySelector(CB_MAIN_AREA)
        };
        if (this._container.querySelector(CB_SIDE_COMMAND_AREA)) {
            this._elements.sideCommandArea = this._container.querySelector(CB_SIDE_COMMAND_AREA);
        }
        if (this._container.querySelector(CB_ITEM_OVERFLOW)) {
            this._elements.overflowCommand = this._container.querySelector(CB_ITEM_OVERFLOW);
            this._elements.contextMenu = this._container.querySelector(CB_ITEM_OVERFLOW).querySelector(CONTEXTUAL_MENU);
        }
        if (this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX)) {
            this._elements.searchBox = this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX);
            this._elements.searchBoxClose = this._container.querySelector(SEARCH_BOX_CLOSE);
            this.searchBoxInstance = this._createSearchInstance();
            this.searchBoxInstance.getInputField().addEventListener("focus", function () { _this._onSearchExpand(); }, false);
            this.searchBoxInstance.getInputField().addEventListener("searchCollapse", function () { _this._onSearchCollapse(); }, false);
        }
    };
    CommandBar.prototype._createItemCollection = function (iCollection, areaClass) {
        var item, label, iconClasses, splitClasses, items = this._container.querySelectorAll(areaClass + " > " + COMMAND_BUTTON + ":not(" + CB_ITEM_OVERFLOW + ")");
        this._commandButtonInstance = new CommandButton(this._elements.overflowCommand);
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            label = item.querySelector(COMMAND_BUTTON_LABEL).textContent;
            var icon = item.querySelector(ICON);
            if (icon) {
                iconClasses = icon.className;
                splitClasses = iconClasses.split(" ");
                for (var o = 0; o < splitClasses.length; o++) {
                    if (splitClasses[o].indexOf(ICON.replace(".", "") + "--") > -1) {
                        icon = splitClasses[o];
                        break;
                    }
                }
            }
            iCollection.push({
                item: item,
                label: label,
                icon: icon,
                isCollapsed: (item.classList.contains(CB_NO_LABEL_CLASS)) ? true : false,
                commandButtonRef: new CommandButton(item)
            });
        }
        return;
    };
    CommandBar.prototype._createContextualRef = function () {
        this.contextualItemContainerRef = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_ITEM).cloneNode(true);
        this.contextualItemLink = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_LINK).cloneNode(false);
        this.contextualItemIcon = this._elements.contextMenu.querySelector(".ms-Icon").cloneNode(false);
        this._elements.contextMenu.innerHTML = "";
    };
    CommandBar.prototype._getElementWidth = function (element) {
        var width, styles;
        if (element.offsetParent === null) {
            element.setAttribute("style", "position: absolute; opacity: 0; display: block;");
        }
        width = element.getBoundingClientRect().width;
        styles = window.getComputedStyle(element);
        width += parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
        element.setAttribute("style", "");
        return width;
    };
    CommandBar.prototype._saveCommandWidths = function () {
        for (var i = 0; i < this.itemCollection.length; i++) {
            var item = this.itemCollection[i].item;
            var width = this._getElementWidth(item);
            this.commandWidths[i] = width;
        }
    };
    CommandBar.prototype._updateCommands = function () {
        var searchCommandWidth = 0;
        var mainAreaWidth = this._elements.mainArea.getBoundingClientRect().width;
        if (this._elements.searchBox) {
            searchCommandWidth = this._getElementWidth(this._elements.searchBox);
        }
        var offset = searchCommandWidth + OVERFLOW_WIDTH + OVERFLOW_LEFT_RIGHT_PADDING;
        var totalAreaWidth = mainAreaWidth - offset;
        this.visibleCommands = [];
        this.overflowCommands = [];
        var totalWidths = 0;
        for (var i = 0; i < this.itemCollection.length; i++) {
            totalWidths += this.commandWidths[i];
            if (totalWidths < totalAreaWidth) {
                this.visibleCommands.push(this.itemCollection[i]);
            }
            else {
                this.overflowCommands.push(this.itemCollection[i]);
            }
        }
    };
    CommandBar.prototype._drawCommands = function () {
        this._elements.contextMenu.innerHTML = "";
        for (var i = 0; i < this.overflowCommands.length; i++) {
            this.overflowCommands[i].item.classList.add("is-hidden");
            var newCItem = this.contextualItemContainerRef.cloneNode(false);
            var newClink = this.contextualItemLink.cloneNode(false);
            var iconClass = this.overflowCommands[i].icon;
            newClink.innerText = this.overflowCommands[i].label;
            newCItem.appendChild(newClink);
            if (iconClass) {
                var newIcon = this.contextualItemIcon.cloneNode(false);
                newIcon.className = ICON.replace(".", "") + " " + iconClass;
                newCItem.appendChild(newIcon);
            }
            this._elements.contextMenu.appendChild(newCItem);
        }
        for (var x = 0; x < this.visibleCommands.length; x++) {
            this.visibleCommands[x].item.classList.remove("is-hidden");
        }
    };
    CommandBar.prototype._setWindowEvent = function () {
        var _this = this;
        window.addEventListener("resize", function () {
            _this._doResize();
        }, false);
    };
    CommandBar.prototype._processCollapsedClasses = function (type) {
        for (var i = 0; i < this.itemCollection.length; i++) {
            var thisItem = this.itemCollection[i];
            if (!thisItem.isCollapsed) {
                if (type === "add") {
                    thisItem.item.classList.add(CB_NO_LABEL_CLASS);
                }
                else {
                    thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
                }
            }
        }
        for (var i = 0; i < this._sideAreaCollection.length; i++) {
            var thisItem = this._sideAreaCollection[i];
            if (!thisItem.isCollapsed) {
                if (type === "add") {
                    thisItem.item.classList.add(CB_NO_LABEL_CLASS);
                }
                else {
                    thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
                }
            }
        }
    };
    CommandBar.prototype._setUIState = function () {
        switch (this.breakpoint) {
            case "sm":
                this._runsSearchBox();
                this._processCollapsedClasses("add");
                this._runOverflow();
                break;
            case "md":
                this._runsSearchBox();
                this._processCollapsedClasses("add");
                this._runOverflow();
                break;
            case "lg":
                this._runsSearchBox();
                this._processCollapsedClasses("remove");
                this._runOverflow();
                break;
            case "xl":
                this._runsSearchBox("remove");
                this._processCollapsedClasses("remove");
                this._runOverflow();
                break;
            default:
                this._runsSearchBox("remove");
                this._processCollapsedClasses("remove");
                this._runOverflow();
                break;
        }
    };
    CommandBar.prototype._checkOverflow = function () {
        if (this.overflowCommands.length > 0) {
            this._elements.overflowCommand.classList.remove("is-hidden");
        }
        else {
            this._elements.overflowCommand.classList.add("is-hidden");
            if (this.activeCommand === this._elements.overflowCommand) {
                this._elements.contextMenu.classList.remove("is-open");
            }
        }
    };
    CommandBar.prototype._redrawMenu = function () {
        var left;
        if (this._hasClass(this._elements.contextMenu, "is-open")) {
            left = this.activeCommand.getBoundingClientRect().left;
            this._drawOverflowMenu(left);
        }
    };
    CommandBar.prototype._drawOverflowMenu = function (left) {
        this._elements.contextMenu.setAttribute("style", "left: " + left + "px; transform: translateX(-50%)");
    };
    CommandBar.prototype._doResize = function () {
        this._setBreakpoint();
        this._setUIState();
    };
    return CommandBar;
}());
export { CommandBar };
