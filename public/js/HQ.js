HQ.typesEnum = {
  NATURE : 1,
  NEW_YORK : 2
}

function HQ(scene, type)
{
	this.natureHQColor = 0x00ff00
	this.newYorkHQColor = 0x0000ff
	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	var color
	if (type == HQ.typesEnum.NATURE){
		color = this.natureHQColor
		this.health = Game.config.nature.health
	}else if (type == HQ.typesEnum.NEW_YORK){
		type = this.newYorkHQColor
		this.health = Game.config.newYork.health
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

