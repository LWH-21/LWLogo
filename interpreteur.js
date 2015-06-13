/* ***************************************************************************/
/* Coeur de l'interpreteur Logo **********************************************/
/* JSLint 20150610                                                           */
/* ***************************************************************************/
"use strict";

function Interpreteur(id, logo, parent) { /***********************************/
    this.ID = id;
    this.LWlogo = logo;
    this.parent = parent;
    this.enfant = null;
    this.pile_op = [];                                                  // Pile des opérateurs / fonctions
    this.pile_arg = [];                                                 // Pile des arguments
    this.analyseur_lexical = new Analyse_lexicale();
    this.dernier_token = null;
    this.termine = false;
    this.contexte = new Contexte(this);
    this.ordre_tortue = false;
    this.fonction = null;
} // Interpreteur

Interpreteur.prototype.decore = function (token) { /**************************/
    var i, j, s;
    if ((token.type !== 'mot') && (token.type !== 'operateur')) { return token; }
    s = sans_accent(token.nom);
    if ((!s) || (s.length === 0)) { s = token.nom; }

    j=this.LWlogo.reference.procedures_util.length;
    for (i=0;i<j;i++) {
        if (this.LWlogo.reference.procedures_util[i].code === s)  {
            token.procedure = this.LWlogo.reference.procedures_util[i];
            return token;
        }
    }

    j=this.LWlogo.reference.procedures.length;
    for (i=0;i<j;i++) {
        if (this.LWlogo.reference.procedures[i].noms.indexOf(s)>=0) {
            token.procedure = this.LWlogo.reference.procedures[i];
            return token;
        }
    }
    return this.erreur(token,'non trouve',new Error().stack);
}; // Decore

Interpreteur.prototype.erreur = function(t,s,cpl) { /*************************/
        var err = new Token('erreur',s);
        err.origine = 'interprete';
        err.valeur = t.nom;
        if (t) {
            err.ligne = t.ligne;
            err.colonne = t.colonne;
        }
        if (cpl) { err.exdata=cpl; } else   { err.exdata = t; }
        return err;
}; // erreur

Interpreteur.prototype.est_termine = function() { /****************************/
    if (this.termine) {return true;}
    if ((this.analyseur_lexical.fin_analyse) && (this.pile_op.length===0) && (! this.dernier_token) && (! this.enfant) ) {
        this.termine=true;
        if (! this.parent) {
            if (this.pile_arg.length>0) {
                var ret;
                while (this.pile_arg.length>0) {
                    ret = this.pile_arg.pop();
                    if ((ret.exdata) && (ret.exdata=='!')) {
                        this.err = this.erreur(ret,'que faire',new Error().stack);
                        return this.termine;
                    }
                }
            }
        }
    }
    return this.termine;
}; // est_termine

Interpreteur.prototype.est_complet = function(i,t) { /***************************/
    var j,nbarg;
    if (this.pile_op[i].procedure.nbarg===0) { return true; }
    if (this.pile_op[i].procedure.style==='p') {
        j = this.pile_arg.length - 1;
        if (t==='maxi') { nbarg = this.pile_op[i].procedure.maxiarg; } else { nbarg = this.pile_op[i].procedure.nbarg; };
        while ((j>=0) && (this.pile_arg[j].numero>this.pile_op[i].numero)) { nbarg--; j--;}
        if (nbarg<=0) {return true; } // // L'instruction a tous ses paramètres 
    } else if (this.pile_op[i].procedure.style=='i') {
        j = this.pile_arg.length - 1;
        nbarg = this.pile_op[i].procedure.nbarg - 1;
        while ((j>=0) && (this.pile_arg[j].numero>this.pile_op[i].numero)) { nbarg--; j--;}
        if (nbarg<=0) { return true; }
    }  
    return false;  
}

/* Teste si l'ajout du Token implique l'évalution de la pile */
Interpreteur.prototype.evaluation_necessaire = function(t) { /*****************/
    var nbarg,i,j;
    if (this.pile_op.length<=0) { return false; } // Rien à évaluer

    switch(t.type) {
        case 'symbole':
        case 'variable':
        case 'liste' :
        case 'nombre':  i = this.pile_op.length -1;
                        j = this.pile_arg.length - 1;
                        if (! this.pile_op[i].procedure) { return false; } // Cas des parentheses
                        if (this.pile_op[i].procedure.nbarg===0) { return true; }
                        if ((j>=0) && (this.pile_op[i].type!='parenthese')) {
                            if (this.est_complet(i,'maxi')) {return true;}
                        }
                        break;
        case 'operateur' :
        case 'mot' :    if (! t.procedure) { return this.erreur(t,'non trouve',new Error().stack); }
                        if (t.procedure.ret===0) { return true; } // L'instruction ne renvoie pas de valeur => evaluer ce qui précède
                        i = this.pile_op.length -1;
						if (this.pile_op[i].type==='evenement') { return true; }
                        if (this.pile_op[i].type!=='parenthese') {
                            if (this.pile_op[i].procedure.priorite>t.procedure.priorite) {
                                // L'instruction précèdente a une priorité supérieure => evaluer si elle a tous ses arguments								
                                if (this.est_complet(i,'maxi')) {return true;}
                                return false;
                            }
                            if (this.pile_op[i].procedure.nbarg===0) { return true; } // L'instruction précèdente n'attend pas de paramètres => evaluer
                            if (this.pile_op[this.pile_op.length-1].procedure.priorite==t.procedure.priorite) {
                                 if (this.est_complet(i,'maxi')) {return true;}
                            }
                        }
                        break;
        case 'eol' :    // Tester si evaluation possible ?
                        i = this.pile_op.length -1;                        
                        if (this.pile_op[i].procedure) {                                
                                // Si toute la pile est complète, evaluer.
                                while (i>=0) {
                                    if (! this.est_complet(i,'mini'))  {return false;}
                                    i--;
                                }
                                return true;
                        }
                        return false;
                        break;
        case 'eop' :
        case 'eof' :    return true;
                        break;
        default :       break;
    }

    return false;
}; // evaluation_necessaire

Interpreteur.prototype.evaluer = function () { /*******************************/

        var i,token;

        if (this.pile_op.length===0) {
            return this.erreur(null,'pile vide',new Error().stack);
        }
        var elt = this.pile_op.pop();
		
        if (! elt) {
            return this.erreur(null,'element vide',new Error().stack);
        }
        var arg=[];
        if (!elt.procedure) {return null;}
        if (elt.procedure.nbarg>0) { // L'operateur prend des arguments
            i = 0;
            while (i<elt.procedure.maxiarg) {
                    if (this.pile_arg.length===0) {
                        break;
                    } else {
                        token = this.pile_arg.pop();
                        if (elt.procedure.style=='p') {
                            if (token.numero> elt.numero) {
                                arg.unshift(token);
                                i++;
                            } else {
                                this.pile_arg.push(token);
                                break;
                            }
                        } else {
                            arg.unshift(token);
                            i++;
                        }
                    }
            }
            if (i<elt.procedure.nbarg) {
                return this.erreur(elt,'argument',new Error().stack);
            }
        }

        if (elt.procedure) {
            this.LWlogo.ligne(this,elt,arg);
            token = test_params(this,elt,arg);
            if ((token) && (token.type=='erreur')) {return token;}
            token = elt.procedure.action(this,elt,arg);           
        } else { return this.erreur(token,'inconnu',new Error().stack); }
        if ((elt.procedure.ret>0) && (token)) {
            token.ligne = elt.ligne;
            token.colonne = elt.colonne;
        } else if ((elt.procedure.ret===0) && (elt.procedure.code[0]!=='$')) {
            i=0;
            while (i<this.pile_arg.length) {
                if (this.pile_arg[i].exdata=='ignore') {
                    this.pile_arg.splice(i,1);
                } else { i++; }
            }
        }
        return token;
}; // Evaluer

Interpreteur.prototype.get = function(t) { /**********************************/
    var e = this, ret;
    while (e) {
        ret = e.contexte.get(t);
        if ((ret) && (ret.type!='erreur')) { return ret; }
        e = e.parent;
    }
    ret = erreur(t,'variable non trouve',new Error().stack);
    ret.valeur = t.nom;
    return ret;
}; // get

Interpreteur.prototype.interprete = function() { /****************************/

    var s,t,ret,token,cpt;
    s=''; cpt=0;
    this.ordre_tortue = false;

    do {
        cpt++;
        // Si un "sous-interprete" est défini...
        if (this.enfant) {
            if (this.enfant.est_termine()) {                
                if (this.enfant.pile_arg.length>0) {
                    token=this.enfant.pile_arg.pop();
                    if (token) {
                        if (this.enfant.src) {
                            token.numero=this.enfant.src.numero;
                            // en attendant mieux...
                            if ((this.enfant.src.procedure) && (this.enfant.src.procedure.code==='EXECUTE')) {
                                this.pile_arg.push(token);
                            }
                        }
                    }
                }
                this.enfant = null;
                return null;
            } else {
                ret = this.enfant.interprete();
                if (ret) {
                    if (ret.type!=='erreur') { ret=null; }
                }
                return ret;
            }
        }

        if (this.dernier_token) {
            ret = this.traite_token();
            if (ret) {
                if (ret.type==='erreur') {
                    this.termine=true;
                    return ret;
                }
                else {
                    t = this.valorise(ret);
                    if (t.type==='erreur') { return ret; }
                    this.pile_arg.push(t);
                }
            }
            continue;
        } else {
                if (this.est_termine()) { return null; }
        }

        if ((! this.analyseur_lexical.fin_analyse) ) {

            // Récupère le prochain lexeme de l'analyseur lexical
            t = this.token_suivant();

            if ( (t) && (t.type !== 'erreur') && (t.type !=='eol') ) {
               if (! t.procedure) {
                   ret = this.decore(t);
                   if ((ret) && (ret.type==='erreur')) { return ret; }
               }

                // Tente de l'ajouter à l'expression en cours
                if ((!ret) || (ret.type!='erreur')) {
                    this.dernier_token = t;
                }
            }
            this.dernier_token = t;
            if ( (t) && (t.type!=='eof') && (!ret || ret.type!=='erreur')) {

            } else   if ((ret) && (ret.type=='erreur')) {
                this.termine=true;
                return t;
            }
        }
    } while ((! this.ordre_tortue) && (!this.est_termine()) && (cpt<10) && (!debug) );
    if (this.err) { return this.err; }
}; // interprete

Interpreteur.prototype.interpreter = function(code,dligne,dcolonne,token) { /**/
  var ret;
  ret = this.analyseur_lexical.init(this.LWlogo,code,dligne,dcolonne,token);
  this.src = token;
  this.dernier_token = null;
  this.pile_arg=[];
  this.pile_op=[];
  this.enfant = null;
  this.termine = false;
  this.contexte=new Contexte(this);
  return ret;
}; // interpreter

Interpreteur.prototype.precedent = function() {/******************************/
    this.analyseur_lexical.back(1);
}; //precedent

Interpreteur.prototype.token_suivant = function() { /*************************/
    var ret;
    ret= this.analyseur_lexical.get();
    return ret;
}; // token suivant

Interpreteur.prototype.traite_token = function() { /***************************/
    switch(this.dernier_token.type) {
    case 'parenthese' : if (this.dernier_token.nom==='(' ) {
                                this.pile_op.push(this.dernier_token);
                                this.dernier_token = null;
                            } else {
                            if (this.pile_op.length===0) {
                               // return this.erreur(this.dernier_token,'parenthese',new Error().stack);
                               this.dernier_token = null;
                               return null;
                            }
                            var e = this.pile_op[this.pile_op.length - 1];
                            if ((e.type!=='parenthese') || (e.nom != '(')) {
                                return this.evaluer();
                            } else {
                                e = this.pile_op.pop();
                                this.dernier_token = null;
                                return null;
                            }
                        }
                        break;
    case 'symbole'  :
    case 'variable' :
    case 'liste'    :
    case 'nombre'   :  if (this.evaluation_necessaire(this.dernier_token)) {
                            return this.evaluer();
                        } else {
                            var t = this.valorise(this.dernier_token);
                            if (t.type==='erreur') { return t; }
                            this.pile_arg.push(t);
                            this.dernier_token = null;
                        }
                        break;
	case 'evenement':
    case 'mot'      :
    case 'operateur':  if (this.evaluation_necessaire(this.dernier_token)) {
                            return this.evaluer();
                        } else {
                            this.pile_op.push(this.dernier_token);
                            this.dernier_token = null;
                        }
                        break;
    case 'eop' :
    case 'eof' :    if (this.evaluation_necessaire(this.dernier_token)) {
                            return this.evaluer();
                    } else {
                        this.dernier_token = null;
                    }
                    break;
    case 'eol' :    if (this.evaluation_necessaire(this.dernier_token)) {
                            return this.evaluer();
                    } else {
                        this.dernier_token = null;
                    }
                    break;
    case 'erreur' : return this.dernier_token;
                    break;
    default    :    return this.erreur(this.dernier_token,'inconnu',new Error().stack);
                    break;

    }
    return null;
}; // Traite_token

Interpreteur.prototype.valorise= function(token,ctx,maj) { /*******************/
    var ret,e,trouve=false;
    if (!token) { return this.erreur(token,'nul',new Error().stack);}
    if (!ctx) { ctx='T'; }
    if (token.type === 'variable') {
        e = this;
        while ((e) && (!trouve)) {
            /* ctx = contexte si (L) LOCAL on ne recherche que dans le local,
                              si (G) GLOBAL on ne recherche que dans le global,
                              si (T) TOUT on recherche dans local + global*/
            if  ((ctx==='T') || (ctx==='G' && (! e.parent)) || (ctx=='L' && (e.parent))) {
                    ret = e.contexte.get(token);
                    if (ret.type==='erreur') { trouve = false ; } else {
                        token.valeur = ret.valeur;
                        if (maj) { ret.valeur = maj.valeur; }
                        if (ret.src) { token.src = ret.src; }
						return token.clone();
                        trouve=true;
                }
            }
            e = e.parent;
        }
        if (! trouve) {
            return this.erreur(token,'variable non trouve','');
        }
    }
    return token;
}; // valorise
