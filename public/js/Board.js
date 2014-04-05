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

	this.loadHQs(hud)
	this.loadLanes(loader)

}

Board.prototype.loadHQs = function(hud){
	this.hqs = [
		new HQ(this.scene, this.hud, HQ.typesEnum.NATURE),
		new HQ(this.scene, this.hud, HQ.typesEnum.NEW_YORK)
	]

	this.hqs[HQ.typesEnum.NATURE].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateX( this.boardWidth - Game.config.lane.marginRight  )
	
	this.scene.add(this.hqs[HQ.typesEnum.NATURE].scene)
	this.scene.add(this.hqs[HQ.typesEnum.NEW_YORK].scene)
}

Board.prototype.loadLanes = function(loader){
	// Create Lower Lane
	this.lowerLane = new Lane(this.scene, loader)
	this.lowerLane.scene.translateX( Game.config.lane.marginLeft )
	this.lowerLane.scene.translateZ(- (Game.config.lane.marginBottom))
	
	// Create Middle Lane
	this.middleLane = new Lane(this.scene, loader);
	this.middleLane.scene.translateX( Game.config.lane.marginLeft )
	this.middleLane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing + 1 ))

	// Create Upper Lane
	this.uperLane = new Lane(this.scene, loader);
	this.uperLane.scene.translateX( Game.config.lane.marginLeft )
	this.uperLane.scene.translateZ(- (Game.config.lane.marginBottom + 2* (Game.config.lane.spacing + 1)))
}

Board.prototype.update = function(time, dt) {
	for (var i = 0; i < 2; i++) {
		this.hqs[i].update(time, dt)
	}

	this.lowerLane.update(time, dt)
	this.middleLane.update(time, dt)
	this.uperLane.update(time, dt)
}
