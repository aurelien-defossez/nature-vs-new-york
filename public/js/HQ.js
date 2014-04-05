HQ.typesEnum = {
  NATURE : 0,
  NEW_YORK : 1
}

function HQ(scene, hud, lanes, type)
{
	this.hud = hud
	this.lanes = lanes
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
		this.healthBarBackground.translateX(-0.6)
		this.healthBarBackground.translateY(0.45)
		this.healthBar.translateX(-0.6)
		this.healthBar.translateY(0.45)
	}else if (type == HQ.typesEnum.NEW_YORK){
		color = this.newYorkHQColor
		this.health = Game.config.newYork.health
		this.healthBarBackground.translateX(0.6)
		this.healthBarBackground.translateY(0.45)
		this.healthBar.translateX(0.6)
		this.healthBar.translateY(0.45)
	}
    this.type = type
	this.hqCube = new THREE.Mesh( new THREE.CubeGeometry(2,1,5),  new THREE.MeshBasicMaterial( { color: color } ) )
	this.hqCube.position.x = 1
	this.hqCube.position.y = 1/2
	this.hqCube.position.z = -5/2
	this.hqCube.castShadow = true
	this.hqCube.receiveShadow = true
	this.scene.add(this.hqCube)
	
	var hqConfig = Game.config[type == HQ.typesEnum.NATURE ? "nature" : "newYork"]
	this.hp = hqConfig.hp
	this.mana = hqConfig.startMana
	this.manaGeneration = hqConfig.manaPerSecond
	this.captureSpeed = [
		hqConfig.captureSpeed,
		hqConfig.captureSpeed,
		hqConfig.captureSpeed
	]
}

HQ.prototype.isAlive = function(){
  	return this.health > 0
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
}

HQ.prototype.update = function(time, dt) {
	this.addMana(dt * this.manaGeneration)
	
	if(this.isAlive()) {
		this.updateHealthBar();

		for (var i = 0; i < 3; i++) {
			this.lanes[i].capture(this.type, this.captureSpeed[i] * dt)
		}
	}
}

HQ.prototype.removeHealth = function(value) {
	this.health -= value
	this.updateHealthBar()
}

HQ.prototype.addMana = function(value) {
	this.mana += value
	this.hud.updateMana(this.type, Math.floor(this.mana))
}

