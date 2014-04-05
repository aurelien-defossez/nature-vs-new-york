function Building(scene, loader, button, player){
    this.player = player
    this.parentScene = scene
	var buildingType = Game.config[this.player].mapping.buildings[button]
	var fileName = Game.config.buildings[buildingType].modelFile
	this.builtTime = Game.config.buildings[buildingType].time
	this.buildingProgress = 0
	this.maxHP = Game.config.buildings[buildingType].hp
	this.currentHP = this.maxHP * 0.2
	this.HpGainRate = (this.maxHP - this.currentHP) / this.builtTime;
	this.BuildRate = 1/this.builtTime;
	this.animationTime = 1;
	this.lowLifeColor = 0xaa0000;
	this.middleLifeColor = 0xff8928;
	this.highLifeColor = 0x00aa00

	this.healthBarBackground = new THREE.Mesh( new THREE.CubeGeometry(0.6,0.03,0.03),  new THREE.MeshBasicMaterial( { color: 0xffffff } ) )
	this.healthBarBackground.position.x = 1 * 0.5
	this.healthBarBackground.position.y = 0.03 * 0.5 + 1/2
	this.healthBarBackground.position.z = -0.03 * 0.5 - 0.66

	this.healthBar = new THREE.Mesh( new THREE.CubeGeometry(0.6,0.04,0.04),  new THREE.MeshBasicMaterial( { color: 0xffffff } ) )
	this.healthBar.position.x = 1 * 0.5
	this.healthBar.position.y = 0.04 * 0.5 + 1/2
	this.healthBar.position.z = -0.03 * 0.5 - 0.66

	this.parentScene.add(this.healthBarBackground);
	this.parentScene.add(this.healthBar);

    console.log('Player ' + player + ' is building a ' + buildingType);
    
	
	this.animations = {}
	this.currentAnimation = null
	var self = this

	loader.load(fileName, function(geometry, materials)
	{
		self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
		self.mesh.castShadow = true
		self.parentScene.add(self.mesh)
		
		var materials = self.mesh.material.materials
		for (var k in materials)
		{
			materials[k].skinning = true
		}
		
		for (var i = 0; i < self.mesh.geometry.animations.length; ++i)
		{
			if (THREE.AnimationHandler.get(self.mesh.geometry.animations[i].name) == null)
				THREE.AnimationHandler.add(self.mesh.geometry.animations[i])
		}
		
		self.animations.create = new THREE.Animation(self.mesh, buildingType+"_create", THREE.AnimationHandler.CATMULLROM)
		self.animations.create.loop = false
		self.currentAnimation = self.animations.create
		self.animationTime = self.currentAnimation.data.length;
		self.currentAnimation.play()
	})
}

Building.prototype.changeAnimation = function(nextAnimation)
{
	if (this.currentAnimation.data.name != nextAnimation)
	{
		this.currentAnimation.stop()
		this.currentAnimation = this.animations[nextAnimation]
		this.currentAnimation.play()
	}
}

Building.prototype.progressBuilding = function(build)
{
	if (build){

	}else{

	}
}

Building.prototype.update = function(time, dt){
	if (this.buildingProgress < 1)
	{
		this.buildingProgress = this.buildingProgress + this.BuildRate * dt;
		this.currentHP = this.currentHP + this.HpGainRate * dt;
	}
	this.healthBar.scale.x = this.currentHP / this.maxHP;
	this.healthBar.position.x = this.currentHP / this.maxHP * 0.6 * 0.5 + 0.4 * 0.5
	var color;

	if (this.currentHP <= this.maxHP * 0.2)
		color = this.lowLifeColor
	else if (this.currentHP <= this.maxHP * 0.5)
		color = this.middleLifeColor
	else
		color = this.highLifeColor

	this.healthBar.material.color = new THREE.Color(color);

	if (this.currentAnimation != null)
	{
		//debugger;
		this.currentTime = (Math.abs(this.buildingProgress))
		this.currentAnimation.reset()
		this.currentAnimation.currentTime = this.currentTime;
		this.currentAnimation.update(0)
	}
}

Building.prototype.destroy = function(){
	this.parentScene.remove(this.mesh)
}
