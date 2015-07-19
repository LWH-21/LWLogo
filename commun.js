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

if (!Math.log10) { /**********************************************************/
    Math.log10 = function(x) {
        return Math.log(x) / Math.LN10;
    }
} // Math.log10

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { /***/
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
} // roundRect

CanvasRenderingContext2D.prototype.floodfill = function(x,y,fillcolor,width,height) {
    var w,e,j,n,w2=width*4;
    var imgData = this.getImageData(0, 0, width, height);
    var pixelPos = (y * width + x) * 4;
    var pixelCol = {r:imgData.data[pixelPos], g:imgData.data[pixelPos+1], b:imgData.data[pixelPos+2], a:imgData.data[pixelPos+3]};     
    this.fillStyle = fillcolor;
    fillcolor = {r:parseInt(this.fillStyle.substring(1,3), 16), g:parseInt(this.fillStyle.substring(3,5), 16), b:parseInt(this.fillStyle.substring(5), 16), a:255};
    var pile = [];
    pile.push(pixelPos);    
    while (pile.length) {
        pixelPos = pile.pop();        
        if ( (imgData.data[pixelPos]===pixelCol.r) && (imgData.data[pixelPos+1]===pixelCol.g) && (imgData.data[pixelPos+2]===pixelCol.b) && (imgData.data[pixelPos+3]===pixelCol.a)) {
            w = pixelPos;e=pixelPos;
            while ( (imgData.data[w]===pixelCol.r) && (imgData.data[w+1]===pixelCol.g) && (imgData.data[w+2]===pixelCol.b) && (imgData.data[w+3]===pixelCol.a)) w-=4;w+=4;
            while ( (imgData.data[e]===pixelCol.r) && (imgData.data[e+1]===pixelCol.g) && (imgData.data[e+2]===pixelCol.b) && (imgData.data[e+3]===pixelCol.a)) e+=4;e-=4;
            for (j=w;j<=e;j+=4) {
                 imgData.data[j]=fillcolor.r;
                 imgData.data[j+1]=fillcolor.g;
                 imgData.data[j+2]=fillcolor.b;                 
                 imgData.data[j+3]=fillcolor.a;
                 n=j-w2;
                 if ((n>0) && (imgData.data[n]===pixelCol.r) && (imgData.data[n+1]===pixelCol.g) && (imgData.data[n+2]===pixelCol.b) && (imgData.data[n+3]===pixelCol.a)) {pile.push(n);};                 
                 n=j+w2;
                 if ( (imgData.data[n]===pixelCol.r) && (imgData.data[n+1]===pixelCol.g) && (imgData.data[n+2]===pixelCol.b) && (imgData.data[n+3]===pixelCol.a)) {pile.push(n);};
            }
        }
    }
    this.putImageData(imgData,0,0);
}

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

/* Teste si les paramètres sont acceptables par le token *********************/
function test_params(interpreteur,token,params) { /* *************************/
    var ret,exp,i,j,k,err;
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
                k=0;                
                do {
                    k++;err = false;
                    switch (exp.charAt(j)) {
                        case '*'    : break;
                        case 'b'    : if (! params[i].est_booleen()) {
                                        ret = erreur(token,'booleen',new Error().stack,params);
                                        ret.origine='eval';
                                        err=true;
                                      }
                                      break;
                        case 'c'    : if (! params[i].est_couleur())  {
                                        ret = erreur(token,'couleur',new Error().stack,params);
                                        ret.origine='eval';
                                        err=true;
                                      }
                                      break;
                        case 'l'    : if (! params[i].est_liste()) {
                                            ret = erreur(token,'liste',new Error().stack,params);
                                            ret.origine='eval';
                                            err=true;
                                      }
                                      break;
                        case 'n'    : if (! params[i].est_nombre()) {
                                        ret = erreur(token,'nombre',new Error().stack,params);
                                        ret.origine='eval';
                                        err=true;
                                      }
                                      break;
                       default      :
                    }
                    if (err) {                        
                        if (params[i].type='mot') {
                            var e = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                            var ret = e.interpreter(params[i].nom,params[i].ligne,params[i].colonne);
                            if ((ret) && (ret.type=='erreur')) {
                                ret = erreur(token,'liste',new Error().stack,params);
                                ret.origine='eval';
                                return ret;
                            } 
                            while (! e.termine) {
                                ret = e.interprete();  
                                if ((ret) && (ret.type=='erreur')) {
                                    ret = erreur(token,'liste',new Error().stack,params);
                                    ret.origine='eval';
                                    return ret;
                                }                                             
                            }
                            if (e.pile_arg.length>0)  {
                                params[i] = e.pile_arg[0]; 
                            }
                        }                        
                    }
                } while ((k<2) && (err)) 
                if (err) { return ret };
                
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
        case 'comment'    : this.valeur=nom.rtrim();
                            break;
        case 'cont'          : break;
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
        case 'mot'        : this.valeur = this.nom;this.nom = this.nom.toLowerCase();this.nom = sans_accent(this.nom);break;
        case 'nombre'     : this.valeur = this.nom;break;
        case 'booleen'    : this.valeur = this.nom;break;
        case 'operateur'  : this.valeur = null;break;
        case 'parenthese' : this.valeur = null;break;
        case 'symbole'    : this.valeur = this.nom;
                            // Les majuscules évitent la confusion avec un mot-clé de Javascript
                            if (this.nom[0]==='"') { this.nom = this.nom.substr(1); } this.nom = sans_accent(this.nom);this.nom=this.nom.toUpperCase();break;
        case 'variable'   : //this.valeur = '';
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

Token.prototype.exporte = function (logo) { /*************************************/  
    var espace = String.fromCharCode(160);
    switch (this.type) {
        case 'cont'       : return '';break;
        case 'comment'    : return '; '+this.valeur.trim();break;
        case 'eof'        : return '{BR}'+espace+'\n';break;
        case 'eol'        : return '{BR}'+espace+'\n';break;
        case 'eop'        : return ' ';break;
        case 'erreur'     : return '';break;
        case 'evenement'  : return this.nom;break;
        case 'liste'      : var lex = new Analyse_lexicale(this.LWlogo);
                            var s = lex.exporte(logo,this.valeur);
                            return '['+espace+s+espace+']';break;
        case 'mot'        : if (this.procedure) {
                                return '{'+this.procedure.code+'}';
                            } else return this.nom;break;
        case 'nombre'     : return this.valeur;break;
        case 'booleen'    : if (this.valeur) return '{VRAI}'; else return '{FAUX}';
                            break;
        case 'operateur'  : switch (this.nom) {
                                case '>'  : return '{0PG}';break;
                                case '<'  : return '{0PP}';break;
                                case '>=' : return '{0PGE}';break;
                                case '<=' : return '{0PPE}';break;
                                case '<>' : return '{0NEG}';break;
                                case '&'  : return '{0ET}';break;
                                case '|'  : return '{0OU}';break;
                                default : return this.nom;break;
                            }
                            break;
        case 'parenthese' : return this.nom;break;
        case 'symbole'    : return ''+this.valeur;break;
        case 'variable'   : return ':'+this.nom;break;
        default           : return '';
    }
} // toString

Token.prototype.longueur = function () { /************************************/
    var lg = 0,s;
    switch (this.type) {
        case 'cont'          :
        case 'comment'    :
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
        case 'cont'          : return this.type;break;
        case 'comment'    : break;
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
        case 'cont'          : return this.type;break;
        case 'comment'    : return this.valeur;break;
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
    var s;
    switch (this.type) {
        case 'cont'          : return this.type;break;
        case 'comment'    : return this.valeur;break;
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
                            s = this.valeur;                            
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

/* ***************************************************************************/
/* Classe AAB * **************************************************************/
/* ***************************************************************************/

function AAB(x,y,w,h) { /*****************************************************/
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.x1=x+w;
    this.y1=y+h;
} // Point





