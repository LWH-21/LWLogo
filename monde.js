/* ***************************************************************************/
/* Monde  ********************************************************************/
/* ***************************************************************************/
"use strict";

function Monde(nom_canvas) { /************************************************/
    this.canvas = document.getElementById(nom_canvas);    
    this.largeur = this.canvas.width;
    this.hauteur = this.canvas.height;
    this.draw();
}; // Monde

Monde.prototype.collision = function(points) { /******************************/
    var i, p, j;
    if (points) {
		j = points.length;
        for (i=0;i<j;i++) {
            p = points[i];
            if ((p.x<0) || (p.x>this.largeur) || (p.y<0) || (p.y>this.hauteur)) return true;
        }
    }
    return false;
} // collision

Monde.prototype.draw = function() { /*****************************************/
    var ctx=this.canvas.getContext("2d");    
    //ctx.fillStyle="rgba(0,0,64,0.8)";
    ctx.fillStyle="rgba(255,255,255,0.1)";   
    ctx.clearRect ( 0 , 0 , this.largeur,this.hauteur ); 
    ctx.fillRect( 0 , 0 , this.largeur,this.hauteur ); 
    ctx.lineWidth=0.5;
    ctx.strokeStyle="rgba(0,0,128,0.2)";
    var i,j;
    ctx.beginPath();
    for (i=20;i<this.largeur;i+=20) {
        for (j=20;j<this.hauteur;j+=20) {
            ctx.moveTo(0,j);ctx.lineTo(this.largeur,j);
            ctx.moveTo(i,0);ctx.lineTo(i,this.hauteur);
        }
    }   
    ctx.stroke();
} // draw



