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
	
	this.alerts = []
}

Board.prototype.popBuilding = function(button, laneIndex, playerName){
	var lane = this.lanes[laneIndex]
	var hq = this.hqs[playerName]
	var building = hq.buyBuilding(lane.scene, playerName, button);

	if (building) {
		lane.popBuilding(button, playerName)
	} else {
    	console.log("Not enough mana")
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
		lane.sayNotEnoughMana()
    }
}
/*Board.prototype.sayNotEnoughMana = function(lane){
	var alertTexture = THREE.ImageUtils.loadTexture('data/NotEnoughMana.png')
	var alert = new THREE.Mesh( new THREE.PlaneGeometry(0.3, 0.02), new THREE.MeshLambertMaterial( { map: alertTexture } ) )
	this.alerts.push( alert );
    alert.position.x = 0.3;
    alert.position.y = 0.3/2;
    alert.position.z = -0.3/2;
    alert.castShadow = true;
    alert.receiveShadow = true;
	alert.createDate = new Date()
	alert.ttl = Game.config.alerts.ttl * 1000
    this.scene.add(alert)
}
Board.prototype.purgeAlerts = function(time){
	if (this.alerts.length > 0){
		var alert = this.alerts[0]
		if (time - alert.createDate.getTime() > alert.ttl) {
			this.scene.remove(alert)
			delete alert
		}
	}
}*/

Board.prototype.loadHQs = function(hud){
	this.hqs = {
		"nature": new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NATURE),
		"newYork": new HQ(this.scene, this.hud, this.lanes, HQ.typesEnum.NEW_YORK)
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
		var lane = new Lane(this, loader)
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

Board.prototype.hitEnemy = function(player) {
	this.hqs[player == "nature" ? "newYork" : "nature"].removeHealth(1);
}
