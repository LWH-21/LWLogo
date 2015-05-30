"use strict";

function Interpreteur(id,logo,parent) {
    this.ID = id;
    this.LWlogo = logo;
    this.parent = parent;
    this.enfant = null;
    this.pile_op = [];                                                  // Pile des opérateurs / fonctions
    this.pile_arg = [];                                                 // Pile des arguments
    this.pile_fun = [];                                                 // Pile des fonctions utilisateurs
    this.analyseur_lexical = new Analyse_lexicale();
    this.dernier_token = null;     
    this.termine = false;    
    this.contexte=new Contexte(this);
    this.ordre_tortue = false;
}

/* Teste si l'ajout du Token implique l'évalution de la pile */
Interpreteur.prototype.evaluation_necessaire = function(t) {

    if (this.pile_op.length<=0) return false; // Rien à évaluer
    
    switch(t.type) {
        case 'symbole':
        case 'variable':
        case 'liste' :
        case 'nombre':  var i = this.pile_op.length -1;
                        var j = this.pile_arg.length - 1;  
                        if (! this.pile_op[i].procedure) return false; // Cas des parentheses
                        if (this.pile_op[i].procedure.nbarg==0) return true;
                        if ((j>=0) && (this.pile_op[i].type!='parenthese')) {
                            if ((this.pile_op[i].procedure.style=='i') && (this.pile_arg[j].numero>this.pile_op[i].numero)) {                                   
                                return true;
                            }
                            if (this.pile_op[i].procedure.style=='p') {                                                                
                                if (this.pile_op[i].procedure.nbarg==0) return true;
                                if ((this.pile_op[i].procedure.maxiarg==1) && (this.pile_arg[j].numero>this.pile_op[i].numero)) return true;
                                if ((this.pile_op[i].procedure.maxiarg>1) /*&&  (this.pile_op[i].procedure.maxiarg==this.pile_op[i].procedure.nbarg)*/ ) {
                                    var nbarg = this.pile_op[i].procedure.maxiarg; 
                                    while ((j>=0) && (this.pile_arg[j].numero>this.pile_op[i].numero)) {nbarg--;j-- ;}
                                    if (nbarg<=0) return true;
                                }
                            }
                        }
                        break;
        case 'operateur' :
        case 'mot' :    if (! t.procedure) return this.erreur(token,'non trouve',new Error().stack);
                            
                        if (t.procedure.ret==0) return true; // L'instruction ne renvoie pas de valeur => evaluer ce qui précède
                        var i = this.pile_op.length -1;                        
                        if (this.pile_op[i].type!='parenthese') {                                                 
                            if (this.pile_op[this.pile_op.length-1].procedure.priorite>t.procedure.priorite) {                                
                                // L'instruction précèdente a une priorité supérieure => evaluer
                                return true;                                
                            }
                            if (this.pile_op[i].procedure.nbarg==0) return true; // L'instruction précèdente n'attend pas de paramètres => evaluer
                            if (this.pile_op[this.pile_op.length-1].procedure.priorite==t.procedure.priorite) {
                                if (this.pile_op[i].procedure.style=='p') {
                                    var j = this.pile_arg.length - 1;
                                    var nbarg = this.pile_op[i].procedure.maxiarg;
                                    while ((j>=0) && (this.pile_arg[j].numero>this.pile_op[i].numero)) { nbarg--; j--;}
                                    if (nbarg<=0) return true; // // L'instruction précèdente a tous ses paramètres => evaluer                                
                                } else if (this.pile_op[i].procedure.style=='i') {
                                    var j = this.pile_arg.length - 1;
                                    var nbarg = this.pile_op[i].procedure.nbarg - 1;
                                    while ((j>=0) && (this.pile_arg[j].numero>this.pile_op[i].numero)) { nbarg--; j--;}
                                    if (nbarg<=0) return true;                             
                                }
                            }
                        }
                        break;
        case 'eol' :    // Tester si evaluation possible ?
                        var i = this.pile_op.length -1;
                        if (this.pile_op[i].procedure) {
                                // Si arguments multiples, evaluer.
                                if (this.pile_op[i].procedure.maxiarg>this.pile_op[i].procedure.nbarg) return true;
                        }
                        return false;
                        break;
        case 'eop' :
        case 'eof' :    return true;
                        break;
    }

    return false;
}

Interpreteur.prototype.donne_valeur= function(token,type_attendu) {
    return token;
}

Interpreteur.prototype.valorise= function(token) {
    var ret,n,e,trouve=false;    
    if (!token) this.erreur(token,'nul',new Error().stack); 
    
 
    if (token.type == 'variable') {  
        e = this;
        while ((e) && (!trouve)) {
            // On recherche dans la pile d'appel des procedures           
            n = e.pile_fun.length ;
            while ((n>0) && (!trouve)) {
                ret = e.pile_fun[n - 1].ctx.get(token);
                if (ret.type!='erreur') {
                    trouve=true;
                    token.valeur = ret.valeur;   
                    if (ret.src) token.src = ret.src;  
                } else n--;
            }
             
            // On recherche dans le contexte global
            if (! trouve) {
                ret = e.contexte.get(token);
                if (ret.type=='erreur') trouve = false ; else {
                    token.valeur = ret.valeur;
                    if (ret.src) token.src = ret.src;   
                    trouve=true;                    
                }
            }        
            e = e.parent;
        } 
        if (! trouve) {            
            return this.erreur(token,'variable non trouve',new Error().stack);
        }       
    }
    return token;
}

Interpreteur.prototype.evaluer = function () {
        
        var i,token,debut;
           
        if (this.pile_op.length==0) {        
            return this.erreur(null,'pile vide',new Error().stack);
        }
        var elt = this.pile_op.pop(); 
        if (! elt) {       
            return this.erreur(null,'element vide',new Error().stack);     
        }               
        var arg=[];        
        if (elt.procedure.nbarg>0) { // L'operateur prend des arguments  
            i = 0;  
            while (i<elt.procedure.maxiarg) {
                    if (this.pile_arg.length==0) {                                                                    
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
            if ((token) && (token.type=='erreur')) return token;              
            token = elt.procedure.action(this,elt,arg);   
            this.nettoie_pile_arg(elt);         
        } else return this.erreur(token,'inconnu',new Error().stack);
        if ((elt.procedure.ret>0) && (token)) {
            token.ligne = elt.ligne;
            token.colonne = elt.colonne;
        } else if (elt.procedure.ret==0) {
           var i=0;
            while (i<this.pile_arg.length) {
                if (this.pile_arg[i].exdata=='ignore') {
                    this.pile_arg.splice(i,1);
                } else i++;
            }
        }       
        return token;
}

Interpreteur.prototype.traite_token = function() {
    switch(this.dernier_token.type) {
    case 'parenthese' : if (this.dernier_token.nom==='(' ) {
                                this.pile_op.push(this.dernier_token); 
                                this.dernier_token = null;                                
                            } else {
                            if (this.pile_op.length===0) {
                               // return this.erreur(this.dernier_token,'parenthese',new Error().stack);
                               this.dernier_token = null;
                               return;
                            }
                            var e = this.pile_op[this.pile_op.length - 1];
                            if ((e.type!=='parenthese') || (e.nom != '(')) {                               
                                return this.evaluer();
                            } else {
                                e = this.pile_op.pop();
                                this.dernier_token = null;
                                return;
                            }
                        }
                        break;
    case 'symbole'  :
    case 'variable' :
    case 'liste'    :
    case 'nombre'   :  if (this.evaluation_necessaire(this.dernier_token)) {                                        
                            return this.evaluer();
                        } else {
                            if (this.pile_op.length==0) {
                                /*if (this.dernier_token.exdata !== 'ignore') {
                                    console.log(this.dernier_token);
                                    return this.erreur(this.dernier_token,'que faire',new Error().stack);
                                }*/
                            }
                            var t = this.valorise(this.dernier_token);
                            if (t.type=='erreur') return t;
                            this.pile_arg.push(t);  
                            this.dernier_token = null;              
                        }
                        break;
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
}

Interpreteur.prototype.nettoie_pile_arg = function(token) {  
    
    var i = 0;
    if (token) {
        if ((token.procedure) && (token.procedure.ret==0)) {           
            while (i<this.pile_arg.length) {
               if ((! this.pile_arg[i]) || (this.pile_arg[i].exdata=='ignore')) {
                    this.pile_arg.splice(i,1);                    
                } else 
               if ((this.pile_arg[i]) && (this.pile_arg[i].numero<token.numero)) {
                   this.pile_arg.splice(i,1);  
               } else i++;
            }
        }        
    } else {
        while (i<this.pile_arg.length) {
            if ((! this.pile_arg[i]) || (this.pile_arg[i].exdata=='ignore')) {
                this.pile_arg.splice(i,1);
            } else i++;
        }
    }
}

Interpreteur.prototype.decore = function(token) {   
    var i,s;
    if ((token.type!=='mot') && (token.type!='operateur')) return token;
    s = sans_accent(token.nom);    
    if ((!s) || (s.length==0)) s = token.nom;    
    for (i=0;i<this.LWlogo.reference.procedures.length;i++) {
        if (this.LWlogo.reference.procedures[i].noms.indexOf(s)>=0) {
            token.procedure = this.LWlogo.reference.procedures[i];                    
            return token;
        }
    }    
    for (i=0;i<this.LWlogo.reference.procedures_util.length;i++) {
        if (this.LWlogo.reference.procedures_util[i].code == s)  {
            token.procedure = this.LWlogo.reference.procedures_util[i];            
            return token;
        }
    }        
    return this.erreur(token,'non trouve',new Error().stack);;
}

Interpreteur.prototype.token_suivant = function() {
    var cont,ret,i;    
    do {
        cont=false;
        if (this.pile_fun.length>0) {
            ret = this.pile_fun[this.pile_fun.length -1];        
            if (ret.termine()) {
                this.nettoie_pile_arg();               
                ret = this.pile_fun.pop();
                cont = true;
            }
        }
    } while (cont);
    
    
    if (this.pile_fun.length==0) {
        ret= this.analyseur_lexical.get();        
    } else {
        var t = this.pile_fun[this.pile_fun.length - 1];
        ret = t.get();        
    }
    return ret;
}

Interpreteur.prototype.precedent = function() {    
    if (this.pile_fun.length>0) {
        if (this.pile_fun.index>0) this.pile_fun.index --;        
    } else {
        this.analyseur_lexical.back(1);
    } 
}

Interpreteur.prototype.interprete = function() {

    var s,t,ret,token,cpt;
    s=''; cpt=0;
    this.ordre_tortue = false;
        
    do {
          
        cpt++;               
        // Si un "sous-interprete" est défini...
        if (this.enfant) {
            if (this.enfant.termine) {
                this.nettoie_pile_arg();
                this.enfant = null;
                return;
            } else {
                ret = this.enfant.interprete();
                if (ret) {
                    if (ret.type!=='erreur') ret=null; 
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
                    if (t.type=='erreur') return ret;                  
                    this.pile_arg.push(t);
                }
            }
            continue;
        } else {
                if ((this.analyseur_lexical.fin_analyse) && (this.pile_fun.length==0) && (this.pile_op.length==0) && (! this.dernier_token)) {                               
                    this.termine=true;   
                    this.dernier_token = null;                
                    return;
                }    
        } 
                
        if ((! this.analyseur_lexical.fin_analyse) || (this.pile_fun.length>0)) {
        
            // Récupère le prochain lexeme de l'analyseur lexical  
            t = this.token_suivant();    
            if ( (t) && (t.type !== 'erreur') && (t.type !=='eol') ) {                          
               if (! t.procedure) {                                    
                   ret = this.decore(t);
                   if ((ret) && (ret.type=='erreur')) return ret;
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
    } while ((! this.ordre_tortue) && (!this.termine) && (cpt<10) && (!debug) )
}

Interpreteur.prototype.interpreter = function(code,dligne,dcolonne,token) { 
  var ret;
  ret = this.analyseur_lexical.init(this.LWlogo,code,dligne,dcolonne,token);  
  this.dernier_token = null;  
  this.pile_arg=[];
  this.pile_op=[];
  this.pile_fun=[];
  this.enfant = null;
  this.termine = false;
  this.contexte=new Contexte(this);
  return ret;
}

Interpreteur.prototype.erreur = function(t,s,cpl) {
        var err = new Token('erreur',s);
        err.origine = 'interprete'; 
        err.valeur = t.nom;
        if (t) {
            err.ligne = t.ligne;
            err.colonne = t.colonne;  
        }
        if (cpl) err.exdata=cpl; else err.exdata = t;                                              
        return err;
}

Interpreteur.prototype.get = function(t) {
    var e = this, ret;
    while (e) {
        ret = e.contexte.get(t);
        if ((ret) && (ret.type!='erreur')) return ret;
        e = e.parent;
    }
    ret = erreur(t,'variable non trouve',new Error().stack);
    ret.valeur = t.nom;
    return ret;
}


