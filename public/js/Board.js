function Board(scene, loader)
{

	this.scene = new THREE.Object3D()
	scene.add(this.scene)

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

	this.loadHQs(loader)
	this.loadLanes(loader)






}

Board.prototype.update =  function(time, dt){
	this.lowerLane.update(time, dt)
	this.middleLane.update(time, dt)
	this.uperLane.update(time, dt)
}

Board.prototype.loadHQs = function(loader){
	// Create Nature HQ
	this.leftHQ = new HQ(this.scene, HQ.typesEnum.NATURE);
	this.leftHQ.scene.translateZ(- (Game.config.lane.marginBottom))
	

	// Create New York HQ
	this.rightHQ = new HQ(this.scene, HQ.typesEnum.NEW_YORK);
	this.rightHQ.scene.translateX( this.boardWidth - Game.config.lane.marginRight  )
	this.rightHQ.scene.translateZ(- (Game.config.lane.marginBottom))
}

Board.prototype.loadLanes = function(loader){
	// Create Lower Lane
	this.lowerLane = new Lane(this.scene, loader)
	this.lowerLane.scene.translateX( Game.config.lane.marginLeft )
	this.lowerLane.scene.translateZ(- (Game.config.lane.marginBottom))
	

	this.lowerLane.setPlayerPosition(HQ.typesEnum.NATURE, Game.config.nature.initOwnedCells);
	this.lowerLane.setPlayerPosition(HQ.typesEnum.NEW_YORK, Game.config.newYork.initOwnedCells);

	// Create Middle Lane
	this.middleLane = new Lane(this.scene, loader);
	this.middleLane.scene.translateX( Game.config.lane.marginLeft )
	this.middleLane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing + 1 ))


	this.middleLane.setPlayerPosition(HQ.typesEnum.NATURE, Game.config.nature.initOwnedCells);
	this.middleLane.setPlayerPosition(HQ.typesEnum.NEW_YORK, Game.config.newYork.initOwnedCells);

	// Create Upper Lane
	this.uperLane = new Lane(this.scene, loader);
	this.uperLane.scene.translateX( Game.config.lane.marginLeft )
	this.uperLane.scene.translateZ(- (Game.config.lane.marginBottom + 2* (Game.config.lane.spacing + 1)))


	this.uperLane.setPlayerPosition(HQ.typesEnum.NATURE, Game.config.nature.initOwnedCells);
	this.uperLane.setPlayerPosition(HQ.typesEnum.NEW_YORK, Game.config.newYork.initOwnedCells);
}