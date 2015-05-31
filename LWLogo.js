"use strict";

var numero_ordre = 0;
var debug=true;   



/* Initialisation de l'interpreteur ******************************************/
function LWLogo() {       
    this.en_pause = false;    
    this.reference = new Reference();
    this.horloge = new Horloge(this);
    this.interpretes = []
    this.interpretes[0] = new Interpreteur(0,this,null);
    this.en_cours = false;
    this.tortues = [];    
    this.monde = new Monde('monde');
    this.tortues[0] = new Tortue(0,'tortue','dessin',this);
    this.editeur = null;
    this.vitesse(50);
    var canvas = document.getElementById('dessin');
    var ctx=canvas.getContext("2d");   
    ctx.fillStyle="rgba(255,255,255,0.1)";   
    ctx.clearRect ( 0 , 0 , canvas.width,canvas.height );    
    ctx.fillRect ( 0 , 0 , canvas.width,canvas.height );   
    this.troisD=null;
}

/* Lancement ****************************************************************/

LWLogo.prototype.run = function (code) {
  var r;
  if (!code) return;
  code = code.rtrim();
  if (code.length<1) return;  
  this.reference.procedures_util=[];
  this.en_pause=false;
  for (r=0;r<this.tortues.length;r++) {
      if (this.tortues[r]) this.tortues[r].reset();
  }  
  r = this.interpretes[0].interpreter(code);
  if ((r) && (r.type=='erreur')) {
      this.erreur(r);
  } else {
    for (r=0;r<this.tortues.length;r++) {
        if (this.tortues[r]) {
            this.tortues[r].vitesse = (this.ma_vitesse + 1);
        }
    }
    this.horloge.start();
  }
}   

LWLogo.prototype.stop = function() {
    var i;
    this.horloge.stop();
    for (i=0;i<this.interpretes.length;i++) {
        this.interpretes[i].pile_nb=[];
        this.interpretes[i].pile_op=[];
    }    
} 

LWLogo.prototype.ligne = function(int,elt,arg) {
    if (this.editeur) {
        if ((elt) && (elt.ligne)) {
            this.editeur.scrollToLine(elt.ligne,true,true);
            this.editeur.gotoLine(elt.ligne,0,false);            
        }    
    }
}

LWLogo.prototype.pause = function() {
    this.en_pause = ! this.en_pause;
}

LWLogo.prototype.vitesse = function(v) {    
    if (v>100) v=100;
    if (v<0) v=0;
    this.ma_vitesse = v;
    if (this.horloge.demarree) {
        this.horloge.stop();
        this.horloge.start();
    }
}

LWLogo.prototype.draw_info = function () {
}

LWLogo.prototype.draw_debug = function () {
    var i,d;
    var canvas = document.getElementById('etat');
    var w = canvas.width, h = canvas.height, ctx=canvas.getContext("2d");
    ctx.fillStyle="rgba(255,255,255,1)";     
    ctx.clearRect ( 0 , 0 , w,h );
    ctx.fillStyle="rgb(0,0,0)";
    ctx.strokeStyle="rgb(64,0,0)";
    d=0;
    var ou = this.interpretes[0];
    while ((ou) && (d<3)) {
        for (i=0;i<ou.pile_arg.length;i++) {
            var e = ou.pile_arg[i];
            ctx.strokeRect(15+(d*250),h-20-(i*20),100,20); 
            ctx.fillText(e.valeur,20+(d*250),h - 10 - (i*20)); 
        }
        for (i=0;i<ou.pile_op.length;i++) {
            var e = ou.pile_op[i];
            ctx.strokeRect(150+(d*250),h-20-(i*20),100,20); 
            ctx.fillText(e.nom,150+(d*250),h - 10 - (i*20)); 
        } 
        ou = ou.enfant;
        d++;
    }    
}    

/* Envoie une commande à la tortue */
LWLogo.prototype.commande = function(emetteur,cmd,param) {    
    if (emetteur) {
        emetteur.ordre_tortue = true;
        if ((emetteur.ID>=0) && (emetteur.ID<=this.tortues.length)) {
            if (this.tortues[emetteur.ID]) this.tortues[emetteur.ID].commande(cmd,param);
            if (debug) {
                var s = cmd,i=0;
                s=s+' [';
                for (i=0;i<param.length;i++) {
                    if (i==0) s=s+' ';else s=s+', ';
                    s = s+param[i];
                }
                s=s+' ] Taille pile: '+emetteur.pile_fun.length;
                console.log(s);
            }
        }
    }
}

/* Retour d'un ordre à la tortue */
LWLogo.prototype.retour_tortue = function(emetteur,token) { 
    var e;
    if (emetteur) {
        if ((emetteur.ID>=0) && (emetteur.ID<this.interpretes.length)) {
            if (this.interpretes[emetteur.ID]) {
                e = this.interpretes[emetteur.ID];
                while (e.enfant) e =e.enfant;
                if (debug) console.log('Retour '+token.valeur);
                e.pile_arg.push(token);
            }
        }
    }
}


LWLogo.prototype.tick = function (that) {

    var t,i,termine;
    
    if (this.en_cours) return;
    if (this.en_pause) return;
    this.en_cours = true;
    termine = false;
    
    this.draw_info();
    
    for (i=0;i<this.interpretes.length;i++) {
    
        if ((this.tortues[i]) && (this.tortues[i].en_cours)) {
            this.tortues[i].tick();
            continue;
        } else {

            if (this.interpretes[i].termine) {
                termine = true;
            } else {
                t = this.interpretes[i].interprete();
                if ((t) && (t.type=='erreur')) {                    
                    termine = true;                    
                    this.erreur(t);
                    break;
                }
            }
           
        }    
    }
    
    if (termine) {
        this.horloge.stop();
    }
    
    this.en_cours = false;
    
}


LWLogo.prototype.sel_tortue = function(nr) {
    var i;
    for (i=0;i<this.tortues.length;i++) {
        if (this.tortues[i]) {
            this.tortues[i].set_tortue(nr);
        }
    }
}

LWLogo.prototype.erreur = function(token) {
    var l=1,c=1,lg=0,s='';
    
    if (token) {
        if (token.ligne) l = token.ligne;
        if (token.colonne) c = token.colonne;
        lg = token.valeur.length;
    }
    
    if (debug) {
        if (!token) {
            console.log('erreur inconnue');
        } else  {            
            switch (token.origine) {
                case 'analyse' : console.log('Erreur lors de l analyse');
                                 console.log('Ligne: '+token.ligne+' Colonne: '+token.colonne);
                                 console.log(token.nom);
                                 console.log(token.exdata);
                                 console.log(token);
                                 break;
                case 'interprete' : console.log('Erreur lors de l interpretation');
                                 console.log('Ligne: '+token.ligne+' Colonne: '+token.colonne);
                                 console.log(token.nom+' '+token.valeur);
                                 console.log(token.exdata);
                                 console.log(token);
                                 break;
                case 'eval' :    console.log('Erreur lors de l evaluation');
                                 console.log('Ligne: '+token.ligne+' Colonne: '+token.colonne);
                                 console.log(token.s);
                                 console.log('pile nb ');
                                 console.log(token.exdata);
                default :        console.log('Erreur origine inconnue');                             
                                 console.log('Ligne: '+token.ligne+' Colonne: '+token.colonne);
                                 console.log(token.nom);
                                 console.log(token);
            }        
        }    
    }
    
    if (this.editeur) {
        if (c>1) c--;
        this.editeur.scrollToLine(l,true,true);
        this.editeur.gotoLine(l,c,true); 
        this.editeur.focus();
        if (lg>0) {
            var Range = require("ace/range").Range;            
            editor.selection.setRange(new Range(l-1, c-1, l-1, c+lg));
        }
        //this.editeur.moveCursorTo(l-1,c-1);
    } 

    s=this.reference.erreur(token);    
    $( "#err_dialog" ).html(s);
    $( "#err_dialog" ).dialog( "open" );
    
    
}

LWLogo.prototype.affichage = function (n) {    
    switch(n) {
        case 0 :    this.close_3d('WebGLCanvas');
                    break;
        case 1 :    this.init_3d('WebGLCanvas');
                    break;
    }
}

LWLogo.prototype.close_3d = function (obj) {
    if (this.troisD) {
        this.troisD.scene = null;
        this.troisD.camera = null;    
        $('#'+this.troisD.nom).empty();
        $('#'+this.troisD.nom).hide();               
    }    
    this.troisD = null;
    $('#dessin').show();
    $('#tortue').show();
    $('#monde').show();    
}

LWLogo.prototype.init_3d = function (obj) {
     
    if (this.troisD) return;
     
    var WIDTH = 800;var HEIGHT = 500;    
    $('#dessin').hide();
    $('#tortue').hide();
    $('#monde').hide();
    $('#'+obj).show();    
    this.troisD = new Object();
    this.troisD.nom = obj;
    this.troisD.scene = new THREE.Scene();
    this.troisD.camera = new THREE.PerspectiveCamera( 65, WIDTH/HEIGHT, 0.1, 1000 ); 
    //this.troisD.camera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000 );   
    this.troisD.renderer = new THREE.WebGLRenderer({antialias:true});
    this.troisD.renderer.setSize( WIDTH, HEIGHT );
    $('#'+obj).append(this.troisD.renderer.domElement);     
    
    //controls = new THREE.OrbitControls( this.troisD.camera );
    
    this.troisD.pointLight =  new THREE.PointLight(0xFFFFFF);
    this.troisD.pointLight.position.x = 10;
    this.troisD.pointLight.position.y = 50;
    this.troisD.pointLight.position.z = 130;
    this.troisD.scene.add(this.troisD.pointLight);    
         
     
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x660000 } );
    this.troisD.tortues=[];
	this.troisD.tortues[0] = new THREE.Mesh( geometry, material );
	this.troisD.scene.add(this.troisD.tortues[0]);
    this.troisD.tortues[0].position.y = -0.5;
    this.troisD.tortues[0].scale.x = 20;
    this.troisD.tortues[0].scale.y = 20;
    this.troisD.tortues[0].scale.z = 20;

    
    var canvas = document.getElementById('dessin');
    WIDTH=canvas.width;
    HEIGHT = canvas.height;
    this.troisD.dessin = new THREE.Texture(canvas); 
    this.troisD.dessin.magFilter = THREE.NearestFilter;
    this.troisD.dessin.minFilter = THREE.LinearFilter;       
    var geometry = new THREE.PlaneGeometry( WIDTH, HEIGHT);
    //var material = new THREE.MeshBasicMaterial( { color: 0x000066 } );
    var material = new THREE.MeshBasicMaterial( {
        map: this.troisD.dessin, side:THREE.DoubleSide
    } );
	var sol = new THREE.Mesh( geometry, material );
	this.troisD.scene.add( sol );
    sol.rotation.x = -Math.PI/2;
    //sol.rotation.z = Math.PI;
    //sol.position.y = Math.PI/2;

    this.troisD.camera.rotation.x=-0.5;    
    this.troisD.camera.position.y = 400;
	this.troisD.camera.position.z = 220;
    this.troisD.camera.up = new THREE.Vector3(0,0,-1);
    this.troisD.camera.lookAt(new THREE.Vector3(0,0,0));
//	var render = function () {
//	requestAnimationFrame( render );

	//logo.troisD.renderer.render(logo.troisD.scene,logo.troisD.camera);


    //render();  
    //$('#'+obj).show();
    this.troisD.dessin.needsUpdate = true;
    this.troisD.renderer.render(this.troisD.scene,this.troisD.camera);
}

 
/* Horloge**************** ******************************************/
function Horloge(parent) {
    this.logo = parent;    
    this.timer = null;
    this.demarree = false;
} 

Horloge.prototype.start = function() {
    var v;
    if (this.logo.ma_vitesse<=0) {
      v = 110;
    } else v = Math.floor(100 / this.logo.ma_vitesse);
    if (this.demarree) this.stop();    
    this.timer = setInterval(function () {this.logo.tick(this.logo);},v);
    this.demarree = true;
}

Horloge.prototype.stop = function() {
    clearInterval(this.timer);
    this.demarree = false;
    this.logo.en_cours = false;
    if (debug) console.log('stop horloge');
    
}


