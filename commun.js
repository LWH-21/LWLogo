/* ***************************************************************************/
/* Fonctions utilitaires *****************************************************/
/* Classes communes **********************************************************/
/* ***************************************************************************/
"use strict";

function erreur (t,s,cpl,params) { /*******************************************/
        var err = new Token('erreur',s),i=0,v,s1;
        err.origine = '?'; 
        if (t) {
            err.valeur = t.nom;
            v = t.nom+' ';
            err.ligne = t.ligne;
            err.colonne = t.colonne;  
        } else err.valeur = '?';
        if (cpl) err.exdata=cpl; else err.exdata = t;    
        if (params) {
            for (i=0;i<params.length;i++) {
                if (params[i]) {
                    s1 = params[i].toString();
                    if (params[i].numero<t.numero) v=s1+' '+v; 
                    else v=v+s1+' ';                    
                } else v=v+'? ';
            }
        }
        err.valeur = v;
        return err;
} // erreur

function isNumber(n) { /******************************************************/
  return !isNaN(parseFloat(n)) && isFinite(n);
} // isNumber

if (!Array.indexOf){ /********************************************************/
  Array.prototype.indexOf = function(obj){
   for(var i=0; i<this.length; i++){
    if(this[i]==obj) return i;
   }
   return -1;
  }
} // Array.indexOf

if (!String.rtrim){ /*********************************************************/
    String.prototype.rtrim = function() {
        var trimmed = this.replace(/\s+$/g, '');
        return trimmed;
    };
} // String.rtrim

function sans_accent(entree) { /**********************************************/
        var sortie = "";        
        var car="";
        var l,i;
        
        entree=entree.toLowerCase();        
        l = entree.length;
 
        for (i = 0 ; i < l ; i++) {
            car = entree.substr(i, 1);
            switch (car) {
            case 'é':
            case 'è':
            case 'ê':
            case 'ë':
            case 'æ': car='e';break;
            case 'à':
            case 'â':
            case 'ä':
            case 'å':
            case 'á': car='a';break;
            case 'ô':
            case 'ö':
            case 'ò':
            case 'ó': car='o';break;
            case 'ç': car='c';break;     
            case 'î':
            case 'ï':
            case 'ì':
            case 'í': car='i';break;                
            case 'Ä':
            case 'Å':
            case 'À': car='a';break;
            case 'Æ':
            case 'É':
            case 'È':
            case 'Ê':
            case 'Ë': car='e';break;
            case 'Ç': car='c';break;
            case 'û':
            case 'ù':
            case 'ü':
            case 'ú': car='u';break;
            case 'ÿ': car='y';break;
            case 'Ö': car='o';break;
            case 'Ü':
            case 'Ù':
            case 'Û': car='u';break;
            case 'ñ':
            case 'Ñ': car='n';break;
            }
            sortie+=car;

        }    
        return sortie;
} // sans_accent

/* Teste si la paramètres sont acceptables par le token **********************/
function test_params(interpreteur,token,params) { /* *************************/      
    var ret,exp,i,j; 
	if (token.type==='evenement') { return true; }
    if ((!token) || (!token.procedure)) {
        ret = erreur(token,'inconnu',new Error().stack,params);   
        ret.origine='eval';
        return ret;
    }    
    if (params.length<token.procedure.nbarg) {
        ret= erreur(token,'nombre_parametres',new Error().stack,params);
        ret.origine = 'eval';
        return s;
    }
    for (i=0;i<token.procedure.nbarg;i++) {
        if (! params[i]) {            
             ret = erreur(token,'null',new Error().stack,params); 
             ret.origine = 'eval';
             return ret;
        }        
        exp = token.procedure.type_params;
        if (exp) {
            j = exp.length - 1;        
            if (j>=0) {
                if (j > i) j=i;
                switch (exp.charAt(j)) {
                    case '*'    : break;
                    case 'b'    : if (! params[i].est_booleen()) {
                                    ret = erreur(token,'booleen',new Error().stack,params);
                                    ret.origine='eval';                                    
                                    return ret;
                                  }
                                  break;                     
                    case 'c'    : if (! params[i].est_couleur())  {
                                    ret = erreur(token,'couleur',new Error().stack,params);
                                    ret.origine='eval';                                    
                                    return ret;
                                  }
                                  break;
                    case 'l'    : if (! params[i].est_liste()) {
                                    ret = erreur(token,'liste',new Error().stack,params);
                                    ret.origine='eval';                                   
                                    return ret;
                                  }
                                  break;  
                    case 'n'    : if (! params[i].est_nombre()) {
                                    ret = erreur(token,'nombre',new Error().stack,params);
                                    ret.origine='eval';                                    
                                    return ret;
                                  }
                                  break;                            
                   default      : 
                }
            }        
        }
    }
} // test_params

/* ***************************************************************************/
/* Classe Token **************************************************************/
/* ***************************************************************************/

function Token(type,nom,exdata,l,c) {
    this.type = type;               // Type de token : eol / nombre / operateur / mot / eof / erreur
    this.nom = nom;
    this.exdata = exdata;             // Infos complémentaires
    this.procedure = null;    
    this.ligne = l;
    this.colonne = c;    
    this.origine = '?';               //Origine du token analyse=Analyseur syntaxique, interprete=interpreteur, eval=evaluation
    this.numero=numero_ordre++;
    switch (this.type) {
        case '?'          : nom = nom.trim();
                            if (isNumber(nom)) {
                                this.type='nombre';
                                this.valeur = parseFloat(nom);
                            } else if ((nom.charAt(0)=='[') && (nom.charAt(nom.length-1)==']')) {
                                this.type='liste';
                                this.valeur='';
                                nom = nom.substring(1, nom.length-1); 
                                var t=nom.trim().split(/[\s,]+/);
                                for (var i=0;i<t.length;i++) {
                                    this.valeur = this.valeur+t[i]+' ';
                                }
                                this.valeur = this.valeur.trim();
                            } else {
                                this.type='mot';
                            }
                            break;
        case 'cont'	      : break;        
        case 'eof'        : this.valeur = null;break;
        case 'eol'        : this.valeur = null;break;
        case 'eop'        : this.valeur = null;break;
        case 'erreur'     : this.valeur = '';break;
		case 'evenement'  : this.valeur=this.nom;break;
        case 'liste'      : /*this.valeur='';
                            var lignes=nom.trim().split(/[\n,]+/);
                            for (var i=0;i<lignes.length;i++) {
                                var t = lignes[i].split(
                                this.valeur = this.valeur+t[i]+' ';
                            }*/
                            this.valeur = this.nom.trim();
                            break; 
        case 'mot'        : this.valeur = nom;nom = nom.toLowerCase();nom = sans_accent(nom);break;       
        case 'nombre'     : this.valeur = this.nom;break;
        case 'booleen'    : this.valeur = this.nom;break;
        case 'operateur'  : this.valeur = null;break;
        case 'parenthese' : this.valeur = null;break;
        case 'symbole'    : this.valeur = this.nom;
                            // Les majuscules évitent la confusion avec un mot-clé de Javascript
							if (this.nom[0]==='"') { this.nom = this.nom.substr(1); } this.nom = sans_accent(this.nom);this.nom=this.nom.toUpperCase();break;
        case 'variable'   : this.valeur = '';
							if (this.nom[0]===':') { this.nom = this.nom.substr(1); } this.nom = sans_accent(this.nom);this.nom=this.nom.toUpperCase();break;
        default           : console.log('type '+type+' non traite');
    }
    if (! this.exdata) this.exdata='!';
} // Token

Token.prototype.clone = function() { /****************************************/
    var c=new Token(this.type,this.nom,this.exdata,this.ligne,this.colonne);
    c.nom = this.nom;
    c.procedure = this.procedure;    
    c.origine = 'clone';          
    c.numero = this.numero;
	
	c.type = this.type;      
    c.exdata = this.exdata;  
	c.valeur = this.valeur;
	
    if (this.src) c.src = this.src;
    return c;
} // clone

Token.prototype.est_blanc = function () { /***********************************/
    switch(this.type) {
        case 'eol'  : return true; break;
        case 'eop'  : return true; break;
        case 'eof'  : return true; break;
        default : return false;
    }
} // est_blanc

Token.prototype.est_booleen = function () { /*********************************/
    switch(this.type) {
        case 'booleen'  :   return true; break;
        case 'variable' :   if ((typeof this.valeur)=='boolean') return true;       
        default : return false;
    }
} // est_booleen

/* Une couleur est une liste de trois nombres par ex. [255 0 64]             */
Token.prototype.est_couleur = function () { /*********************************/
    var t,ret;
    switch(this.type) {
        case 'liste'    :   
        case 'variable' :   t = this.split();
                            ret = false;
                            if (t.length==3) {
                                for (i=0;i<3;i++) {
                                    if (! isNumber(t[i])) return false;
                                }
                                return true;
                            }
                            return ret;
                            break;
        default : return false;
    }
} // est_couleur

Token.prototype.est_liste = function () { /***********************************/

    if ((typeof this.valeur)!='string') {
        return false;
    }

    switch(this.type) {
        case 'liste'    :   return true; break;
        case 'variable' :   if ((typeof this.valeur)=='string') return true;
                            break;
        default : return false;
    }
} // est_liste

Token.prototype.est_mot = function () { /*************************************/
    switch(this.type) {
        case 'symbole'  :   return true; break;
        case 'mot'      :   return true; break;
        case 'variable' :   if ((typeof this.valeur)=='string') return true;
                            break;
        default : return false;
    }
} // est_mot

Token.prototype.est_nombre = function () { /**********************************/  
    switch(this.type) {
        case 'nombre' : return true; break;
        case 'variable' : if ((typeof this.valeur)=='number') return true;
                          if (isNaN(parseFloat(this.valeur))) return false;
                          if (! isFinite(this.valeur)) return false;
                          return true;
                          break;
        default : return false;
    }
} // est_nombre

Token.prototype.longueur = function () { /************************************/
    var lg = 0,s;
    switch (this.type) {
        case 'cont'	      : 
        case 'eof'        : 
        case 'eol'        :
        case 'eop'        : 
        case 'erreur'     : break;
		case 'evenement'  : lg=0;break;
        case 'liste'      : lg=this.valeur.length+2;break;
        case 'mot'        : lg=this.valeur.length;break;    
        case 'nombre'     : s=this.valeur+' ';lg = s.length - 1;break;
        case 'booleen'    : lg = this.nom.length;break;
        case 'operateur'  : lg = this.nom.length;break;
        case 'parenthese' : lg = this.nom.length;break;
        case 'symbole'    : lg = this.nom.length;break;
        case 'variable'   : lg = this.nom.length+1;break;
        default           : return 'type '+this.type+' inconnu';
    } 
    return lg;
} // longueur

Token.prototype.split = function () { /***************************************/
    var t = [], s;
    switch (this.type) {
        case 'cont'	      : return this.type;break;
        case 'eof'        : break;
        case 'eol'        : break;
        case 'eop'        : break;
        case 'erreur'     : break;
		case 'evenement'  : break;
        case 'liste'      : s=this.valeur.trim();
                            s=s+' ';
                            var i=0,j=0,s1='',blancs=/\s/,c;
                            while (i<s.length) {
                                    c=s.charAt(i);
                                    if ((j==0) && (blancs.test(c))) {
                                            if (s1.length>0) t.push(s1);
                                            s1='';
                                    } else {
                                        s1=s1+c;
                                        if (c=='[') j++;
                                        if (c==']') {
                                            j--;
                                            if (j==0) {
                                                if (s1.length>0) t.push(s1);
                                                s1='';                                            
                                            }
                                        }
                                    }
                                    i++;
                            }
                            if (j>0) {
                                s1=trim(s1);
                                if (s1.length>0) t.push(s1);
                            }
                            return t;break; 
        case 'mot'        : s=this.valeur;s=s.trim();
                            t = s.split('');break;     
        case 'nombre'     : s=this.valeur+' ';
                            s=s.trim();
                            return s.split('');break;
        case 'booleen'    : if (this.valeur) t[0]=logo.reference.les_fonctions['VRAI'].std[0]; else
                            t[0]=logo.reference.les_fonctions['FAUX'].std[0];
                            break;
        case 'operateur'  : t[0]=this.nom;break;
        case 'parenthese' : t[0]=this.nom;break;
        case 'symbole'    : s=this.nom;
                            if (s.charAt(0)=='"') s=s.substr(1);
                            t=s.split('');break;
        case 'variable'   : if (this.src) {
                                t = this.src.split();
                            } else {
                                t=this.valeur.split('');
                            }
                            break;
    } 
    return t;    
}

Token.prototype.toString = function () { /************************************/
    switch (this.type) {
	case 'cont'	  : return this.type;break;
        case 'eof'        : return this.type;break;
        case 'eol'        : return this.type;break;
        case 'eop'        : return this.type;break;
        case 'erreur'     : return this.type+' '+this.exdata;break;
		case 'evenement'  : return this.nom;break;
        case 'liste'      : return '['+this.valeur+']';break; 
        case 'mot'        : return this.nom;break;     
        case 'nombre'     : return this.valeur;break;
        case 'booleen'    : if (this.valeur) return logo.reference.les_fonctions['VRAI'].std[0]; else
                            return logo.reference.les_fonctions['FAUX'].std[0];
                            break;
        case 'operateur'  : return this.nom;break;
        case 'parenthese' : return this.nom;break;
        case 'symbole'    : return '"'+this.valeur;break;
        case 'variable'   : return ':'+this.nom;break;
        default           : return 'type '+this.type+' inconnu';
    }            
} // toString

Token.prototype.toText = function () { /**************************************/
    switch (this.type) {
	case 'cont'	  : return this.type;break;
        case 'eof'        : return this.type;break;
        case 'eol'        : return this.type;break;
        case 'eop'        : return this.type;break;
        case 'erreur'     : return this.type+' '+this.exdata;break;
		case 'evenement'  : return this.nom;break;
        case 'liste'      : return this.valeur;break;
        case 'mot'        : return this.nom;break;     
        case 'nombre'     : return this.valeur;break;
        case 'booleen'    : if (this.valeur) return logo.reference.les_fonctions['VRAI'].std[0]; else
                            return logo.reference.les_fonctions['FAUX'].std[0];
                            break;
        case 'operateur'  : return this.nom;break;
        case 'parenthese' : return this.nom;break;
        case 'symbole'    : return this.valeur.slice(1);break;
        case 'variable'   : if (this.src) return this.src.toText();
                            return this.valeur;break;
        default           : return 'type '+this.type+' inconnu';
    }            
} // toString

/* ***************************************************************************/
/* Classe Contexte * *********************************************************/
/* Stockage des variables ****************************************************/
/* ***************************************************************************/

function Contexte(parent) { /*************************************************/
    this.parent = parent;
    this.data = [];
} // Contexte

Contexte.prototype.ajoute = function(t) { /***********************************/
    if (t) {            
        this.data[t.nom] = t;           
    }
} // ajoute

Contexte.prototype.delete =function(t) { /************************************/
    if (t) {
        this.data[t.nom] = null;
    }
    return false;
} // delete

Contexte.prototype.get = function(t) { /**************************************/
    if (t) {
        if (this.data[t.nom]) return this.data[t.nom]; 
    }
    return erreur(t,'non trouve',new Error().stack);
} // get

Contexte.prototype.maj = function(t) { /**************************************/
    if (t) {
        this.data[t.nom] = t;  
    }
    return false;
} // maj

/* ***************************************************************************/
/* Classe Fonction_utilisateur * *********************************************/
/* Fonctions définies par l'utilisateur **************************************/
/* ***************************************************************************/

function Fonction_utilisateur() { /*******************************************/
    this.code='';
    this.nom='';
    this.nbarg=0;
    this.maxiarg=0;
    this.style='p';
    this.ret=0;
    this.priorite=5;
    this.tokens=[];
    this.args=[];
    this.phase = 0;
    this.action=f_procedure;
} // Fonction_utilisateur

Fonction_utilisateur.prototype.add = function(t) { /**************************/
        switch (this.phase) {
            case 0 : if ((t.type == 'mot') && (t.procedure) && (t.procedure.code=='POUR')) {
                        this.phase=1;
                     } else return this.erreur(t,'pour attendu',new Error().stack);
                     break;
            case 1 : if (t.type=='eol') return;
                     if (t.type=='mot') {
                        this.nom=t.nom;this.code=sans_accent(this.nom);
                        this.phase=2;                        
                    } else return this.erreur(t,'nom attendu',new Error().stack);        
                    break;
            case 2 : if (t.type=='eol') return;
                     if (t.type=='variable') {
                         this.args.push(t);
                         this.nbarg++;
                         this.maxiarg=this.nbarg;
                     } else
                     if (t.type=='liste') {
                         this.phase=3;
                         this.add(t);
                     } else {
                         this.phase=4;
                         this.add(t);
                     }
                     break;
            case 3 : if (t.type=='liste') {
                        this.args.push(t);
                        this.maxiarg++;
                     } else {
                         this.phase=4;
                         this.add(t);                         
                     }
            case 4 : if ((t.type == 'mot') && (t.procedure) && (t.procedure.code=='FIN')) {
                        // Le token 'eop' force la finalisation de la procedure
                        this.tokens.push(new Token('eop',''));
                        this.phase = 5;                        
                     } else {
                        this.tokens.push(t);
                        if ((t.procedure) && (t.procedure.code=='RETOURNE')) {this.ret=1;}
                     }
                     break;                     
        }
} // add

Fonction_utilisateur.prototype.erreur = function(t,s,cpl) { /*****************/
        var err = new Token('erreur',s);
        err.origine = 'analyse'; 
        if (t) {
            err.ligne = t.ligne;
            err.colonne = t.colonne;  
        }
        if (cpl) err.exdata=cpl; else err.exdata = t;                                              
        return err;
} // erreur

Fonction_utilisateur.prototype.toString = function() { /**********************/
    var s,i;
    s = 'Fonction POUR '+this.nom+' ';
    for (i=0;i<this.args.length;i++) {
        s+=':'+this.args[i].nom+' ';
    }
    s+='\n';
   for (i=0;i<this.tokens.length;i++) {
        s+='\t'+this.tokens[i].nom+'\n';
    }  
    s+='FIN\n';  
    return s;
} // tostring

/* ***************************************************************************/
/* Classe Procedure * ********************************************************/
/* ***************************************************************************/
 
function Procedure(code,noms,nbarg_mini,nb_arg_maxi,style,ret,p,action) {
    this.code = code; // Nom 'standard' de la procedure. Identique dans toutes les langues
    this.noms = noms; //  Noms de la procedure, avec les synonymes (par exemple 'avance', 'av')    
    this.nbarg = nbarg_mini; // Nombre d'arguments    
    this.maxiarg = nb_arg_maxi;
    this.style = style;  // Style prefixe (p) ou infix (i)
    this.ret = ret; // Nombre d'arguments renvoyés (1 pour une fonction, 0 pour une procedure)
    this.priorite = p; /* priorite de l'operateur.  
                                                     5 : ordre tortue (AV, TD...)
                                                    10 : addition/soustraction
                                                    20 : multiplication/division
                                                    30 : puissance 
                                                    50 : ordre sans argument (VE, STOP...)  */
    this.action = action;
    this.type_params='*';
}

/* ***************************************************************************/
/* Classe Point * ************************************************************/
/* ***************************************************************************/

function Point(x,y) { /*******************************************************/
    this.x = x;
    this.y = y;
} // Point








