/* ***************************************************************************/
/* Monde  ********************************************************************/
/* ***************************************************************************/
"use strict";

function Monde(nom_canvas) { /************************************************/
    this.canvas = document.getElementById(nom_canvas);    
    this.largeur=this.canvas.width;
    this.hauteur=this.canvas.height;
    this.draw();
} // Monde

Monde.prototype.collision = function(points) { /******************************/
    var i,p;
    if (points) {
        for (i=0;i<points.length;i++) {
            p = points[i];
            if ((p.x<0) || (p.x>this.largeur) || (p.y<0) || (p.y>this.hauteur)) return true;
        }
    }
    return false;
} // collision

Monde.prototype.draw = function() { /*****************************************/
    var ctx=this.canvas.getContext("2d");
    ctx.fillStyle="rgba(0,0,64,0.8)";
    ctx.clearRect ( 0 , 0 , this.largeur,this.hauteur );    
} // draw



