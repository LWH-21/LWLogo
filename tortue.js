/* ***************************************************************************/
/* Tortue 2D basique *********************************************************/
/* ***************************************************************************/
"use strict";

function Tortue(id,nom_canvas, dessin, logo) { /******************************/
    this.ID = id;
    this.LWlogo = logo;
    
    this.canvas = document.getElementById(nom_canvas);    
    this.dessin = document.getElementById(dessin);   
    
    this.cap = 0;
    this.posx = 0;
    this.posy = 0;
       
    this.ordre='';      // Dernier ordre envoye ala tortue
    this.debut=true;    // Indique que le traitement de l'ordre n'a pas encore commence
    this.param=[];      // Parametres de l'ordre
    this.param_trv=[];  // Copie de travail des parametres
    
    this.crayon_baisse = true;
    this.taille_crayon = 1;
    this.couleur_crayon = "#000000";
    this.font = "Verdana"
    this.fontsize=30;
    
    this.montre_points = true; // Affichage ou non des points utilises pour tester les collisions
    this.points = []; // Points servant au calcul des collisions.
    
    this.visible = true;
    
    this.en_cours=false;
    this.oldx = 0;
    this.oldy = 0;
    this.vitesse = 100;
    this.dessin_tortue = this.dessin_simple;
    
    this.bulle = 0;
    this.text='';
    this.temps_affichage = 10000; // affichage des bulles : 10s. par défaut (en milliemes de secondes)
    this.timer=null;
    
    this.set_tortue(1);
    
    var ctx=this.dessin.getContext("2d");
    ctx.fillStyle="rgba(0,0,64,0.8)";
    ctx.clearRect ( 0 , 0 , this.dessin.width,this.dessin.height); 
    this.draw(); 
} // Tortue

/* Conversion d'un point du repere "tortue au repere "canvas" ****************/
Tortue.prototype.convert = function (x,y) { /*********************************/
    var w = this.canvas.width, h = this.canvas.height;
    x = x + (w / 2);
    y = h - y - (h / 2);
    return new Point(x,y);
} // convert

/* Conversion des points "marquants de la tortue *****************************/
/* Ces points servent à la gestion des collisions                            */
Tortue.prototype.convert_pts = function (pts,xr,yr) { /*************************/    
    var ret = [],i=0,x,y,sin,cos,p;
    var direction = ((this.cap) * (Math.PI / 180));
    if (!xr) xr=this.posx;
    if (!yr) yr=this.posy;
    sin = Math.sin(direction);
    cos = Math.cos(direction);
    for (i=0;i<pts.length;i++) {
        x = pts[i].x * cos - pts[i].y*sin ;
        y = pts[i].x * sin +  pts[i].y*cos;
        
/*x2=x1*Cosinus(a) - y1*Sinus(a)
 y2=x1*Sinus(a) + y1*Cosinus(a)        */
        p = this.convert(x+xr, y+yr);
        ret.push(p);
    }
    return ret;
} // convert_pts

Tortue.prototype.dessin_simple = function(ctx) { /****************************/
    ctx.save();
 /*   ctx.fillStyle="#009933";
    ctx.strokeStyle="#336633";
    ctx.lineWidth=1;
    ctx.scale(1,1.5);
    ctx.beginPath();
    ctx.arc(0,0,10,0*Math.PI,2*Math.PI);    
    ctx.stroke();ctx.fill();  
    ctx.arc(0,0,5,0*Math.PI,2*Math.PI); 
    ctx.stroke();
    ctx.restore();  
    ctx.save();
    ctx.fillStyle="#009933";
    ctx.strokeSyle="#000000"; 
    ctx.lineWidth=2;   
    ctx.beginPath();    
    ctx.arc(0,-15,5,0*Math.PI,2*Math.PI);    
    ctx.stroke();
    ctx.fill(); */
    
    ctx.fillStyle="#009933";
    ctx.strokeStyle="#336633";
    ctx.beginPath();
    ctx.arc(-10,-5,5,0*Math.PI,2*Math.PI);
    ctx.arc(10,-5,5,0*Math.PI,2*Math.PI);
    ctx.arc(-10,7,5,0*Math.PI,2*Math.PI);
    ctx.arc(10,7,5,0*Math.PI,2*Math.PI);
    ctx.stroke();ctx.fill();
    
    ctx.beginPath();
    
    ctx.moveTo(6,-15);ctx.lineTo(-6,-15);ctx.lineTo(-10,-7);ctx.lineTo(-10,7);ctx.lineTo(-6,15);
    ctx.lineTo(6,15);ctx.lineTo(10,7);ctx.lineTo(10,-7);ctx.lineTo(6,-15);
    
    ctx.stroke();ctx.fill();
    
    ctx.restore();  
} // dessin_simple

Tortue.prototype.dessin_std = function(ctx) { /*******************************/
    ctx.save();
    ctx.fillStyle="#FFFF00";
    ctx.strokeStyle="#FF9900";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(-7,15);
    ctx.lineTo(0,10);
    ctx.lineTo(7,15);
    ctx.lineTo(0,0);
    ctx.stroke();
    ctx.fill();   
    ctx.restore();
} // dessin_std

Tortue.prototype.dessin_3d = function() {
    if (this.LWlogo.troisD) {
        var x,y;
        x = this.posx;
        y = this.posy;
        this.LWlogo.troisD.tortues[this.ID].position.x = x;
        this.LWlogo.troisD.tortues[this.ID].position.z = -y;
        this.LWlogo.troisD.renderer.render(this.LWlogo.troisD.scene,this.LWlogo.troisD.camera);
        this.LWlogo.troisD.dessin.needsUpdate=true;
        
    }
}

Tortue.prototype.draw = function() { /****************************************/

    if (this.LWlogo.troisD) {
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
                var nt = new Date().getTime();
                nt = this.temps_affichage - (nt - this.bulle);
                if (nt<0) nt=0;
                if (nt<2000) {
                    ctx.globalAlpha=nt/2000;
                }
                ctx.font="15px Georgia";            
                var x1,y1,x2,y2,wt;
                wt = ctx.measureText(this.text).width+10;
                if (wt<50) wt = 50;
                if (wt>300) wt = 300;
                if (p.x > w/2)  x1 = p.x - wt - 20; else x1 = p.x + 20;
                if (p.y > h/2) { y1 = p.y - 50;} else {y1 = p.y + 20;y2 = p.y + 25};
                ctx.fillStyle="#FFFFFF";
                ctx.strokeStyle="#000000";
                ctx.shadowBlur=10;
                ctx.shadowColor="black";            
                /*ctx.beginPath();
                ctx.moveTo(p.x,p.y);
                ctx.lineTo(x1+wt/2,y1+10);
                ctx.lineTo(x1+wt/2,y2+30);             
                ctx.lineTo(p.x,p.y);       
                ctx.fill();
                ctx.stroke();*/ 
                ctx.beginPath();
                ctx.rect(x1,y1,wt,50);
                ctx.fill();
                ctx.stroke(); 
                ctx.clip();
                ctx.shadowBlur=0;
                
                ctx.fillStyle="#000000";            
                ctx.fillText(this.text,x1+5,y1+15);                        
                if (nt<=0) {
                    if (this.timer) clearInterval(this.timer);
                    this.timer = null;
                    this.bulle = 0;
                }
                ctx.restore();            
            }
            ctx.shadowBlur=0;        
            ctx.translate(p.x,p.y);
            ctx.rotate(-this.cap*Math.PI/180);        
            this.dessin_tortue(ctx);
            ctx.rotate(+this.cap*Math.PI/180);
            ctx.translate(-p.x,-p.y);
            if (this.montre_points) {
                var p1,i;    
                p1 = this.convert_pts(this.points);    
                ctx.fillStyle="#ff0000"; 
                for (i=0;i<p1.length;i++) {           
                    ctx.fillRect(p1[i].x-2,p1[i].y-2,4,4);
                }        
            }
            ctx.restore();
        }  else if (this.bulle>0) {
                ctx.save();
                var nt = new Date().getTime();
                nt = this.temps_affichage - (nt - this.bulle);
                if (nt<2000) {
                    ctx.globalAlpha=nt/2000;
                }
                if (nt<0) nt=0;
                ctx.font="15px Georgia";            
                var x1,y1,x2,y2,wt;
                wt = ctx.measureText(this.text).width+10;
                if (wt<50) wt = 50;
                if (wt>300) wt = 300;            
                ctx.fillStyle="#FFFFFF";
                ctx.strokeStyle="#000000";
                ctx.shadowBlur=10;
                ctx.shadowColor="black";            
                ctx.beginPath()                                 
                ctx.rect(5,5,wt,50);
                ctx.fill();
                ctx.stroke(); 
                ctx.clip();
                ctx.shadowBlur=0;            
                ctx.fillStyle="#000000";            
                ctx.fillText(this.text,10,20);                        
                if (nt<=0) {
                    if (this.timer) clearInterval(this.timer);
                    this.timer = null;
                    this.bulle=0;
                }
                ctx.restore();
        }    
     }
     this.dessine();   
} // draw

Tortue.prototype.dessine = function() { /**************************************/
    if ((this.posx!=this.oldx) || (this.posy != this.oldy)) {
        if (this.crayon_baisse) {
            var old = this.convert(this.oldx,this.oldy);
            var ctx=this.dessin.getContext("2d");
            var p = this.convert(this.posx,this.posy);
            ctx.lineWidth=this.taille_crayon;
            ctx.strokeStyle=this.couleur_crayon;
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(old.x,old.y);
            ctx.lineTo(p.x,p.y);
            ctx.stroke();
        }
    }
} // dessine

Tortue.prototype.reset = function(t) { /**************************************/
    this.en_cours=false;
    this.oldx = this.posx;
    this.oldy = this.posy;
    this.ordre='';
    this.debut=true;
    this.param=[];  
    this.param_trv=[];   
    this.draw();
    this.bulle=0;
    this.text='';
} // reset

Tortue.prototype.set_tortue = function(t) { /*********************************/
    switch (t) {
        case 1        : this.dessin_tortue = this.dessin_simple;
                        this.points=[];
                        this.points.push(new Point(0,0));
                        break;
        default       : this.dessin_tortue = this.dessin_std; 
                        this.points=[];
                        this.points.push(new Point(0,0));
                        this.points.push(new Point(-10,-15));
                        this.points.push(new Point(0,-10));
                        this.points.push(new Point(10,-15));
                        break;
    }  
    this.draw();  
} // set_tortue




Tortue.prototype.commande= function(cmd,param) {
    this.ordre=cmd;
    this.debut = true;
    this.param=param;
    this.param_tr = param.slice(0);
    this.en_cours=true;    
}

Tortue.prototype.collision = function(x,y) {
    var p;    
    p = this.convert_pts(this.points,x,y);           
    return this.LWlogo.monde.collision(p);
}

Tortue.prototype.retour = function(token) {
    if (!token) {
        token = new Token('nombre',0,'ignore');
    }        
    token.numero = this.ordre.numero;
    this.LWlogo.retour_tortue(this,token);
    this.ordre='';
    this.param=[];
    this.param_tr=[];
    this.en_cours = false;
}

Tortue.prototype.texte = function(text) {
    var p,w,h,ctx;
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
    ctx.translate(-(p.x-w),-(p.y+h));            
}

Tortue.prototype.videecran =function(v) {
    this.draw();
    var ctx=this.dessin.getContext("2d");
    var w = this.dessin.width, h = this.dessin.height;
    ctx.fillStyle="rgba(255,255,255,0.1)";   
    ctx.clearRect ( 0 , 0 , w,h );
    ctx.fillRect(0,0,w,h);
    this.bulle=0;
    this.text='';
}

Tortue.prototype.tick = function() {    
    var dx,dy,dep,rep;
    var direction;
    this.oldx = this.posx;
    this.oldy = this.posy;
    rep = this.vitesse;
    switch (this.ordre.procedure.code) {
        case 'ATTENDS'  :   var d = new Date();
                            var t = d.getTime(); 
                            t = Math.floor(t*6/100);
                            if ((! this.param_tr[1]) || (this.param_tr[1]<=0) || (this.param_tr[1]>t)) {
                                this.param_tr[1] = t;
                            }                                  
                            if ((t - this.param_tr[1])>=this.param_tr[0]) this.retour(new Token('booleen',true,'ignore'));  
                            break;
        case 'AV'       :   direction = ((this.cap+90) * (Math.PI / 180));
                            do {
                                if (this.param_tr[0]<1) dep = this.param_tr[0]; else dep = 1;                            
                                dx = dep * Math.cos(direction);
                                dy = dep * Math.sin(direction);
                                dx = this.posx + dx;
                                dy = this.posy + dy;  
                                if (this.collision(dx,dy)) { // Deplacement incomplet on renvoie la difference
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));
                                    rep=0;
                                } else {
                                    this.posx = dx;
                                    this.posy = dy;
                                    this.param_tr[0]=this.param_tr[0]-1;
                                    if (this.param_tr[0]<0) this.param_tr[0]=0; 
                                    if (this.param_tr[0]<=0) { // Deplacement complet
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;
                            } while (rep>0) 
                            break;
        case 'BC'       :   this.crayon_baisse = true;
                            this.retour(new Token('booleen',true,'ignore'));                   
                            break;  
        case 'CACHETORTUE': this.visible=false;
                            this.retour(new Token('booleen',true,'ignore'));                  
                            break;  
        case 'CAP'      :   this.retour(new Token('nombre',this.cap,'!'));                  
                            break; 
        case 'ETIQUETTE':   if (this.debut) {
                                this.param_tr[1] = this.param_tr[0].length;    
                                this.debut = false;
                            };
                            /*this.debut = false;
                            if (this.param_tr[1].length==0) {
                                this.retour(new Token('nombre', 0,'!'));
                            } else {*/
/*                            var ctx = this.dessin.getContext("2d");
                                ctx.font=this.fontsize+"px "+this.font;         
                                var w = (ctx.measureText(c).width) / 2;  
                                dx = this.posx+(w/2)
                                dy = this.posy;
                                if (this.collision(dx,dy)) {
                                    this.retour(new Token('nombre', this.param_tr[1],'!'));
                                } else {
                                    this.texte(this.param_tr[0]);                                    
                                    this.posx = this.posx+w;   
                                    this.oldx = this.posx;
                                }
                            }*/    
                            this.texte(this.param_tr[0]);
                            this.retour(new Token('nombre', this.param_tr[1],'!'));
                            break;                            
        case 'FCC'      :   this.couleur_crayon = 'rgb('+this.param_tr[2]+','+this.param_tr[1]+','+this.param_tr[0]+')';                            
                            this.retour(new Token('booleen',true,'ignore')); 
                            break;                             
        case 'FTC'      :   this.taille_crayon = this.param_tr[0];
                            this.retour(new Token('booleen',true,'ignore')); 
                            break;                            
        case 'FIXECAP'  :   this.cap = (this.param_tr[0] % 360);
                            if (this.cap<0) this.cap+=360;
                            this.retour(new Token('booleen',true,'ignore'));                
                            break;     
        case 'FIXEPOS'  :   if (this.debut) {
                                this.param_tr[3] = this.posx;
                                this.param_tr[2] = this.posy;
                                this.param_tr[3] = this.cap;
                                dep = Math.atan2(this.posx-this.param_tr[1], this.posy-this.param_tr[0]);
                                dep = dep+Math.PI;
                                this.cap = dep*(-180/Math.PI);                                
                            }
                            this.debut = false;
                            do {
                                // param_tr[1] => x, param_tr[0] => y, 
                                var n = max(Math.abs(this.posx - this.param_tr[1]), Math.abs(this.posy - this.param_tr[0]));
                                if (n<1) {
                                    dx = this.param_tr[1];
                                    dy = this.param_tr[0];                                    
                                } else {
                                    dep = Math.abs(this.posx - this.param_tr[1]) / n;
                                    if (dep<=0) {
                                        dx = this.param_tr[1];
                                    } else if (this.posx<this.param_tr[1]) {
                                        dx = this.posx + dep;
                                    } else dx = this.posx - dep;
                                    dep = Math.abs(this.posy - this.param_tr[0]) / n;
                                    if (dep<=0) {
                                        dy = this.param_tr[0];
                                    } else if (this.posy<this.param_tr[0]) {
                                        dy = this.posy + dep;
                                    } else dy = this.posy - dep;
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
        case 'FIXEX'    :   if (this.debut) this.param_tr[1] = this.posx;
                            this.debut = false;
                            do {
                                 dep = Math.abs(this.posx - this.param_tr[0]);
                                 if (dep<1) {
                                    dx = this.param_tr[0];
                                 } else if (this.posx<this.param_tr[0]) {
                                    dx = this.posx + 1;
                                 } else dx = this.posx - 1;
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
                            } while (rep>0) 
                            break; 
        case 'FIXEY'    :   if (this.debut) this.param_tr[1] = this.posy;
                            this.debut = false;
                            do {
                                 dep = Math.abs(this.posy - this.param_tr[0]);
                                 if (dep<1) {
                                    dy = this.param_tr[0];
                                 } else if (this.posy<this.param_tr[0]) {
                                    dy = this.posy + 1;
                                 } else dy = this.posy - 1;
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
                            } while (rep>0) 
                            break; 
        case 'LC'       :   this.crayon_baisse = false;
                            this.retour(new Token('booleen',true,'ignore'));                  
                            break; 
        case 'MONTRE':      this.bulle = new Date().getTime();
                            var that = this;
                            if (! this.timer) this.timer=setInterval(function () {that.draw();},60);
                            this.text = this.param_tr[0];
                            if (this.text.length<=1) this.bulle = 0;
                            this.retour(new Token('booleen',true,'ignore'));                  
                            break;                            
        case 'MONTRETORTUE': this.visible=true;
                            this.retour(new Token('booleen',true,'ignore'));                  
                            break;
        case 'NETTOIE'  :   this.videecran();
                            this.retour(new Token('booleen',true,'ignore'));  
                            break;
        case 'ORIGINE'  :   this.posx = 0;
                            this.posy = 0;
                            this.retour(new Token('booleen',true,'ignore'));                              
                            break;
        case 'RE'       :   direction = ((this.cap+90) * (Math.PI / 180));
                            do {                                
                                if (this.param_tr[0]<1) dep = this.param_tr[0]; else dep = 1;                            
                                dx = (-dep) * Math.cos(direction);
                                dy = (-dep) * Math.sin(direction);
                                dx = this.posx + dx;
                                dy = this.posy + dy;  
                                if (this.collision(dx,dy)) {
                                    this.retour(new Token('nombre',this.param[0]-this.param_tr[0],'ignore'));
                                    rep=0;
                                } else {
                                    this.posx = dx;
                                    this.posy = dy;
                                    this.param_tr[0]=this.param_tr[0]-1;
                                    if (this.param_tr[0]<0) this.param_tr[0]=0; 
                                    if (this.param_tr[0]<=0) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));                
                                        rep=0;
                                    } else if (rep<1) {
                                        this.retour(new Token('nombre',this.param[0],'ignore'));    
                                    }                               
                                } 
                                rep --;
                            } while (rep>0)                         
                            break;                            
        case 'TD'       :   dep = this.param_tr[0]; 
                            this.cap = this.cap - dep                            
                            this.cap = this.cap % 360;                            
                            if (this.cap < 0) this.cap = this.cap + 360;
                            this.retour(new Token('nombre',0,'ignore'));                    
                            break;   
        case 'TG'       :   dep = this.param_tr[0]; 
                            this.cap = this.cap + dep                            
                            this.cap = this.cap % 360;                            
                            if (this.cap < 0) this.cap = this.cap + 360;
                            this.retour(new Token('nombre',0,'ignore'));                    
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
}
