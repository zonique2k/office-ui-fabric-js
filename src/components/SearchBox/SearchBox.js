var SB_FIELD = ".ms-SearchBox-field";
var SB_CLEAR_BUTTON = ".ms-SearchBox-clear";
var SB_EXIT_BUTTON = ".ms-SearchBox-exit";
var SB_HAS_TEXT = "has-text";
var SB_IS_ACTIVE = "is-active";
var SB_IS_ANIMATED = "is-animated";
var SearchBox = (function () {
    function SearchBox(container) {
        var _this = this;
        this._container = container;
        this._saveDOMRefs(this._container);
        this._boundExpandSearchHandler = this._expandSearchHandler.bind(this);
        this._boundEnableClose = this._enableClose.bind(this);
        this._boundCollapseSearchBox = this._collapseSearchBox.bind(this);
        this._boundClearSearchBox = this._clearSearchBox.bind(this);
        this._boundHandleBlur = this._handleBlur.bind(this);
        this._boundExitSearchBox = this._exitSearchBox.bind(this);
        this._setHasText();
        this._setFocusAction(this._container);
        this._setClearButtonAction();
        this._setBlurAction();
        this._clearOnly = false;
        setTimeout(function () {
            _this._checkState();
            _this._addAnimation();
        }, 10);
    }
    SearchBox.prototype.setCollapsedListeners = function () {
        this._disposeListeners();
        this._searchBox.addEventListener("click", this._boundExpandSearchHandler, false);
        this._searchBoxField.addEventListener("focus", this._boundExpandSearchHandler, true);
    };
    SearchBox.prototype.getInputField = function () {
        return this._searchBoxField;
    };
    SearchBox.prototype._saveDOMRefs = function (context) {
        this._searchBox = context;
        this._searchBoxField = this._searchBox.querySelector(SB_FIELD);
        this._searchBoxClearButton = this._searchBox.querySelector(SB_CLEAR_BUTTON);
        this._searchBoxExitButton = this._searchBox.querySelector(SB_EXIT_BUTTON);
    };
    SearchBox.prototype._disposeListeners = function () {
        this._searchBox.removeEventListener("click", this._boundExpandSearchHandler);
        this._searchBoxField.removeEventListener("focus", this._boundExpandSearchHandler);
    };
    SearchBox.prototype._exitSearchBox = function (event) {
        event.stopPropagation();
        event.target.blur();
        this._clearSearchBox();
        this._collapseSearchBox();
        this._searchBox.removeEventListener("keyup", this._boundEnableClose);
        this.setCollapsedListeners();
    };
    SearchBox.prototype._collapseSearchBox = function () {
        this._searchBox.classList.remove("is-active");
        var event = document.createEvent("Event");
        event.initEvent("searchCollapse", true, true);
        this._searchBoxField.dispatchEvent(event);
    };
    SearchBox.prototype._expandSearchHandler = function () {
        this._disposeListeners();
        this._searchBox.classList.add("is-active");
        this._searchBoxField.focus();
    };
    SearchBox.prototype._enableClose = function () {
        this._setHasText();
    };
    SearchBox.prototype._setHasText = function () {
        if (this._searchBoxField.value.length > 0) {
            this._searchBox.classList.add(SB_HAS_TEXT);
        }
        else {
            this._searchBox.classList.remove(SB_HAS_TEXT);
        }
    };
    SearchBox.prototype._setFocusAction = function (context) {
        var _this = this;
        this._searchBoxField.addEventListener("focus", function () {
            _this._setHasText();
            _this._searchBox.addEventListener("keyup", _this._boundEnableClose, false);
            _this._searchBox.classList.add(SB_IS_ACTIVE);
            _this._searchBox.classList.add(SB_IS_ACTIVE);
        }, true);
    };
    SearchBox.prototype._clearSearchBox = function (event) {
        var _this = this;
        this._clearOnly = true;
        this._searchBoxField.value = "";
        this._setHasText();
        setTimeout(function () {
            _this._clearOnly = false;
        }, 10);
    };
    SearchBox.prototype._setClearButtonAction = function () {
        var _this = this;
        if (this._searchBoxExitButton) {
            this._searchBoxExitButton.addEventListener("click", this._boundExitSearchBox, false);
        }
        this._searchBoxClearButton.addEventListener("mousedown", this._boundClearSearchBox, false);
        this._searchBoxClearButton.addEventListener("keydown", function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 13) {
                _this._clearSearchBox(e);
            }
        }, false);
    };
    SearchBox.prototype._handleBlur = function (event) {
        var _this = this;
        console.log("_handleBlur");
        if (this._searchBox.classList.contains("ignoreBlur"))
            return;
        if (!this._clearOnly) {
            this._searchBox.removeEventListener("keyup", this._boundEnableClose);
            setTimeout(function () {
                if (!_this._searchBox.contains(document.activeElement)) {
                    _this._clearSearchBox();
                    _this._collapseSearchBox();
                    _this.setCollapsedListeners();
                }
            }, 10);
        }
        else {
            this._searchBoxField.focus();
        }
        this._clearOnly = false;
    };
    SearchBox.prototype._setBlurAction = function () {
        this._searchBoxField.addEventListener("blur", this._boundHandleBlur, true);
        this._searchBoxClearButton.addEventListener("blur", this._boundHandleBlur, true);
    };
    SearchBox.prototype._checkState = function () {
        if (this._searchBox.classList.contains("is-collapsed")) {
            this.setCollapsedListeners();
        }
    };
    SearchBox.prototype._addAnimation = function () {
        this._container.classList.add(SB_IS_ANIMATED);
    };
    return SearchBox;
}());
export { SearchBox };
