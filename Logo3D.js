/* ***************************************************************************/
/* Affichage 3d avec three.js ************************************************/
/* ***************************************************************************/
"use strict";

function Logo3D(parent,nom) {
    this.logo = parent;
    this.nom = nom;
    
    $('#'+this.nom).show();

    this.WIDTH = 800;
    this.HEIGHT = 500;
    this.fov = 40;

    $('#'+this.nom).show();

    this.tortues=[];
    this.sol = null;
    this.dessin = null;
    this.style = 0;

}

function webglAvailable() { 
    try {
        var canvas = document.createElement("canvas");
        return !!
            window.WebGLRenderingContext && 
            (canvas.getContext("webgl") || 
                canvas.getContext("experimental-webgl"));
    } catch(e) { 
        return false;
    } 
}

function animate() {
    if (logo.troisD) {
        logo.troisD.render();
    }
}

Logo3D.prototype.change_tortue = function(n) {
    var n, plateau,i,j;
    this.style=n;
    if (! this.collada) {
        return;
    }
    switch(n) {
        case 1 : n = 'TortueB';break;
        case 2 : n = 'TortueC';break;
        case 3 : n = 'TortueD';break;
        default: n = 'TortueA';break;
    }
    plateau = this.collada.getObjectByName('Plateau',true);
    for (i=0;i<plateau.children.length;i++) {
        if (plateau.children[i].name.substr(0, 6)=='Tortue') {
            plateau.children[i].visible=false;
        }
    }

    for (i=0;i<this.logo.tortues.length;i++)  {
        this.tortues[i]=this.collada.getObjectByName(n);
        this.tortues[i].position.set(0,100,0);
        this.tortues[i].visible=true;
        this.tortues[i].castShadow=true;
        this.tortues[i].castShadow = true;
        this.tortues[i].receiveShadow = true;
        for (j=0;j<this.tortues[i].children.length;j++) {
            this.tortues[i].children[j].castShadow=true;
            this.tortues[i].children[j].receiveShadow=true;
        }
        
    }
}

Logo3D.prototype.close = function() {
        this.scene = null;
        this.camera = null;
        $('#'+this.nom).empty();
        $('#'+this.nom).hide();
}

Logo3D.prototype.maj_monde = function() {
    var plateau, i;
    plateau = this.collada.getObjectByName('Plateau',true);
    i = 0;
    while (i<this.collada.children.length) {
        if (this.collada.children[i].name.substr(0, 3)=='Mur') {
            this.collada.remove(this.collada.children[i]);
        } else i++;
    }
    for (i=0;i<this.logo.monde.murs.length;i++) {
        var m = this.logo.monde.murs[i];
        var cube = new THREE.Mesh( new THREE.BoxGeometry(m.w,m.h, 30 ), new THREE.MeshNormalMaterial() );
        cube.name='Mur'+i;
        cube.position.x = m.x + (m.w /2);
        cube.position.y = m.y - (m.h / 2);
        cube.position.z = 10;
        this.collada.add( cube);
        cube.castShadow=true;
    }
}

Logo3D.prototype.start = function() {

    var canvas = document.getElementById('dessin');
    var WIDTH=canvas.width;
    var HEIGHT = canvas.height;
    var i,j;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.fov, this.WIDTH/this.HEIGHT, 1, 4000 );
    this.camera.rotation.x=-31;
    this.camera.position.x = 0;
    this.camera.position.y = -500;
    this.camera.position.z = 500;
    this.camera.up = new THREE.Vector3(0,1,0);
    this.camera.lookAt(this.scene.position);

    this.renderer = webglAvailable() ? new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer: true}) : new THREE.CanvasRenderer({antialias:true, preserveDrawingBuffer: true});

    this.renderer.setSize( this.WIDTH, this.HEIGHT );
    this.renderer.setClearColor( 0xFFFFFF,0.5 );
    this.renderer.shadowMapEnabled=true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        
    this.scene.add(this.collada);

    $('#'+this.nom).append(this.renderer.domElement);

    this.dessin = new THREE.Texture(canvas);
    this.dessin.magFilter = THREE.NearestFilter;
    this.dessin.minFilter = THREE.LinearFilter;

    var geometry = new THREE.PlaneGeometry( WIDTH, HEIGHT);
    var material = new THREE.MeshPhongMaterial( {
        map: this.dessin, side:THREE.FrontSide,color: 0xEDE5E4,
        shading: THREE.SmoothShading,
        shininess:10,
        //lightMap: this.dessin,
        //specularMap:this.dessin,
        alphaTest:0.102,
        fog:false
    } );


    this.sol = new THREE.Mesh( geometry, material );
    this.collada.add( this.sol );
    this.sol.position.x = 0;
    this.sol.position.y = 0;
    this.sol.position.z = 15;
    this.sol.receiveShadow=true;


    var canvas = document.getElementById('monde');
    this.fond = new THREE.Texture(canvas);
    this.fond.magFilter = THREE.NearestFilter;
    this.fond.minFilter = THREE.LinearFilter;
    var geometry = new THREE.PlaneGeometry( WIDTH, HEIGHT);
    var material = new THREE.MeshPhongMaterial( {
        //alphaMap: this.dessin,
        //bumpMap: this.dessin,        
        wrapRGB : (0.5,0.5,0.5),
        map: this.fond,
        //envMap:this.dessin,
        side:THREE.FrontSide,color: 0xEDE5E4,
        shading:THREE.SmoothShading
        //alphaTest:0.8
    } );
    this.monde = new THREE.Mesh( geometry, material );
    this.monde.receiveShadow=true;
    this.collada.add( this.monde );
    this.monde.position.x = 0;
    this.monde.position.y = 0;
    this.monde.position.z = 14.8;


    var skyBoxGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	this.scene.add(skyBox);
    
    /*var geometry = new  THREE.SphereGeometry( this.WIDTH*2, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {
        side:THREE.DoubleSide,color: 0xEDE5E4
    } );
    var ciel = new THREE.Mesh( geometry, material );
    this.collada.add( ciel );*/

    this.ambientLight = new THREE.AmbientLight(0xD1ECED);
    this.scene.add(this.ambientLight);

    this.spriteTexture = new THREE.Texture(this.logo.tortues[0].textCanvas) 
    this.spriteTexture.magFilter = THREE.NearestFilter;
    this.spriteTexture.minFilter = THREE.LinearFilter;    
    this.spriteTexture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map:  this.spriteTexture, useScreenCoordinates: false/*, alignment: spriteAlignment*/ } );
	this.textSprite = new THREE.Sprite( spriteMaterial );
	this.textSprite.scale.set(100,50,2.0);
    this.scene.add(this.textSprite);
        
    this.Light = new THREE.DirectionalLight(0x0000FF,0.5);
    this.Light.position.z = 2000;
    this.Light.position.x = 1500;
    this.Light.position.y = 1500;
     
    this.collada.add(this.Light);
    this.Light.castShadow=true;
    this.Light.shadowDarkness = 0.1;

    this.Light.target = this.sol;  

    var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    controls.target = this.collada.position;
    controls.damping = 0.2;
    controls.autorotate=true;
    controls.noPan=true;
    controls.minDistance = 200;
    controls.maxDistance = 1500;
    controls.minAzimuthAngle =-Math.PI / 4 ;
    controls.maxAzimuthAngle = Math.PI / 4 ;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = 19*Math.PI /20;

    init_helper();
    this.dessin.needsUpdate = true;
    this.fond.needsUpdate = true;
    this.change_tortue(this.style);
    this.maj_monde();
    animate();


}

Logo3D.prototype.makeTextSprite = function( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var context = this.textCanvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	this.spriteTexture.needsUpdate = true;
}

function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

Logo3D.prototype.update_fond = function() {
    this.fond.needsUpdate=true;
}

Logo3D.prototype.init = function() {
    var loader = new THREE.ColladaLoader();
    var that = this;
    this.pret=false;
    loader.load('scene.dae', function (result) {
        result.scene.position.set(0,0,0);
        that.collada = result.scene;
        loader.options.convertUpAxis = true;
        that.start();
    });
}

Logo3D.prototype.render = function() {
    var i;
    requestAnimationFrame(animate);
    for (i=0;i<this.tortues.length;i++) {
        if ((this.tortues[i]) && (this.logo.tortues[i])) {           
            this.tortues[i].position.z=0;
            this.tortues[i].visible = this.logo.tortues[i].visible;
            this.tortues[i].position.x = this.logo.tortues[i].posx;
            this.tortues[i].position.y = this.logo.tortues[i].posy;
            this.tortues[i].rotation.z = this.logo.tortues[i].cap*(-Math.PI/180);             
            if (this.logo.tortues[i].bulle>0) {                
                this.textSprite.visible = true;
                this.textSprite.position.x = this.logo.tortues[i].posx;
                this.textSprite.position.y = this.logo.tortues[i].posy;
                this.textSprite.position.z = 30 + this.logo.tortues[i].textCanvas.height ;
                this.textSprite.scale.set(this.logo.tortues[i].textCanvas.width,this.logo.tortues[i].textCanvas.height,1.0); 
                this.spriteTexture.needsUpdate = true;                
            } else {
                this.textSprite.visible = false;
            }
        }
    }

    this.renderer.render(this.scene,this.camera);
}

Logo3D.prototype.update = function() {
    if (this.dessin) {
       this.dessin.needsUpdate=true;
    }
}
