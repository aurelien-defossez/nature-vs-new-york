function Board()
{

	this.scene = new THREE.Object3D()

	this.boardWidth = Game.config.lane.marginLeft + Game.config.lane.cellNumber + Game.config.lane.marginRight
	this.boardHeight = Game.config.lane.marginTop + 2 * Game.config.lane.spacing + 3 + Game.config.lane.marginBottom
	planeGeom = new THREE.PlaneGeometry(this.boardHeight, this.boardWidth);
	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.boardWidth, this.boardHeight), new THREE.MeshLambertMaterial())
	this.plane.position.x = this.boardWidth/2
	this.plane.position.z = -this.boardHeight/2
	this.scene.add(this.plane)
	this.plane.rotation.x = -Math.PI * 0.5
	this.plane.castShadow = false
	this.plane.receiveShadow = true

	this.lowerLane = new Lane()
	this.lowerLane.scene.translateX( Game.config.lane.marginLeft )
	this.lowerLane.scene.translateZ(- (Game.config.lane.marginBottom))
	this.scene.add(this.lowerLane.scene)

	this.middleLane = new Lane();
	this.middleLane.scene.translateX( Game.config.lane.marginLeft )
	this.middleLane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing + 1 ))
	this.scene.add(this.middleLane.scene)

	this.uperLane = new Lane();
	this.uperLane.scene.translateX( Game.config.lane.marginLeft )
	this.uperLane.scene.translateZ(- (Game.config.lane.marginBottom + 2* (Game.config.lane.spacing + 1)))
	this.scene.add(this.uperLane.scene)


}