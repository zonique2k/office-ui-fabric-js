var MessageBanner = (function () {
    function MessageBanner(container) {
        this._textContainerMaxWidth = 700;
        this._bufferElementsWidth = 88;
        this._bufferElementsWidthSmall = 35;
        this.SMALL_BREAK_POINT = 480;
        this.container = container;
        this.init();
    }
    MessageBanner.prototype.init = function () {
        this._cacheDOM();
        this._setListeners();
        this._clientWidth = this._errorBanner.offsetWidth;
        this._initTextWidth = this._clipper.offsetWidth;
        this._onResize();
    };
    MessageBanner.prototype.show = function () {
        this._errorBanner.className = "ms-MessageBanner";
    };
    MessageBanner.prototype.showBanner = function () {
        this.show();
    };
    MessageBanner.prototype.hide = function () {
        if (this._errorBanner.className.indexOf("hide") === -1) {
            this._errorBanner.className += " hide";
            setTimeout(this._hideMessageBanner.bind(this), 500);
        }
    };
    MessageBanner.prototype._hideMessageBanner = function () {
        this._errorBanner.className = "ms-MessageBanner is-hidden";
    };
    MessageBanner.prototype._onResize = function () {
        this._clientWidth = this._errorBanner.offsetWidth;
        if (window.innerWidth >= this.SMALL_BREAK_POINT) {
            this._resizeRegular();
        }
        else {
            this._resizeSmall();
        }
    };
    MessageBanner.prototype._resizeRegular = function () {
        if ((this._clientWidth - this._bufferSize) > this._initTextWidth && this._initTextWidth < this._textContainerMaxWidth) {
            this._textWidth = "auto";
            this._chevronButton.className = "ms-MessageBanner-expand";
            this._collapse();
        }
        else {
            this._textWidth = Math.min((this._clientWidth - this._bufferSize), this._textContainerMaxWidth) + "px";
            if (this._chevronButton.className.indexOf("is-visible") === -1) {
                this._chevronButton.className += " is-visible";
            }
        }
        this._clipper.style.width = this._textWidth;
    };
    MessageBanner.prototype._resizeSmall = function () {
        if (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth) > this._initTextWidth) {
            this._textWidth = "auto";
            this._collapse();
        }
        else {
            this._textWidth = (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth)) + "px";
        }
        this._clipper.style.width = this._textWidth;
    };
    MessageBanner.prototype._cacheDOM = function () {
        this._errorBanner = this.container;
        this._clipper = this.container.querySelector(".ms-MessageBanner-clipper");
        this._chevronButton = this.container.querySelector(".ms-MessageBanner-expand");
        this._actionButton = this.container.querySelector(".ms-MessageBanner-action");
        this._bufferSize = this._actionButton.offsetWidth + this._bufferElementsWidth;
        this._closeButton = this.container.querySelector(".ms-MessageBanner-close");
    };
    MessageBanner.prototype._expand = function () {
        var icon = this._chevronButton.querySelector(".ms-Icon");
        this._errorBanner.className += " is-expanded";
        icon.className = "ms-Icon ms-Icon--DoubleChevronUp";
    };
    MessageBanner.prototype._collapse = function () {
        var icon = this._chevronButton.querySelector(".ms-Icon");
        this._errorBanner.className = "ms-MessageBanner";
        icon.className = "ms-Icon ms-Icon--DoubleChevronDown";
    };
    MessageBanner.prototype._toggleExpansion = function () {
        if (this._errorBanner.className.indexOf("is-expanded") > -1) {
            this._collapse();
        }
        else {
            this._expand();
        }
    };
    MessageBanner.prototype._setListeners = function () {
        window.addEventListener("resize", this._onResize.bind(this), false);
        this._chevronButton.addEventListener("click", this._toggleExpansion.bind(this), false);
        this._closeButton.addEventListener("click", this.hide.bind(this), false);
    };
    return MessageBanner;
}());
export { MessageBanner };
