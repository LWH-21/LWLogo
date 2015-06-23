/* **************** ***********************************************************/
/* Dessin  *******************************************************************/
/* ***************************************************************************/
"use strict";

function Dessin(logo,nom_canvas) { /*******************************************/
    this.canvas = document.getElementById(nom_canvas);    
    this.largeur = this.canvas.width;
    this.hauteur = this.canvas.height;   
    this.LWLogo = logo;    
    this.lst = [];
}; // Dessin(logo,nom_canvas)

Dessin.prototype.ajoute =  function(n,o,d,couleur,epaisseur) { /**************/
    var i,e,ajout=true;
    i = this.lst.length - 1;
    if (i>=0) {
        e = this.lst[i];
        if ( (e.numero === n) &&(e.dest.x===o.x) && (e.dest.y===o.y) && (e.couleur===couleur) && (e.taille===epaisseur)) {
            e.dest = d;
            ajout=false;
        } 
    } 
    if (ajout) {
        e = new DessinElt(n,o,d,couleur,epaisseur);
        this.lst.push(e);
    }   
} // Dessin.ajoute(o,d,couleur,epaisseur)

Dessin.prototype.ligne = function(n,o,d,couleur,epaisseur) { /****************/
    var ctx=this.canvas.getContext("2d");
    ctx.lineWidth=epaisseur;
    ctx.strokeStyle=couleur;
    ctx.lineCap="round";
    ctx.beginPath();
    ctx.moveTo(o.x,o.y);
    ctx.lineTo(d.x,d.y);
    ctx.stroke(); 
    this.ajoute(n,o,d,couleur,epaisseur);    
} // Dessin.ligne(n,o,d,couleur,epaisseur)

Dessin.prototype.toSVG = function(f) { /**************************************/
    var d = new Date(), s='', i, e;
    if (f) {
        s='<?xml version="1.0" encoding="utf-8"?>';
        s=s+'<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"  xmlns:svg="http://www.w3.org/2000/svg"\n';
        s=s+'xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ';
        s=s+'width="'+this.largeur+'" height="'+this.hauteur+'" viewbox="0 0 '+this.largeur+' '+this.hauteur+'">\n'
        s=s+' id="svg2" version="1.1" inkscape:version="0.48.4 r9939"   sodipodi:docname="LWLogo.svg">\n';
        s=s+'<metadata id="metadata382">\n<rdf:RDF><cc:Work rdf:about="">\n<dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />\n<dc:title>Dessin LWLogo</dc:title>\n';
        s=s+'<dc:creator><cc:Agent><dc:title>LWH</dc:title></cc:Agent></dc:creator>\n<dc:source>http://lwh.free.fr</dc:source><dc:language>FR</dc:language><dc:description>LWLogo</dc:description>\n';        
        s=s+'<dc:date>'+d.toISOString()+'</dc:date>\n<dc:publisher><cc:Agent><dc:title>LWH</dc:title></cc:Agent></dc:publisher>\n<cc:license rdf:resource="http://creativecommons.org/licenses/by/3.0/" /></cc:Work>\n';
        s=s+'<cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">\n<cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />\n<cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />\n';
        s=s+'<cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />\n<cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />\n<cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />\n';
        s=s+'</cc:License></rdf:RDF></metadata>\n'; 
    } else {
        s=s+'<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+this.largeur+'" height="'+this.hauteur+'" ';
    }    
    s=s+'viewbox=" 0 0 '+this.largeur+' '+this.hauteur+'">'   
    if (f) {
        s=s+'<title>Dessin Logo</title>';
        s=s+'<desc> Code : '+'\n';
        s=s+'Genere a partir de : http://lwh.free.fr\n';
        s=s+'</desc>\n';     
    }
    for (i=0;i<this.lst.length;i++) {
        e = this.lst[i];         
        s=s+'<path d="M'+(e.origine.x)+','+(e.origine.y)+' L'+(e.dest.x)+','+(e.dest.y)+'" style="stroke: '+e.couleur+'; stroke-width: '+e.taille+'px; fill: none;"/>\n'; 
    }
    s=s+'</svg>';                          
    return s;           
} // Dessin.toSVG(f)


Dessin.prototype.vide = function() { /****************************************/
   this.lst=[];    
   var ctx=this.canvas.getContext("2d");
   ctx.fillStyle="rgba(0,0,64,0.8)";
   ctx.clearRect ( 0 , 0 , this.largeur,this.hauteur);    
} // Dessine.vide()

function DessinElt(n,o,d,couleur,epaisseur) { /*******************************/
    this.numero = n;
    this.origine = o;    
    this.dest = d;
    this.couleur = couleur;   
    this.taille = epaisseur;    
}; // DessinElt(n,o,d,couleur,epaisseur)
