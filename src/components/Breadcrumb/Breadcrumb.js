var Breadcrumb = (function () {
    function Breadcrumb(container) {
        this._currentMaxItems = 0;
        this._itemCollection = [];
        this._tabIndex = 2;
        this.container = container;
        this._onResize = this._onResize.bind(this);
        this._openOverflow = this._openOverflow.bind(this);
        this._overflowKeyPress = this._overflowKeyPress.bind(this);
        this._closeOverflow = this._closeOverflow.bind(this);
        this.removeOutlinesOnClick = this.removeOutlinesOnClick.bind(this);
        this.init();
    }
    Breadcrumb.prototype.removeOutlinesOnClick = function () {
        this._breadcrumbList.blur();
    };
    Breadcrumb.prototype.addItem = function (itemLabel, itemLink) {
        this._itemCollection.push({ text: itemLabel, link: itemLink });
        this._updateBreadcrumbs();
    };
    Breadcrumb.prototype.removeItemByLabel = function (itemLabel) {
        var i = this._itemCollection.length;
        while (i--) {
            if (this._itemCollection[i].text === itemLabel) {
                this._itemCollection.splice(i, 1);
            }
        }
        this._updateBreadcrumbs();
    };
    ;
    Breadcrumb.prototype.removeItemByPosition = function (value) {
        this._itemCollection.splice(value, 1);
        this._updateBreadcrumbs();
    };
    Breadcrumb.prototype.init = function () {
        this._cacheDOM();
        this._setListeners();
        this._createItemCollection();
        this._onResize();
    };
    Breadcrumb.prototype._createItemCollection = function () {
        var length = this._listItems.length;
        var i = 0;
        var item;
        var text;
        var link;
        var tabIndex;
        for (i; i < length; i++) {
            item = this._listItems[i].querySelector(".ms-Breadcrumb-itemLink");
            text = item.textContent;
            link = item.getAttribute("href");
            tabIndex = parseInt(item.getAttribute("tabindex"), 10);
            this._itemCollection.push({ link: link, tabIndex: tabIndex, text: text });
        }
    };
    Breadcrumb.prototype._onResize = function () {
        this._closeOverflow(null);
        this._renderList();
    };
    Breadcrumb.prototype._renderList = function () {
        var maxItems = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;
        if (maxItems !== this._currentMaxItems) {
            this._updateBreadcrumbs();
        }
        this._currentMaxItems = maxItems;
    };
    Breadcrumb.prototype._updateBreadcrumbs = function () {
        this._tabIndex = 2;
        var maxItems = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;
        if (this._itemCollection.length > maxItems) {
            this._breadcrumb.classList.add("is-overflow");
        }
        else {
            this._breadcrumb.classList.remove("is-overflow");
        }
        this._addItemsToOverflow(maxItems);
        this._addBreadcrumbItems(maxItems);
    };
    ;
    Breadcrumb.prototype._addItemsToOverflow = function (maxItems) {
        var _this = this;
        this._resetList(this._contextMenu);
        var end = this._itemCollection.length - maxItems;
        var overflowItems = this._itemCollection.slice(0, end);
        overflowItems.forEach(function (item) {
            var li = document.createElement("li");
            li.className = "ms-ContextualMenu-item";
            var a = document.createElement("a");
            a.className = "ms-ContextualMenu-link";
            if (item.link !== null) {
                a.setAttribute("href", item.link);
            }
            a.setAttribute("tabindex", (_this._tabIndex++).toString());
            a.textContent = item.text;
            li.appendChild(a);
            _this._contextMenu.appendChild(li);
        });
    };
    Breadcrumb.prototype._addBreadcrumbItems = function (maxItems) {
        this._resetList(this._breadcrumbList);
        var i = this._itemCollection.length - maxItems;
        i = i < 0 ? 0 : i;
        if (i >= 0) {
            for (i; i < this._itemCollection.length; i++) {
                var listItem = document.createElement("li");
                var item = this._itemCollection[i];
                var a = document.createElement("a");
                var chevron = document.createElement("i");
                listItem.className = "ms-Breadcrumb-listItem";
                a.className = "ms-Breadcrumb-itemLink";
                if (item.link !== null) {
                    a.setAttribute("href", item.link);
                }
                a.setAttribute("tabindex", (this._tabIndex++).toString());
                a.textContent = item.text;
                chevron.className = "ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight";
                listItem.appendChild(a);
                listItem.appendChild(chevron);
                this._breadcrumbList.appendChild(listItem);
            }
        }
    };
    Breadcrumb.prototype._resetList = function (list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    };
    Breadcrumb.prototype._openOverflow = function (event) {
        if (this._overflowMenu.className.indexOf(" is-open") === -1) {
            this._overflowMenu.classList.add("is-open");
            this.removeOutlinesOnClick();
            this._overflowButton.focus();
        }
    };
    Breadcrumb.prototype._overflowKeyPress = function (event) {
        if (event.keyCode === 13) {
            this._openOverflow(event);
        }
    };
    Breadcrumb.prototype._closeOverflow = function (event) {
        if (!event || event.target !== this._overflowButton) {
            this._overflowMenu.classList.remove("is-open");
        }
    };
    Breadcrumb.prototype._cacheDOM = function () {
        this._breadcrumb = this.container;
        this._breadcrumbList = this._breadcrumb.querySelector(".ms-Breadcrumb-list");
        this._listItems = this._breadcrumb.querySelectorAll(".ms-Breadcrumb-listItem");
        this._contextMenu = this._breadcrumb.querySelector(".ms-ContextualMenu");
        this._overflowButton = this._breadcrumb.querySelector(".ms-Breadcrumb-overflowButton");
        this._overflowMenu = this._breadcrumb.querySelector(".ms-Breadcrumb-overflowMenu");
    };
    Breadcrumb.prototype._setListeners = function () {
        window.addEventListener("resize", this._onResize, false);
        this._overflowButton.addEventListener("click", this._openOverflow, false);
        this._overflowButton.addEventListener("keypress", this._overflowKeyPress, false);
        document.addEventListener("click", this._closeOverflow, false);
        this._breadcrumbList.addEventListener("click", this.removeOutlinesOnClick, false);
    };
    Breadcrumb.MEDIUM = 639;
    return Breadcrumb;
}());
export { Breadcrumb };
