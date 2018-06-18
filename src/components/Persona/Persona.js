import { ContextualHost } from "../ContextualHost/ContextualHost";
import { PersonaCard } from "../PersonaCard/PersonaCard";
var MODAL_POSITION = "top";
var Persona = (function () {
    function Persona(container) {
        this._persona = container;
        this._personaCard = this._persona.querySelector(".ms-PersonaCard");
        if (this._personaCard) {
            this._assignEvents();
            this._personaCard.setAttribute("style", "display: none;");
            this._createPersonaCard();
        }
    }
    Persona.prototype._createPersonaCard = function () {
        this._personaCardInstance = new PersonaCard(this._personaCard);
    };
    Persona.prototype._createContextualHostInstance = function () {
        this._personaCard.setAttribute("style", "display: block;");
        this._contextualHostInstance = new ContextualHost(this._personaCard, MODAL_POSITION, this._persona);
    };
    Persona.prototype._personaEventHandler = function () {
        this._createContextualHostInstance();
    };
    Persona.prototype._assignEvents = function () {
        var _this = this;
        this._persona.addEventListener("click", this._personaEventHandler.bind(this), false);
        this._persona.addEventListener("keyup", function (e) { return (e.keyCode === 32) ? _this._personaEventHandler() : null; }, false);
    };
    return Persona;
}());
export { Persona };
