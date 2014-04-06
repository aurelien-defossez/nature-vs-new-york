HQ.typesEnum = {
  NATURE : "nature",
  NEW_YORK : "newYork"
}

function HQ(scene, hud, lanes, type, loader)
{
	this.hud = hud
	this.lanes = lanes
	this.loader = loader
	this.natureHQColor = 0x00ff00
	this.newYorkHQColor = 0x0000ff
	this.scene = new THREE.Object3D()
	scene.add(this.scene)

	var healthBarFill = new THREE.MeshBasicMaterial( { color: 0xff0000})
	var healthBarGeometry = new THREE.PlaneGeometry(0.297, 0.018)
	this.healthBar = new THREE.Mesh( healthBarGeometry,  healthBarFill )
	this.hud.scene.add(this.healthBar)

	var healthBarBackground = THREE.ImageUtils.loadTexture('data/HealthBar.png')
	var healthBarMaterialBackground = new THREE.MeshLambertMaterial( { map: healthBarBackground } )
	var healthBarGeometryBackground = new THREE.PlaneGeometry(0.3, 0.02)
	this.healthBarBackground = new THREE.Mesh( healthBarGeometryBackground,  healthBarMaterialBackground )
	this.hud.scene.add(this.healthBarBackground)

	var color
	if (type == HQ.typesEnum.NATURE){
		color = this.natureHQColor
		this.health = Game.config.nature.health
		this.healthBarBackground.translateX(-0.8)
		this.healthBarBackground.translateY(0.55)
		this.healthBar.translateX(-0.8)
		this.healthBar.translateY(0.55)
	}else if (type == HQ.typesEnum.NEW_YORK){
		color = this.newYorkHQColor
		this.health = Game.config.newYork.health
		this.healthBarBackground.translateX(0.8)
		this.healthBarBackground.translateY(0.55)
		this.healthBar.translateX(0.8	)
		this.healthBar.translateY(0.55)
	}
    this.type = type
	this.hqCube = new THREE.Mesh( new THREE.CubeGeometry(2,0.2,5),  new THREE.MeshBasicMaterial( { color: color } ) )
	this.hqCube.position.x = 1
	this.hqCube.position.y = 0.2/2
	this.hqCube.position.z = -5/2
	this.hqCube.castShadow = true
	this.hqCube.receiveShadow = true
	this.scene.add(this.hqCube)

	var hqConfig = Game.config[type == HQ.typesEnum.NATURE ? "nature" : "newYork"]
	this.hp = hqConfig.hp
	this.mana = hqConfig.startMana
	this.manaPerSecond = hqConfig.manaPerSecond
	this.captureSpeed = [
		hqConfig.captureSpeed,
		hqConfig.captureSpeed,
		hqConfig.captureSpeed
	]
}

HQ.prototype.isAlive = function(){
  	return this.health > 0
}

HQ.prototype.buyUnit = function(scene, player, type){
	var unitType = Game.config[player].mapping.units[type]
	var cost = Game.config.units[unitType].cost

	if (this.mana >= cost) {
		this.mana -= cost
		var unit = new Unit(scene, player, unitType, this.loader)
		return unit
	}
}

HQ.prototype.buyBuilding = function(scene, player, type){
	var buildingType = Game.config[player].mapping.buildings[type]
	var cost = Game.config.buildings[buildingType].cost

	if (this.mana >= cost) {
		this.mana -= cost
		return true
	}
}

HQ.prototype.updateHealthBar = function(){
	var widthOld = this.healthBar.scale.x * this.healthBar.geometry.width
	switch(this.type){
		case HQ.typesEnum.NATURE:
			var scaleX = this.health/Game.config.nature.health
			this.healthBar.scale.x = scaleX
			this.healthBar.position.x -= (widthOld - this.healthBar.geometry.width * scaleX)/2
			break;
		case HQ.typesEnum.NEW_YORK:
			var scaleX = this.health/Game.config.newYork.health
			this.healthBar.scale.x = scaleX
			this.healthBar.position.x -= (widthOld - this.healthBar.geometry.width * scaleX)/2
			break;
	}

    if(this.health <= 0) {
        menu.show(100);
    }
}

HQ.prototype.update = function(time, dt) {
	this.addMana(dt * this.manaPerSecond)

	if(this.isAlive()) {
		this.updateHealthBar();

		for (var i = 0; i < 3; i++) {
			this.lanes[i].capture(this.type, this.captureSpeed[i] * dt)
		}
	}
}

HQ.prototype.hit = function(points) {
	this.health -= points
	this.updateHealthBar()

	if (this.health <= 0) {
		// TODO: Game over
	}
}

HQ.prototype.addMana = function(value) {
	this.mana += value
	this.hud.updateMana(this.type, Math.floor(this.mana))
}

