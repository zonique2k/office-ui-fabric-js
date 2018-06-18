import { PanelHost } from "../PanelHost/PanelHost";
var ANIMATE_IN_STATE = "animate-in";
var ANIMATE_OUT_STATE = "animate-out";
var ANIMATION_END = 400;
var Panel = (function () {
    function Panel(panel, direction, animateOverlay) {
        this._panel = panel;
        this._direction = direction || "right";
        this._animateOverlay = animateOverlay || true;
        this.panelHost = new PanelHost(this._panel, this._animateInPanel);
        this._closeButton = this._panel.querySelector(".ms-PanelAction-close");
        this._clickHandler = this.dismiss.bind(this, null);
        this._setEvents();
        document.body.setAttribute("style", "height: 100%; overflow: hidden;");
    }
    Panel.prototype.dismiss = function (callBack) {
        var _this = this;
        this._panel.classList.add(ANIMATE_OUT_STATE);
        setTimeout(function () {
            _this._panel.classList.remove(ANIMATE_OUT_STATE);
            _this._panel.classList.remove("is-open");
            _this.panelHost.dismiss();
            if (callBack) {
                callBack();
            }
            document.body.setAttribute("style", "");
        }, ANIMATION_END);
        if (this._closeButton !== null) {
            this._closeButton.removeEventListener("click", this._clickHandler);
        }
    };
    Panel.prototype._setEvents = function () {
        this.panelHost.overlay.overlayElement.addEventListener("click", this._clickHandler);
        if (this._closeButton !== null) {
            this._closeButton.addEventListener("click", this._clickHandler);
        }
    };
    Panel.prototype._animateInPanel = function (layer) {
        layer.classList.add(ANIMATE_IN_STATE);
        layer.classList.add("is-open");
        setTimeout(function () {
            layer.classList.remove(ANIMATE_IN_STATE);
        }, ANIMATION_END);
    };
    return Panel;
}());
export { Panel };
