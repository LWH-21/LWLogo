"use strict";

function test_params(interpreteur,token,params) {       
    var ret,exp,i,j,s; 
    if ((!token) || (!token.procedure)) {
        ret = erreur(token,'inconnu',new Error().stack);   
        ret.origine='eval';
        return ret;
    }
    s=token.valeur+' ';
    if (params.length<token.procedure.nbarg) {
        ret= erreur(token,'nombre_parametres',new Error().stack);
        ret.origine = 'eval';
        ret.valeur = s; 
        return s;
    }
    for (i=0;i<token.procedure.nbarg;i++) {
        if (! params[i]) {
             s=s+' nul';
             ret = erreur(token,'null',new Error().stack); 
             ret.origine = 'eval';
             ret.valeur = s;
             return ret;
        }
        s=s+params[i].valeur+' ';
        exp = token.procedure.type_params;
        if (exp) {
            j = exp.length - 1;        
            if (j>=0) {
                if (j > i) j=i;
                switch (exp.charAt(j)) {
                    case '*'    : break;
                    case 'n'    : if (! params[i].est_nombre()) {
                                    ret = erreur(token,'nombre',new Error().stack);
                                    ret.origine='eval';
                                    ret.valeur = s;
                                    return ret;
                                  }
                                  break;
                    case 'l'    : if (! params[i].est_liste()) {
                                    ret = erreur(token,'liste',new Error().stack);
                                    ret.origine='eval';
                                    ret.valeur = s;
                                    return ret;
                                  }
                                  break; 
                    case 'b'    : if (! params[i].est_booleen()) {
                                    ret = erreur(token,'booleen',new Error().stack);
                                    ret.origine='eval';
                                    ret.valeur = s;
                                    return ret;
                                  }
                                  break;                              
                   default      : 
                }
            }        
        }
    }
}    

function f_donne(interpreteur,token,params) {
    // Creation variable globale   
    var i = interpreteur;
    while (i.parent) i=i.parent;
    if (i) {        
        var ret = new Token('variable',':'+params[0].nom,params[0].valeur,token.ligne,token.colonne);
        ret.valeur = params[1].valeur;        
        i.contexte.ajoute(ret);    
    }
    return;
}

function f_math(interpreteur,token,params) {
    var ret,s,i,n,v;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        if (params[i].numero<token.numero) v=params[i].valeur+' '+v; else v=v+params[i].valeur+' ';
    }
    i=0;s=0;n=0;
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
                case 'SIN'  :   s = Math.sin(params[i].valeur);
                                break;
                case 'COS'  :   s = Math.cos(params[i].valeur);
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
        if (isNaN(s) || (! isFinite(s))) {
            ret = erreur(params[i],'evaluation',new Error().stack); 
            ret.origine='eval';
            ret.valeur = v;
            ret.cpl = interpreteur;
            return ret;            
        }
        i++;
    }           
    var ret = new Token('nombre',s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
}

function f_logique(interpreteur,token,params) {
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
                    case 'ET'   :   if (i==0) s=params[0].valeur; else s = s && params[i].valeur;
                                    break;
                    case 'NON'  :   s = ! params[i].valeur;
                                    break                                    
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
}

function f_compare(interpreteur,token,params) {
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
                    case 'EGAL' :   if (i==1) s=params[0].valeur == params[1].valeur;
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
}


function f_tortue(interpreteur,token,params) {

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
}

function f_si(interpreteur,token,params) {       
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
        //if ((interpreteur.dernier_token.type!=='eop') && (! interpreteur.analyseur_lexical.fin_analyse)) interpreteur.analyseur_lexical.back(1);
        interpreteur.dernier_token = new Token('eop','');               
    } else if (token.procedure.code=='SINON') {
        interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);                      
        ret=interpreteur.enfant.interpreter(params[2].valeur,params[2].ligne,params[2].colonne);                               
        if ((ret) && (ret.type=='erreur')) {
            return ret;
        }        
        //if ((interpreteur.dernier_token.type!=='eop') && (! interpreteur.analyseur_lexical.fin_analyse)) interpreteur.analyseur_lexical.back(1);
        interpreteur.dernier_token = new Token('eop','');    
    }
    return ;
}

function f_liste(interpreteur,token,params) {
    var ret,s,i,n,v,t,tr;   
    v=token.nom+' ';
    for (i=0;i<params.length;i++) {
        s = params[i].valeur;
        if (params[i].est_liste()) s='['+s+']';
        if (params[i].est_mot()) s='"'+s;
        if (params[i].numero<token.numero) v=s+' '+v; else v=v+s+' ';
    }
    i=0;s='';n=0;
    tr='mot';
    while (i<params.length) {
        if (params[i].numero>n) n = params[i].numero;
        try {
            switch (token.procedure.code) {
                case 'COMPTE': if (params[0].est_liste()) t = params[0].valeur.trim().split(/[\s,]+/);
                                else t = params[0].valeur.split('');                                    
                                s=t.length;
                                tr='nombre';                     
                                break;                 
                case 'DERNIER': if (params[0].est_liste()) t = params[0].valeur.trim().split(/[\s,]+/);
                                else t = params[0].valeur.split('');                                    
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
                                    if (params[1].est_liste()) t = params[1].valeur.trim().split(/[\s,]+/);
                                    else t = params[1].valeur.split('');
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
                case 'PREMIER': if (params[0].est_liste()) t = params[0].valeur.trim().split(/[\s,]+/);
                                else t = params[0].valeur.split('');                                    
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
                                    t = params[0].valeur.trim().split(/[\s,]+/);
                                    tr='liste';
                                } else t = params[0].valeur.split('');                                    
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
                                    t = params[0].valeur.trim().split(/[\s,]+/);
                                    tr='liste';
                                } else t = params[0].valeur.split('');                                    
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
    if ((! s) || (s=='')) {
        ret = erreur(params[i],'evaluation',new Error().stack); 
        ret.origine='eval'   
        ret.valeur=v;         
        ret.cpl = interpreteur;                                 
        return ret;        
    }           
    ret = new Token(tr,s,'!');
    ret.numero = n;
    ret.origine='eval' 
    return ret;
}

function f_exec(interpreteur,token,params) {   
    var ret,exp,i,j,v,p,inter; 
    switch (token.procedure.code) {
        case 'EXEC' :   interpreteur.enfant = new Interpreteur(interpreteur.ID,interpreteur.LWlogo,interpreteur);
                        ret = interpreteur.enfant.interpreter(params[0].valeur,params[0].ligne,params[0].colonne,params[0]);   
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
}

function f_repete(interpreteur,token,params) {   
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
}

function f_procedure(interpreteur,token,params) {     
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
}

function f_compteur(interpreteur,token,params) {     
    var t = new Token('variable',':$-compteur');    
    var ret;    
    ret = interpreteur.get(t); 
    ret.numero = token.numero;    
    ret.exdata='!';
    return ret;   
}

function f_e_s(interpreteur,token,params) {
    console.log(params[0].valeur);
    window.alert(params[0].valeur);
}

function f_stop(interpreteur,token,params) {    
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
}
