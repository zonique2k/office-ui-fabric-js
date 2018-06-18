import { ContextualHost } from "../ContextualHost/ContextualHost";
var MODAL_POSITION = "bottom";
var SUBMENU_POSITION = "right";
var ContextualMenu = (function () {
    function ContextualMenu(container, hostTarget, position) {
        this._container = container;
        this._hostTarget = hostTarget;
        this._position = position ? position : MODAL_POSITION;
        this._isOpen = false;
        this._setOpener(hostTarget);
        this._init();
    }
    ContextualMenu.prototype.getHost = function () {
        return this._host;
    };
    ContextualMenu.prototype._init = function () {
        this._container.addEventListener("click", this._onContextualMenuClick.bind(this), true);
        document.addEventListener("click", this._onDocumentClick.bind(this), false);
    };
    ContextualMenu.prototype._onDocumentClick = function (event) {
        if (event.target instanceof HTMLElement) {
            var target = event.target;
            var classList = target.classList;
            if (!this._hostTarget.contains(target) && !classList.contains("ms-ContextualMenu-link")) {
                this._isOpen = false;
            }
        }
    };
    ContextualMenu.prototype._onContextualMenuClick = function (event) {
        var target = event.target;
        var classList = target.classList;
        if (classList.contains("ms-ContextualMenu-link") && !classList.contains("is-disabled")) {
            if (this._container.classList.contains("ms-ContextualMenu--multiselect")) {
                this._multiSelect(target);
            }
            else {
                this._singleSelect(target);
                if (!target.parentElement.classList.contains("ms-ContextualMenu-item--hasMenu")) {
                    this._host.disposeModal();
                    this._isOpen = false;
                }
            }
        }
    };
    ContextualMenu.prototype._multiSelect = function (target) {
        if (target.classList.contains("is-selected")) {
            target.classList.remove("is-selected");
        }
        else {
            target.classList.add("is-selected");
        }
    };
    ContextualMenu.prototype._singleSelect = function (target) {
        var selecteds = this._container.querySelectorAll(".is-selected");
        var i = selecteds.length;
        while (i--) {
            selecteds[i].classList.remove("is-selected");
        }
        target.classList.add("is-selected");
    };
    ContextualMenu.prototype._toggleMenu = function (event) {
        (!this._isOpen) ? this._openContextMenu(event) : this._host.disposeModal();
        this._isOpen = !this._isOpen;
    };
    ContextualMenu.prototype._setOpener = function (hostTarget) {
        var _this = this;
        hostTarget.addEventListener("click", function (event) {
            event.preventDefault();
            _this._toggleMenu(event);
        });
    };
    ContextualMenu.prototype._openContextMenu = function (event) {
        this._createModalHostView(this._container, this._position, this._hostTarget);
        this._checkForSubmenus(this._container);
    };
    ContextualMenu.prototype._checkForSubmenus = function (container) {
        var _this = this;
        var submenus = container.querySelectorAll(".ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu");
        var i = submenus.length;
        if (submenus.length) {
            var _loop_1 = function () {
                var button = submenus[i].querySelector(".ms-ContextualMenu-link");
                var menu = submenus[i].querySelector(".ms-ContextualMenu");
                if (menu) {
                    var contextualMenu_1 = new ContextualMenu(menu, button, SUBMENU_POSITION);
                    menu.addEventListener("hostAdded", function () {
                        _this._host.setChildren(contextualMenu_1.getHost());
                    });
                }
            };
            while (i--) {
                _loop_1();
            }
        }
    };
    ContextualMenu.prototype._createModalHostView = function (container, position, hostTarget) {
        container.classList.remove("is-hidden");
        this._host = new ContextualHost(container, position, hostTarget, false);
        var event = document.createEvent("Event");
        event.initEvent("hostAdded", true, true);
        container.dispatchEvent(event);
    };
    return ContextualMenu;
}());
export { ContextualMenu };
