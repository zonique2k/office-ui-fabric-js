import { Animate } from "../../utilities/Animate";
import { Ease } from "../../utilities/Ease";
var PersonaCard = (function () {
    function PersonaCard(container) {
        this._container = container;
        var activeElement = this._container.querySelector(".ms-PersonaCard-action.is-active");
        var activeId = activeElement.getAttribute("data-action-id");
        this._actions = this._container.querySelector(".ms-PersonaCard-actions");
        this._expander = this._container.querySelector(".ms-PersonaCard-detailExpander");
        this._actionDetailBox = this._container.querySelector(".ms-PersonaCard-actionDetailBox");
        this._setDetail(activeId);
        this._boundOnActionClick = this._onActionClick.bind(this);
        this._boundOnExpanderClick = this._onExpanderClick.bind(this);
        this._boundOnTab = this._onTab.bind(this);
        this._addListeners();
    }
    PersonaCard.prototype.removeListeners = function () {
        this._actions.removeEventListener("click", this._boundOnActionClick);
        this._expander.removeEventListener("click", this._boundOnExpanderClick);
        this._container.removeEventListener("keydown", this._boundOnTab);
    };
    PersonaCard.prototype._addListeners = function () {
        this._actions.addEventListener("click", this._boundOnActionClick, false);
        this._expander.addEventListener("click", this._boundOnExpanderClick, false);
        this._container.addEventListener("keydown", this._boundOnTab, false);
    };
    PersonaCard.prototype._onTab = function (event) {
        var target = event.target;
        if (event.keyCode === 9 && target.classList.contains("ms-PersonaCard-action")) {
            this._onActionClick(event);
        }
    };
    PersonaCard.prototype._onExpanderClick = function (event) {
        var parent = event.target.parentElement;
        if (parent.classList.contains("is-collapsed")) {
            parent.classList.remove("is-collapsed");
        }
        else {
            parent.classList.add("is-collapsed");
        }
        var parentHeight = parent.clientHeight;
        this._animateDetail(parentHeight);
    };
    PersonaCard.prototype._onActionClick = function (event) {
        var target = event.target;
        var actionId = target.getAttribute("data-action-id");
        if (actionId && target.className.indexOf("is-active") === -1) {
            this._setAction(target);
            this._setDetail(actionId);
        }
    };
    PersonaCard.prototype._setAction = function (target) {
        var activeElement = this._container.querySelector(".ms-PersonaCard-action.is-active");
        activeElement.classList.remove("is-active");
        target.classList.add("is-active");
    };
    PersonaCard.prototype._setDetail = function (activeId) {
        var selector = ".ms-PersonaCard-details[data-detail-id='" + activeId + "']";
        var lastDetail = this._container.querySelector(".ms-PersonaCard-details.is-active");
        var activeDetail = this._container.querySelector(selector);
        if (lastDetail) {
            lastDetail.classList.remove("is-active");
        }
        activeDetail.classList.add("is-active");
        var detailHeight = activeDetail.clientHeight;
        this._animateDetail(detailHeight);
    };
    PersonaCard.prototype._animateDetail = function (height) {
        var _this = this;
        this._actionDetailBox.style.overflowY = "hidden";
        Animate.transition(this._actionDetailBox, {
            height: height,
            duration: 0.25,
            ease: Ease.SINE_EASE_OUT,
            onEnd: function () {
                _this._actionDetailBox.style.overflowY = "auto";
            }
        });
    };
    return PersonaCard;
}());
export { PersonaCard };
