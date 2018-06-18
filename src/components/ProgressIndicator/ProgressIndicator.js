var ProgressIndicator = (function () {
    function ProgressIndicator(container) {
        this.container = container;
        this.cacheDOM();
    }
    ProgressIndicator.prototype.setProgressPercent = function (percent) {
        this._progressBar.style.width = Math.round(this._width * percent) + "px";
    };
    ProgressIndicator.prototype.setProgress = function (progress) {
        this._progress = progress;
        var percentage = this._progress / this._total;
        this.setProgressPercent(percentage);
    };
    ProgressIndicator.prototype.setTotal = function (total) {
        this._total = total;
    };
    ProgressIndicator.prototype.setName = function (name) {
        this._itemName.innerHTML = name;
    };
    ProgressIndicator.prototype.setDescription = function (description) {
        this._itemDescription.innerHTML = description;
    };
    ProgressIndicator.prototype.cacheDOM = function () {
        this._itemName = this.container.querySelector(".ms-ProgressIndicator-itemName") || null;
        this._itemDescription = this.container.querySelector(".ms-ProgressIndicator-itemDescription") || null;
        this._progressBar = this.container.querySelector(".ms-ProgressIndicator-progressBar");
        var itemProgress = this.container.querySelector(".ms-ProgressIndicator-itemProgress");
        this._width = itemProgress.offsetWidth;
    };
    return ProgressIndicator;
}());
export { ProgressIndicator };
