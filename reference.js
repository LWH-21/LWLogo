/* ***************************************************************************/
/* Reference  ****************************************************************/
/* Description du langage et des fonctions                                   */
/* ***************************************************************************/
"use strict";

/* Messages d'erreurs */


function Reference() { /******************************************************/

    /* Procedures du langage */
    this.procedures = [];   
    this.procedures_util = [];
    
    /* Libellés */
    
    this.libelle = {
        encours: 'En cours',
        enpause: 'En pause.',
        pile   : 'Taille de la pile :',
        statut : 'Statut de la tortue : '
    }

    /* Messages d'erreurs */
    this.les_messages = {  
      crochet       : 'Caracteres "[" et "]" non apparies.', 
      inconnu       : 'Caractere non inconnu par le langage',  
      nombre        : 'Ne peux pas interpreter ce nombre',
      type          : 'Type inconnu'
    };
    
    /* Nom des fonctions */
    this.les_fonctions = {
      ARRONDI : {std: ['arrondi'] },
      ATTENDS : {std: ['attends'] },
      AV : {std: ['avance','av']},
      BC : {std: ['baissecrayon','bc']},
      BLANC : {std:['blanc']},
      BLEU : {std: ['bleu']},      
      BRUN : {std:['brun']},
      CACHETORTUE : {std:['cachetortue','cto']},
      CAP :{std:['cap']},
      CHOSE : {std:['chose']},
      COMPTE:{std:['compte']},
      COMPTEUR : {std: ['compteur.r']},
      COS : {std:['cos']},
      CYAN : {std:['cyan']},
      DERNIER : {std:['dernier']},
      DIFFERENCE : {std:['difference']},
      DONNE : {std:['donne']},
      DONNELOCALE : {std:['donnelocale']},
      EGALQ : {std:['egal?']},
      ET : {std:['et']},
      ETIQUETTE : {std:['etiquette']},
      EXECUTE : {std:['execute','exec']},
      FAUX : {std:['faux']},
      FCC : {std:['fixecouleurcrayon','fcc']},
      FIN : {std:['fin']},
      FIXECAP : {std:['fixecap']},
      FIXEPOS : {std:['fixepos']},
      FIXEX : {std:['fixex']},
      FIXEXY : {std:['fixexy']},
      FIXEY : {std:['fixey']},
      FTC : {std:['fixetaillecrayon','ftc']},
      HASARD : {std:['hasard']},
      ITEM : {std:['item']},
      JAUNE : {std:['jaune']},
      JUSQUA : {std:['desque']},
      LC : {std:['levecrayon','lc']},
      LISTE : {std:['liste']},
      LISTEQ : {std:['liste?']},
      LOCALE : {std:['locale']},
      LOG10 : {std:['log10','lg']},
      MAGENTA : {std:['magenta']},
      MOINS : {std:['moins']},
      MELANGE : {std:['melange']},
      MONTRE : {std:['montre']},
      MONTRETORTUE : {std:['montretortue','mto']},
      MOT  : {std:['mot']},
      MOTQ : {std:['mot?']},
      NETTOIE : {std:['nettoie']},
      NOIR : {std:['noir']},
      NOMBREQ : {std:['nombre?']},
      NON : {std:['non']},
      ORIGINE : {std:['origine']},
      OU : {std:['ou']},
      PI : {std:['pi']},
      POS: {std:['pos']},
      POUR: {std:['pour']},
      PREMIER: {std:['premier','prem']},
      PRODUIT: {std:['produit']},
      PUISSANCE: {std:['puissance']},
      QUOTIENT: {std:['quotient']},
      RACINE: {std:['racine']},
      RE : {std:['recule','re']},
      REPETE : {std:['repete']},
      RESTE : {std:['reste']},
      ROUGE : {std:['rouge']},
      SD : {std:['saufdernier','sd']},
      SI : {std:['si']},
      SIN : {std:['sin']},
      SINON : {std:['sinon']},
      SOMME : {std:['somme']},
      SP : {std:['saufpremier','sp']},
      STOP : {std:['stop','stoppe']},
      TANTQUE: {std:['tantque']},
      TD : {std:['droite','td','dr']},
      TG : {std:['gauche','tg','ga']},
      VE : {std:['videecran', 've','nettoietout','nt']},
      VERT : {std:['vert']}, 
      VIDEQ : {std:['vide?']},
      VRAI : {std:['vrai']}          
    };
    
    //          code,   mini_arg,   maxi_arg,   style,  ret,    priorite,   action           arguments attendus. *=nimp, n=nombre, b=booleen, l=liste, m=mot, w=mot ou liste, c=couleur

    this.add(   'AV',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('ATTENDS', 1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add(   'BC',   0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add('CACHETORTUE',0,       0,          'p',    1,      5,          f_tortue,       '*'); 
    this.add(  'CAP',   0,          0,          'p',    1,     50,          f_tortue,       '*'); 
    this.add('ETIQUETTE',1,         1,          'p',    1,      5,          f_tortue,       '*');   
    this.add( 'FCC',    1,          1,          'p',    1,      5,          f_tortue,       'l');    
    this.add( 'FTC',    1,          1,          'p',    1,      5,          f_tortue,       'n');    
    this.add( 'FIXECAP',1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add( 'FIXEPOS',1,          1,          'p',    1,      5,          f_tortue,       'l');
    this.add(   'FIXEX',1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add(  'FIXEXY',2,          2,          'p',    1,      5,          f_tortue,       'n');     
    this.add(   'FIXEY',1,          1,          'p',    1,      5,          f_tortue,       'n'); 
    this.add(   'LC',   0,          0,          'p',    1,      5,          f_tortue,       '*');    
    this.add('MONTRE',  1,          1,          'p',    1,      5,          f_tortue,       '*');   
    this.add('MONTRETORTUE',0,      0,          'p',    1,      5,          f_tortue,       '*'); 
    this.add('NETTOIE' ,0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add( 'ORIGINE',0,          0,          'p',    1,      5,          f_tortue,       '*'); 
    this.add(  'POS',   0,          0,          'p',    1,     50,          f_tortue,       '*'); 
    this.add(   'TD',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add(   'TG',   1,          1,          'p',    1,      5,          f_tortue,       'n'); 
    this.add(   'RE',   1,          1,          'p',    1,      5,          f_tortue,       'n'); 
    this.add(   'VE',   0,          0,          'p',    1,      5,          f_tortue,       '*');

    this.add('BLANC',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('BLEU',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('BRUN',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('CYAN',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('GRIS',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('JAUNE',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('MAGENTA', 0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('NOIR',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('ROUGE',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('VERT',    0,          0,          'p',    1,     50,          f_couleur,      'n');

    this.add('HASARD',  1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('SOMME',   2,      99999,          'p',    1,     10,          f_math,         'n');
    this.add('DIFFERENCE',2,    99999,          'p',    1,     10,          f_math,         'n');
    this.add('MOINS',   1,          1,          'p',    1,      5,          f_math,         'n');
    this.add('PRODUIT', 2,      99999,          'p',    1,     20,          f_math,         'n');
    this.add('RESTE',   2,          2,          'p',    1,     20,          f_math,         'n');
    this.add('ARRONDI', 1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('RACINE',  1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('PI',      0,          0,          'p',    1,     50,          f_math,         'n');
    this.add('PUISSANCE',2,     99999,          'p',    1,     20,          f_math,         'n');
    this.add('LOG10',   1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('SIN',     1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('COS',     1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('QUOTIENT',2,      99999,          'p',    1,     20,          f_math,         'n');   
    this.add('+',       2,          2,          'i',    1,     10,          f_math,         'n'); 
    this.add('*',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('-',       2,          2,          'i',    1,     10,          f_math,         'n');
    this.add('/',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('%',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('^',       2,          2,          'i',    1,     20,          f_math,         'n');

    this.add('COMPTE',  1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('DERNIER', 1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('ITEM',    2,          2,          'p',    1,     10,          f_liste,       'nw');
    this.add('LISTE',   1,      99999,          'p',    1,     10,          f_liste,        '*');
    this.add('MELANGE', 1,      99999,          'p',    1,     10,          f_liste,        'l');
    this.add('MOT',     1,      99999,          'p',    1,     10,          f_liste,        '*');
    this.add('PREMIER', 1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('SD',      1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('SP',      1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('VIDEQ',   1,          1,          'p',    1,     10,          f_liste,        'w');

    this.add('VRAI',    0,          0,          'p',    1,     50,          f_logique,      'b');
    this.add('FAUX',    0,          0,          'p',    1,     50,          f_logique,      'b');
    this.add('ET',      2,      99999,          'p',    1,     20,          f_logique,      'b');
    this.add('&',       2,          2,          'i',    1,     20,          f_logique,      'b');
    this.add('OU',      2,      99999,          'p',    1,     10,          f_logique,      'b');
    this.add('|',       2,          2,          'i',    1,     20,          f_logique,      'b');    
    this.add('NON',     1,          1,          'p',    1,     10,          f_logique,      'b');

    this.add('=',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('>',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('<',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('<>',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('<=',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('>=',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('EGALQ',   2,          2,          'p',    1,     10,          f_compare,     '**'); 

    this.add('LISTEQ',  1,          1,          'p',    1,     20,          f_predicat,     '*'); 
    this.add('MOTQ',    1,          1,          'p',    1,     20,          f_predicat,     '*');
    this.add('NOMBREQ', 1,          1,          'p',    1,     20,          f_predicat,     '*');

    this.add('EXECUTE', 1,          1,          'p',    1,     10,          f_exec,          'l');
    this.add('JUSQUA',  2,          2,          'p',    0,     10,          f_exec,         'll');
    this.add('TANTQUE', 2,          2,          'p',    0,     10,          f_exec,         'll');
    this.add('REPETE',  2,          2,          'p',    0,     10,          f_repete,       'nl');
    this.add('SI',      2,          2,          'p',    0,     10,          f_si,           'bl');
    this.add('SINON',   3,          3,          'p',    0,     10,          f_si,          'bll');
    this.add('COMPTEUR',0,          0,          'p',    1,     50,          f_compteur,      '*');
    this.add('CHOSE',   1,          1,          'p',    1,     50,          f_variable,      'm');  
    this.add('DONNE',   2,          2,          'p',    0,      5,          f_variable,     'm*');  
    this.add('DONNELOCALE',2,       2,          'p',    0,      5,          f_variable,     'm*');  
    this.add('LOCALE',  1,      99999,          'p',    0,      5,          f_variable,      'm');    
    this.add('(',       0,          0,          'i',    0,      0,          null,            '*'); 
    this.add( 'POUR',   0,          0,          'p',    0,     50,          null,            '*');
    this.add(  'FIN',   0,          0,          'p',    0,     50,          null,            '*');
    this.add( 'STOP',   0,          0,          'p',    0,     50,          f_stop,          '*');
} // Reference

Reference.prototype.add = function (code,mini_arg,maxi_arg,style,ret,priorite,action,type_params) {
    var p;
    if (this.les_fonctions[code]) {
        p = new Procedure(code,
                          this.les_fonctions[code].std,
                          mini_arg,
                          maxi_arg,
                          style,
                          ret,
                          priorite,
                          action);
    } else {
        p = new Procedure(code,
                          [code],
                          mini_arg,
                          maxi_arg,
                          style,
                          ret,
                          priorite,
                          action);        
    }    
    p.code=code;
    p.type_params = type_params;
    this.procedures.push(p);
} // add

// Mise en forme de l'erreur pour affichage
Reference.prototype.erreur = function(token) { /******************************/
    var s='';
    if (token) {
            switch (token.origine) {
                case 'analyse' : s='<b>Erreur lors de l analyse</b><br>';
                                 break;
                case 'interprete' :s='<b>Erreur lors de l interpretation</b><br>';
                                 break;
                case 'eval' :    s='<b>Erreur lors de l evaluation</b><br>';
                                 break;
            }                    
            if (token.ligne) s=s+'Ligne: '+token.ligne+' ';
            if (token.colonne) s=s+'Colonne: '+token.colonne+'<br>';
            switch (token.nom) {
                case 'argument' : s=s+'Les arguments ne correspondent pas pour la commande <span class="valencia">'+token.valeur+'</span>';break;
                case 'crochet' : s=s+'Les crochets ([ - ]) ne correspondent pas';break;
                case 'evaluation':s=s+'Probleme lors de l evaluation de <span class="valencia">'+token.valeur+'</span>';
                                  if (token.err) s=s+'<br>'+token.err+'</br>';
                                  break;
                case 'format numerique' : s=s+'Mauvais format pour le nombre <span class="valencia">'+token.valeur+'</span>';break;
                case 'nombre' : s=s+'Nombre attendu dans l expression <span class="valencia">'+token.valeur+'</span>';break;
                case 'non trouve' : s=s+'Je ne connais pas <em>'+token.valeur+'</em>';break;
                case 'parenthese' : s=s+'Probleme de parentheses';break;
                case 'variable non trouve' : s=s+'Variable <em>'+token.valeur+'</em> non trouvee';break;
                default       : s=s+token.nom;
            }
    } else s='Erreur inconnue';
    return s;
} // erreur


/* ***************************************************************************/
/* Definition des fonctions **************************************************/
/* ***************************************************************************/

/* Fonctions de comparaison **************************************************/
function f_compare(interpreteur,token,params) { /*****************************/
    var ret,s,i,n;   
    if ((!token) || (!token.procedure)) {
        ret = erreur(token,'inconnu',new Error().stack);
        ret.origine='eval';
        ret.cpl = interpreteur;
        return ret;       
    }
    if ((params.length<token.procedure.nbarg) || (params.length>token.procedure.maxiarg)) {
        ret = erreur(token,'nombre_parametres',new Error().stack);
        ret.origine='eval';
        ret.cpl = interpreteur;
        return ret;        
    }
    s=false;
    if (token.procedure.nbarg==0) {
        n = token.numero;
    }
    else {    
        i=0;n=0;
        while (i<params.length) {           
            if (params[i].numero>n) n = params[i].numero;
            try {
                switch (token.procedure.code) {
                    case '='    :   if (i==1) s=params[0].valeur == params[1].valeur;
                                   break;
                    case '>'    :    if (i==1) s=params[0].valeur > params[1].valeur;
                                   break;                                   
                    case '<'    :   if (i==1) s=params[0].valeur < params[1].valeur;
                                    break;
                    case '<>'   :   if (i==1) s=params[0].valeur != params[1].valeur;
                                    break;  
                    case '<='   :   if (i==1) s=params[0].valeur <= params[1].valeur;
                                    break;    
                    case '>='   :   if (i==1) s=params[0].valeur >= params[1].valeur;
                                    break;
                    case 'EGALQ':   if (i==1) s=params[0].valeur == params[1].valeur;
                                    break;                                      
                    default     :   ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'            
                                    ret.cpl = interpreteur;                                 
                                    return ret;
                }            
            }
            catch(err) {
                ret = erreur(params[i],'evaluation',new Error().stack); 
                ret.origine='eval'            
                ret.err = err;
                ret.cpl = interpreteur;
                return ret;
            }
            if (isNaN(s) || (! isFinite(s))) {
                ret = erreur(params[i],'evaluation',new Error().stack); 
                ret.origine='eval';
                ret.cpl = interpreteur;
                return ret;            
            }
            i++;
        }  
    }    
    var ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
} // f_compare
  
/* Compteur pour l'instruction repete ****************************************/
function f_compteur(interpreteur,token,params) {     
    var t = new Token('variable',':$-compteur');    
    var ret;    
    ret = interpreteur.get(t); 
    ret.numero = token.numero;    
    ret.exdata='!';
    return ret;   
} // f_compteur

/* Constantes de couleurs ****************************************************/
function f_couleur(interpreteur,token,params) { /*****************************/  
    var ret,s,i,n,v;   
    v=token.toString()+' ';
    for (i=0;i<params.length;i++) {
        if (params[i].numero<token.numero) v=params[i].toString()+' '+v; else v=v+params[i].toString()+' ';
    }
    i=0;s=0;n=token.numero;
    if (token.procedure.nbarg==0) {
        switch (token.procedure.code) {  
            case 'BLANC'    : s='255 255 255';
                              break;         
            case 'BLEU'     : s='0 0 255';
                              break; 
            case 'BRUN'     : s='91 60 17';
                              break;                               
            case 'CYAN'     : s='0 255 255';
                              break;    
            case 'GRIS'     : s='175 175 175';
                              break; 
            case 'JAUNE'    : s='255 255 0';
                              break;                               
            case 'MAGENTA'  : s='255 0 255';
                              break;                              
            case 'NOIR'     : s='0 0 0';
                              break;
            case 'ROUGE'    : s='255 0 0';
                              break;                              
            case 'VERT'     : s='0 255 0';
                              break;                               
        }
    }   
    ret = new Token('liste',s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;  
} // f_compteur

  
/* Fonction exec, jusqu'a, tant que*******************************************/
function f_exec(interpreteur,token,params) { /********************************/  
    var ret,exp,i,j,v,p,inter; 
    switch (token.procedure.code) {
        case 'EXECUTE': interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                        ret = interpreteur.enfant.interpreter(params[0].valeur,params[0].ligne,params[0].colonne,token);   
                        break;
        case 'JUSQUA' :
        case 'TANTQUE': inter = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                        ret = inter.interpreter(params[0].valeur,params[0].ligne,params[0].colonne,params[0]); 
                        if ((ret) && (ret == erreur)) return ret;
                        while (! inter.termine) {
                            ret = inter.interprete();
                            if ((ret) && (ret.type=='erreur')) {                                
                                return ret;
                            }                                
                        }
                        v=null;
                        while ((!v) && (inter.pile_arg.length>0)) {
                            ret = inter.pile_arg.pop();
                            if (ret.est_booleen) v=ret;
                        }
                        if (!v) ret = erreur(params[i],'evaluation',new Error().stack);
                        if (token.procedure.code=='JUSQUA') v.valeur = !v.valeur; 
                        if (v.valeur) {
                            interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                            ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne,params[1]);                               
                            if (interpreteur.dernier_token.type!=='eop') {                
                                var l = interpreteur.pile_fun.length;            
                                if (l==0) {
                                    if (! interpreteur.analyseur_lexical.fin_analyse) interpreteur.analyseur_lexical.back(1);                       
                                } else {
                                    if (interpreteur.pile_fun[l-1].index>0) interpreteur.pile_fun[l-1].index--;                                                        
                                }            
                            }   
                            interpreteur.dernier_token = new Token('eop','');
                            interpreteur.pile_op.push(token);
                            interpreteur.pile_arg.push(params[0]);
                            interpreteur.pile_arg.push(params[1]);
                        }
                        break;
  
    }
    if ((ret) && (ret.type=='erreur')) {
        return ret;
    }  
} // f_exec

/* Fonctions sur les listes **************************************************/
function f_liste(interpreteur,token,params) { /*******************************/
    var ret,s,i,j,n,v,t,t1,tr,analyseur;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        s = params[i].valeur;
        if (params[i].est_liste()) s='['+s+']';
        if (params[i].est_mot()) s='"'+s;
        if (params[i].numero<token.numero) v=s+' '+v; else v=v+s+' ';
    }
    i=0;s='';n=0;
    tr='?';
    while (i<params.length) {
        if (params[i].numero>n) n = params[i].numero;
        try {
            switch (token.procedure.code) {
                case 'COMPTE':  t = params[0].split();                                                            
                                s=t.length;
                                tr='nombre';                     
                                break;                 
                case 'DERNIER': t = params[0].split();                                     
                                if (t.length>0) {
                                    s = t[t.length - 1];
                                } else {
                                    ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'   
                                    ret.valeur=v;         
                                    ret.cpl = interpreteur;                                 
                                    return ret;                                        
                                }                           
                                break;                
                case 'ITEM':    if (i==1) {
                                    t = params[1].split(); 
                                    params[0].valeur = Math.floor(params[0].valeur - 1);
                                    if ((params[0].valeur>=0) && (t.length>params[0].valeur)) {
                                        s = t[params[0].valeur];
                                    } else {
                                        ret = erreur(params[i],'evaluation',new Error().stack); 
                                        ret.origine='eval'   
                                        ret.valeur=v;         
                                        ret.cpl = interpreteur;                                 
                                        return ret;                                        
                                    }                           
                                }
                                break; 
                case 'LISTE':   tr='liste';
                                switch(params[i].type) {
                                    case 'cont'	      : break;
                                    case 'eof'        : break;
                                    case 'eol'        : break;
                                    case 'eop'        : break;
                                    case 'erreur'     : break;
                                    case 'liste'      : s=s+' ['+params[i].valeur+']';break; 
                                    case 'mot'        : s=s+' '+params[i].valeur;break;     
                                    case 'nombre'     : s=s+' '+params[i].valeur;break; 
                                    case 'booleen'    : if (params[i].valeur) s=s+' VRAI'; else s=s+' FAUX';break;
                                    case 'operateur'  : s=s+' '+params[i].nom;break; 
                                    case 'parenthese' : s=s+' '+params[i].nom;break; 
                                    case 'symbole'    : s=s+' '+params[i].valeur;break; 
                                    case 'variable'   : s=s+' '+params[i].valeur;break;
                                    default           : break;                                    
                                }                                
                                break; 
                case 'MELANGE':
                              tr='liste';
                              t=params[i].split();
                              if (i==0) {
                                t1=t; 
                              } else {
                                for (j=0;j<3;j++) {
                                    var a = parseFloat(t1[j]);
                                    var b = parseFloat(t[j]);
                                    t1[j]=Math.sqrt(0.5*Math.pow(a,2)+0.5*Math.pow(b,2));
                                    if (t1[j]<0) t1[j]=0;
                                    if (t1[j]>255) t1[j]=255;
                                    t1[j] = Math.round(t1[j]);
                                }
                              }
                              if (i==params.length-1) {
                                s='';
                                for (j=0;j<3;j++) s=s+' '+t1[j];
                                s=s.trim();
                              }                              
                              break;
                case 'MOT':   tr='mot';
                                switch(params[i].type) {
                                    case 'cont'	      : break;
                                    case 'eof'        : break;
                                    case 'eol'        : break;
                                    case 'eop'        : break;
                                    case 'erreur'     : break;
                                    case 'liste'      : s=s+params[i].valeur;break; 
                                    case 'mot'        : s=s+params[i].valeur;break;     
                                    case 'nombre'     : s=s+params[i].valeur;break; 
                                    case 'booleen'    : if (params[i].valeur) s=s+'VRAI'; else s=s+'FAUX';break;
                                    case 'operateur'  : s=s+params[i].nom;break; 
                                    case 'parenthese' : s=s+params[i].nom;break; 
                                    case 'symbole'    : s=s+params[i].valeur;break; 
                                    case 'variable'   : s=s+params[i].valeur;break;
                                    default           : break;                                    
                                }                                
                                break; 
                case 'PREMIER': t = params[0].split();                                    
                                if (t.length>0) {
                                    s = t[0];                                    
                                } else {
                                    ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'   
                                    ret.valeur=v;         
                                    ret.cpl = interpreteur;                                 
                                    return ret;                                        
                                }                           
                                break;
                case 'SP':      if (params[0].est_liste()) {
                                    t = params[0].split(); 
                                    tr='liste';
                                } else t = params[0].split();                                   
                                if (t.length>0) {
                                    s=''
                                    for (i=1;i<t.length;i++) {
                                        s=s+t[i];
                                        if (tr=='liste') s=s+' ';
                                    }
                                    s=s.trim();
                                } else {
                                    ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'   
                                    ret.valeur=v;         
                                    ret.cpl = interpreteur;                                 
                                    return ret;                                        
                                }  
                                break;
                case 'SD':      if (params[0].est_liste()) {
                                    t = params[0].split(); 
                                    tr='liste';
                                } else t = params[0].split();                                  
                                if (t.length>0) {
                                    s=''
                                    for (i=0;i<t.length-1;i++) {
                                        s=s+t[i];
                                        if (tr=='liste') s=s+' ';
                                    }
                                    s=s.trim();
                                } else {
                                    ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'   
                                    ret.valeur=v;         
                                    ret.cpl = interpreteur;                                 
                                    return ret;                                        
                                }  
                                break;  
                case 'VIDEQ':   t = params[0].split();                                                            
                                s=(t.length==0);
                                tr='booleen';                     
                                break;
                default     :   ret = erreur(params[i],'evaluation',new Error().stack); 
                                ret.origine='eval'   
                                ret.valeur=v;         
                                ret.cpl = interpreteur;                                 
                                return ret;
            }            
        }
        catch(err) {
            ret = erreur(params[i],'evaluation',new Error().stack); 
            ret.origine='eval' 
            ret.valeur = v;           
            ret.err = err;
            ret.cpl = interpreteur;
            return ret;
        }
        i++;
    }        
    /*if ((! s) || (s=='')) {
        ret = erreur(params[i],'evaluation',new Error().stack); 
        ret.origine='eval'   
        ret.valeur=v;         
        ret.cpl = interpreteur;                                 
        return ret;        
    }  */         
    ret = new Token(tr,s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
} // f_liste

/* Fonctions logiques : ET, OU... ********************************************/
function f_logique(interpreteur,token,params) { /*****************************/
    var ret,s,i,n,v;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        if (params[i].numero<token.numero) v=params[i].valeur+' '+v; else v=v+params[i].valeur+' ';
    }    
    s=false;
    if (token.procedure.nbarg==0) {
        n = token.numero;
        switch (token.procedure.code) {
            case 'VRAI' : s = true;break;
            case 'FAUX' : s = false;break;
            default     : s = false;
        }
    }
    else {    
        i=0;n=0;
        while (i<params.length) {
            if ((! params[i]) || (! params[i].est_booleen)) {               
                ret = erreur(params[i],'booleen',new Error().stack);
                ret.origine='eval';
                ret.cpl = interpreteur;
                return ret;
            }    
            if (params[i].numero>n) n = params[i].numero;
            try {
                switch (token.procedure.code) {
                    case '&'    :
                    case 'ET'   :   if (i==0) s=params[0].valeur; else s = s && params[i].valeur;
                                    break;
                    case 'NON'  :   s = ! params[i].valeur;
                                    break
                    case '|'    :
                    case 'OU'   :   if (i==0) s=params[0].valeur; else s = s || params[i].valeur;
                                    break;
                    default     :   ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'            
                                    ret.cpl = interpreteur;   
                                    ret.valeur = v;
                                    return ret;
                }            
            }
            catch(err) {
                ret = erreur(params[i],'evaluation',new Error().stack); 
                ret.origine='eval'            
                ret.err = err;
                ret.valeur = v;
                ret.cpl = interpreteur;
                return ret;
            }
            if (isNaN(s) || (! isFinite(s))) {
                ret = erreur(params[i],'evaluation',new Error().stack); 
                ret.origine='eval';
                ret.cpl = interpreteur;
                ret.valeur = v;
                return ret;            
            }
            i++;
        }  
    }    
    var ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
} // f_logique

/* Fonctions mathematiques ***************************************************/
function f_math(interpreteur,token,params) { /********************************/
    var ret,s,i,n,v,tr;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        if (params[i].numero<token.numero) v=params[i].valeur+' '+v; else v=v+params[i].valeur+' ';
    }
    i=0;s=0;n=token.numero;tr='nombre';
    if (token.procedure.nbarg==0) {
        switch (token.procedure.code) {    
            case 'PI'       : s=Math.PI;
                              break;
        }
    } else {
        while (i<params.length) {
            if (params[i].numero>n) n = params[i].numero;
            try {
                switch (token.procedure.code) {
                    case 'ARRONDI': s = Math.round(params[i].valeur);
                                    break;
                    case 'DIFFERENCE':
                    case '-'    :   if (i==0) s=params[i].valeur; else
                                    s = s - params[i].valeur;
                                    break;  
                    case 'HASARD':  s=Math.round(params[i].valeur*Math.random())
                                    break;
                    case 'SIN'  :   s = Math.sin(params[i].valeur*Math.PI/180);
                                    break;
                    case 'COS'  :   s = Math.cos(params[i].valeur*Math.PI/180);
                                    break;    
                    case 'LOG10':   s = Math.log10(params[i].valeur);
                                    break;
                    case 'MOINS':   s = 0-params[i].valeur;
                                    break;
                    case 'PRODUIT':
                    case '*'    :   if (i==0) s=params[i].valeur; else
                                    s = s * params[i].valeur;
                                    break;   
                    case 'PUISSANCE':
                    case '^'    :   if (i==0) s=params[i].valeur; else
                                    s = Math.pow(s,params[i].valeur);
                                    break;
                    case 'QUOTIENT':
                    case '/'    :   if (i==0) s=params[i].valeur; else
                                    s = s / params[i].valeur;
                                    break;
                    case 'RACINE':  s= Math.sqrt(params[i].valeur);
                                    break;
                    case '%'    :
                    case 'RESTE':   if (i==1) s=params[0].valeur % params[1].valeur; else s=params[i].valeur;
                                    break;
                    case '+'    :
                    case 'SOMME' :  s = s+params[i].valeur;                                    
                                    break;
                    default     :   ret = erreur(params[i],'evaluation',new Error().stack); 
                                    ret.origine='eval'   
                                    ret.valeur=v;         
                                    ret.cpl = interpreteur;                                 
                                    return ret;
                }            
            }
            catch(err) {
                ret = erreur(params[i],'evaluation',new Error().stack); 
                ret.origine='eval' 
                ret.valeur = v;           
                ret.err = err;
                ret.cpl = interpreteur;
                return ret;
            }
            i++;
        }  
    }
    if ( (tr=='nombre') && (isNaN(s) || (! isFinite(s)))) {
        ret = erreur(params[i],'evaluation',new Error().stack); 
        ret.origine='eval';
        ret.valeur = v;
        ret.cpl = interpreteur;
        return ret;            
    }    
    var ret = new Token(tr,s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
} // f_math

function f_predicat(interpreteur,token,params) { /****************************/   
    var ret,s,i,n,v;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        s = params[i].valeur;
        if (params[i].est_liste()) s='['+s+']';
        if (params[i].est_mot()) s='"'+s;
        if (params[i].numero<token.numero) v=s+' '+v; else v=v+s+' ';
    }
    n = token.numero;
    s=false;
    i=0;
    while (i<params.length) {
        if (params[i].numero>n) n = params[i].numero;
        switch (token.procedure.code) {
            case 'LISTEQ':  s = params[i].est_liste();
                            break;
            case 'MOTQ':    s= params[i].est_mot();
                            break;
            case 'NOMBREQ' :  s = params[i].est_nombre;
                            break;
        } 
        i++;                   
    }
    var ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;    
} // f_predicat

/* Procedure utilisateur *****************************************************/
function f_procedure(interpreteur,token,params) { /***************************/     
    var c,l;
    
    var e,i;
    e = interpreteur;
    i = 0;
    while (e.parent) {
        e = e.parent;
        i++;
    }       
    
    if (interpreteur.pile_fun.length>0) {
        c = interpreteur.pile_fun[interpreteur.pile_fun.length - 1];
        if (c.termine()) interpreteur.pile_fun.pop();
    }
    c = new FunContexte(token,params);
    l = interpreteur.pile_fun.length;      

    if (interpreteur.dernier_token.type!=='eop') {        
        if (l==0) {            
            interpreteur.analyseur_lexical.back(1);
        } else {
            if (interpreteur.pile_fun[l-1].index>0) interpreteur.pile_fun[l-1].index--;
        }
    } 
    interpreteur.pile_fun.push(c);     
    interpreteur.dernier_token = new Token('eop','');     
} // f_procedure

/*****************************************************************************/
function f_repete(interpreteur,token,params) { /******************************/
    var ret,exp,i,j,v,p;    
    p=params[0].clone();
    p.valeur = Math.floor(params[0].valeur); 
    if ((! p.exdata) || (p.exdata=='!')) p.exdata=0;
    if (p.valeur>0) {    
                
        p.exdata++;
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
        v = new Token('variable',':$-compteur');
        v.valeur = p.exdata;                
        ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne,params[1]);   
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }
        interpreteur.enfant.contexte.ajoute(v);
        
        if (p.valeur>1) {
                p.valeur = p.valeur - 1;            
                if (interpreteur.dernier_token.type!=='eop') {                
                    var l = interpreteur.pile_fun.length;            
                    if (l==0) {
                        if (! interpreteur.analyseur_lexical.fin_analyse) interpreteur.analyseur_lexical.back(1);                       
                    } else {
                            if (interpreteur.pile_fun[l-1].index>0) interpreteur.pile_fun[l-1].index--;                                                        
                        }            
                }   
                interpreteur.dernier_token = new Token('eop','');
                interpreteur.pile_op.push(token);
                interpreteur.pile_arg.push(p);
                interpreteur.pile_arg.push(params[1]);            
        }        
    }
    return ;
} // f_repete

/* Fonctions si, sinon *******************************************************/
function f_si(interpreteur,token,params) { /**********************************/      
    var ret,exp,i;      
    if (params.length<token.procedure.nbarg) return erreur(token,'nombre_parametres',new Error().stack); 
    if ((! params[0]) || (! params[0].est_booleen)) return erreur(token,'booleen',new Error().stack); 
    if ((! params[1]) || (! params[1].est_liste) || (params[1].type != 'liste')) {
    
        return erreur(token,'liste',new Error().stack); 
        }
    if (token.procedure.nbarg==3) {
        if ((! params[2]) || (! params[2].est_liste) || (params[2].type != 'liste')) return erreur(token,'liste',new Error().stack); 
    }
          
    if (params[0].valeur) {                    
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);                      
        ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne);                               
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }        
        if (interpreteur.dernier_token.type!=='eop') {                
            var l = interpreteur.pile_fun.length;            
            if (l==0) {
                if (! interpreteur.analyseur_lexical.fin_analyse) interpreteur.analyseur_lexical.back(1);                       
            } else {
                    if (interpreteur.pile_fun[l-1].index>0) interpreteur.pile_fun[l-1].index--;                                                        
                }            
        }       
        interpreteur.dernier_token = new Token('eop','');               
    } else if (token.procedure.code=='SINON') {
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);                      
        ret=interpreteur.enfant.interpreter(params[2].valeur,params[2].ligne,params[2].colonne);                               
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }        
        
        if (interpreteur.dernier_token.type!=='eop') {                
            var l = interpreteur.pile_fun.length;            
            if (l==0) {
                if (! interpreteur.analyseur_lexical.fin_analyse) interpreteur.analyseur_lexical.back(1);                       
            } else {
                    if (interpreteur.pile_fun[l-1].index>0) interpreteur.pile_fun[l-1].index--;                                                        
                }            
        }           
        
        interpreteur.dernier_token = new Token('eop','');    
    }
    return ;
} // f_si

/*****************************************************************************/
function f_stop(interpreteur,token,params) { /********************************/    
    var e = interpreteur,c;
        
    while ((e.pile_fun.length==0) && (e.parent)) e = e.parent;
    e.enfant=null;   
   // while (e.parent) e=e.parent;
    // console.log(e.analyseur_lexical.tokens, e.analyseur_lexical.numero);
    if (e.pile_fun.length>0) {
        e.pile_fun.pop();
        /*c = e.pile_fun[e.pile_fun.length - 1];
        c.index = c.token.procedure.tokens.length;        
        var t = e.token_suivant();
        console.log(t);*/
        
    } else {
    //    e.analyseur_lexical.numero = e.analyseur_lexical.tokens.length;
    }       
   // console.log(e.analyseur_lexical.);   
    interpreteur.dernier_token=null;
} // f_stop

/* Ordres pour la tortue *****************************************************/
function f_tortue(interpreteur,token,params) { /******************************/

    var v=[],i,j,ret; 
    var inter;
    interpreteur.ordre_tortue = true;
    
    switch (token.procedure.code) {
        case 'FIXEPOS'  :
        case 'FCC'      :   j=2;
                            if (token.procedure.code=='FCC') j=3;
                            inter = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);                      
                            ret = inter.interpreter(params[0].valeur,params[0].ligne,params[0].colonne);
                            if ((ret) && (ret.type=='erreur')) {                                
                                return ret;
                            }
                            while (! inter.termine) {
                                ret = inter.interprete();
                                if ((ret) && (ret.type=='erreur')) {                                
                                    return ret;
                                }                                
                            }
                            i = 0;                            
                            while ((i<j) && (inter.pile_arg.length>0)) {
                                ret = inter.pile_arg.pop();
                                if (ret) {
                                    if (ret.type=='erreur') return ret;
                                    if (ret.est_nombre()) {
                                        v[i] = ret.valeur;    
                                        i++;
                                    }
                                }
                            } 
                            if  (i<j) {
                                ret = erreur(params[0],'evaluation',new Error().stack);                                
                                ret.valeur = token.valeur+' '+params[0].valeur;
                                ret.origine='eval';
                                ret.cpl = interpreteur;                                
                                return ret;
                            }
                            break;
        default         :   if (params) {
                                for (i=0;i<params.length;i++) {
                                    if (params[i]) v[i] = params[i].valeur;
                                }
                            }
                            break;
    }
    
    interpreteur.LWlogo.commande(interpreteur,token,v);    
    return;     
} // f_tortue

/* Création de variables globales et locales *********************************/
function f_variable(interpreteur,token,params) { /****************************/
    var i,j,ret;    
    i=0;
    while (i<params.length) {        
        switch (token.procedure.code) {
            case 'CHOSE':   ret=new Token('variable',':'+params[0].nom);
                            ret = interpreteur.valorise(ret);
                            ret.numero = token.numero;
                            return ret;
                            break;
            case 'DONNE':   if (i==1) { // Création d'une variable globale                                                                
                                ret=new Token('variable',':'+params[0].nom);
                                ret = interpreteur.valorise(ret,params[1]);                                
                                if (ret.type != 'erreur') {                                    
                                    ret.valeur=params[1].valeur;
                                    ret.src =  params[1]; 
                                    ret.numero = token.numero;                                    
                                } else {
                                    var interp = interpreteur;
                                    while (interp.parent) inter=interp.parent;            
                                    if (interp) {        
                                        ret = new Token('variable',':'+params[0].nom,params[0].valeur,token.ligne,token.colonne);
                                        ret.valeur = params[1].valeur;  
                                        ret.src =  params[1];    
                                        ret.numero = token.numero;
                                        interp.contexte.ajoute(ret);    
                                    } 
                                }
                            }
                            break;
            case 'DONNELOCALE': 
                            if (i==1) {
                                ret = new Token('variable',':'+params[0].nom,params[0].valeur,token.ligne,token.colonne);
                                ret.valeur = params[1].valeur;  
                                ret.src =  params[1];    
                                ret.numero = token.numero;
                                j = interpreteur.pile_fun.length;
                                if (j>0) {
                                    interpreteur.pile_fun[j-1].ctx.ajoute(ret);  
                                } else interpreteur.contexte.ajoute(ret); 
                            }
                            break;                            
            case 'LOCALE':  ret = new Token('variable',':'+params[i].nom,params[i].valeur,token.ligne,token.colonne);
                            ret.valeur = '';  
                            ret.numero = token.numero;
                            j = interpreteur.pile_fun.length;
                            if (j>0) {
                                interpreteur.pile_fun[j-1].ctx.ajoute(ret);  
                            } else interpreteur.contexte.ajoute(ret);    
                            break;
        } 
        i++;                   
    }
    return;
} // f_variable


