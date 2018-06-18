var Pivot = (function () {
    function Pivot(container) {
        this._container = container;
        this._addListeners();
        var firstContent = this._container.querySelector(".ms-Pivot-content");
        firstContent.style.display = "block";
    }
    Pivot.prototype.removeListeners = function () {
        this._container.removeEventListener("click", this._selectTab.bind(this));
    };
    Pivot.prototype._addListeners = function () {
        var _this = this;
        this._container.querySelector(".ms-Pivot-links").addEventListener("click", this._selectTabMouse.bind(this), false);
        this._container.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                _this._selectTabKeyboard(event);
            }
        }, true);
    };
    Pivot.prototype._selectTab = function (selectedTab) {
        if (selectedTab.classList.contains("ms-Pivot-link") && !selectedTab.querySelector(".ms-Pivot-ellipsis")) {
            var sibling = selectedTab.parentElement.firstElementChild;
            while (sibling) {
                sibling.classList.remove("is-selected");
                sibling = sibling.nextElementSibling;
            }
            selectedTab.classList.add("is-selected");
            var containers = this._container.querySelectorAll(".ms-Pivot-content");
            Array.prototype.forEach.call(containers, function (el, i) {
                el.style.display = "none";
            });
            var selectedContentName = selectedTab.getAttribute("data-content");
            var selectedContent = this._container.querySelector(".ms-Pivot-content[data-content='" + selectedContentName + "']");
            selectedContent.style.display = "block";
        }
    };
    Pivot.prototype._selectTabMouse = function (event) {
        event.preventDefault();
        var selectedTab = event.target;
        this._selectTab(selectedTab);
    };
    Pivot.prototype._selectTabKeyboard = function (event) {
        event.preventDefault();
        var selectedTab = event.target;
        this._selectTab(selectedTab);
    };
    return Pivot;
}());
export { Pivot };
