function Game()
{
    this.currentTime = null
	this.isStartup = true

    var gameDiv = document.getElementById("game")

    this.renderer = new THREE.WebGLRenderer({ antialias: Game.config.antialiasing })
    this.renderer.setSize(Game.config.board.width, Game.config.board.height)
    this.renderer.shadowMapEnabled = true
    this.renderer.setClearColor(0xddefff, 1)
    gameDiv.appendChild(this.renderer.domElement)

    this.loader = new THREE.JSONLoader()

    this.scene = new THREE.Scene()

    this.hud = new HUD()
    this.hud.scene.position.set( 0, 0, -1);

    this.board = new Board(this.scene, this.loader, this.hud);


    this.camera = new THREE.PerspectiveCamera(50.0, 16.0 / 9.0, 0.1, 1000.0)
    this.scene.add(this.camera)
    this.camera.position.set(this.board.boardWidth/2, 7, 4)
    this.camera.lookAt(new THREE.Vector3( this.board.boardWidth/2, 0, -this.board.boardHeight/2 ))
    this.camera.add(this.hud.scene);

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

    this.musicManager = new MusicManager()

    this.players = {
        left: new Player(HQ.typesEnum.NATURE, this.board, new PadController(0)),
        right: new Player(HQ.typesEnum.NEW_YORK, this.board, new PadController(1))
    }
}

Game.prototype.update = function(time)
{
    var dt = 0
    if (this.currentTime != null) {
        dt = Math.min(time - this.currentTime,  1000 / 25)/1000
    }
    this.currentTime = time

    this.board.update(time, dt)
    this.musicManager.update(time, dt, 0)

    this.players.left.controlAction()
    this.players.right.controlAction()

    this.renderer.render(this.scene, this.camera)
}
