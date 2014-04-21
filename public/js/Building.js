function Building(scene, loader, button, player, hq, lane, cell){
    this.player = player
    this.parentScene = scene
	var buildingType = Game.config[this.player].mapping.buildings[button]
	var fileName = Game.config.buildings[buildingType].modelFile
	this.type = buildingType
	this.hq = hq
	this.lane = lane
	this.cell = cell
	this.builtTime = Game.config.buildings[buildingType].time
	this.buildingProgress = 0
	this.destroyScaffoldingProgress = 0
	this.ScaffoldingDestroyed = true;
	this.built = false
	this.maxHP = Game.config.buildings[buildingType].hp
	this.currentHP = this.maxHP * 0.2
	this.HpGainRate = (this.maxHP - this.currentHP) / this.builtTime;
	this.BuildRate = 1/this.builtTime;
	this.animationTime = 1;
	this.animationTimerSetter = 0;
	this.lowLifeColor = 0xaa0000;
	this.middleLifeColor = 0xff8928;
	this.highLifeColor = 0x00aa00;
	this.time = 0

	this.healthBarBackground = new THREE.Mesh( new THREE.CubeGeometry(0.6,0.03,0.03),  new THREE.MeshBasicMaterial( { color: 0xffffff } ) )
	this.healthBarBackground.position.x = 1 * 0.5
	this.healthBarBackground.position.y = 0.03 * 0.5 + 1
	this.healthBarBackground.position.z = -0.03 * 0.5 - 0.25

	this.healthBar = new THREE.Mesh( new THREE.CubeGeometry(0.6,0.04,0.04),  new THREE.MeshBasicMaterial( { color: 0xffffff } ) )
	this.healthBar.position.x = 1 * 0.5
	this.healthBar.position.y = 0.04 * 0.5 + 1
	this.healthBar.position.z = -0.03 * 0.5 - 0.25

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
		self.mesh.receiveShadow = true
		//self.parentScene.add(self.mesh)
		console.log(Game.config.buildings[buildingType].modelFile)
		if (Game.config.buildings[buildingType].modelFile == "data/tree_mana.js")
		{
			materials[1].alphaTest = 0.5;
		}


	})
	var name
	if (this.player == "newYork"){
		fileName = Game.config.buildings.scaffolding.modelFile
		name = "scaffolding"
	}

	else{
		fileName = Game.config.buildings.tree.modelFile
		name = "tree"
	}

	loader.load(fileName, function(geometry, materials)
	{
		self.scaffoldingMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
		self.scaffoldingMesh.castShadow = true
		self.scaffoldingMesh.receiveShadow = true
		self.parentScene.add(self.scaffoldingMesh)

		var materials = self.scaffoldingMesh.material.materials
		for (var k in materials)
		{
			materials[k].skinning = true
		}

		for (var i = 0; i < self.scaffoldingMesh.geometry.animations.length; ++i)
		{
			if (THREE.AnimationHandler.get(self.scaffoldingMesh.geometry.animations[i].name) == null)
				THREE.AnimationHandler.add(self.scaffoldingMesh.geometry.animations[i])
		}

		self.animations.create = new THREE.Animation(self.scaffoldingMesh, name+"_create", THREE.AnimationHandler.CATMULLROM)
		self.animations.create.loop = false
		self.animations.destroy = new THREE.Animation(self.scaffoldingMesh, name+"_destroy", THREE.AnimationHandler.CATMULLROM)
		self.animations.destroy.loop = false
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

Building.prototype.applyEffect = function()
{
	switch(this.type) {
		// Mana ++
		case 'manaTree':
		case 'bank':
			this.hq.manaPerSecond += Game.config.buildings[this.type].manaPerSecond
		break

		// Capture ++
		case 'rootTree':
			this.hq.captureSpeed[this.lane.id] += Game.config.buildings[this.type].captureSpeed
		break

		case 'protectorTree':
		case 'policeStation':
			// Nothing to do
		break
	}
}

Building.prototype.removeEffect = function(){
	switch(this.type) {
		// Mana ++
		case 'manaTree':
		case 'bank':
			this.hq.manaPerSecond -= Game.config.buildings[this.type].manaPerSecond
		break

		// Capture ++
		case 'rootTree':
			this.hq.captureSpeed[this.lane.id] -= Game.config.buildings[this.type].captureSpeed
		break

		case 'protectorTree':
		case 'policeStation':
			// Nothing to do
		break
	}
}

Building.prototype.getBounds = function(){
	return {
		left: this.cell.id,
		right: this.cell.id + 1
	}
}

Building.prototype.update = function(time, dt){
	if (!this.built)
	{
		this.buildingProgress = this.buildingProgress + this.BuildRate * dt;
		this.currentHP = this.currentHP + this.HpGainRate * dt;

		if (this.buildingProgress >= 1) {
			this.built = true
			this.buildingProgress = 1
			this.applyEffect()
			this.parentScene.add(this.mesh)
			this.currentAnimation.stop()
			this.currentAnimation = this.animations.destroy
			this.currentAnimation.play();
			this.ScaffoldingDestroyed = false;
			musicManager.playSfx(this.type + "Spawn")
		}
		this.animationTimerSetter = this.buildingProgress;
	} else {
		this.time += dt
		if (this.type == "policeStation" && this.time >= Game.config.buildings.policeStation.policemansDelay) {
			this.time -= Game.config.buildings.policeStation.policemansDelay
			this.lane.createUnit("newYork", "policeman", this.cell.id + .5)
		}
	}


	if (!this.ScaffoldingDestroyed)
	{
		this.destroyScaffoldingProgress = this.destroyScaffoldingProgress + 1/this.currentAnimation.data.length * dt ;

		if (this.destroyScaffoldingProgress >= 1){
			this.ScaffoldingDestroyed = true;
			this.destroyScaffoldingProgress = 1
			this.parentScene.remove(this.scaffoldingMesh)
		}
		this.animationTimerSetter = this.destroyScaffoldingProgress;
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
		this.currentAnimation.reset()
		this.currentAnimation.currentTime = this.animationTimerSetter * this.currentAnimation.data.length;
		this.currentAnimation.update(0)
	}
}

Building.prototype.hit = function(points){
	this.currentHP -= points

	if (this.currentHP <= 0) {
		this.removeEffect()
		this.destroy()
		return true
	}
}

Building.prototype.destroy = function(){
	this.parentScene.remove(this.mesh)
	this.parentScene.remove(this.healthBarBackground);
	this.parentScene.remove(this.healthBar);
	this.parentScene.remove(this.scaffoldingMesh);
}
