/* ***************************************************************************/
/* Tortue 2D basique *********************************************************/
/* ***************************************************************************/
"use strict";

function Tortue(id,nom_canvas, dessin, logo) { /******************************/
    this.ID = id;
    this.LWlogo = logo;
    
    this.canvas = document.getElementById(nom_canvas); 
    this.textCanvas = document.createElement('canvas');    
    
    this.dessin = new Dessin(logo,dessin);
    
    this.cap = 0;
    this.posx = 0;
    this.posy = 0;
       
    this.ordre='';      // Dernier ordre envoye ala tortue
    this.num_ordre = 0;
    this.debut=true;    // Indique que le traitement de l'ordre n'a pas encore commence
    this.param=[];      // Parametres de l'ordre
    this.param_trv=[];  // Copie de travail des parametres
	this.etats =  [];	// Etats de la tortue. Utilisé pour la gestion des événements;
    
    this.crayon_baisse = true;
    this.taille_crayon = 1;
    this.couleur_crayon = "#000000";
    this.font = "Verdana";
    this.fontsize=30;
    
    this.montre_points = false; // Affichage ou non des points utilises pour tester les collisions
    this.points = []; // Points servant au calcul des collisions.
    
    this.visible = true;
    
    this.en_cours=false;
    this.oldx = 0;
    this.oldy = 0;
    this.vitesse = 100;
    this.dessin_tortue = this.dessin_std;
    
    this.bulle = 0;this.oldbulle = 0;
    this.text=[];
    this.temps_affichage = 10000; // affichage des bulles : 10s. par défaut (en milliemes de secondes)
    this.timer=null;
    
    this.style=0;
    this.set_tortue(1);
    
    this.dessin.vide();
    this.draw(); 
} // Tortue

/* Conversion d'un point du repere "tortue au repere "canvas" ****************/
Tortue.prototype.convert = function (x,y) { /*********************************/
    var w = this.canvas.width, h = this.canvas.height;
    x = x + (w / 2);
    y = (h/2) - y ;
    return new Point(x,y);
}; // convert

/* Conversion des points "marquants de la tortue *****************************/
/* Ces points servent à la gestion des collisions                            */
Tortue.prototype.convert_pts = function (pts,xr,yr) { /***********************/    
    var ret = [],i=0,x,y,sin,cos,p,j=pts.length;
    var direction = ((this.cap) * (Math.PI / -180));
    if (!xr) {xr=this.posx;}
    if (!yr) {yr=this.posy;}
    sin = Math.sin(direction);
    cos = Math.cos(direction);
    for (i=0;i<j;i++) {
        x = pts[i].x * cos - pts[i].y*sin ;
        y = pts[i].x * sin +  pts[i].y*cos;
        p = this.convert(x+xr, y+yr);
        ret.push(p);
    }
    return ret;
}; // convert_pts

Tortue.prototype.dessin_robot = function(ctx,points) { /**********************/

    var i;
    ctx.save();

    ctx.lineWidth=1;
    ctx.strokeStyle="#000000";
    ctx.fillStyle="#000000";
    if (this.visible) { ctx.fillRect(-17,-10,7,20); } else { ctx.strokeRect(-17,-10,7,20); }
    if (this.visible) { ctx.fillRect( 10,-10,7,20); } else { ctx.strokeRect( 10,-10,7,20); }
 
    ctx.fillStyle="#0000FF";
    ctx.beginPath();
    ctx.arc(-5,-10,5,0,2*Math.PI); 
    ctx.arc( 5,-10,5,0,2*Math.PI);      
    ctx.fill();
    if (this.visible) { ctx.fillStyle="#FFFF00"; } else
    { ctx.fillStyle="#FFFFFF"; }
    
    ctx.strokeStyle="#FF9900";    
    ctx.beginPath();
    ctx.arc(0,0,15,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    if (this.crayon_baisse) { i = 1 ; } { i = 6; }
    if (this.visible) {ctx.strokeStyle="#0000FF"; } else { ctx.strokeStyle=this.couleur_crayon; }
    ctx.fillStyle=this.couleur_crayon;
    ctx.arc( 0,0,i,0,2*Math.PI);
    if (this.visible) { ctx.fill(); }    
    ctx.stroke();
    
    /*if (this.visible) ctx.fill(); */
    if (points) {  
        ctx.fillStyle="#ff0000"; 
        for (i=0;i<this.points.length;i++) {           
            ctx.fillRect(this.points[i].x-2,this.points[i].y-2,4,4);
        }                
    }        
    ctx.restore();     
} // dessin_robot

Tortue.prototype.dessin_probot = function(ctx,points) { /**********************/

    var i;
    ctx.save();

    ctx.lineWidth=1;
    ctx.strokeStyle="#000000";
        
 
    ctx.fillStyle="#f0001a";
    //carrosserie
    ctx.beginPath();
    ctx.moveTo(-15,-28);
    ctx.arcTo(0,-32,15,-28,60);   
    ctx.lineTo(15,28);
    ctx.arcTo(0,32,-15,28,60);
    ctx.lineTo(-15,-28);  
    ctx.fill();
    ctx.stroke(); 
    
   // ctx.strokeRect(-15,-30,30,60);
    
    //roues
    ctx.fillStyle="#000000";
    ctx.fillRect(-19,-18,4,15);ctx.fillRect(-19,5,4,15);
    ctx.fillRect( 15,-18,4,15);ctx.fillRect( 15,5,4,15);
    //parebrise
    ctx.beginPath();
    ctx.fillStyle="#00abe6";
    ctx.moveTo(-10,-7);
    ctx.arcTo(0,-10,10,-7,40);   
    //ctx.lineTo(10,-7);
    ctx.lineTo(7,0);
    ctx.lineTo(-7,0);
    ctx.fill();
    
    if (this.visible) { ctx.fillStyle="#FFFF00"; } else
    { ctx.fillStyle="#FFFFFF"; }
    
    ctx.strokeStyle="#FF9900";    
    ctx.beginPath();
    
    /*if (this.visible) ctx.fill(); */
    if (points) {  
        ctx.fillStyle="#ff0000"; 
        for (i=0;i<this.points.length;i++) {           
            ctx.fillRect(this.points[i].x-2,this.points[i].y-2,4,4);
        }                
    }        
    ctx.restore();     
} // dessin_probot

Tortue.prototype.dessin_simple = function(ctx,points) { /*********************/
    ctx.save();  
    ctx.fillStyle="#009933";
    ctx.strokeStyle="#000000";

    ctx.beginPath();
      
    var i,tx=2,ty=2.3;
    
    //tête
    var x = [   2,  3,   3,   1,  -1,  -3, -3,   -2 ];
    var y = [-7.5, -9, -11, -14, -14, -11, -9, -7.5];        
    for (i=0;i<x.length;i++) {
        if (i===0) {ctx.moveTo(x[i]*tx,y[i]*ty);} else {ctx.lineTo(x[i]*tx ,y[i]*ty);}
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }    
    // Patte AVD   
    ctx.beginPath();
    x = [7.5, 10, 10,  8.5, 5.5];
    y = [ -3, -5, -7, -8.5, -6.5];        
    for (i=0;i<x.length;i++) {
        if (i===0) {ctx.moveTo(x[i]*tx ,y[i]*ty);} else {ctx.lineTo(x[i]*tx ,y[i]*ty);}
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    // Patte AVG   
    ctx.beginPath();      
    for (i=0;i<x.length;i++) {
        if (i===0) {ctx.moveTo(-x[i]*tx ,y[i]*ty);} else {ctx.lineTo(-x[i]*tx ,y[i]*ty);}
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    // Patte ARD   
    ctx.beginPath();      
    for (i=0;i<x.length;i++) {
        if (i===0) { ctx.moveTo(x[i]*tx ,-y[i]*ty); } else { ctx.lineTo(x[i]*tx ,-y[i]*ty);}
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    // Patte ARG   
    ctx.beginPath();      
    for (i=0;i<x.length;i++) {
        if (i===0) {ctx.moveTo(-x[i]*tx ,-y[i]*ty); } else { ctx.lineTo(-x[i]*tx ,-y[i]*ty);}
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    // Corps    
    ctx.beginPath();
    x = [7.5, 7.5, 5.5,   2, -2, -5.5, -7.5, -7.5, -7.5, -5.5, -2,  2, 5.5,  7.5, 7.5   ];
    y = [  0,   3, 6.5, 7.5,  7.5,  6.5,    3,    0, -3,   -6.5, -7.5, -7.5,  -6.5, -3,  0];        
    for (i=0;i<x.length;i++) {
        if (i===0) { ctx.moveTo(x[i]*tx ,y[i]*ty); } else { ctx.lineTo(x[i]*tx ,y[i]*ty); }
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    tx=tx/1.5;ty=ty/1.5;    
    ctx.beginPath();      
    for (i=0;i<x.length;i++) {
        if (i===0) { ctx.moveTo(-x[i]*tx ,-y[i]*ty); } else  { ctx.lineTo(-x[i]*tx ,-y[i]*ty); }
    }
    ctx.stroke();if (this.visible) { ctx.fill(); }   
    ctx.strokeRect(-4,-5,8,10); 
   
    ctx.restore();  
}; // dessin_simple

Tortue.prototype.dessin_std = function(ctx,points) { /************************/
    var i;
    ctx.save();
    ctx.fillStyle="#FFFF00";
    ctx.strokeStyle="#FF9900";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(0,-10);
    ctx.lineTo(-7,5);
    ctx.lineTo(0,0);
    ctx.lineTo(7,5);
    ctx.lineTo(0,-10);
    ctx.stroke();
    if (this.visible) ctx.fill(); 
    if (points) {  
        ctx.fillStyle="#ff0000"; 
        for (i=0;i<this.points.length;i++) {           
            ctx.fillRect(this.points[i].x-2,this.points[i].y-2,4,4);
        }                
    }        
    ctx.restore();    
}; // dessin_std

Tortue.prototype.dessin_3d = function() {
    if (this.LWlogo.troisD) {
        this.LWlogo.troisD.update();                
    }
};

// Renvoie un rectangle encadrant la tortue **********************************/
Tortue.prototype.getAAB = function(xr,yr) { /********************************/
    var i=0,x,y,sin,cos,p,j=this.points.length;
    var x1,x2,y1,y2;
    var direction = ((this.cap) * (Math.PI / -180));
    if (!xr) {xr=this.posx;}
    if (!yr) {yr=this.posy;}
    sin = Math.sin(direction);
    cos = Math.cos(direction);
    for (i=0;i<j;i++) {
        x = this.points[i].x * cos - this.points[i].y*sin ;
        y = this.points[i].x * sin + this.points[i].y*cos;
        p = this.convert(x+xr, y+yr);
        if (i===0) {
            x1=p.x;x2=p.x;
            y1=p.y;y2=p.y;
        } else {
            x1 = Math.min(x1,p.x);x2=Math.max(x2,p.x);
            y1 = Math.min(y1,p.y);y2=Math.max(y2,p.y);
        }
        
    }
    p = new AAB(x1,y1,x2-x1,y2-y1);
    return p;
} // getAAB

Tortue.prototype.montre = function( nctx,p,aff) {
    var mwt,h;
    if (this.oldbulle !== this.bulle) {
        var i,x1,y1,y2,wt,w,ctx;
        this.oldbulle = this.bulle;   
        h = 20 + this.text.length * 15;
        
        this.textCanvas.width = this.canvas.width;
        this.textCanvas.height = h;                        
        ctx = this.textCanvas.getContext("2d");
        ctx.font="Bold 15px Georgia"; 
        mwt = 10;
        for (i=0;i<this.text.length;i++) {
            wt = ctx.measureText(this.text[i]).width+5;
            mwt = Math.max(wt+20,mwt);
        }   
        this.textCanvas.width = mwt; 
        ctx.font="Bold 15px Georgia";         
        ctx.fillStyle='rgba(255,255,255,1)';
        ctx.fillRect(0,0,mwt,h);
        
        ctx.fillStyle="#FFFFFF";
        ctx.strokeStyle="#000066";
        ctx.shadowBlur=10;
        ctx.shadowColor="black";             
        ctx.beginPath();
        ctx.roundRect(2,2,mwt - 4,h - 4,5);        
        ctx.fill();ctx.stroke();ctx.clip();
        y1=20;
        ctx.fillStyle="#000000";
        for (i=0;i<this.text.length;i++) {
            ctx.fillText(this.text[i],6,y1);
            y1+=15;
        }                      
    }
    
    if (aff) { nctx.drawImage(this.textCanvas,p.x,p.y); }
};

Tortue.prototype.draw = function() { /****************************************/

	var nt;
	
    if (this.LWlogo.troisD) {
        this.dessine();  
        if (this.bulle>0) {
            this.montre(ctx,p,false);
            nt = new Date().getTime();
            nt = this.temps_affichage - (nt - this.bulle);
            if (nt<=0) {
                if (this.timer) { clearInterval(this.timer);}
                this.timer = null;
                this.bulle=0;                
            }              
        }
        this.dessin_3d();       
    } else {
        var w = this.canvas.width, h = this.canvas.height, ctx=this.canvas.getContext("2d");
        var p = this.convert(this.posx,this.posy);    
        ctx.fillStyle="rgba(255,255,255,0.1)";
        ctx.clearRect ( 0 , 0 , w,h );
        if (this.visible) {
            ctx.save();
            if (this.bulle>0) {
                ctx.save();
                nt = new Date().getTime();
                nt = this.temps_affichage - (nt - this.bulle);
                if (nt<0) { nt=0; }
                if (nt<2000) {
                    ctx.globalAlpha=nt/2000;
                }
                this.montre(ctx,p,true);
                ctx.restore();            
            }
            ctx.shadowBlur=0;        
            ctx.translate(p.x,p.y);
            ctx.rotate(this.cap*Math.PI/180);        
            this.dessin_tortue(ctx,(this.montre_points || debug) );
            ctx.rotate(-this.cap*Math.PI/180);
            ctx.translate(-p.x,-p.y);
            ctx.restore();
             if (debug) {
             var p1 = this.getAAB(this.posx,this.posy);
             ctx.strokeRect(p1.x,p1.y,p1.w,p1.h); 
             }
             
        }  else if (this.bulle>0) {
                ctx.save();
                nt = new Date().getTime();
                this.montre(ctx,p,true);
                nt = this.temps_affichage - (nt - this.bulle);
                if (nt<2000) {
                    ctx.globalAlpha=nt/2000;
                }
                if (nt<0) { nt=0; }                
                if (nt<=0) {
                    if (this.timer) { clearInterval(this.timer);}
                    this.timer = null;
                    this.bulle=0;
                }
                ctx.restore();
        }    
        this.dessine(); 
     }  
}; // draw

Tortue.prototype.dessine = function() { /**************************************/
    if ((this.posx!=this.oldx) || (this.posy != this.oldy)) {
        if (this.crayon_baisse) {
            var old = this.convert(this.oldx,this.oldy);            
            var p = this.convert(this.posx,this.posy);
            this.dessin.ligne(this.num_ordre,old,p,this.couleur_crayon,this.taille_crayon);
        }
    }
}; // dessine

Tortue.prototype.reset = function() { /***************************************/
    this.en_cours=false;
    this.oldx = this.posx;
    this.oldy = this.posy;
    this.ordre='';
    this.debut=true;
    this.param=[];  
    this.param_trv=[];   
    this.draw();
    this.bulle=0;
    this.text=[];
    this.num_ordre=0;
}; // reset

Tortue.prototype.set_tortue = function(t) { /*********************************/
    this.style=t;
    switch (t) {
        case 1        : this.dessin_tortue = this.dessin_robot; // Robot
                        this.points=[];
                        this.points.push(new Point(-15,-15));
                        this.points.push(new Point( 15,-15));
                        this.points.push(new Point( 15, 15));
                        this.points.push(new Point(-15, 15));
                        break;
        case 2        : this.dessin_tortue = this.dessin_simple; // Tortue
                        this.points=[];
                        this.points.push(new Point(-17,-25));
                        this.points.push(new Point( 17,-25));
                        this.points.push(new Point( 17, 17));
                        this.points.push(new Point(-17, 17));
                        break;       
        case 3        : this.dessin_tortue = this.dessin_probot; // Probot
                        this.points=[];
                        this.points.push(new Point(-15,-30));
                        this.points.push(new Point( 15,-30));
                        this.points.push(new Point( 15, 30));
                        this.points.push(new Point(-15, 30));                                        
                        break; 
        default       : this.dessin_tortue = this.dessin_std; 
                        this.points=[];
                        this.points.push(new Point(0,-10));
                        this.points.push(new Point(-7,5));
                        //this.points.push(new Point(0,0));
                        this.points.push(new Point(7,5));
                        this.points.push(new Point(0,-10))
                        break;
    }  
    this.draw();  
}; // set_tortue




Tortue.prototype.commande= function(cmd,param) {
    this.ordre=cmd;
    this.num_ordre ++;
    this.debut = true;
    switch (cmd.procedure.code) {
        case 'FIXECAP'  : param[0] = param[0] % 360;break;
        case 'TD'       : param[0] = param[0] % 360;break;
        case 'TG'       : param[0] = param[0] % 360;break;        
    }    
    this.param=param;
    this.param_tr = param.slice(0);
    this.en_cours=true;    
};

Tortue.prototype.collision = function(x,y) {
    var p,ret;    
    p = this.getAAB(x,y);
    ret =  this.LWlogo.monde.collision(p);
	if (ret) this.etats.push('collision!');
	return ret;
};

Tortue.prototype.retour = function(token) {
    if (!token) {
        token = new Token('nombre',0,'ignore');
    }        
    token.numero = this.ordre.numero;
    this.LWlogo.retour_tortue(this,token,this.etats.slice(0));
    this.ordre='';
    this.param=[];
    this.param_tr=[];
	this.etats=[];
    this.en_cours = false;
};

Tortue.prototype.texte = function(text) {
   /* var p,w,h,ctx;
    p = this.convert(this.posx,this.posy); 
    this.draw();
    ctx=this.dessin.getContext("2d");
    ctx.font=this.fontsize+"px "+this.font;         
    w = (ctx.measureText(text).width) / 2;  
    h = this.fontsize / 2;
    ctx.fillStyle=this.couleur_crayon;
    ctx.translate(p.x-w,p.y+h);
    ctx.rotate(-this.cap*Math.PI/180);        
    ctx.fillText(text,-w,-h);
    ctx.rotate(+this.cap*Math.PI/180);
    ctx.translate(-(p.x-w),-(p.y+h));    */        
};

Tortue.prototype.remplir =function() {
    var p = this.convert(this.posx,this.posy); 
    this.dessin.remplir(p.x,p.y,this.couleur_crayon);
};


Tortue.prototype.videecran =function() {
    this.draw();
    this.dessin.vide();
    this.bulle=0;
    this.text='';
};

Tortue.prototype.tick = function() {    
    var dx,dy,dep,rep,v,chg,oldcap;
    var direction;
    this.oldx = this.posx;
    this.oldy = this.posy;    
    v = this.vitesse / 10;   
    if (v>1) {rep = Math.ceil(v); } else { rep=1; }
    if (this.vitesse>=100) { rep=10000; }  
    switch (this.ordre.procedure.code) {
        case 'ATTENDS'  :   var d = new Date();
                            var t = d.getTime(); 
                            t = Math.floor(t*6/100);
                            if ((! this.param_tr[1]) || (this.param_tr[1]<=0) || (this.param_tr[1]>t)) {
                                this.param_tr[1] = t;
                            }                                  
                            if ((t - this.param_tr[1])>=this.param_tr[0]) { this.retour(new Token('booleen',true,'ignore'));}  
                            break;
        case 'AV'       :   direction = ((this.cap) * (Math.PI / 180));
                            do {
                                if (this.param_tr[0]<1) { dep = this.param_tr[0]; } else {
                                    if (v>=1) {dep = 1; } else { dep=Math.min(this.param_tr[0],v); }                          
                                }
                                dx = dep * Math.sin(direction);
                                dy = dep * Math.cos(direction);
                                dx = this.posx + dx;
                                dy = this.posy + dy;  
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));                                    
                                    rep=0;
                                } else {
                                    this.posx = dx;
                                    this.posy = dy;
                                    this.param_tr[0]=this.param_tr[0]-dep;
                                    if (this.param_tr[0]<0) {this.param_tr[0]=0; }
                                    if (this.param_tr[0]<=0) { // Deplacement complet
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;
                            } while (rep>0); 
                            break;
        case 'BC'       :   chg= ! this.crayon_baisse;
                            this.crayon_baisse = true;
                            this.retour(new Token('booleen',chg,'ignore'));                   
                            break;  
        case 'CACHETORTUE': chg = this.visible; // La commande renvoie VRAI si l'état de la tortue a changé
                            this.visible=false;
                            this.retour(new Token('booleen',chg,'ignore'));                  
                            break;  
        case 'CAP'      :   this.retour(new Token('nombre',this.cap,'!'));                  
                            break; 
        case 'ETIQUETTE':   if (this.debut) {
                                this.param_tr[1] = this.param_tr[0].length;    
                                this.debut = false;
                            }    
                            this.texte(this.param_tr[0]);
                            this.retour(new Token('nombre', this.param_tr[1],'!'));
                            break;                            
        case 'FCC'      :   this.couleur_crayon = 'rgb('+(this.param_tr[2] % 256)+','+(this.param_tr[1] % 256)+','+(this.param_tr[0] % 256)+')';                            
                            this.retour(new Token('booleen',true,'ignore')); 
                            break;                             
        case 'FTC'      :   this.taille_crayon = this.param_tr[0];
                            this.retour(new Token('booleen',true,'ignore')); 
                            break;                            
        case 'FIXECAP'  :   this.cap = (this.param_tr[0] % 360);
                            if (this.cap<0) { this.cap+=360; }
                            this.retour(new Token('booleen',true,'ignore'));                
                            break; 
        case 'FIXEXY'   :   // Les coordonnées x et y sont inversées par rapport à fixepos
                            if (this.debut) {
                                this.param[0] =  this.param_tr[1];
                                this.param[1] =  this.param_tr[0];
                                this.param_tr =  this.param.slice(0);
                            }
							// Pas de break ici !
        case 'FIXEPOS'  :   if (this.debut) {
                                this.param_tr[3] = this.posx;
                                this.param_tr[2] = this.posy;
                                this.param_tr[3] = this.cap;
                                dep = Math.atan2(this.posx-this.param_tr[1], this.posy-this.param_tr[0]);
                                dep = dep+Math.PI;
                                this.cap = dep*(180/Math.PI);                                
                            }
                            this.debut = false;
                            do {
                                // param_tr[1] => x, param_tr[0] => y, 
                                var n = Math.max(Math.abs(this.posx - this.param_tr[1]), Math.abs(this.posy - this.param_tr[0]));
                                if (n<1) {
                                    dx = this.param_tr[1];
                                    dy = this.param_tr[0];                                    
                                } else {
                                    dep = Math.abs(this.posx - this.param_tr[1]) / n;
                                    if (dep<=0) {
                                        dx = this.param_tr[1];
                                    } else if (this.posx<this.param_tr[1]) {
                                        dx = this.posx + dep;
                                    } else {dx = this.posx - dep ;}
                                    dep = Math.abs(this.posy - this.param_tr[0]) / n;
                                    if (dep<=0) {
                                        dy = this.param_tr[0];
                                    } else if (this.posy<this.param_tr[0]) {
                                        dy = this.posy + dep;
                                    } else { dy = this.posy - dep; }
                                }
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la distance
                                    dep = Math.sqrt(Math.pow(this.posx-this.param_tr[3],2)+Math.pow(this.posy-this.param_tr[2],2));
                                    this.cap = this.param_tr[3];
                                    this.retour(new Token('nombre',dep,'ignore')); 
                                    rep=0;                                   
                                } else {
                                    this.posx=dx;this.posy=dy; // // Deplacement complet on renvoie la distance
                                    dep = Math.sqrt(Math.pow(dx-this.param_tr[3],2)+Math.pow(dy-this.param_tr[2],2));
                                    if ((this.posx==this.param_tr[1]) && (this.posy==this.param_tr[0])) {
                                       this.cap = this.param_tr[3];
                                       this.retour(new Token('nombre',dep,'ignore')); 
                                       rep=0; 
                                    }
                                }                                
                                rep--;
                            } while (rep>0);                                         
                            break; 
        case 'FIXEX'    :   if (this.debut) { this.param_tr[1] = this.posx; }
                            this.debut = false;
                            do {
                                 dep = Math.abs(this.posx - this.param_tr[0]);
                                 if (dep<1) {
                                    dx = this.param_tr[0];
                                 } else if (this.posx<this.param_tr[0]) {
                                    dx = this.posx + 1;
                                 } else { dx = this.posx - 1; }
                                 if (this.collision(dx,this.poxy)) { // Deplacement incomplet on renvoie la difference
                                    this.retour(new Token('nombre',Math.abs(this.param_tr[1]-this.posx),'ignore')); 
                                    rep=0;                                   
                                } else {
                                    this.posx = dx;
                                    if (this.posx==this.param_tr[0]) {
                                        this.retour(new Token('nombre',Math.abs(this.param_tr[1]-this.posx),'ignore')); 
                                        rep=0;                                      
                                    }
                                }                                             
                                rep--;
                            } while (rep>0); 
                            break; 
        case 'FIXEY'    :   if (this.debut) { this.param_tr[1] = this.posy;}
                            this.debut = false;
                            do {
                                 dep = Math.abs(this.posy - this.param_tr[0]);
                                 if (dep<1) {
                                    dy = this.param_tr[0];
                                 } else if (this.posy<this.param_tr[0]) {
                                    dy = this.posy + 1;
                                 } else { dy = this.posy - 1; }
                                 if (this.collision(this.posx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.retour(new Token('nombre',Math.abs(this.param_tr[1]-this.posy),'ignore')); 
                                    rep=0;                                   
                                } else {
                                    this.posy = dy;
                                    if (this.posy==this.param_tr[0]) {
                                        this.retour(new Token('nombre',Math.abs(this.param_tr[1]-this.posy),'ignore')); 
                                        rep=0;                                      
                                    }
                                }                                             
                                rep--;
                            } while (rep>0); 
                            break; 
        case 'LC'       :   chg= this.crayon_baisse;
                            this.crayon_baisse = false;
                            this.retour(new Token('booleen',chg,'ignore'));                  
                            break; 
        case 'MONTRE':      this.bulle = new Date().getTime();
                            var that = this;
                            if (! this.timer) { this.timer=setInterval(function () {that.draw();},60); }
                            this.text=[];
                            for (var i=0;i<this.param_tr.length;i++) {
                                this.text[i] = this.param_tr[i]+' ';
                                this.text[i] = this.text[i].trim();
                            }
                            if (this.text.length<1) { this.bulle = 0; }                            
                            this.retour(new Token('booleen',true,'ignore'));                  
                            break;                            
        case 'MONTRETORTUE': chg = ! this.visible; // La commande renvoie VRAI si l'état de la tortue a changé
                            this.visible=true;
                            this.retour(new Token('booleen',chg,'ignore'));                  
                            break;                            
        case 'NETTOIE'  :   this.videecran();
                            this.retour(new Token('booleen',true,'ignore'));  
                            break;
        case 'ORIGINE'  :   this.posx = 0;
                            this.posy = 0;
                            this.cap = 0;
                            this.retour(new Token('booleen',true,'ignore'));                              
                            break;
        case 'POS'      :   this.retour(new Token('liste',this.posx+' '+this.posy,'!')); 
                            break;                             
        case 'RE'       :   direction = ((this.cap) * (Math.PI / 180));
                            do {
                                if (this.param_tr[0]<1) { dep = this.param_tr[0]; } else {
                                    if (v>=1) { dep = 1; } else { dep=Math.min(this.param_tr[0],v); }                        
                                }
                                dx = -dep * Math.sin(direction);
                                dy = -dep * Math.cos(direction);
                                dx = this.posx + dx;
                                dy = this.posy + dy;  
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));
                                    rep=0;
                                } else {
                                    this.posx = dx;
                                    this.posy = dy;
                                    this.param_tr[0]=this.param_tr[0]-dep;
                                    if (this.param_tr[0]<0) { this.param_tr[0]=0; }
                                    if (this.param_tr[0]<=0) { // Deplacement complet
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;
                            } while (rep>0);                   
                            break;  
        case 'REMPLIS'  :   if (this.crayon_baisse) {
                                this.remplir();
                            }
                            this.retour(new Token('booleen',0,'ignore'));    
                            break;
        case 'TD'       :   do {
                                if (this.param_tr[0]<1) { dep = this.param_tr[0]; } else {
                                    if (v>=1) { dep = 1; } else { dep=Math.min(this.param_tr[0],v); }                           
                                }
                                oldcap = this.cap;
                                this.cap = this.cap + dep;
                                if (this.cap < 0) {this.cap = this.cap + 360; }
                                this.cap = this.cap % 360; 
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.cap = oldcap;
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));
                                    rep=0;
                                } else {                                   
                                    this.param_tr[0]=this.param_tr[0]-dep;
                                    if (this.param_tr[0]<0) {this.param_tr[0]=0; }
                                    if (this.param_tr[0]<=0) { // Deplacement complet                                        
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;        
                            } while (rep>0);                 
                            break;   
        case 'TG'       :   do {
                                if (this.param_tr[0]<1) { dep = this.param_tr[0];} else {
                                    if (v>=1) { dep = 1; } else { dep=Math.min(this.param_tr[0],v); }                          
                                }
                                oldcap = this.cap;
                                this.cap = this.cap - dep;
                                if (this.cap < 0) { this.cap = this.cap + 360; }
                                this.cap = this.cap % 360; 
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.cap = oldcap;
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));
                                    rep=0;
                                } else {                                   
                                    this.param_tr[0]=this.param_tr[0]-dep;
                                    if (this.param_tr[0]<0) { this.param_tr[0]=0; }
                                    if (this.param_tr[0]<=0) { // Deplacement complet                                        
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;        
                            } while (rep>0);                     
                            break; 
        case 'VE'       :   this.cap = 0;this.taille_crayon = 1;
                            this.posx = 0;this.visible = true;
                            this.posy = 0;this.crayon_baisse = true; 
                            this.couleur_crayon = "#000000";   
                            this.oldx = 0;this.oldy = 0;                            
                            this.videecran();
                            this.retour(new Token('booleen',true,'ignore'));
                            break;
        default         :   console.log('ordre inconnu ',this.ordre);
                            this.retour();  
                            break;
    }
    this.draw();
};
