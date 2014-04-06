Board.alertTypesEnum = {
	NOT_ENOUGH_MANA : 0,
	NO_EMPTY_CELL : 1
}

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

	this.alerts = {
		nature : null,
		newYork : null
	}
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
	    	this.showAlert(Board.alertTypesEnum.NOT_ENOUGH_MANA, playerName)
	    }
	}else{
		this.showAlert(Board.alertTypesEnum.NO_EMPTY_CELL, playerName)
	}

}

Board.prototype.popMonster = function(button, laneIndex, playerName){
    var lane = this.lanes[laneIndex]
	var hq = this.hqs[playerName]
	var unit = hq.buyUnit(lane.scene, playerName, button);

	if (unit) {
    	lane.addUnitInQueue(unit)
    } else {
		this.showAlert(Board.alertTypesEnum.NOT_ENOUGH_MANA, playerName)
    }
}

Board.prototype.showAlert = function(alertType, playerName){
	
	if (this.alerts[playerName]==null || this.alerts[playerName].type != alertType){
		var imgPath = 'data/'
		if (alertType == Board.alertTypesEnum.NOT_ENOUGH_MANA && playerName == HQ.typesEnum.NATURE) {
			console.log("Not enough mana")
			imgPath += 'NotEnoughMana.png'
		} else if (alertType == Board.alertTypesEnum.NOT_ENOUGH_MANA && playerName == HQ.typesEnum.NEW_YORK) {
			console.log("Not enough dollars")
			imgPath += 'NotEnoughDollars.png'
		} else if (alertType == Board.alertTypesEnum.NO_EMPTY_CELL) {
			console.log("No empty cells")
			imgPath += 'NoEmptyCell.png'
		}
		
		var alertTexture = THREE.ImageUtils.loadTexture(imgPath)
		var alert = new THREE.Mesh( new THREE.PlaneGeometry(1, 1)
								   , new THREE.MeshLambertMaterial( { transparent:true, map: alertTexture } ) )
		this.scene.remove(this.alerts[playerName])
		this.alerts[playerName] = alert;
		if(playerName === HQ.typesEnum.NATURE) {
			alert.position.x = 4.6;
		} else if(playerName === HQ.typesEnum.NEW_YORK) {
			alert.position.x = this.boardWidth - 4.6;
		}
		alert.type = alertType
		alert.position.y = 3;
		alert.position.z = -this.boardHeight/2;
		alert.rotation.x = -Math.PI * 0.35
		alert.castShadow = true;
		alert.receiveShadow = true;
		alert.createDate = new Date()
		alert.ttl = Game.config.alerts.ttl * 1000
		this.scene.add(alert)
	}
	
}
Board.prototype.purgeAlert = function(playerName){
	var currentTime = new Date()
	var alert = this.alerts[playerName]
	if (alert!= null && currentTime.getTime() - alert.createDate.getTime() > alert.ttl) {
		this.scene.remove(alert)
		this.alerts[playerName] = null
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
	
	this.purgeAlert(HQ.typesEnum.NATURE)
	this.purgeAlert(HQ.typesEnum.NEW_YORK)
}
