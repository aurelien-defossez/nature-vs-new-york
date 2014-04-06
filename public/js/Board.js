function Board(scene, loader, hud)
{

	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	this.loader = loader

	this.hud = hud
	this.boardWidth = Game.config.lane.marginLeft + Game.config.lane.cellNumber + Game.config.lane.marginRight
	this.boardHeight = Game.config.lane.marginTop + 2 * Game.config.lane.spacing + 3 + Game.config.lane.marginBottom
	planeGeom = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
	material = new THREE.MeshLambertMaterial()
	material.color = new THREE.Color( 0, 0.5, 0.2 );
	this.plane = new THREE.Mesh(planeGeom, material)
	this.plane.position.x = this.boardWidth/2
	this.plane.position.z = -this.boardHeight/2
	this.scene.add(this.plane)
	this.plane.rotation.x = -Math.PI * 0.5
	this.plane.castShadow = false
	this.plane.receiveShadow = true

	this.loadLanes(loader)
	this.loadHQs(hud)

	this.alerts = []
}

Board.prototype.popBuilding = function(button, laneIndex, playerName){
	var lane = this.lanes[laneIndex]
	var hq = this.hqs[playerName]

	var hasEmptyCell = false;
	if (playerName == HQ.typesEnum.NATURE){
		for (var i = 0; i <= lane.cells.length -1; i++){
			if (lane.cells[i].building == null && lane.cells[i].owner == playerName){
				hasEmptyCell = true;
				break;
			}
		}
	} else {
		for (var i = lane.cells.length -1 ; i >= 0; i--){
			if (lane.cells[i].building == null && lane.cells[i].owner == playerName){
				lane.cells[i].build(button, playerName, hq)
				hasEmptyCell = true;
				break;
			}
		}
	}

	if (hasEmptyCell)
	{
		var building = hq.buyBuilding(lane.scene, playerName, button);

		if (building) {
			lane.popBuilding(button, playerName, this.hqs[playerName])
		} else {
	    	console.log("Not enough mana")
	    }
	}else{
		console.log("Not Enought Cells")
	}

}

Board.prototype.popMonster = function(button, laneIndex, playerName){
    var lane = this.lanes[laneIndex]
	var hq = this.hqs[playerName]
	var unit = hq.buyUnit(lane.scene, playerName, button);

	if (unit) {
    	lane.addUnitInQueue(unit)
    } else {
    	console.log("Not enough mana")
		lane.sayNotEnoughMana(playerName)
    }
}

Board.prototype.loadHQs = function(hud){
	this.hqs = {
		"nature": new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NATURE, this.loader),
		"newYork": new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NEW_YORK, this.loader)
	}

	this.hqs[HQ.typesEnum.NATURE].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateZ(- (Game.config.lane.marginBottom))
	this.hqs[HQ.typesEnum.NEW_YORK].scene.translateX( this.boardWidth - Game.config.lane.marginRight  )

	this.scene.add(this.hqs[HQ.typesEnum.NATURE].scene)
	this.scene.add(this.hqs[HQ.typesEnum.NEW_YORK].scene)
}

Board.prototype.loadLanes = function(loader){
	this.lanes = []
	for (var i = 0; i < 3; i++) {
		var lane = new Lane(i, this, loader)
		lane.scene.translateX( Game.config.lane.marginLeft )
		lane.scene.translateZ(- (Game.config.lane.marginBottom + Game.config.lane.spacing * i))
		this.lanes[i] = lane
	}
}

Board.prototype.update = function(time, dt) {
	this.hqs.nature.update(time, dt)
	this.hqs.newYork.update(time, dt)

	for (var i = 0; i < 3; i++) {
		this.lanes[i].update(time, dt)
	}
}
