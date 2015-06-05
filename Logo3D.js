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
    
}

function animate() {
    if (logo.troisD) {
        logo.troisD.render();
    }
}


Logo3D.prototype.close = function() {
        this.scene = null;
        this.camera = null;    
        $('#'+this.nom).empty();
        $('#'+this.nom).hide();      
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
   
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize( this.WIDTH, this.HEIGHT );
    this.renderer.setClearColor( 0xFFFFFF,0.5 );
    $('#'+this.nom).append(this.renderer.domElement);         
        
    this.dessin = new THREE.Texture(canvas); 
    this.dessin.magFilter = THREE.NearestFilter;
    this.dessin.minFilter = THREE.LinearFilter;       
    var geometry = new THREE.PlaneGeometry( WIDTH, HEIGHT);    
    var material = new THREE.MeshBasicMaterial( {
        map: this.dessin, side:THREE.DoubleSide,color: 0xEDE5E4, 
        shading:THREE.SmoothShading,
        lightMap: this.dessin,
        specularMap:this.dessin,
        fog:false
    } );
    /*var that = this;
    var material = THREE.MeshBasicMaterial( {
    map: that.dessin, side:THREE.DoubleSide
    } );   */     
	this.sol = new THREE.Mesh( geometry, material );
	this.collada.add( this.sol );
    this.sol.position.x = 0;
    this.sol.position.y = 0;    
    this.sol.position.z = 15;
    
  
    var geometry = new  THREE.SphereGeometry( this.WIDTH*2, 32, 32 ); 
    var material = new THREE.MeshPhongMaterial( {
        side:THREE.DoubleSide,color: 0xEDE5E4
    } );
	var ciel = new THREE.Mesh( geometry, material );
	this.collada.add( ciel );
  
     var ambientLight = new THREE.AmbientLight(0xD1ECED);
     this.scene.add(ambientLight);
   /*  var directionalLight = new THREE.DirectionalLight(0x0000FF);
     directionalLight.position.set(1, 1, 1).normalize();
     this.scene.add(directionalLight);  */
  
    this.scene.add(this.collada);
 
    for (i=0;i<this.logo.tortues.length;i++)  {
        j = i+1;
        this.tortues[i]=this.collada.getObjectByName( "Tortue"+j);
        this.tortues[i].position.set(0,0,0);       
    }
    
         
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
    animate();
    
}

Logo3D.prototype.init = function() {

    var loader = new THREE.ColladaLoader();   
    var that = this;    
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
            if (this.logo.tortues[i].crayon_baisse) this.tortues[i].position.z=0;else this.tortues[i].position.z=10;
            this.tortues[i].visible = this.logo.tortues[i].visible;
            this.tortues[i].position.x = this.logo.tortues[i].posx;
            this.tortues[i].position.y = this.logo.tortues[i].posy;  
            this.tortues[i].rotation.z = this.logo.tortues[i].cap*(-Math.PI/180);
        }
    }      
    
    this.renderer.render(this.scene,this.camera);         
}

Logo3D.prototype.update = function() {
    if (this.dessin) {
       this.dessin.needsUpdate=true; 
    }
}
