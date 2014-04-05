function Board()
{

	this.scene = new THREE.Object3D()

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

	this.loadHQs()
	this.loadLanes()






}

Board.prototype.loadHQs = function(){
	// Create Nature HQ
	this.leftHQ = new HQ("nature");
	this.leftHQ.scene.translateZ(- (Game.config.lane.marginBottom))
	this.scene.add(this.leftHQ.scene)



	// Create New York HQ
	this.rightHQ = new HQ("newYork");
	this.scene.add(this.rightHQ.scene)
	this.rightHQ.scene.translateX( this.boardWidth - Game.config.lane.marginRight  )
	this.rightHQ.scene.translateZ(- (Game.config.lane.marginBottom))
}

Board.prototype.loadLanes = function(){
	// Create Lower Lane
	this.lowerLane = new Lane()
	this.lowerLane.scene.translateX( Game.config.lane.marginLeft )
	this.lowerLane.scene.translateZ(- (Game.config.lane.marginBottom))
	this.scene.add(this.lowerLane.scene)

	this.lowerLane.setPlayerPosition("nature", Game.config.nature.initOwnedCells);
	this.lowerLane.setPlayerPosition("newYork", Game.config.newYork.initOwnedCells);

	// Create Middle Lane
	this.middleLane = new Lane();
	this.middleLane.scene.translateX( Game.config.lane.marginLeft )
	this.middleLane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing + 1 ))
	this.scene.add(this.middleLane.scene)

	this.middleLane.setPlayerPosition("nature", Game.config.nature.initOwnedCells);
	this.middleLane.setPlayerPosition("newYork", Game.config.newYork.initOwnedCells);

	// Create Upper Lane
	this.uperLane = new Lane();
	this.uperLane.scene.translateX( Game.config.lane.marginLeft )
	this.uperLane.scene.translateZ(- (Game.config.lane.marginBottom + 2* (Game.config.lane.spacing + 1)))
	this.scene.add(this.uperLane.scene)

	this.uperLane.setPlayerPosition("nature", Game.config.nature.initOwnedCells);
	this.uperLane.setPlayerPosition("newYork", Game.config.newYork.initOwnedCells);
}