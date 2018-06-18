var CONTEXT_STATE_CLASS = "is-open";
var MODAL_STATE_POSITIONED = "is-positioned";
var CONTEXT_HOST_MAIN_CLASS = "ms-ContextualHost-main";
var CONTEXT_HOST_BEAK_CLASS = "ms-ContextualHost-beak";
var ARROW_LEFT_CLASS = "ms-ContextualHost--arrowLeft";
var ARROW_TOP_CLASS = "ms-ContextualHost--arrowTop";
var ARROW_BOTTOM_CLASS = "ms-ContextualHost--arrowBottom";
var ARROW_RIGHT_CLASS = "ms-ContextualHost--arrowRight";
var MODIFIER_BASE = "ms-ContextualHost--";
var ARROW_SIZE = 28;
var ARROW_OFFSET = 8;
var ContextualHost = (function () {
    function ContextualHost(content, direction, targetElement, hasArrow, modifiers, matchTargetWidth, disposalCallback) {
        if (hasArrow === void 0) { hasArrow = true; }
        this._resizeAction = this._resizeAction.bind(this);
        this._dismissAction = this._dismissAction.bind(this);
        this._handleKeyUpDismiss = this._handleKeyUpDismiss.bind(this);
        this._matchTargetWidth = matchTargetWidth || false;
        this._direction = direction;
        this._container = this.createContainer();
        this._contextualHost = this._container;
        this._contextualHostMain = this._contextualHost.getElementsByClassName(CONTEXT_HOST_MAIN_CLASS)[0];
        this._contextualHostMain.appendChild(content);
        this._hasArrow = hasArrow;
        this._arrow = this._container.getElementsByClassName(CONTEXT_HOST_BEAK_CLASS)[0];
        this._targetElement = targetElement;
        this._openModal();
        this._setResizeDisposal();
        if (disposalCallback) {
            this._disposalCallback = disposalCallback;
        }
        if (modifiers) {
            for (var i = 0; i < modifiers.length; i++) {
                this._container.classList.add(MODIFIER_BASE + modifiers[i]);
            }
        }
        if (!ContextualHost.hosts) {
            ContextualHost.hosts = [];
        }
        ContextualHost.hosts.push(this);
    }
    ContextualHost.prototype.disposeModal = function () {
        if (ContextualHost.hosts.length > 0) {
            window.removeEventListener("resize", this._resizeAction, false);
            document.removeEventListener("click", this._dismissAction, true);
            document.removeEventListener("keyup", this._handleKeyUpDismiss, true);
            this._container.parentNode.removeChild(this._container);
            if (this._disposalCallback) {
                this._disposalCallback();
            }
            var index = ContextualHost.hosts.indexOf(this);
            ContextualHost.hosts.splice(index, 1);
            var i = ContextualHost.hosts.length;
            while (i--) {
                ContextualHost.hosts[i].disposeModal();
                ContextualHost.hosts.splice(i, 1);
            }
        }
    };
    ContextualHost.prototype.setChildren = function (value) {
        if (!this._children) {
            this._children = [];
        }
        this._children.push(value);
    };
    ContextualHost.prototype.contains = function (value) {
        return this._container.contains(value);
    };
    ContextualHost.prototype.createContainer = function () {
        var ContextualHost0 = document.createElement("div");
        ContextualHost0.setAttribute("class", "ms-ContextualHost");
        ContextualHost0.innerHTML += " ";
        var ContextualHost0c1 = document.createElement("div");
        ContextualHost0c1.setAttribute("class", CONTEXT_HOST_MAIN_CLASS);
        ContextualHost0c1.innerHTML += " ";
        ContextualHost0.appendChild(ContextualHost0c1);
        ContextualHost0.innerHTML += " ";
        var ContextualHost0c3 = document.createElement("div");
        ContextualHost0c3.setAttribute("class", CONTEXT_HOST_BEAK_CLASS);
        ContextualHost0.appendChild(ContextualHost0c3);
        ContextualHost0.innerHTML += "";
        return ContextualHost0;
    };
    ContextualHost.prototype._openModal = function () {
        var _this = this;
        this._copyModalToBody();
        this._saveModalSize();
        this._findAvailablePosition();
        this._showModal();
        setTimeout(function () { _this._setDismissClick(); }, 100);
    };
    ContextualHost.prototype._findAvailablePosition = function () {
        var _posOk;
        switch (this._direction) {
            case "left":
                _posOk = this._positionOk(this._tryPosModalLeft.bind(this), this._tryPosModalRight.bind(this), this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                this._setPosition(_posOk);
                break;
            case "right":
                _posOk = this._positionOk(this._tryPosModalRight.bind(this), this._tryPosModalLeft.bind(this), this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                this._setPosition(_posOk);
                break;
            case "top":
                _posOk = this._positionOk(this._tryPosModalTop.bind(this), this._tryPosModalBottom.bind(this));
                this._setPosition(_posOk);
                break;
            case "bottom":
                _posOk = this._positionOk(this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                this._setPosition(_posOk);
                break;
            default:
                this._setPosition();
        }
    };
    ContextualHost.prototype._showModal = function () {
        this._container.classList.add(CONTEXT_STATE_CLASS);
    };
    ContextualHost.prototype._positionOk = function (pos1, pos2, pos3, pos4) {
        var _posOk;
        _posOk = pos1();
        if (!_posOk) {
            _posOk = pos2();
            if (!_posOk && pos3) {
                _posOk = pos3();
                if (!_posOk && pos4) {
                    _posOk = pos4();
                }
            }
        }
        return _posOk;
    };
    ContextualHost.prototype._calcLeft = function (mWidth, teWidth, teLeft) {
        var mHalfWidth = mWidth / 2;
        var teHalf = teWidth / 2;
        var mHLeft = (teLeft + teHalf) - mHalfWidth;
        mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
        return mHLeft;
    };
    ContextualHost.prototype._calcTop = function (mHeight, teHeight, teTop) {
        var mHalfWidth = mHeight / 2;
        var teHalf = teHeight / 2;
        var mHLeft = (teTop + teHalf) - mHalfWidth;
        mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
        return mHLeft;
    };
    ContextualHost.prototype._setPosition = function (curDirection) {
        var teBR = this._targetElement.getBoundingClientRect();
        var teLeft = teBR.left;
        var teRight = teBR.right;
        var teTop = teBR.top;
        var teWidth = teBR.width;
        var teHeight = teBR.height;
        var mHLeft;
        var mHTop;
        var mWidth = "";
        var arrowTop;
        var arrowLeft;
        var windowX = window.scrollX ? window.scrollX : 0;
        var windowY = window.scrollY ? window.scrollY : 0;
        var arrowSpace = (this._hasArrow) ? ARROW_SIZE : 0;
        if (this._matchTargetWidth) {
            mWidth = "width: " + this._modalWidth + "px;";
        }
        switch (curDirection) {
            case "left":
                mHLeft = teLeft - this._modalWidth - arrowSpace;
                mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
                mHTop += window.scrollY ? window.scrollY : 0;
                this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._container.classList.add(MODAL_STATE_POSITIONED);
                if (this._hasArrow) {
                    this._container.classList.add(ARROW_RIGHT_CLASS);
                    arrowTop = ((teTop + windowY) - mHTop) + ARROW_OFFSET;
                    this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
                }
                break;
            case "right":
                mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
                mHTop += windowY;
                mHLeft = teRight + arrowSpace;
                this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._container.classList.add(MODAL_STATE_POSITIONED);
                if (this._hasArrow) {
                    arrowTop = ((windowY + teTop) - mHTop) + ARROW_OFFSET;
                    this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
                    this._container.classList.add(ARROW_LEFT_CLASS);
                }
                break;
            case "top":
                mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
                mHTop = teTop - this._modalHeight - arrowSpace;
                mHTop += windowY;
                this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._container.classList.add(MODAL_STATE_POSITIONED);
                if (this._hasArrow) {
                    arrowTop = this._modalHeight - (arrowSpace / 2);
                    arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), ARROW_OFFSET);
                    this._arrow.setAttribute("style", "top: " + arrowTop + "px; left: " + arrowLeft + "px;");
                    this._container.classList.add(ARROW_BOTTOM_CLASS);
                }
                break;
            case "bottom":
                mHLeft = mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
                mHTop = teTop + teHeight + arrowSpace;
                mHTop += window.scrollY ? window.scrollY : 0;
                this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._container.classList.add(MODAL_STATE_POSITIONED);
                if (this._hasArrow) {
                    arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), ARROW_OFFSET);
                    this._arrow.setAttribute("style", "left: " + arrowLeft + "px;");
                    this._container.classList.add(ARROW_TOP_CLASS);
                }
                break;
            default:
                this._container.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
        }
    };
    ContextualHost.prototype._tryPosModalLeft = function () {
        var teLeft = this._targetElement.getBoundingClientRect().left;
        if (teLeft < this._modalWidth) {
            return false;
        }
        else {
            return "left";
        }
    };
    ContextualHost.prototype._tryPosModalRight = function () {
        var teRight = this._targetElement.getBoundingClientRect().right;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if ((w - teRight) < this._modalWidth) {
            return false;
        }
        else {
            return "right";
        }
    };
    ContextualHost.prototype._tryPosModalBottom = function () {
        var teBottom = window.innerHeight - this._targetElement.getBoundingClientRect().bottom;
        if (teBottom < this._modalHeight) {
            return false;
        }
        else {
            return "bottom";
        }
    };
    ContextualHost.prototype._tryPosModalTop = function () {
        var teTop = this._targetElement.getBoundingClientRect().top;
        if (teTop < this._modalHeight) {
            return false;
        }
        else {
            return "top";
        }
    };
    ContextualHost.prototype._copyModalToBody = function () {
        document.body.appendChild(this._container);
    };
    ContextualHost.prototype._saveModalSize = function () {
        var _modalStyles = window.getComputedStyle(this._container);
        this._container.setAttribute("style", "opacity: 0; z-index: -1");
        this._container.classList.add(MODAL_STATE_POSITIONED);
        this._container.classList.add(CONTEXT_STATE_CLASS);
        if (this._matchTargetWidth) {
            var teStyles = window.getComputedStyle(this._targetElement);
            this._modalWidth = this._targetElement.getBoundingClientRect().width
                + (parseInt(teStyles.marginLeft, 10)
                    + parseInt(teStyles.marginLeft, 10));
        }
        else {
            this._modalWidth = this._container.getBoundingClientRect().width
                + (parseInt(_modalStyles.marginLeft, 10)
                    + parseInt(_modalStyles.marginRight, 10));
            this._container.setAttribute("style", "");
        }
        this._modalHeight = this._container.getBoundingClientRect().height
            + (parseInt(_modalStyles.marginTop, 10)
                + parseInt(_modalStyles.marginBottom, 10));
        this._container.classList.remove(MODAL_STATE_POSITIONED);
        this._container.classList.remove(CONTEXT_STATE_CLASS);
        this._teWidth = this._targetElement.getBoundingClientRect().width;
        this._teHeight = this._targetElement.getBoundingClientRect().height;
    };
    ContextualHost.prototype._dismissAction = function (e) {
        if (!this._container.contains(e.target) && e.target !== this._container) {
            if (this._children !== undefined) {
                var isChild_1 = false;
                this._children.map(function (child) {
                    if (child !== undefined) {
                        isChild_1 = child.contains(e.target);
                    }
                });
                if (!isChild_1) {
                    this.disposeModal();
                }
            }
            else {
                this.disposeModal();
            }
        }
    };
    ContextualHost.prototype._setDismissClick = function () {
        document.addEventListener("click", this._dismissAction, true);
        document.addEventListener("keyup", this._handleKeyUpDismiss, true);
    };
    ContextualHost.prototype._handleKeyUpDismiss = function (e) {
        if (e.keyCode === 32 || e.keyCode === 27) {
            this._dismissAction(e);
        }
    };
    ContextualHost.prototype._resizeAction = function () {
        this.disposeModal();
    };
    ContextualHost.prototype._setResizeDisposal = function () {
        window.addEventListener("resize", this._resizeAction, false);
    };
    return ContextualHost;
}());
export { ContextualHost };
