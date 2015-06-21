/* **************** ***********************************************************/
/* Monde  ********************************************************************/
/* ***************************************************************************/
"use strict";

function Monde(logo,nom_canvas) { /*******************************************/
    this.canvas = document.getElementById(nom_canvas);    
    this.largeur = this.canvas.width;
    this.hauteur = this.canvas.height;
    this.quadrillage=0;    
    this.murs = [];
    this.LWLogo = logo;
    this.draw();
}; // Monde


Monde.prototype.collision = function(aab) { /******************************/
    var i, p, j,k,l,o;
    if (aab) {        
        if ((aab.x<0) || (aab.x1>this.largeur) || (aab.y<0) || (aab.y1>this.hauteur)) return true;
        k=this.murs.length;
        for (l=0;l<k;l++) {
            o=this.murs[l].aab;            
            if (this.collisionAABB(o,aab)) return true;
        }
    
       /* j = points.length;
        for (i=0;i<j;i++) {
            p = points[i];
            if ((p.x<0) || (p.x>this.largeur) || (p.y<0) || (p.y>this.hauteur)) return true;
            k= this.murs.length;
            for (l=0;l<k;l++) {
                    o=this.murs[l];
                    if ( (p.x >= o.cx) && (p.x <= o.cx+o.w) &&
                         (p.y >= o.cy) &&  (p.y <= o.cy+o.h)) {
                         return true;
                    }
            }
        }*/
    }
    return false;
} // collision

// Collision entre un point et une Axis Aligned Bounding Box /****************/
Monde.prototype.collisionXY = function(x,y,box) {
    if ((x >= box.x) && (x < box.x + box.w) && (y >= box.y) && (y < box.y + box.h)) {
       return true;
    } else {
       return false;
    }
}
// Collision entre deux Axis Aligned Bounding Box /***************************/
Monde.prototype.collisionAABB = function(box1,box2) {
   if((box2.x >= box1.x + box1.w) || (box2.x + box2.w <= box1.x) || (box2.y >= box1.y + box1.h) || (box2.y + box2.h <= box1.y)) {
          return false; 
   } else {
          return true;           
    }
}

// Collision entre un point et un cercle /************************************/
Monde.prototype.collisionXYC = function(x,y,cercle) {
   var d2 = (x-C.x)*(x-C.x) + (y-C.y)*(y-C.y);
   if (d2>C.rayon*C.rayon) {
      return false;
   } else {
      return true;      
    }
}

// Collision entre 2 cercles /************************************************/
Monde.prototype.collisionCC = function (c1,c2) {
   var d2 = (c1.x-c2.x)*(c1.x-c2.x) + (c1.y-c2.y)*(c1.y-c2.y);
   if (d2 > (c1.rayon + c2.rayon)*(c1.rayon + c2.rayon)) {
      return false;
   } else {
      return true;
   }
}

Monde.prototype.draw = function() { /*****************************************/
    var i,j;
    var ctx=this.canvas.getContext("2d");    
    //ctx.fillStyle="rgba(0,0,64,0.8)";
    ctx.fillStyle="rgba(255,255,255,0.1)";   
    ctx.clearRect ( 0 , 0 , this.largeur,this.hauteur ); 
    ctx.fillRect( 0 , 0 , this.largeur,this.hauteur ); 
    
    switch (this.quadrillage) {
        case 0  :    break; // aucun
        case 1  :   ctx.lineWidth=1; // petits carreaux;
                    ctx.strokeStyle="rgba(0,0,128,0.2)";                  
                    ctx.beginPath();
                    for (i=20;i<this.largeur;i+=20) {
                        for (j=20;j<this.hauteur;j+=20) {
                            ctx.moveTo(0,j);ctx.lineTo(this.largeur,j);
                            ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
                        }
                    }   
                    ctx.stroke();
                    break;
        case 2 :    ctx.lineWidth=1; // Seyes;
                    ctx.beginPath();
                    ctx.strokeStyle="rgba(74,0,181,1)";  
                    for (i=40;i<this.largeur;i+=40) {
                         ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
                    }
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle="rgba(129,0,131,1)";
                    for (i=40;i<this.largeur;i+=40) {
                         ctx.moveTo(0,i);ctx.lineTo(this.largeur,i);
                    }
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle="rgba(154,205,248,1)";
                    for (i=10;i<this.largeur;i+=10) {
                         if (i%40 != 0) {ctx.moveTo(0,i);ctx.lineTo(this.largeur,i);}
                    }
                    ctx.stroke();   
                    break;
        case 3 :    ctx.lineWidth=1; // Reperes
                    ctx.beginPath();
                    ctx.strokeStyle="rgba(255,0,0,1)";  
                    i = this.largeur / 2;
                    ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
                    i = this.hauteur / 2;
                    ctx.moveTo(0,i);ctx.lineTo(this.largeur,i);
                    ctx.stroke();
                    i = this.largeur / 2; j=i; i -= 50;
                    ctx.beginPath();
                    ctx.textAlign="center"; 
                    ctx.strokeStyle="rgba(0,0,128,0.5)";  
                    ctx.fillStyle="#000000"; 
                    while (i>0) {
                        ctx.fillText(0-(j-i),i,this.hauteur - 5); 
                        ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
                        i -= 50;
                    }
                    i = this.largeur / 2; j=i; i += 50;
                    while (i<this.largeur) {
                        ctx.fillText(i-j,i,this.hauteur - 5); 
                        ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
                        i += 50;
                    }
                    i = this.hauteur / 2; j=i; i -= 50;
                    while (i>0) {
                        ctx.fillText(j-i,this.largeur - 15,i+5); 
                        ctx.moveTo(0,i);ctx.lineTo(this.largeur,i);
                        i -= 50;
                    }
                    i = this.hauteur / 2; j=i; i += 50;
                    while (i<this.hauteur) {
                        ctx.fillText(j-i,this.largeur - 15,i+5); 
                        ctx.moveTo(0,i);ctx.lineTo(this.largeur,i);
                        i += 50;
                    }                    
                    ctx.stroke();
                        
                    
    }
    for (i=0;i<this.murs.length;i++) {
        ctx.fillStyle="#663333";
        ctx.strokeStyle="#000000";
        ctx.fillRect(this.murs[i].aab.x,this.murs[i].aab.y,this.murs[i].w,this.murs[i].h);
    }     
} // draw

Monde.prototype.mur = function (p) { /****************************************/
    var i,o;
    if ((p.length>3) && (Math.abs(p[2])>0) && (Math.abs(p[3])>0)) {
        //if (p[0]<0) { p[0]=0; }
        //if (p[1]<0) { p[1]=0; }        
        if ((p[0]<this.largeur) && (p[1]<this.hauteur)) {
            o = new ObjetStatique('M',p[0],p[1],p[2],p[3],this);
            this.murs.push(o);
        }
    }
    this.draw();
    if (this.LWLogo.troisD) {
            this.LWLogo.troisD.maj_monde();
    }
} // mur

Monde.prototype.reset = function() {
    this.murs=[];
    this.draw();
    if (this.LWLogo.troisD) {
            this.LWLogo.troisD.maj_monde();
    }    
}

/****************************/

function ObjetStatique(type,x,y,w,h,monde) { /*******************************************/
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.aab = new AAB(this.x + (monde.largeur / 2),(monde.hauteur/2) - this.y,w,h) ;
}; 

