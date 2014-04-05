function Board(scene, loader, hud)
{

	this.scene = new THREE.Object3D()
	scene.add(this.scene)

	this.hud = hud
	this.boardWidth = Game.config.lane.marginLeft + Game.config.lane.cellNumber + Game.config.lane.marginRight
	this.boardHeight = Game.config.lane.marginTop + 2 * Game.config.lane.spacing + 3 + Game.config.lane.marginBottom
	planeGeom = new THREE.PlaneGeometry(this.boardHeight, this.boardWidth);
	material = new THREE.MeshLambertMaterial()
	material.color = new THREE.Color( 0, 0.5, 0.2 );
	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.boardWidth, this.boardHeight), material)
	this.plane.position.x = this.boardWidth/2
	this.plane.position.z = -this.boardHeight/2
	this.scene.add(this.plane)
	this.plane.rotation.x = -Math.PI * 0.5
	this.plane.castShadow = false
	this.plane.receiveShadow = true

	this.loadLanes(loader)
	this.loadHQs(hud)
}

Board.prototype.popBuilding = function(button, laneIndex, playerName){
	var lane = this.lanes[laneIndex]
    lane.popBuilding(button, playerName)
}

Board.prototype.popMonster = function(button, laneIndex, playerName){
    var lane = this.lanes[laneIndex]
    var unit = new Unit(lane.scene, playerName, button)
    lane.addUnitInQueue(unit)
}

Board.prototype.loadHQs = function(hud){
	this.hqs = [
		new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NATURE),
		new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NEW_YORK)
	]

	this.hqs[HQ.typesEnum.NATURE].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateX( this.boardWidth - Game.config.lane.marginRight  )
	
	this.scene.add(this.hqs[HQ.typesEnum.NATURE].scene)
	this.scene.add(this.hqs[HQ.typesEnum.NEW_YORK].scene)
}

Board.prototype.loadLanes = function(loader){
	this.lanes = []
	for (var i = 0; i < 3; i++) {
		var lane = new Lane(this, loader)
		lane.scene.translateX( Game.config.lane.marginLeft )
		lane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing * i))
		this.lanes[i] = lane
	}
}

Board.prototype.update = function(time, dt) {
	for (var i = 0; i < 2; i++) {
		this.hqs[i].update(time, dt)
	}
	for (var i = 0; i < 3; i++) {
		this.lanes[i].update(time, dt)
	}
}

Board.prototype.hitEnemy = function(player) {
    if(player === HQ.typesEnum.NATURE) {
        this.hqs[HQ.typesEnum.NEW_YORK].removeHealth(1);
    } else if(player === HQ.typesEnum.NEW_YORK) {
        this.hqs[HQ.typesEnum.NATURE].removeHealth(1);
    }
}
