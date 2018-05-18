"use strict";
exports.__esModule = true;
var Overlay_1 = require("../Overlay/Overlay");
var PANEL_HOST_CLASS = "ms-PanelHost";
var PanelHost = (function () {
    function PanelHost(layer, callBack) {
        this._layer = layer;
        this._callBack = callBack;
        this._createElements();
        this._renderElements();
    }
    PanelHost.prototype.dismiss = function () {
        this.overlay.hide();
        document.body.removeChild(this.panelHost);
    };
    PanelHost.prototype.update = function (layer, callBack) {
        this.panelHost.replaceChild(layer, this._layer);
        if (callBack) {
            callBack();
        }
    };
    PanelHost.prototype._renderElements = function () {
        document.body.appendChild(this.panelHost);
        if (this._callBack) {
            this._callBack(this._layer);
        }
    };
    PanelHost.prototype._createElements = function () {
        this.panelHost = document.createElement("div");
        this.panelHost.classList.add(PANEL_HOST_CLASS);
        this.panelHost.appendChild(this._layer);
        this.overlay = new Overlay_1.Overlay(this._overlayContainer);
        this.overlay.show();
        this.panelHost.appendChild(this.overlay.overlayElement);
    };
    return PanelHost;
}());
exports.PanelHost = PanelHost;
