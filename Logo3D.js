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

    this.renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer: true});
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
        lightMap: this.dessin,
        specularMap:this.dessin,
        alphaTest:0.13,
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
        map: this.fond, side:THREE.FrontSide,color: 0xEDE5E4,
        shading:THREE.SmoothShading
    } );
    this.monde = new THREE.Mesh( geometry, material );
    this.monde.receiveShadow=true;
    this.collada.add( this.monde );
    this.monde.position.x = 0;
    this.monde.position.y = 0;
    this.monde.position.z = 14.8;


    var geometry = new  THREE.SphereGeometry( this.WIDTH*2, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {
        side:THREE.DoubleSide,color: 0xEDE5E4
    } );
    var ciel = new THREE.Mesh( geometry, material );
    this.collada.add( ciel );

     var ambientLight = new THREE.AmbientLight(0xD1ECED);
     this.scene.add(ambientLight);

     this.Light = new THREE.DirectionalLight(0x0000FF,1);
    // this.Light.position.set(0, 0, 10).normalize();
     this.Light.position.z = 2000;
     this.Light.position.x = 1500;
     this.Light.position.y = 1500;
     
    // this.collada.add( new THREE.DirectionalLightHelper(this.Light, 50) );
     
     //directionalLight.position.set(0, 100, 0);
     this.collada.add(this.Light);
     this.Light.castShadow=true;
     this.Light.shadowDarkness = 0.1;
     //this.Light.shadowCameraVisible  = true;
   /*  directionalLight.shadowCameraRight    =  200;
     directionalLight.shadowCameraLeft     = -200;
     directionalLight.shadowCameraTop      =  200;
     directionalLight.shadowCameraBottom   = 0;*/
     
    

/*this.Light.shadowMapWidth = 1024;
this.Light.shadowMapHeight = 1024;

this.Light.shadowCameraNear = 500;
this.Light.shadowCameraFar = 4000;
this.Light.shadowCameraFov = 30;*/
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
            //if (this.logo.tortues[i].crayon_baisse) this.tortues[i].position.z=0;else this.tortues[i].position.z=10;
            this.tortues[i].position.z=0;
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
