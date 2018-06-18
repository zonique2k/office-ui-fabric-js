import { Persona } from "../Persona/Persona";
var PERSONA_CLASS = ".ms-Persona--facePile";
var PERSONA_INITIALS = ".ms-Persona-initials";
var PERSONA_IMAGE = ".ms-Persona-image";
var PERSONA_PRIMARY_CLASS = ".ms-Persona-primaryText";
var PERSONA_SECONDARY_CLASS = ".ms-Persona-secondaryText";
var FacePile = (function () {
    function FacePile(container) {
        this._personaCollection = [];
        this._facePile = container;
        this._createPersonaCollection();
    }
    FacePile.prototype._createPersonaCollection = function () {
        var _personas = document.querySelectorAll(PERSONA_CLASS);
        for (var i = 0; i < _personas.length; i++) {
            var _thisPersona = _personas[i];
            this._personaCollection.push({
                item: _thisPersona,
                initials: _thisPersona.querySelector(PERSONA_INITIALS).textContent,
                image: _thisPersona.querySelector(PERSONA_IMAGE) ?
                    _thisPersona.querySelector(PERSONA_IMAGE).getAttribute("src") : null,
                primaryText: _thisPersona.querySelector(PERSONA_PRIMARY_CLASS) ?
                    _thisPersona.querySelector(PERSONA_PRIMARY_CLASS).textContent : "",
                secondaryText: _thisPersona.querySelector(PERSONA_SECONDARY_CLASS) ?
                    _thisPersona.querySelector(PERSONA_SECONDARY_CLASS).textContent : "",
                personaInstance: new Persona(_thisPersona)
            });
        }
    };
    return FacePile;
}());
export { FacePile };
