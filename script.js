/*
 * TP01 - Formulaire d'inscription
 * JavaScript Vanilla, aucune bibliothèque externe.
 */

(function () {
    "use strict";

    /* ===== Références vers le DOM ===== */
    var formulaire = document.getElementById("formulaire-inscription");
    var carteFormulaire = document.getElementById("carte-formulaire");
    var carteRecapitulatif = document.getElementById("carte-recapitulatif");
    var erreurGlobale = document.getElementById("erreur-globale");
    var boutonRetour = document.getElementById("bouton-retour");

    /* Description des champs : identifiant + libellé affiché dans les messages */
    var CHAMPS = [
        { id: "login", libelle: "Le login" },
        { id: "motdepasse", libelle: "Le mot de passe" },
        { id: "confirmation", libelle: "La confirmation du mot de passe" },
        { id: "nom", libelle: "Le nom" },
        { id: "prenom", libelle: "Le prénom" },
        { id: "adresse", libelle: "L'adresse" },
        { id: "email", libelle: "L'email" },
        { id: "telephone", libelle: "Le téléphone" },
        { id: "naissance", libelle: "La date de naissance" }
    ];

    /* Expression régulière de validation d'un email */
    var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    /* ===== Utilitaires d'affichage des erreurs ===== */

    function afficherErreurChamp(id, message) {
        var champ = document.getElementById(id);
        var zoneErreur = document.getElementById("erreur-" + id);

        champ.classList.add("invalide");
        champ.setAttribute("aria-invalid", "true");
        zoneErreur.textContent = message;
    }

    function reinitialiserErreurs() {
        erreurGlobale.hidden = true;
        erreurGlobale.textContent = "";

        CHAMPS.forEach(function (definition) {
            var champ = document.getElementById(definition.id);
            var zoneErreur = document.getElementById("erreur-" + definition.id);

            champ.classList.remove("invalide");
            champ.removeAttribute("aria-invalid");
            zoneErreur.textContent = "";
        });
    }

    /* ===== Validation ===== */

    /**
     * Contrôle l'ensemble du formulaire.
     * Renvoie le nombre d'erreurs détectées et remplit les messages au passage.
     */
    function validerFormulaire() {
        var nombreErreurs = 0;

        /* 1. Tous les champs doivent être remplis */
        CHAMPS.forEach(function (definition) {
            var valeur = document.getElementById(definition.id).value.trim();

            if (valeur === "") {
                afficherErreurChamp(definition.id, definition.libelle + " est obligatoire.");
                nombreErreurs++;
            }
        });

        /* 2. L'email doit être valide */
        var email = document.getElementById("email").value.trim();
        if (email !== "" && !REGEX_EMAIL.test(email)) {
            afficherErreurChamp("email", "L'email saisi n'est pas valide (exemple : nom@domaine.fr).");
            nombreErreurs++;
        }

        /* 3. Le mot de passe et sa confirmation doivent correspondre */
        var motDePasse = document.getElementById("motdepasse").value;
        var confirmation = document.getElementById("confirmation").value;

        if (motDePasse !== "" && confirmation !== "" && motDePasse !== confirmation) {
            afficherErreurChamp("confirmation", "Le mot de passe et sa confirmation ne correspondent pas.");
            nombreErreurs++;
        }

        return nombreErreurs;
    }

    /* ===== Récapitulatif ===== */

    /** Transforme une date AAAA-MM-JJ en JJ/MM/AAAA. */
    function formaterDate(valeurIso) {
        var morceaux = valeurIso.split("-");

        if (morceaux.length !== 3) {
            return valeurIso;
        }

        return morceaux[2] + "/" + morceaux[1] + "/" + morceaux[0];
    }

    /** Remplit puis affiche le récapitulatif (sans le mot de passe). */
    function afficherRecapitulatif() {
        document.getElementById("recap-login").textContent = document.getElementById("login").value.trim();
        document.getElementById("recap-nom").textContent = document.getElementById("nom").value.trim();
        document.getElementById("recap-prenom").textContent = document.getElementById("prenom").value.trim();
        document.getElementById("recap-adresse").textContent = document.getElementById("adresse").value.trim();
        document.getElementById("recap-email").textContent = document.getElementById("email").value.trim();
        document.getElementById("recap-telephone").textContent = document.getElementById("telephone").value.trim();
        document.getElementById("recap-naissance").textContent = formaterDate(document.getElementById("naissance").value);

        carteFormulaire.hidden = true;
        carteRecapitulatif.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ===== Événements ===== */

    formulaire.addEventListener("submit", function (evenement) {
        /* Pas de rechargement de la page */
        evenement.preventDefault();

        reinitialiserErreurs();

        var nombreErreurs = validerFormulaire();

        if (nombreErreurs > 0) {
            erreurGlobale.textContent = nombreErreurs === 1
                ? "1 erreur a été détectée, merci de corriger le champ signalé."
                : nombreErreurs + " erreurs ont été détectées, merci de corriger les champs signalés.";
            erreurGlobale.hidden = false;

            /* On place le curseur sur le premier champ en erreur */
            var premierChampInvalide = formulaire.querySelector(".invalide");
            if (premierChampInvalide) {
                premierChampInvalide.focus();
            }
            return;
        }

        afficherRecapitulatif();
    });

    /* Efface le message d'erreur d'un champ dès que l'utilisateur le corrige */
    CHAMPS.forEach(function (definition) {
        document.getElementById(definition.id).addEventListener("input", function () {
            this.classList.remove("invalide");
            this.removeAttribute("aria-invalid");
            document.getElementById("erreur-" + definition.id).textContent = "";
        });
    });

    /* Retour au formulaire depuis le récapitulatif */
    boutonRetour.addEventListener("click", function () {
        carteRecapitulatif.hidden = true;
        carteFormulaire.hidden = false;
        window.scrollTo(0, 0);
    });
})();
