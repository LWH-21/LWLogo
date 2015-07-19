/* ***************************************************************************/
/* Analyse lexicale  *********************************************************/
/* ***************************************************************************/
"use strict";


function Analyse_lexicale(logo) { /*******************************************/
    this.src = null;
    this.nligne = 1;
    this.ncolonne = 0;
    this.fin_analyse = false;
    this.tokens = [];
    this.numero = 0;
    this.logo = logo;
} // Analyse_lexicale

Analyse_lexicale.prototype.back = function (n) { /*****************************/
    if (!n) { n = 1; }
    this.numero -= n;
    if (this.numero < 0) { this.numero = 0; }
}; // Analyse_lexicale.back(n)

 /* Creation des procedures utilisateur **************************************/
Analyse_lexicale.prototype.creation_procs = function () { /*******************/
	var i, j, t, fin, f, debut, trouve;
	i = 0;
	while (i < this.tokens.length) {
        t = this.tokens[i];
        if ((t.type === 'mot') && (t.procedure) && (t.procedure.code === 'POUR')) {
            fin = false;
            debut = t;
            f = new Fonction_utilisateur();
            do {
                f.add(t);
                this.tokens.splice(i, 1);
                if ((t.type === 'mot') && (t.procedure) && (t.procedure.code === 'FIN')) {
                    fin = true;
                    i--;
                } else { t = this.tokens[i]; }
                if ((t.procedure) && (t.procedure.code === 'POUR')) {
                    t = this.erreur(debut, 'procedure imbriquee', new Error().stack);
                    return t;
                }
            } while ((!fin) && (i < this.tokens.length));
            if (!fin) {
                t = this.erreur(debut, 'fin fonction', new Error().stack);
                return t;
            }
            j = 0;
			trouve = false;
            while ((!trouve) && (j < this.logo.reference.procedures_util.length)) {
                if (this.logo.reference.procedures_util[j].code === f.code) {
                    trouve = true;
                    this.logo.reference.procedures_util[j] = f;
                    t = this.erreur(debut, 'procedure dupliquee', new Error().stack);
                    return t;
                }
                j++;
            }
            if (!trouve) {
                this.logo.reference.procedures_util.push(f);
                if (debug) { console.log('ajout ', f.nom); }
            }
		}
        i++;
    }
}; // creation_procs

Analyse_lexicale.prototype.decore = function (token) { /**********************/
    var i, s, j;
    if ((token.type === 'operateur') || (token.type === 'mot')) {
        s = sans_accent(token.nom);
        j = this.logo.reference.procedures.length;
        for (i = 0; i < j; i++) {
            if (this.logo.reference.procedures[i].noms.indexOf(s) >= 0) {
                token.procedure = this.logo.reference.procedures[i];
                return;
            }
        }
    }
    return null;
}; // decore

Analyse_lexicale.prototype.est_termine = function () { /**********************/
    var i;
    for (i = this.numero; i < this.tokens.length; i++) {
        if (!this.tokens[i].est_blanc()) { return false; }
    }
    return true;
}; // Analyse_lexicale.est_termine()

Analyse_lexicale.prototype.erreur = function (t, s, cpl) { /******************/
	var err = new Token('erreur', s);
	err.origine = 'analyse';
	if (t) {
		err.ligne = t.ligne;
		err.colonne = t.colonne;
	}
	if (cpl) { err.exdata = cpl; } else { err.exdata = t; }
	return err;
}; // Analyse_lexicale.erreur

// Exporte les tokens dans un format lisible dans toutes les langues
Analyse_lexicale.prototype.exporte = function (logo, code) { /****************/
    var i, t, p, s, d = false, test, sep = String.fromCharCode(160);
    code = code.replace(sep, ' ');
    s = '';
    this.logo = logo;
    this.src = code.rtrim();
    this.nligne = 1;
    this.ncolonne = 0;
    this.fin_analyse = false;
    this.tokens = [];
    this.numero = 0;
    do {
        t = this.suivant();
        if ((d) || ( !t.est_blanc())) {
            d = true;
            if ((! p) || (! t.est_blanc()) || (! p.est_blanc())) {
                this.decore(t);
                this.tokens.push(t);
            }
        }
        p = t;
    } while ( (t) && (t.type !== 'erreur') && (t.type !== 'eof'));
    if ((t) && (t.type === 'erreur')) { return ''; }
    // Moins unaires
    i = 0;
    while (i<this.tokens.length) {
        test=false;
        if ((this.tokens[i].type === 'operateur') && (this.tokens[i].nom === '-')) {
            // Le token suivant doit être un nombre, sur la même ligne
            if ((i+1<this.tokens.length) && (this.tokens[i+1].type === 'nombre') && (this.tokens[i+1].ligne === this.tokens[i].ligne)) {
                // Le moins doit être collé au token suivant
                if (this.tokens[i].colonne === this.tokens[i+1].colonne - 1) {
                    // si pas de token précédent => ok
                    if (i === 0) {
                        test=true;
                    } else if (this.tokens[i-1].type === 'operateur') { // Si le token précédent est un opérateur
                        test=true;
                    } else if ((this.tokens[i-1].type === 'parenthese') && (this.tokens[i-1].nom === '(')) { // parenthese ouvrante
                        test=true;
                    } else if (this.tokens[i-1].ligne<this.tokens[i].ligne) { // pas sur la même ligne
                        test=true;
                    } else if (this.tokens[i-1].colonne+this.tokens[i-1].longueur()<this.tokens[i].colonne) { // pas collé
                        test=true;
                    }  else { test=false; }
                }
            }

        }
        if (test) {
            this.tokens[i+1].valeur = -this.tokens[i+1].valeur;
            this.tokens[i+1].nom = '-'+this.tokens[i+1].nom;
            this.tokens[i+1].colonne = this.tokens[i].colonne;
            this.tokens.splice(i,1);
        } else { i++; }
    }
    for (i=0;i<this.tokens.length;i++) {
        if ((! this.tokens[i].est_blanc() ) || (i<this.tokens.length-1)) {
            s=s+this.tokens[i].exporte(this.logo);
            if (! this.tokens[i].est_blanc()) {
                s = s+sep;
            }
        }
    }

    return s;
}; // Analyse_lexicale.exporte(logo,mode)

Analyse_lexicale.prototype.get = function() { /*******************************/
    if (this.numero < this.tokens.length) {
        if (this.tokens[this.numero].type === 'eof') {
            this.fin_analyse = this.est_termine();
        }
        return this.tokens[this.numero ++];
    }
    this.fin_analyse = true;
    return new Token('eof','');
}; // Analyse_lexicale.get()

// Importe les tokens à partir d'un format lisible dans toutes les langues
Analyse_lexicale.prototype.importe = function(logo,code) { /******************/
    var t, f, key, i, s, s1, newline, procedure,
    re = /[\n\xA0\s]/, ident = /\{[A-Za-z0-9]*\}/;
    newline=false;
    procedure=false;
    s='';
    code = code.replace(new RegExp('&quot;', 'g'),'"');
    t = code.split(re);
    for (i=0;i<t.length;i++) {
        if (t[i].match(ident)) {
            t[i]=t[i].trim();
            t[i]=t[i].substring(1,t[i].length-1 );
            switch (t[i]) {
                case '0PG'  : if ((procedure) && (newline)) { s+='    '; } s+='> ';break;
                case '0PP'  : if ((procedure) && (newline)) { s+='    '; } s+='< ';break;
                case '0PGE' : if ((procedure) && (newline)) { s+='    '; } s+='>= ';break;
                case '0PPE' : if ((procedure) && (newline)) { s+='    '; } s+='<= ';break;
                case '0NEG' : if ((procedure) && (newline)) { s+='    '; } s+='<> ';break;
                case '0ET'  : if ((procedure) && (newline)) { s+='    '; } s+='& ';break;
                case '0OU'  : if ((procedure) && (newline)) { s+='    '; } s+='| ';break;
                case 'BR'   : newline=true;s=s+'\n';break;
                default     : for( key in this.logo.reference.procedures) {
                                f = this.logo.reference.procedures[key];
                                if (t[i]===f.code) {
                                    s1 = this.logo.reference.les_fonctions[f.code].std[0];
                                    s1 = s1.toUpperCase();
                                    if (f.code==='POUR') {
                                        procedure = true;
                                        s+=s1+' ';
                                    } else if (f.code==='FIN') {
                                        procedure = false;
                                        s+=s1+'\n';
                                    } else {
                                        if ((procedure) && (newline)) { s+='    '; }
                                        s+=s1+' ';
                                    }
                                    break;
                                }
                            }
                            newline = false;
                            break;
            }
        } else {
            if ((t[i]!=='\n') && (t[i]!=="")) {
            if ((procedure) && (newline)) { s=s+'    '; }
            newline = false;
            s+=t[i].trim()+' ';
            }
        }
    }
    return s;
}; //Analyse_lexicale.importe(logo,code)

 Analyse_lexicale.prototype.init= function(parent,texte,dligne,dcol,token) { //

    var t,cont;

    if ((! texte.rtrim) || ((typeof texte)!=='string')) {
        /* Non analysable */
        t = this.erreur('','analyse',new Error().stack);
        return t;
    }

    this.src = texte.rtrim();
    this.logo = parent;
    this.nligne = 1;
    this.ncolonne = 0;
    /* au cas où on interprete à partir d'une autre source que le code d'origine */
    if (dligne) { this.nligne=dligne; }
    if (dcol)   { this.ncolonne = dcol; }

    this.fin_analyse = false;
    this.tokens = [];
    this.numero = 0;
    // Au cas où le token a déjà été analysé, inutile de refaire le travail
    if (token) {
        if (token.tokens) {
            if (token.tokens.length>0) {
                this.tokens = token.tokens;
                return;
            }
        }
    }
    //1ere phase : lecture
    do {
        t = this.suivant();
        if (t.type === 'cont') {
        cont=true;
        } else if (t.type === 'eol') {
        if (!cont)  { this.tokens.push(t); }
        } else if (t.type!=='comment') {
            this.tokens.push(t);
            cont=false;
        }
    } while ( (t) && (t.type!=='erreur') && (t.type!=='eof'));
    if ((t) && (t.type === 'erreur')) { return t; }
    this.tokens.push(new Token('eof'));
    //2eme phase : tests basiques
    t = this.tests();
    if ((t) && (t.type === 'erreur')) { return t; }
    //3eme phase : creation des procedures
    t = this.creation_procs();
    // Mise en mémoire pour utilisation ulterieure
    if (( ! t) || (t.type !== 'erreur')) {
        if ((token) && (this.tokens.length>0)) {
            token.tokens = this.tokens;
        }
    }
    return t;
}; // Analyse_lexicale.init(parent,texte,dligne,dcol,token)

Analyse_lexicale.prototype.suivant =function() { /****************************/

    var result, i, j, token, c, cprev, fin, suivant, p, d, f,
    mot = /[\w\u00C0-\u017F\.\?\!&]/,
    blancs = ' \t\f\r';

    while (this.src.length>0) {
        c = this.src.charAt(0);
        this.src = this.src.slice(1);

        this.ncolonne++;

        if (c === '\n') {                                                  // Fin de ligne
            token = new Token('eol','');
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            this.nligne++;
            this.ncolonne=0;
            return token;
        }
        if (c === '~') {
        token = new Token('cont','');                // Caractere de continuation
              return token;
        }
        if ((c >= '0' && c <= '9') || (c === '.')) {                    // Nombre. Forme acceptées : 12 / 12.5 / 0.5 / .5 / 4.5e-5
            result=c;
            if (c === '.') { j=1; } else { j=0; }
            if (this.src.length>0) {
                i=0;
                fin = false;
                cprev = c;
                do {
                    c = this.src.charAt(i);
                    if (c === '.') { j++; }
                    if ((c >= '0' && c <= '9') || (c === '.') || (c === 'e') || (c === 'E') || ((c === '-') && (cprev=== 'e' || cprev === 'E')) ) {
                        result+=c;
                        i++;
                    } else { fin=true; }
                    cprev = c;
                } while ((!fin) && (i<this.src.length));
            }
            if ((j<2) && isNumber(result)){
                token = new Token('nombre',parseFloat(result),'!');
                token.ligne = this.nligne;
                token.colonne = this.ncolonne;
                token.origine = 'analyse';
                this.src = this.src.slice(i);
                this.ncolonne += i;
                return token;
            }
            token = this.erreur(null,'format numerique',new Error().stack);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            token.valeur = result;
            return token;
        }
		if (c === ')' || c ==='(') {                                  // Parenthèses
            token = new Token('parenthese',c);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            return token;
        }
		if (c === ']') {
            token = this.erreur(null,'crochet',new Error().stack);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            return token;
        }
		if (c === '[') {                                            // Listes
            p=1;
			i=0;
            d = this.nligne;
            f = this.ncolonne;
            if (this.src.length>0) {
                result='';
                do {
                    c = this.src.charAt(i);
                    this.ncolonne++;
                    if ((c === ';') || (c === '#')) { // Commentaires
                        fin=false;
                        do {
                            c = this.src.charAt(i);
                            if (c === '\n') { fin=true; } else { i++; }
                        } while ((!fin) && (i<this.src.length));
                    }
                    if (c === '\n') {
                        this.nligne++;
                        this.ncolonne = 0;
                    }
                    if (c === ']') { p--; }
                    if (c === '[') { p++; }
                    if (p>0) {
                        result+=c;
                    }
                    i++;
                } while ((p>0) && (i<this.src.length));
            }
            if (p>0) {
                token = this.erreur(null,'crochet',new Error().stack);
                token.ligne = d;
                token.colonne = f;
                return token;
            }
            this.src = this.src.slice(i);
            token = new Token('liste',result,'!');
            token.ligne = d;
            token.colonne = f;
            token.origine = 'analyse';
            return token;
        }
		if ("+-*/%^=><&|".indexOf(c)>=0) {                              // Operateur + - * /
            switch (c) {
                case '<' : suivant = this.src.charAt(0);
                           if ((suivant === '=') || (suivant === '>')) {
                            c=c+suivant;
                            this.src = this.src.slice(1);
                           }
                           break;
                case '>' : suivant = this.src.charAt(0);
                           if (suivant === '=')  {
                            c=c+suivant;
                            this.src = this.src.slice(1);
                           }
                           break;
            }

            token = new Token('operateur',c);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            return token;
        }
		if ((c === '#') || (c === ';')) {                              // Commentaire jusqu'à la fin de ligne
            if (this.src.length>0) {
                i = 0;fin=false;
                result='';
                do {
                    c = this.src.charAt(i);
                    result += c;
                    if (c === '\n') { fin=true; } else { i++; }
                } while ((!fin) && (i<this.src.length));
                token = new Token('comment',result,'!');
                token.ligne = this.nligne;
                token.colonne = this.ncolonne;
                token.origine = 'analyse';
                this.ncolonne += i;
                this.src = this.src.slice(i);
                return token;
            }
        } else if ((c>='A'&& c<='Z') || (c>='a' && c<='z') ) {          // Identificateur (mot) Commence par une lettre. Peut comporter un point.
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c === '\n') {
                    fin=true;
                } else if ((c === ' ') || (c === '\t') || (c === '\f') || (c === '\r')) {
                    fin=true;
                } else if (! mot.test(c)) {
                    fin=true;
                }  else {
                    result = result+c;
                    i++;
                }
            }
            token = new Token('mot',result,'!');
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            this.src = this.src.slice(i);
            this.ncolonne+=i;
            return token;
        }
		if (c === ':') {                                            // Variable
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c === '\n') {
                    fin=true;
                } else if ((c === ' ') || (c === '\t') || (c === '\f') || (c === '\r')) {
                    fin=true;
                } else if (! mot.test(c)) {
                    fin=true;
                }  else {
                    result = result+c;
                    i++;
                }
            }
            token = new Token('variable',result.toLowerCase(),'!');
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            this.src = this.src.slice(i);
            this.ncolonne+=i;
            return token;
        }
		if (c === '"') {                                             // Symbole
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c === '\n') {
                    fin=true;
                } else if ((c === ' ') || (c === '\t') || (c === '\f') || (c === '\r')) {
                    fin=true;
                /*} else if (! mot.test(c)) {
                    fin=true;*/
                }  else {
                    result = result+c;
                    i++;
                }
            }
            token = new Token('symbole',result,'!');
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            this.src = this.src.slice(i);
            this.ncolonne+=i;
            return token;
        }
		if (blancs.indexOf(c)>=0) {                              // Caractères blancs
            i=0;j=0;
            fin = false;
            do {
                c = this.src.charAt(i);
                if (blancs.indexOf(c)>=0) {
                    if (c === '\n') {
                        this.nligne++;
                        this.ncolonne = 0;
                        j=0;
                    } else { j++; }
                    i++;
                } else { fin=true; }
            } while ((!fin) && (i<this.src.length));
            this.src = this.src.slice(i);
            this.ncolonne += j;
        } else {
            token = this.erreur(null,'caractere non reconnu',new Error().stack);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse';
            token.valeur=c;
            return token;
        }


    } // while (this.src.length)>0

    token = new Token('eof','');
    token.ligne = this.nligne;
    token.colonne = this.ncolonne;
    token.origine = 'analyse';
    return token;

}; // Suivant

Analyse_lexicale.prototype.reset = function() { /*****************************/
    this.src = null;
    this.nligne=1;
    this.ncolonne = 0;
    this.fin_analyse = true;
    this.tokens=[];
    this.numero = 0;
}; // reset

/* Tests sur l'analyse lexicale **********************************************/
Analyse_lexicale.prototype.tests = function() { /*****************************/
        var i,j,t,test, p;
        // Suppression des lignes inutiles
        i = 1;
        while (i<this.tokens.length) {
            if ((this.tokens[i].est_blanc()) &&  (this.tokens[i - 1].est_blanc())) {
                this.tokens.splice(i-1,1);
            } else { i++; }
        }
        // Test parantheses
        p=[];
        for (i=0;i<this.tokens.length;i++) {
            t = this.tokens[i];
            if (t.type === 'parenthese') {
                if (t.nom === '(') {
                    p.push(t);
                } else {
                    if (p.length === '0') {
                        return this.erreur(t,'parenthese',new Error().stack);
                    }
					p.pop();
                }
            }
        }
        if (p.length>0) {
            t = p.pop();
            return this.erreur(t,'parenthese',new Error().stack);
        }
        // Moins unaires
        i = 0;
        while (i<this.tokens.length) {
            test=false;
            if ((this.tokens[i].type === 'operateur') && (this.tokens[i].nom === '-')) {
                // Le token suivant doit être un nombre, sur la même ligne
                if ((i+1<this.tokens.length) && (this.tokens[i+1].type === 'nombre') && (this.tokens[i+1].ligne === this.tokens[i].ligne)) {
                    // Le moins doit être collé au token suivant
                    if (this.tokens[i].colonne === this.tokens[i+1].colonne - 1) {
                        // si pas de token précédent => ok
                        if (i === 0) {
                            test=true;
                        } else if (this.tokens[i-1].type === 'operateur') { // Si le token précédent est un opérateur
                            test=true;
                        } else if ((this.tokens[i-1].type === 'parenthese') && (this.tokens[i-1].nom === '(')) { // parenthese ouvrante
                            test=true;
                        } else if (this.tokens[i-1].ligne<this.tokens[i].ligne) { // pas sur la même ligne
                            test=true;
                        } else if (this.tokens[i-1].colonne+this.tokens[i-1].longueur()<this.tokens[i].colonne) { // pas collé
                            test=true;
                        }  else { test=false; }
                    }
                }
            }
            if (test) {
                this.tokens[i+1].valeur = -this.tokens[i+1].valeur;
                this.tokens[i+1].nom = '-'+this.tokens[i+1].nom;
                this.tokens[i+1].colonne = this.tokens[i].colonne;
                this.tokens.splice(i,1);
            } else { i++; }
        }
        // Compléte les tokens
        i=0;
        while (i<this.tokens.length) {
            t = this.tokens[i];
            if ((t.type === 'mot') || (t.type === 'operateur')) { this.decore(t); }
            i++;
        }
        // Moins unaires
        i = 0;
        while (i<this.tokens.length) {
            test=false;
            if ((this.tokens[i].type === 'operateur') && (this.tokens[i].nom === '-')) {
                // Le token suivant doit être un nombre, sur la même ligne
                if ((i+1<this.tokens.length) && (this.tokens[i+1].ligne === this.tokens[i].ligne)) {
                    // si pas de token précédent => ok
                    if (i === 0) {
                        test=true;
                    } else if (this.tokens[i-1].type === 'operateur') { // Si le token précédent est un opérateur
                        test=true;
                    } else if ((this.tokens[i-1].type === 'parenthese') && (this.tokens[i-1].nom === '(')) { // parenthese ouvrante
                        test=true;
                    } else { test=false; }
                }
            }
            if (test) {
                 for (j=0;j<this.logo.reference.procedures.length;j++) {
                    if (this.logo.reference.procedures[j].code === 'MOINS')  {
                        this.tokens[i].procedure = this.logo.reference.procedures[j];
                        break;
                    }
                }
            }
            i++;
        }
}; //tests



