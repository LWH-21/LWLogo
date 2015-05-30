﻿/* ***************************************************************************/
/* Analyse lexicale  *********************************************************/
/* ***************************************************************************/
"use strict";


function Analyse_lexicale () { /**********************************************/
    this.src = null;
    this.cache = new Array();
    this.nligne=1;
    this.ncolonne = 0; 
    this.fin_analyse = false;   
    this.tokens=[];
    this.numero = 0;
} // Analyse_lexicale
 
 Analyse_lexicale.prototype.back = function(n) { /*****************************/
    if (! n) n=1;
    this.numero -= n; 
    if (this.numero<0) this.numero=0;
} // back
 
 /* Creation des procedures utilisateur **************************************/
Analyse_lexicale.prototype.creation_procs = function() { /********************/
        var i,j,t,fin,f,debut,trouve;
        i=0;
        while (i<this.tokens.length) {
            t = this.tokens[i];
            if ((t.type=='mot') && (t.procedure) && (t.procedure.code=='POUR')) {
                fin = false;
                debut = t;                
                f=new Fonction_utilisateur();
                do {
                    f.add(t);                    
                    this.tokens.splice(i,1);
                    if ((t.type == 'mot') && (t.procedure) && (t.procedure.code=='FIN')) {
                        fin=true; 
                        i--;
                    } else t = this.tokens[i];
                } while ((!fin) && (i<this.tokens.length))
                if (!fin) {                    
                    t = this.erreur(debut,'fin fonction',new Error().stack);
                    return t;
                } else {
                    j=0;trouve=false;
                    while ((!trouve) && (j<this.logo.reference.procedures_util.length)) {
                        if (this.logo.reference.procedures_util[j].nom==f.nom) {
                            trouve=true;
                            this.logo.reference.procedures_util[j]=f;
                        } else j++;
                    }
                    if (! trouve) {
                        this.logo.reference.procedures_util.push(f);
                        if (debug) console.log('ajout ',f.nom);
                    }
                }
            }
            i++;
        }
} // creation_procs 

Analyse_lexicale.prototype.decore = function (token) { /**********************/
    var i,s;
    if ((token.type=='operateur') || (token.type=='mot')) {
        s = sans_accent(token.nom);   
        for (i=0;i<this.logo.reference.procedures.length;i++) {
            if (this.logo.reference.procedures[i].noms.indexOf(s)>=0)  {
                token.procedure = this.logo.reference.procedures[i];              
                return;
            } 
        }    
    }
    return null;
} // decore

Analyse_lexicale.prototype.erreur = function(t,s,cpl) { /*********************/
        var err = new Token('erreur',s);
        err.origine = 'analyse'; 
        if (t) {
            err.ligne = t.ligne;
            err.colonne = t.colonne;  
        }
        if (cpl) err.exdata=cpl; else err.exdata = t;                                              
        return err;
} // erreur
 
Analyse_lexicale.prototype.get = function() { /*******************************/    
    if (this.numero < this.tokens.length) {
        if (this.tokens[this.numero].type=='eof') {
            this.fin_analyse = true;
        }  
        return this.tokens[this.numero ++];
    } else return new Token('eof','');
} // get 
 
 Analyse_lexicale.prototype.init= function(parent,texte,dligne,dcol,token) { //
    
    var t,cont;
    
    if ((! texte.rtrim) || ((typeof texte)!=='string')) {
        /* Non analysable */
        t = this.erreur('','analyse',new Error().stack);
        return t;
    }
    
    this.src = texte.rtrim();
    this.logo = parent;
    this.nligne=1;
    this.ncolonne = 0;   
    /* au cas où on interprete à partir d'une autre source que le code d'origine */
    if (dligne) this.nligne=dligne;
    if (dcol) this.ncolonne = dcol;    
    
    this.fin_analyse = false;
    this.tokens=[];
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
	    if (t.type=='cont') {
		cont=true;
	    } else if (t.type=='eol') {
		if (!cont) this.tokens.push(t); 
	    } else {
		this.tokens.push(t); 
		cont=false;
	    }                             
    } while ( (t) && (t.type!=='erreur') && (t.type!=='eof')); 
    if ((t) && (t.type=='erreur')) return t; 
    this.tokens.push(new Token('eof')); 
    //2eme phase : tests basiques
    t = this.tests();
    if ((t) && (t.type=='erreur')) return t;  
    //3eme phase : creation des procedures 
    t = this.creation_procs();
    // Mise en mémoire pour utilisation ulterieure
    if (( ! t) || (t.type!='erreur')) {
        if ((token) && (this.tokens.length>0)) {
            token.tokens = this.tokens;
        }     
    }
    return t;
} // init
 
Analyse_lexicale.prototype.suivant =function() { /****************************/
    
    var result,i,j,token,c,fin;           

    var mot = /[\w\u00C0-\u017F\.\?]/;
    var blancs = ' \t\f\r';    
    
    while (this.src.length>0) {
        c = this.src.charAt(0);
        this.src = this.src.slice(1);
        
        this.ncolonne++;
        
        if (c=='\n') {                                                  // Fin de ligne
            token = new Token('eol','');
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;
            token.origine = 'analyse'; 
            this.nligne++;
            this.ncolonne=0;
            return token;  
        } else if (c=='~') {
	    token = new Token('cont','');				// Caractere de continuation
      	    return token;
        } else if ((c>='0' && c<='9') || (c=='.')) {                    // Nombre. Forme acceptées : 12 / 12.5 / 0.5 / .5
            result=c;
            if (c=='.') j=1; else j=0;
            if (this.src.length>0) {
                i=0;
                fin = false;
                do {
                    c = this.src.charAt(i);
                    if (c=='.') j++; 
                    if ((c>='0' && c<='9') || (c=='.')) {
                        result+=c;
                        i++;                        
                    } else fin=true;
                } while ((!fin) && (i<this.src.length))
            }
            if ((j<2) && isNumber(result)){
                token = new Token('nombre',parseFloat(result),'!');
                token.ligne = this.nligne;
                token.colonne = this.ncolonne;
                token.origine = 'analyse';
                this.src = this.src.slice(i);
                this.ncolonne += i;
                return token;
            } else {
                token = this.erreur(null,'format numerique',new Error().stack);
                token.ligne = this.nligne;
                token.colonne = this.ncolonne;
                token.origine = 'analyse';
                token.valeur = result;                
                return token;
            }
        } else if (c==')' || c=='(') {                                  // Parenthèses
                token = new Token('parenthese',c);
                token.ligne = this.nligne;
                token.colonne = this.ncolonne;
                token.origine = 'analyse';
                return token;
        } else if (c==']') { 
                    token = this.erreur(null,'crochet',new Error().stack);
                    token.ligne = this.nligne;
                    token.colonne = this.ncolonne;
                    return token;                
        } else if (c=='[') {                                            // Listes 
                var p=1,d,f;i=0;
                d = this.nligne;
                f = this.ncolonne;
                if (this.src.length>0) {                    
                    result='';
                    do {
                        c = this.src.charAt(i);
                        this.ncolonne++;
                        if ((c==';') || (c=='#')) { // Commentaires
                            fin=false;                            
                            do {
                                c = this.src.charAt(i);                                
                                if (c=='\n') fin=true; else i++;
                            } while ((!fin) && (i<this.src.length));                             
                        }      
                        if (c=='\n') {
                            this.nligne++; 
                            this.ncolonne = 0;
                        }
                        if (c==']') p--;  
                        if (c=='[') p++; 
                        if (p>0) {                            
                            if (c=='\n') c=' ';
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
                } else {
                    this.src = this.src.slice(i);                    
                    token = new Token('liste',result,'!');
                    token.ligne = d;
                    token.colonne = f; 
                    token.origine = 'analyse';            
                    return token;                
                }        
        } else if ("+-*/^=><".indexOf(c)>=0) {                              // Operateur + - * /       
            switch (c) {
                case '<' : var suivant = this.src.charAt(0);
                           if ((suivant=='=') || (suivant=='>')) {
                            c=c+suivant;
                            this.src = this.src.slice(1);
                           }
                           break;
                case '>' : var suivant = this.src.charAt(0);
                           if (suivant=='=')  {
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
        } else if ((c=='#') || (c==';')) {                              // Commentaire jusqu'à la fin de ligne
            if (this.src.length>0) {
                i = 0;fin=false;
                do {
                    c = this.src.charAt(i);
                    if (c=='\n') fin=true; else i++;
                } while ((!fin) && (i<this.src.length));
                this.ncolonne += i;
                this.src = this.src.slice(i);
            }
        } else if ((c>='A'&& c<='Z') || (c>='a' && c<='z') ) {          // Identificateur (mot) Commence par une lettre. Peut comporter un point. 
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c=='\n') {
                    fin=true;
                } else if ((c==' ') || (c=='\t') || (c=='\f') || (c=='\r')) {
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
        } else if (c==':') {                                            // Variable
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c=='\n') {
                    fin=true;
                } else if ((c==' ') || (c=='\t') || (c=='\f') || (c=='\r')) {
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
        } else if (c=='"') {                                             // Symbole
            result=c;fin=false;i=0;
            while ((!fin) && (i<this.src.length)) {
                c = this.src.charAt(i);
                if (c=='\n') {
                    fin=true;
                } else if ((c==' ') || (c=='\t') || (c=='\f') || (c=='\r')) {
                    fin=true;
                } else if (! mot.test(c)) {
                    fin=true;
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
        } else if (blancs.indexOf(c)>=0) {                              // Caractères blancs
            i=0;j=0;
            fin = false;
            do {
                c = this.src.charAt(i);                    
                if (blancs.indexOf(c)>=0) {                        
                    if (c=='\n') {
                        this.nligne++; 
                        this.ncolonne = 0;
                        j=0;                        
                    } else j++;                    
                    i++;                        
                } else fin=true;
            } while ((!fin) && (i<this.src.length))
            this.src = this.src.slice(i);
            this.ncolonne += j;                
        } else {            
            token = this.erreur(null,'caractere non reconnu',new Error().stack);
            token.ligne = this.nligne;
            token.colonne = this.ncolonne;            
            token.origine = 'analyse';            
            return token;
        }
        
                
    } // while (this.src.length)>0
                      
    token = new Token('eof','');
    token.ligne = this.nligne;
    token.colonne = this.ncolonne;
    token.origine = 'analyse';    
    return token;

} // Suivant 
 
/* Tests sur l'analyse lexicale **********************************************/ 
Analyse_lexicale.prototype.tests = function() { /*****************************/
        var i,t,test;
        // Suppression des lignes inutiles 
        i = 1;
        while (i<this.tokens.length) {
            if ((this.tokens[i].est_blanc()) &&  (this.tokens[i - 1].est_blanc())) {
                this.tokens.splice(i-1,1);
            } else i++;            
        }
        // Test parantheses 
        var p=[];
        for (i=0;i<this.tokens.length;i++) {
            t = this.tokens[i];
            if (t.type=='parenthese') {
                if (t.nom=='(') {
                    p.push(t);
                } else {
                    if (p.length=='0') {
                        return this.erreur(t,'parenthese',new Error().stack);
                    } else p.pop();
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
            if ((this.tokens[i].type=='operateur') && (this.tokens[i].nom=='-')) {                
                // Le token suivant doit être un nombre, sur la même ligne
                if ((i+1<this.tokens.length) && (this.tokens[i+1].type=='nombre') && (this.tokens[i+1].ligne==this.tokens[i].ligne)) {
                    // Le moins doit être collé au token suivant                    
                    if (this.tokens[i].colonne == this.tokens[i+1].colonne - 1) {
                        // si pas de token précédent => ok
                        if (i==0) {
                            test=true; 
                        } else if (this.tokens[i-1].type=='operateur') { // Si le token précédent est un opérateur
                            test=true;
                        } else if ((this.tokens[i-1].type=='parenthese') && (this.tokens[i-1].nom=='(')) { // parenthese ouvrante
                            test=true;
                        } else if (this.tokens[i-1].ligne<this.tokens[i].ligne) { // pas sur la même ligne
                            test=true;
                        } else if (this.tokens[i-1].colonne+this.tokens[i-1].longueur()+1<this.tokens[i].colonne) { // pas collé
                            test=true;
                        }  else test=false;                                               
                    }
                }
                
            }
            if (test) {
                this.tokens[i+1].valeur = 0 - this.tokens[i+1].valeur;
                this.tokens[i+1].nom = '-'+this.tokens[i+1].nom;
                this.tokens.splice(i,1);            
            } else i++;
        }        
        // Compléte les tokens
        i=0;
        while (i<this.tokens.length) {
            t = this.tokens[i];
            if ((t.type=='mot') || (t.type=='operateur')) this.decore(t);
            i++;
        }
        /*if (debug) {
            for (i=0;i<this.tokens.length;i++) {
                t = this.tokens[i];
                console.log('Analyse '+i+':',t);
            }         
        }*/
} //tests
 

