var CircleObject = (function () {
    function CircleObject(element, j) {
        this.element = element;
        this.j = j;
    }
    return CircleObject;
}());
var Spinner = (function () {
    function Spinner(container) {
        this.eightSize = 0.2;
        this.animationSpeed = 90;
        this.parentSize = 20;
        this.fadeIncrement = 0;
        this.circleObjects = [];
        this._target = container;
        this._init();
    }
    Spinner.prototype.start = function () {
        var _this = this;
        this.stop();
        this.interval = setInterval(function () {
            var i = _this.circleObjects.length;
            while (i--) {
                _this._fade(_this.circleObjects[i]);
            }
        }, this.animationSpeed);
    };
    Spinner.prototype.stop = function () {
        clearInterval(this.interval);
    };
    Spinner.prototype._init = function () {
        this._setTargetElement();
        this._setPropertiesForSize();
        this._createCirclesAndArrange();
        this._initializeOpacities();
        this.start();
    };
    Spinner.prototype._setPropertiesForSize = function () {
        if (this.spinner.className.indexOf("large") > -1) {
            this.parentSize = 28;
            this.eightSize = 0.179;
        }
        this.offsetSize = this.eightSize;
        this.numCircles = 8;
    };
    Spinner.prototype._setTargetElement = function () {
        if (this._target.className.indexOf("ms-Spinner") === -1) {
            this.spinner = document.createElement("div");
            this.spinner.className = "ms-Spinner";
            this._target.appendChild(this.spinner);
        }
        else {
            this.spinner = this._target;
        }
    };
    Spinner.prototype._initializeOpacities = function () {
        var i = 0;
        var j = 1;
        var opacity;
        this.fadeIncrement = 1 / this.numCircles;
        for (i; i < this.numCircles; i++) {
            var circleObject = this.circleObjects[i];
            opacity = (this.fadeIncrement * j++);
            this._setOpacity(circleObject.element, opacity);
        }
    };
    Spinner.prototype._fade = function (circleObject) {
        var opacity = this._getOpacity(circleObject.element) - this.fadeIncrement;
        if (opacity <= 0) {
            opacity = 1;
        }
        this._setOpacity(circleObject.element, opacity);
    };
    Spinner.prototype._getOpacity = function (element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    };
    Spinner.prototype._setOpacity = function (element, opacity) {
        element.style.opacity = opacity.toString();
    };
    Spinner.prototype._createCircle = function () {
        var circle = document.createElement("div");
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = this.parentSize * this.offsetSize + "px";
        return circle;
    };
    Spinner.prototype._createCirclesAndArrange = function () {
        var angle = 0;
        var offset = this.parentSize * this.offsetSize;
        var step = (2 * Math.PI) / this.numCircles;
        var i = this.numCircles;
        var circleObject;
        var radius = (this.parentSize - offset) * 0.5;
        while (i--) {
            var circle = this._createCircle();
            var x = Math.round(this.parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(this.parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            this.spinner.appendChild(circle);
            circle.style.left = x + "px";
            circle.style.top = y + "px";
            angle += step;
            circleObject = new CircleObject(circle, i);
            this.circleObjects.push(circleObject);
        }
    };
    return Spinner;
}());
export { Spinner };
