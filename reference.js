/* ***************************************************************************/
/* Reference  ****************************************************************/
/* Description du langage et des fonctions                                   */
/* JSLint 20150609                                                           */
/* ***************************************************************************/
"use strict";

/* Messages d'erreurs */


function Reference() { /******************************************************/

    /* Procedures du langage */
    this.procedures = [];
    this.procedures_util = [];

    /* Libellés */

    this.libelle = {
        crayon: 'Crayon :',
        encours: 'En cours',
        enpause: 'En pause.',
        pile   : 'Taille de la pile :',
        statut : 'Statut de la tortue : '
    };

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
      CHOIX : {std:['choix']},
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
      ENLEVE : {std:['enleve']},
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
      INIT : {std:['init!']},
      INVERSE : {std:['inverse']},
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
      METSDERNIER : {std : ['metsdernier','md']},
      METSPREMIER : {std : ['metspremier','mp']},
      MONTRE : {std:['montre']},
      MONTRETORTUE : {std:['montretortue','mto']},
      MOT  : {std:['mot']},
      MOTQ : {std:['mot?']},
      MUR : {std:['mur&']},
      NETTOIE : {std:['nettoie']},
      NOIR : {std:['noir']},
      NOMBREQ : {std:['nombre?']},
      NON : {std:['non']},
      ORIGINE : {std:['origine']},
      OU : {std:['ou']},
      PI : {std:['pi']},
      PHRASE : {std:['phrase']},
      POS: {std:['pos']},
      POUR: {std:['pour']},
      PREMIER: {std:['premier','prem']},
      PRODUIT: {std:['produit']},
      PUISSANCE: {std:['puissance']},
      QUOTIENT: {std:['quotient']},
      RACINE: {std:['racine']},
      RE : {std:['recule','re']},
      REPETE : {std:['repete']},
      REPETEPOUR : {std:['repetepour']},
      RESTE : {std:['reste']},
      RETOURNE : {std:['retourne','rapporte','rends']},
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

    //   num       code,   mini_arg,   maxi_arg,   style,  ret,    priorite,   action           arguments attendus. *=nimp, n=nombre, b=booleen, l=liste, m=mot, w=mot ou liste, c=couleur

    this.add('t01',   'AV',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t02','ATTENDS', 1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t03',   'BC',   0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t04','CACHETORTUE',0,       0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t05',  'CAP',   0,          0,          'p',    1,     50,          f_tortue,       '*');
    this.add('t06','ETIQUETTE',1,         1,          'p',    1,      5,          f_tortue,       '*');
    this.add('t07', 'FCC',    1,          1,          'p',    1,      5,          f_tortue,       'l');
    this.add('t08', 'FTC',    1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t09', 'FIXECAP',1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t10', 'FIXEPOS',1,          1,          'p',    1,      5,          f_tortue,       'l');
    this.add('t11',   'FIXEX',1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t12',  'FIXEXY',2,          2,          'p',    1,      5,          f_tortue,       'n');
    this.add('t13',   'FIXEY',1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t14',   'LC',   0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t15','MONTRE',  1,      99999,          'p',    1,      5,          f_tortue,       '*');
    this.add('t16','MONTRETORTUE',0,      0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t17','NETTOIE' ,0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t18', 'ORIGINE',0,          0,          'p',    1,      5,          f_tortue,       '*');
    this.add('t19',  'POS',   0,          0,          'p',    1,     50,          f_tortue,       '*');
    this.add('t20',   'TD',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t21',   'TG',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t22',   'RE',   1,          1,          'p',    1,      5,          f_tortue,       'n');
    this.add('t23',   'VE',   0,          0,          'p',    1,      5,          f_tortue,       '*');

    this.add('c01','BLANC',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c02','BLEU',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c03','BRUN',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c04','CYAN',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c05','GRIS',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c06','JAUNE',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c07','MAGENTA', 0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c08','NOIR',    0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c09','ROUGE',   0,          0,          'p',    1,     50,          f_couleur,      'n');
    this.add('c10','VERT',    0,          0,          'p',    1,     50,          f_couleur,      'n');

    this.add('m01','HASARD',  1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m02','SOMME',   2,      99999,          'p',    1,     20,          f_math,         'n');
    this.add('m03','DIFFERENCE',2,    99999,          'p',    1,     10,          f_math,         'n');
    this.add('m04','MOINS',   1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m05','PRODUIT', 2,      99999,          'p',    1,     20,          f_math,         'n');
    this.add('m06','RESTE',   2,          2,          'p',    1,     20,          f_math,         'n');
    this.add('m07','ARRONDI', 1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m08','RACINE',  1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m09','PI',      0,          0,          'p',    1,     50,          f_math,         'n');
    this.add('m10','PUISSANCE',2,     99999,          'p',    1,     20,          f_math,         'n');
    this.add('m11','LOG10',   1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m12','SIN',     1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m13','COS',     1,          1,          'p',    1,     20,          f_math,         'n');
    this.add('m14','QUOTIENT',2,      99999,          'p',    1,     20,          f_math,         'n');
    this.add('m15','+',       2,          2,          'i',    1,     10,          f_math,         'n');
    this.add('m16','*',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('m17','-',       2,          2,          'i',    1,     10,          f_math,         'n');
    this.add('m18','/',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('m19','%',       2,          2,          'i',    1,     20,          f_math,         'n');
    this.add('m20','^',       2,          2,          'i',    1,     20,          f_math,         'n');

    this.add('l01','CHOIX',   1,          1,          'p',    1,      5,          f_liste,        'w');
    this.add('l02','COMPTE',  1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('l03','DERNIER', 1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('l04','ENLEVE',  2,          2,          'p',    1,      5,          f_liste,       '*l');
    this.add('l05','INVERSE', 1,          1,          'p',    1,      5,          f_liste,        'w');
    this.add('l06','ITEM',    2,          2,          'p',    1,      5,          f_liste,       'nw');
    this.add('l07','LISTE',   1,      99999,          'p',    1,     10,          f_liste,        '*');
    this.add('l08','METSDERNIER', 2,      2,          'p',    1,     10,          f_liste,       '*l');
    this.add('l09','METSPREMIER', 2,      2,          'p',    1,     10,          f_liste,       '*l');
    this.add('l10','MELANGE', 1,      99999,          'p',    1,     10,          f_liste,        'l');
    this.add('l11','MOT',     1,      99999,          'p',    1,     10,          f_liste,        '*');
    this.add('l12','PHRASE',  1,      99999,          'p',    1,     10,          f_liste,        '*');
    this.add('l13','PREMIER', 1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('l14','SD',      1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('l15','SP',      1,          1,          'p',    1,     10,          f_liste,        'w');
    this.add('l16','VIDEQ',   1,          1,          'p',    1,     10,          f_liste,        'w');

    this.add('L01','VRAI',    0,          0,          'p',    1,     50,          f_logique,      'b');
    this.add('L02','FAUX',    0,          0,          'p',    1,     50,          f_logique,      'b');
    this.add('L03','ET',      2,      99999,          'p',    1,     20,          f_logique,      'b');
    this.add('L04','&',       2,          2,          'i',    1,     20,          f_logique,      'b');
    this.add('L05','OU',      2,      99999,          'p',    1,     10,          f_logique,      'b');
    this.add('L06','|',       2,          2,          'i',    1,     20,          f_logique,      'b');
    this.add('L07','NON',     1,          1,          'p',    1,     10,          f_logique,      'b');

    this.add('O01','=',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O02','>',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O03','<',       2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O04','<>',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O05','<=',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O06','>=',      2,          2,          'i',    1,     10,          f_compare,      '*');
    this.add('O07','EGALQ',   2,          2,          'p',    1,     10,          f_compare,     '**');

    this.add('Q01','LISTEQ',  1,          1,          'p',    1,     20,          f_predicat,     '*');
    this.add('Q02','MOTQ',    1,          1,          'p',    1,     20,          f_predicat,     '*');
    this.add('Q03','NOMBREQ', 1,          1,          'p',    1,     20,          f_predicat,     '*');

    this.add('D01','EXECUTE', 1,          1,          'p',    1,     10,          f_exec,          'l');
    this.add('D02','JUSQUA',  2,          2,          'p',    0,     10,          f_exec,         'll');
    this.add('D03','TANTQUE', 2,          2,          'p',    0,     10,          f_exec,         'll');
    this.add('D04','REPETE',  2,          2,          'p',    0,     10,          f_exec,         'nl');
    this.add('D05','REPETEPOUR', 2,       2,          'p',    0,     10,          f_exec,         'll');
    this.add('D06','SI',      2,          2,          'p',    0,     10,          f_si,           'bl');
    this.add('D07','SINON',   3,          3,          'p',    0,     10,          f_si,          'bll');
    this.add('D08','COMPTEUR',0,          0,          'p',    1,     50,          f_compteur,      '*');
    this.add('D09','CHOSE',   1,          1,          'p',    1,     50,          f_variable,      'm');
    this.add('D10','DONNE',   2,          2,          'p',    0,      5,          f_variable,     'm*');
    this.add('D11','DONNELOCALE',2,       2,          'p',    0,      5,          f_variable,     'm*');
    this.add('D12','LOCALE',  1,      99999,          'p',    0,      5,          f_variable,      'm');
    this.add('D13','(',       0,          0,          'i',    0,      0,          null,            '*');
    this.add('D14', 'POUR',   0,          0,          'p',    0,     50,          null,            '*');
    this.add('D15',  'FIN',   0,          0,          'p',    0,     50,          null,            '*');
    this.add('D16', 'STOP',   0,          0,          'p',    0,     50,          f_stop,          '*');
    this.add('D17','RETOURNE',1,          1,          'p',    0,      5,          f_stop,          '*');
    
    this.add('E01','$EVT!',   0,          0,          'p',    0,     50,          f_evenement,     '*'); 
    this.add('E02','MUR',     1,          1,          'p',    0,     50,          f_evenement,     'l');        
} // Reference

Reference.prototype.add = function (num,code,mini_arg,maxi_arg,style,ret,priorite,action,type_params) {
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
    p.num = num;
    p.code=code;
    p.type_params = type_params;
    this.procedures.push(p);
}; // add

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
                default :       s='<b>Erreur</b><br>';break;
            }
            if (token.ligne) {s=s+'Ligne: '+token.ligne+' ';}
            if (token.colonne) {s=s+'Colonne: '+token.colonne+'<br>';}
            switch (token.nom) {
                case 'analyse'        : s=s+'Code impossible à analyser.';break;
                case 'argument'     : s=s+'Les arguments ne correspondent pas pour la commande <span class="valencia">'+token.valeur+'</span>';break;
                case 'booleen'      : s=s+'Paramètre de type <booleen> attendu après <span class="valencia">'+token.valeur+'</span>';break;
                case 'caractere non reconnu' : s=s+'Caractère <span class="valencia">'+token.valeur+'</span> non reconnu';break;
                case 'couleur'      :  s=s+'Paramètre de type <couleur> (liste de 3 nombres) attendu après <span class="valencia">'+token.valeur+'</span>';break;
                case 'crochet'      : s=s+'Les crochets ([ - ]) ne correspondent pas';break;
                case 'element vide' : s=s+'Erreur système : Token à nul';break;
                case 'evaluation'   : s=s+'Probleme lors de l evaluation de <span class="valencia">'+token.valeur+'</span>';
                                      if (token.err) {s=s+'<br>'+token.err+'</br>';}
                                      break;
                case 'fin fonction' : s=s+'La fin de la fonction <span class="valencia">'+token.valeur+'</span> n est pas indiquée.';break;
                case 'format numerique' : s=s+'Mauvais format pour le nombre <span class="valencia">'+token.valeur+'</span>';break;
                case 'inconnu'      : s=s+'Je ne connais pas <span class="valencia">'+token.valeur+'</span>';break;
                case 'init'         : s=s+'L appel à  <span class="valencia">'+token.valeur+'</span> doit se faire dans une fonction d initialisation.';
                case 'liste'        : s=s+'Paramètre de type <liste> attendu après <span class="valencia">'+token.valeur+'</span>';break;
                case 'nombre'       : s=s+'Nombre attendu dans l expression <span class="valencia">'+token.valeur+'</span>';break;
                case 'non trouve'   : s=s+'Je ne connais pas <em>'+token.valeur+'</em>';break;
                case 'nul'            : s=s+'Erreur système. Token à nul';break;
                case 'parenthese'   : s=s+'Probleme de parentheses';break;
                case 'pile vide'    : s=s+'Erreur système : La pile des opérateurs est vide';break;
                case 'procedure dupliquee' : s=s+'La procédure <span class="valencia">'+token.valeur+'</span> a déjà été définie';break;
                case 'procedure imbriquee' : s=s+'Définition imbriquée de procédure';break;
                case 'que faire'    : s=s+'Que faire avec <em>'+token.valeur+'</em> ?';break;
                case 'variable non trouve' : s=s+'Variable <em>'+token.valeur+'</em> non trouvee';break;
                default             : s=s+token.nom;break;
            }
    } else { s='Erreur inconnue'; }
    return s;
}; // erreur


/* ***************************************************************************/
/* Definition des fonctions **************************************************/
/* ***************************************************************************/

/* Fonctions de comparaison **************************************************/
function f_compare(interpreteur,token,params) { /*****************************/
    var ret,s,i,n;
    s=false;
    if (token.procedure.nbarg===0) {
        n = token.numero;
    }
    else {
        i=0;n=0;
        while (i<params.length) {
            if (params[i].numero>n) {n = params[i].numero;}
            try {
                switch (token.procedure.code) {
                    case '='    :   if (i==1) {s=params[0].valeur == params[1].valeur;}
                                   break;
                    case '>'    :    if (i==1) {s=params[0].valeur > params[1].valeur;}
                                   break;
                    case '<'    :   if (i==1) {s=params[0].valeur < params[1].valeur;}
                                    break;
                    case '<>'   :   if (i==1) {s=params[0].valeur != params[1].valeur;}
                                    break;
                    case '<='   :   if (i==1) {s=params[0].valeur <= params[1].valeur;}
                                    break;
                    case '>='   :   if (i==1) {s=params[0].valeur >= params[1].valeur;}
                                    break;
                    case 'EGALQ':   if (i==1) {s=params[0].valeur == params[1].valeur;}
                                    break;
                    default     :   ret = erreur(params[i],'evaluation',new Error().stack);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                }
            }
            catch(err) {
                ret = erreur(params[i],'evaluation',new Error().stack);
                ret.origine='eval';
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
    ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval';
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
    var ret,s,i,n;
    i=0;s=0;n=token.numero;
    if (token.procedure.nbarg===0) {
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
            default         : s='0 0 0';
                            break;
        }
    }
    ret = new Token('liste',s,'!');
    ret.numero = n;
    ret.origine='eval';
    return ret;
} // f_compteur

// Réponse aux évenements survenus à la tortue *******************************/
// Fonctions liées aux évenements ********************************************/
function f_evenement(interpreteur,token,params) { /***************************/
    var i,j,t,e;
    
    
    switch (token.procedure.code) {
    
    case '$EVT!' :  j=interpreteur.LWlogo.reference.procedures_util.length;
                    for (i=0;i<j;i++) {
                        if (interpreteur.LWlogo.reference.procedures_util[i].code === token.nom)  {
                            t=new Token('mot',token.nom);
                            t.procedure = interpreteur.LWlogo.reference.procedures_util[i];
                            break;
                        }
                    }
                    if (t) {
                        e = interpreteur;
                        while (e) { // Pas d'appel récursif pour les événements.
                            if ((e.fonction) && (e.fonction.procedure.code===t.nom)) { return null; }
                            e = e.parent;
                        }
                        return f_procedure(interpreteur,t,params);
                    }
                    return null;
                    break;
    case 'MUR' :    e = interpreteur;
                    var v=[];
                    // L'appel doit obligatoirement se faire depuis une fonction "init!"
                    while ((e.parent) && (! e.fonction)) e=e.parent;
                    t = interpreteur.LWlogo.reference.les_fonctions['INIT'].std[0];
                    if ((! t) || (!e.fonction) || (t!==e.fonction.procedure.code)) {
                        t = erreur(token,'init',new Error().stack);
                        t.origine='eval';
                        t.cpl = interpreteur;
                        return t;                   
                    }
                    // Seule la première tortue peut appeler cette fonction
                    while (e.parent) e=e.parent;
                    if (e.ID !== 0) { return; }
                    e = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                    t = e.interpreter(params[0].valeur,params[0].ligne,params[0].colonne);
                    if ((t) && (t.type=='erreur')) {
                        return ret;
                    }                    
                    while (! e.termine) {
                        t = e.interprete();
                        if ((t) && (t.type=='erreur')) {
                            return t;
                        }
                    }
                    i = 0;
                    while ((i<4) && (e.pile_arg.length>0)) {
                        t = e.pile_arg.pop();
                        if (t) {
                            if (t.type=='erreur') {return t;}
                            if (t.est_nombre()) {
                                v[3-i] = t.valeur;
                                i++;
                            }
                        }
                    }
                    if  (i<4) {
                            r = erreur(token,'evaluation',new Error().stack,params);
                            r.origine='eval';
                            r.cpl = interpreteur;
                            return r;
                    }                                         
                    interpreteur.LWlogo.monde.mur(v);  
                    break;
                    
    }
} // f_evenement

/* Fonction exec, jusqu'a, tant que*******************************************/
function f_exec(interpreteur,token,params) { /********************************/
    var ret,exp,i,j,v,p,inter;
    switch (token.procedure.code) {
        case 'EXECUTE': interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                        ret = interpreteur.enfant.interpreter(params[0].valeur,params[0].ligne,params[0].colonne,token);
                        break;
        case 'REPETE' : p=params[0].clone();
                        p.valeur = Math.floor(params[0].valeur);
                        if ((! p.exdata) || (p.exdata=='!')) {p.exdata=0;}
                        if (p.valeur>0) {
                            p.exdata++;
                            interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                            v = new Token('variable',':$-compteur');
                            v.valeur = p.exdata;
                            v.exdata=='ignore';
                            ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne,params[1]);
                            if ((ret) && (ret.type=='erreur')) {
                                return ret;
                            }
                            interpreteur.enfant.contexte.ajoute(v);
                            if (p.valeur>1) {
                                    p.valeur = p.valeur - 1;
                                    if (interpreteur.dernier_token.type!=='eop') {
                                        if (! interpreteur.analyseur_lexical.fin_analyse) {interpreteur.analyseur_lexical.back(1);}
                                    }
                                    interpreteur.dernier_token = new Token('eop','');
                                    interpreteur.pile_op.push(token);
                                    interpreteur.pile_arg.push(p);
                                    interpreteur.pile_arg.push(params[1]);
                            }
                        }
                        break;
        case 'REPETEPOUR':
                        p = params[0].split();
                        if ((p.length>=3) && (p.length<5)) {
                            v = new Token('variable',':'+p[0]);
                            for (i=1;i<p.length;i++) {
                                if (! isNumber(p[i])) {
                                    ret=erreur(token,'nombre',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                p[i]=parseFloat(p[i]);
                            }
                            v.valeur = p[1];
                            if (v.valeur <= p[2]) {
                                    interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                                    ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne,params[1]);
                                    interpreteur.enfant.contexte.ajoute(v);
                                    if ((ret) && (ret.type=='erreur')) {
                                        return ret;
                                    }
                                    if (p.length==4) {
                                        p[1] = p[1] + p[3];
                                    }  else {
                                        p[1] = p[1] + 1;
                                    }
                                    v = params[0].clone();
                                    v.valeur = ' ';
                                    for (i=0;i<p.length;i++) {
                                        v.valeur=v.valeur+p[i]+' ';
                                    }
                                    v.valeur=v.valeur.trim();
                                    if (interpreteur.dernier_token.type!=='eop') {
                                        if (! interpreteur.analyseur_lexical.fin_analyse) {interpreteur.analyseur_lexical.back(1);}
                                    }
                                    interpreteur.dernier_token = new Token('eop','');
                                    interpreteur.pile_op.push(token);
                                    interpreteur.pile_arg.push(v);
                                    interpreteur.pile_arg.push(params[1]);
                            }
                        } else {
                            ret=erreur(token,'liste',new Error().stack,params);
                            ret.origine='eval';
                            ret.cpl = interpreteur;
                            return ret;
                        }
                        break;
        case 'JUSQUA' :
        case 'TANTQUE': inter = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                        ret = inter.interpreter(params[0].valeur,params[0].ligne,params[0].colonne,params[0]);
                        if ((ret) && (ret == erreur)) {return ret;}
                        while (! inter.termine) {
                            ret = inter.interprete();
                            if ((ret) && (ret.type=='erreur')) {
                                return ret;
                            }
                        }
                        v=null;
                        while ((!v) && (inter.pile_arg.length>0)) {
                            ret = inter.pile_arg.pop();
                            if (ret.est_booleen) {v=ret;}
                        }
                        if (!v) {ret = erreur(params[i],'evaluation',new Error().stack);}
                        if (token.procedure.code=='JUSQUA') {v.valeur = !v.valeur;}
                        if (v.valeur) {
                            interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                            ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne,params[1]);
                            if (interpreteur.dernier_token.type!=='eop') {
                                if (! interpreteur.analyseur_lexical.fin_analyse) {interpreteur.analyseur_lexical.back(1);}
                            }
                            interpreteur.dernier_token = new Token('eop','');
                            interpreteur.pile_op.push(token);
                            interpreteur.pile_arg.push(params[0]);
                            interpreteur.pile_arg.push(params[1]);
                        }
                        break;
            default :   break;

    }
    if ((ret) && (ret.type=='erreur')) {
        return ret;
    }
} // f_exec

/* Fonctions sur les listes **************************************************/
function f_liste(interpreteur,token,params) { /*******************************/
    var ret,s,i,j,n,t,t1,tr,analyseur;
    i=0;s='';n=0;
    tr='?';
    while (i<params.length) {
        if (params[i].numero>n) {n = params[i].numero;}
        try {
            switch (token.procedure.code) {
                case 'CHOIX':   t = params[0].split();
                                if (t.length>0) {
                                    j = Math.floor(Math.random()*t.length);
                                    s = t[j];
                                } else {
                                    ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                break;
                case 'COMPTE':  t = params[0].split();
                                s=t.length;
                                tr='nombre';
                                break;
                case 'DERNIER': t = params[0].split();
                                if (t.length>0) {
                                    s = t[t.length - 1];
                                } else {
                                    ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                break;
                case 'ENLEVE':  if (i==1) {
                                    if (params[1].est_liste()) {
                                        t = params[1].split();
                                        tr='liste';
                                    } else {t = params[1].split();}
                                    if (t.length>0) {
                                        s='';
                                        for (i=0;i<t.length;i++) {
                                            if (t[i] != params[0].valeur) {
                                                s=s+t[i];
                                                if (tr=='liste') {s=s+' ';}
                                            }
                                        }
                                        s=s.trim();
                                    } else {
                                        ret = erreur(token,'evaluation',new Error().stack,params);
                                        ret.origine='eval';
                                        ret.cpl = interpreteur;
                                        return ret;
                                    }
                                }
                                break;
                case 'INVERSE': t = params[0].split();
                                tr=params[0].type;
                                s=''                                
                                for (i=t.length;i>0;i--) {
                                    s=s+t[i - 1];
                                    if (tr==='liste') {s=s+' ';}
                                }
                                s=s.trim(); 
                                break;
                case 'ITEM':    if (i==1) {
                                    t = params[1].split();
                                    params[0].valeur = Math.floor(params[0].valeur - 1);
                                    if ((params[0].valeur>=0) && (t.length>params[0].valeur)) {
                                        s = t[params[0].valeur];
                                    } else {
                                        ret = erreur(token,'evaluation',new Error().stack,params);
                                        ret.origine='eval';
                                        ret.cpl = interpreteur;
                                        return ret;
                                    }
                                }
                                break;
                case 'PHRASE':
                case 'LISTE':   tr='liste';
                                switch(params[i].type) {
                                    case 'cont'       : break;
                                    case 'eof'        : break;
                                    case 'eol'        : break;
                                    case 'eop'        : break;
                                    case 'erreur'     : break;
                                    case 'liste'      : if (token.procedure.code==='LISTE') {
                                                            s=s+' ['+params[i].valeur+']';
                                                        } else {
                                                            s=s+' '+params[i].valeur;
                                                        }
                                                        break;
                                    case 'mot'        : s=s+' '+params[i].toText();break;
                                    case 'nombre'     : s=s+' '+params[i].toText();break;
                                    case 'booleen'    : if (params[i].valeur) {s=s+' VRAI';} else {s=s+' FAUX';} break;
                                    case 'operateur'  : s=s+' '+params[i].nom;break;
                                    case 'parenthese' : s=s+' '+params[i].nom;break;
                                    case 'symbole'    : s=s+' '+params[i].toText();break;
                                    case 'variable'   : s=s+' '+params[i].toText();break;
                                    default           : break;
                                }
                                break;
                case 'MELANGE':
                              tr='liste';
                              t=params[i].split();
                              if (i===0) {
                                t1=t;
                              } else {
                                for (j=0;j<3;j++) {
                                    var a = parseFloat(t1[j]);
                                    var b = parseFloat(t[j]);
                                    t1[j]=Math.sqrt(0.5*Math.pow(a,2)+0.5*Math.pow(b,2));
                                    if (t1[j]<0) {t1[j]=0;}
                                    if (t1[j]>255) {t1[j]=255;}
                                    t1[j] = Math.round(t1[j]);
                                }
                              }
                              if (i==params.length-1) {
                                s='';
                                for (j=0;j<3;j++) {s=s+' '+t1[j];}
                                s=s.trim();
                              }
                              break;
                case 'METSPREMIER' :
                                if (i==1) {
                                    s=params[0].toText()+' '+params[1].valeur;
                                    tr='liste';
                                }
                                break;
                case 'METSDERNIER' :
                                if (i==1) {
                                    s=params[1].valeur+' '+params[0].toText();
                                    tr='liste';
                                }
                                break;
                case 'MOT':   tr='mot';
                                switch(params[i].type) {
                                    case 'cont'       : break;
                                    case 'eof'        : break;
                                    case 'eol'        : break;
                                    case 'eop'        : break;
                                    case 'erreur'     : break;
                                    case 'liste'      : s=s+params[i].valeur;break;
                                    case 'mot'        : s=s+params[i].valeur;break;
                                    case 'nombre'     : s=s+params[i].valeur;break;
                                    case 'booleen'    : if (params[i].valeur) {s=s+'VRAI';} else {s=s+'FAUX';} break;
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
                                    ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                break;
                case 'SP':      if (params[0].est_liste()) {
                                    t = params[0].split();
                                    tr='liste';
                                } else {t = params[0].split();}
                                if (t.length>0) {
                                    s='';
                                    for (i=1;i<t.length;i++) {
                                        s=s+t[i];
                                        if (tr=='liste') {s=s+' ';}
                                    }
                                    s=s.trim();
                                } else {
                                    ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                break;
                case 'SD':      if (params[0].est_liste()) {
                                    t = params[0].split();
                                    tr='liste';
                                } else {t = params[0].split();}
                                if (t.length>0) {
                                    s='';
                                    for (i=0;i<t.length-1;i++) {
                                        s=s+t[i];
                                        if (tr=='liste') {s=s+' ';}
                                    }
                                    s=s.trim();
                                } else {
                                    ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                                }
                                break;
                case 'VIDEQ':   t = params[0].split();
                                s=(t.length===0);
                                tr='booleen';
                                break;
                default     :   ret = erreur(token,'evaluation',new Error().stack,params);
                                ret.origine='eval';
                                ret.cpl = interpreteur;
                                return ret;
            }
        }
        catch(err) {
            ret = erreur(token,'evaluation',new Error().stack,params);
            ret.origine='eval';
            ret.err = err;
            ret.cpl = interpreteur;
            return ret;
        }
        i++;
    }
    ret = new Token(tr,s,'!');
    ret.numero = n;
    ret.origine='eval';
    return ret;
} // f_liste

/* Fonctions logiques : ET, OU... ********************************************/
function f_logique(interpreteur,token,params) { /*****************************/
    var ret,s,i,n;

    s=false;
    if (token.procedure.nbarg===0) {
        n = token.numero;
        switch (token.procedure.code) {
            case 'VRAI' : s = true;break;
            case 'FAUX' : s = false;break;
            default     : s = false;break;
        }
    }
    else {
        i=0;n=0;
        while (i<params.length) {
            if ((! params[i]) || (! params[i].est_booleen)) {
                ret = erreur(token,'booleen',new Error().stack,params);
                ret.origine='eval';
                ret.cpl = interpreteur;
                return ret;
            }
            if (params[i].numero>n) {n = params[i].numero;}
            try {
                switch (token.procedure.code) {
                    case '&'    :
                    case 'ET'   :   if (i===0) {s=params[0].valeur;} else { s = s && params[i].valeur;}
                                    break;
                    case 'NON'  :   s = ! params[i].valeur;
                                    break;
                    case '|'    :
                    case 'OU'   :   if (i===0) {s=params[0].valeur;} else {s = s || params[i].valeur;}
                                    break;
                    default     :   ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                }
            }
            catch(err) {
                ret = erreur(params[i],'evaluation',new Error().stack);
                ret.origine='eval';
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
    ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval';
    return ret;
} // f_logique

/* Fonctions mathematiques ***************************************************/
function f_math(interpreteur,token,params) { /********************************/
    var ret,s,i,n,tr;
    i=0;s=0;n=token.numero;tr='nombre';
    
    if (token.procedure.nbarg===0) {
        switch (token.procedure.code) {
            case 'PI'       : s=Math.PI;
                              break;
            default         : break;
        }
    } else {
        while (i<params.length) {
            if (params[i].numero>n) {n = params[i].numero;}
            try {
                switch (token.procedure.code) {
                    case 'ARRONDI': s = Math.round(params[i].valeur);
                                    break;
                    case 'DIFFERENCE':
                    case '-'    :   if (i===0) {s=params[i].valeur;} else {s = s - params[i].valeur;}
                                    break;
                    case 'HASARD':  s=Math.round(params[i].valeur*Math.random());
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
                    case '*'    :   if (i===0) {s=params[i].valeur;} else {s = s * params[i].valeur;}
                                    break;
                    case 'PUISSANCE':
                    case '^'    :   if (i===0) {s=params[i].valeur;} else {s = Math.pow(s,params[i].valeur);}
                                    break;
                    case 'QUOTIENT':
                    case '/'    :   if (i===0) {s=params[i].valeur;} else { s = s / params[i].valeur;}
                                    break;
                    case 'RACINE':  s= Math.sqrt(params[i].valeur);
                                    break;
                    case '%'    :
                    case 'RESTE':   if (i===1) {s=params[0].valeur % params[1].valeur;} else {s=params[i].valeur;}
                                    break;
                    case '+'    :
                    case 'SOMME' :  s = s+params[i].valeur;
                                    break;
                    default     :   ret = erreur(token,'evaluation',new Error().stack,params);
                                    ret.origine='eval';
                                    ret.cpl = interpreteur;
                                    return ret;
                }
            }
            catch(err) {
                ret = erreur(token,'evaluation',new Error().stack,params);
                ret.origine='eval';
                ret.err = err;
                ret.cpl = interpreteur;
                return ret;
            }
            i++;
        }
    }
    if ( (tr=='nombre') && (isNaN(s) || (! isFinite(s)))) {
        ret = erreur(token,'evaluation',new Error().stack,params);
        ret.origine='eval';
        ret.cpl = interpreteur;
        return ret;
    }
    ret = new Token(tr,s,'!');
    ret.numero = n;
    ret.origine='eval';
    return ret;
} // f_math

function f_predicat(interpreteur,token,params) { /****************************/
    var ret,s,i,n;
    n = token.numero;
    s=false;
    i=0;
    while (i<params.length) {
        if (params[i].numero>n) {n = params[i].numero;}
        switch (token.procedure.code) {
            case 'LISTEQ':  s = params[i].est_liste();
                            break;
            case 'MOTQ':    s= params[i].est_mot();
                            break;
            case 'NOMBREQ' :  s = params[i].est_nombre;
                            break;
            default         : break;
        }
        i++;
    }
    ret = new Token('booleen',s,'!');
    ret.numero = n;
    ret.origine='eval';
    return ret;
} // f_predicat

/* Procedure utilisateur *****************************************************/
function f_procedure(interpreteur,token,params) { /***************************/
    var i,it;
    if ( /*interpreteur.pile_op.length==0 &&*/ interpreteur.parent && interpreteur.dernier_token.est_blanc() && interpreteur.analyseur_lexical.est_termine() ) {
        // Récursivité terminale => récupère de la place sur la pile
        interpreteur.analyseur_lexical.reset();
        interpreteur.analyseur_lexical.tokens = token.procedure.tokens.slice(0);
        interpreteur.analyseur_lexical.fin_analyse=false;
        interpreteur.pile_arg = [];
        interpreteur.fonction = token;
        interpreteur.contexte = new Contexte(interpreteur); 
        it = interpreteur;
    } else {
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
        interpreteur.enfant.fonction = token;
        interpreteur.enfant.analyseur_lexical.tokens = token.procedure.tokens.slice(0);
        it = interpreteur.enfant;
    }

    for (i=0;i<token.procedure.maxiarg;i++) {
        var v = token.procedure.args[i].clone();
        if (i<params.length) {
            if (params[i]) {
                v.valeur = params[i].valeur;
                v.src = params[i];
            }
        }
        it.contexte.ajoute(v);
    }
} // f_procedure

/* Fonctions si, sinon *******************************************************/
function f_si(interpreteur,token,params) { /**********************************/
    var ret,exp,i;

    if (params[0].valeur) {
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
        ret = interpreteur.enfant.interpreter(params[1].valeur,params[1].ligne,params[1].colonne);
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }
        if (interpreteur.dernier_token.type!=='eop') {
            if (! interpreteur.analyseur_lexical.fin_analyse) { interpreteur.analyseur_lexical.back(1); }
        }
        interpreteur.dernier_token = new Token('eop','');
    } else if (token.procedure.code=='SINON') {
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
        ret=interpreteur.enfant.interpreter(params[2].valeur,params[2].ligne,params[2].colonne);
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }

        if (interpreteur.dernier_token.type!=='eop') {
            if (! interpreteur.analyseur_lexical.fin_analyse) {interpreteur.analyseur_lexical.back(1);}
        }

        interpreteur.dernier_token = new Token('eop','');
    }
    return null;
} // f_si

/*****************************************************************************/
function f_stop(interpreteur,token,params) { /********************************/
    var e = interpreteur,c;

    while ((e.parent) && (! e.fonction)) {
        e = e.parent;
    }

    if (e) {
        e.enfant = null;
        e.dernier_token = null;
        e.contexte=null;
        e.analyseur_lexical.reset();
        if (e.fonction) {c=e.fonction.numero;} else {c=token.numero;}
        if (token.procedure.code==='RETOURNE') {
            if (e.fonction) {
                if (e.fonction.procedure.code[0]==='$') return
            }
            if (e.parent) {e=e.parent;}
            if ((params.length>0) && (params[0])) {
                params[0].numero = c;
                e.pile_arg.push(params[0]);
            }
        }
    }
} // f_stop

/* Ordres pour la tortue *****************************************************/
function f_tortue(interpreteur,token,params) { /******************************/

    var v=[],i,j,ret;
    var inter;
    interpreteur.ordre_tortue = true;

    switch (token.procedure.code) {
        case 'MONTRE'   :   for (i=0;i<params.length;i++) {
                                if (params[i]) {v[i] = params[i].toText();}
                            }
                            break;
        case 'FIXEPOS'  :
        case 'FCC'      :   j=2;
                            if (token.procedure.code=='FCC') {j=3;}
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
                                    if (ret.type=='erreur') {return ret;}
                                    if (ret.est_nombre()) {
                                        v[i] = ret.valeur;
                                        i++;
                                    }
                                }
                            }
                            if  (i<j) {
                                ret = erreur(token,'evaluation',new Error().stack,params);
                                ret.origine='eval';
                                ret.cpl = interpreteur;
                                return ret;
                            }
                            break;
        default         :   if (params) {
                                for (i=0;i<params.length;i++) {
                                    if (params[i]) {v[i] = params[i].valeur;}
                                }
                            }
                            break;
    }

    interpreteur.LWlogo.commande(interpreteur,token,v);
    return null;
} // f_tortue

/* Création de variables globales et locales *********************************/
function f_variable(interpreteur,token,params) { /****************************/
    var i,ret,interp;
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
                                // On vérifie d'abord qu'aucune variable locale du même nom existe
                                ret = interpreteur.valorise(ret,'L',params[1]);
                                if (ret.type != 'erreur') {
                                    ret.valeur=params[1].valeur;
                                    ret.src =  params[1];
                                    ret.numero = token.numero;
                                } else {
                                    // Si pas de variable locale, on la créé en globale
                                    interp = interpreteur;
                                    while (interp.parent) {interp=interp.parent;}
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
                                interp = interpreteur;
                                while ((interp.parent) && (!interp.fonction)) {interp=interp.parent;}
                                interpreteur.contexte.ajoute(ret);
                            }
                            break;
            case 'LOCALE':  ret = new Token('variable',':'+params[i].nom,params[i].valeur,token.ligne,token.colonne);
                            ret.valeur = '';
                            ret.numero = token.numero;
                            interp = interpreteur;
                            while ((interp.parent) && (!interp.fonction))  {interp=interp.parent;}
                            break;
            default :       break;
        }
        i++;
    }
    return null;
} // f_variable


