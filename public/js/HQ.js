HQ.typesEnum = {
  NATURE : 1,
  NEW_YORK : 2
}

function HQ(scene, type, hud)
{
	this.hud = hud
	this.natureHQColor = 0x00ff00
	this.newYorkHQColor = 0x0000ff
	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	
	var healthBarTexture = THREE.ImageUtils.loadTexture('data/HealthBar.png')
	var healthBarMaterial = new THREE.MeshLambertMaterial( { map: healthBarTexture } )
	var healthBarGeometry = new THREE.PlaneGeometry(0.3, 0.02)
	this.healthBar = new THREE.Mesh( healthBarGeometry,  healthBarMaterial )
	this.hud.scene.add(this.healthBar)
	
	var color
	if (type == HQ.typesEnum.NATURE){
		color = this.natureHQColor
		this.health = Game.config.nature.health
		this.healthBar.translateX(-0.6)
		this.healthBar.translateY(0.45)
	}else if (type == HQ.typesEnum.NEW_YORK){
		color = this.newYorkHQColor
		this.health = Game.config.newYork.health
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
	
	
	
	
}

HQ.prototype.isAlive = function(){
  	return this.health > 0
}

HQ.prototype.update = function(){
	
}

HQ.prototype.healthBar = function(){
	
}

