function Game()
{
	this.currentTime = null
	
	var gameDiv = document.getElementById("game")
	
	this.renderer = new THREE.WebGLRenderer({ antialias: Game.config.antialiasing })
	this.renderer.setSize(1280, 720)
	this.renderer.shadowMapEnabled = true
	this.renderer.setClearColor(0xddefff, 1)
	gameDiv.appendChild(this.renderer.domElement)
	
	this.scene = new THREE.Scene()

	this.board= new Board();

	this.scene.add(this.board.scene)
	
	this.camera = new THREE.PerspectiveCamera(50.0, 16.0 / 9.0, 0.1, 1000.0)
	this.scene.add(this.camera)
	this.camera.position.set(this.board.boardWidth/2, 6, 2)
	this.camera.lookAt(new THREE.Vector3( this.board.boardWidth/2, 0, -this.board.boardHeight/2 ))


	




	
	this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
	this.hemiLight.color.setHSL(0.6, 1, 0.6)
	this.hemiLight.groundColor.setHSL(0.095, 1, 0.75)
	this.hemiLight.position.set(0, 100, 0)
	this.scene.add(this.hemiLight)
	
	this.dirLight = new THREE.DirectionalLight(0xffffff, 1)
	this.dirLight.color.setHSL(0.1, 1, 0.95)
	this.dirLight.position.set(-1, 1.75, 1)

	this.dirLight.position.multiplyScalar(20)
	this.dirLight.target.position.set(this.board.boardWidth/2, 0, -this.board.boardHeight/2)
	this.dirLight.castShadow = true
	var shadowSize = 6
	this.dirLight.shadowCameraLeft = -shadowSize;
	this.dirLight.shadowCameraRight = shadowSize;
	this.dirLight.shadowCameraTop = shadowSize;
	this.dirLight.shadowCameraBottom = -shadowSize;
	this.dirLight.shadowCameraNear = 30;
	this.dirLight.shadowCameraFar = 60;
	this.dirLight.shadowBias = -0.00092
	//this.dirLight.shadowCameraVisible = true
	//this.dirLight.shadowMapBias = -10;
	this.dirLight.shadowMapWidth = this.dirLight.shadowMapHeight = 1024;
	this.scene.add(this.dirLight)
	
	//var light = new THREE.PointLight(0xffffff, 2, 0)
	//this.scene.add(light)
	
	this.loader = new THREE.JSONLoader()
	
	this.musicManager = new MusicManager()
    
    this.action = {
        player1: new Date(),
        player2: new Date()
    }
}

Game.prototype.update = function(time)
{
    var dt = 0,
        pads,
        time

    if (this.currentTime != null)
        dt = Math.min(time - this.currentTime,  1000 / 25)
        this.currentTime = time

        this.musicManager.update(time, dt, 0)

        if (Gamepad.supported) {
            pads = Gamepad.getStates()
            time = new Date()
            if(pads[1] && (this.action.player1 == null || time - this.action.player1 > 200)) {
                this.action.player1 = new Date()
                buttonAction(1, pads[1])
            }
            if(pads[2] && (this.action.player2 == null || time - this.action.player2 > 200)) {
                this.action.player2 = new Date()
                buttonAction(2, pads[2])
            }
        }

    this.renderer.render(this.scene, this.camera)
}
