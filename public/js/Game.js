function Game()
{
	this.currentTime = null
	
	var gameDiv = document.getElementById("game")
	
	this.renderer = new THREE.WebGLRenderer()
	this.renderer.setSize(1280, 720)
	this.renderer.shadowMapEnabled = true
	this.renderer.setClearColor(0xddefff, 1)
	gameDiv.appendChild(this.renderer.domElement)
	
	this.scene = new THREE.Scene()
	
	this.camera = new THREE.PerspectiveCamera(90.0, 16.0 / 9.0, 0.1, 1000.0)
	this.scene.add(this.camera)
	this.camera.position.set(0, 5, 20)
	
	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial())
	this.scene.add(this.plane)
	this.plane.rotation.x = -Math.PI * 0.5
	this.plane.castShadow = true
	this.plane.receiveShadow = true
	
	this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
	this.hemiLight.color.setHSL(0.6, 1, 0.6)
	this.hemiLight.groundColor.setHSL(0.095, 1, 0.75)
	this.hemiLight.position.set(0, 500, 0)
	this.scene.add(this.hemiLight)
	
	this.dirLight = new THREE.DirectionalLight(0xffffff, 1)
	this.dirLight.color.setHSL(0.1, 1, 0.95)
	this.dirLight.position.set(-1, 1.75, 1)
	this.dirLight.position.multiplyScalar(50)
	this.dirLight.castShadow = true
	var shadowSize = 20
	this.dirLight.shadowCameraLeft = -shadowSize;
	this.dirLight.shadowCameraRight = shadowSize;
	this.dirLight.shadowCameraTop = shadowSize;
	this.dirLight.shadowCameraBottom = -shadowSize;
	this.dirLight.shadowCameraNear = 50;
	this.dirLight.shadowCameraFar = 250;
	//this.dirLight.shadowCameraVisible = true
	//this.dirLight.shadowMapBias = -10;
	this.dirLight.shadowMapWidth = this.dirLight.shadowMapHeight = 512;
	this.scene.add(this.dirLight)
	
	//var light = new THREE.PointLight(0xffffff, 2, 0)
	//this.scene.add(light)
	
	this.loader = new THREE.JSONLoader()
	
	this.musicManager = new MusicManager()
}

Game.prototype.update = function(time)
{
	var dt = 0
	if (this.currentTime != null)
		dt = Math.min(time - this.currentTime,  1000 / 25)
	this.currentTime = time
	
	this.musicManager.update(time, dt, 0)
	
	this.renderer.render(this.scene, this.camera)
}
