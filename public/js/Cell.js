function Cell(scene, loader, lane, id)
{
	this.neutralColor = 0xaaaaaa
	this.natureColor = 0x00aa00
	this.newYorkColor = 0x0000aa
	this.owner = null
	this.captureProgress = 0
	this.lane = lane
	this.id = id
	this.scene = new THREE.Object3D()

	this.animations = {}
	this.currentAnimation = null
	this.animationTime = 20;
	this.reverse = false

	this.building = null;
	scene.add(this.scene)
	this.loader = loader
}

Cell.prototype.setOwner = function(player) {
	this.owner = player
	this.captureProgress = player == "nature" ? 1 : -1

	if (!this.mesh) {
		this.loadMesh(this.loader, player + 'Cell')
	}
}

Cell.prototype.capture = function(value){
	if (value > 0 && this.captureProgress <= 0 && this.captureProgress + value > 0) {
		this.loadMesh(this.loader, 'natureCell')
	} else if (value < 0 && this.captureProgress >= 0 && this.captureProgress + value < 0) {
		this.loadMesh(this.loader, 'newYorkCell')
	}

	this.captureProgress += value

	var remaining = 0
	if (this.captureProgress >= 1) {
		remaining = 1 - this.captureProgress
		this.setOwner("nature")
	} else if (this.captureProgress <= -1) {
		remaining = 1 + this.captureProgress
		this.setOwner("newYork")
	}

	return remaining
}

Cell.prototype.build = function(button, player, hq){
	if (this.building) {
		this.building.destroy()
	}

	this.building = new Building(this.scene, this.loader, button, player, hq, this.lane, this);
}


Cell.prototype.update = function(time, dt){
	if (this.building){
		this.building.update(time, dt);
	}

	if (this.currentAnimation != null) {
		this.currentTime = (Math.abs(this.captureProgress)) * this.animationTime
		this.currentAnimation.reset()
		this.currentAnimation.currentTime = this.currentTime;
		this.currentAnimation.update(0)
	}
}

Cell.prototype.loadMesh = function(loader, name) {
	var self = this
	var fileName = Game.config.buildings[name].modelFile
	loader.load(fileName, function(geometry, materials) {
		if (self.mesh) {
			self.scene.remove(self.mesh)
		}
		self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
		self.mesh.castShadow = true
		self.mesh.receiveShadow = true
		self.scene.add(self.mesh)
		
		var materials = self.mesh.material.materials
		for (var k in materials) {
			materials[k].skinning = true
		}
		
		for (var i = 0; i < self.mesh.geometry.animations.length; ++i) {
			if (THREE.AnimationHandler.get(self.mesh.geometry.animations[i].name) == null)
				THREE.AnimationHandler.add(self.mesh.geometry.animations[i])
		}
		
		self.animations.create = new THREE.Animation(self.mesh, name + "_create", THREE.AnimationHandler.CATMULLROM)

		self.animations.create.loop = false
		self.currentAnimation = self.animations.create
		self.animationTime = self.currentAnimation.data.length;
		self.currentAnimation.play()
	})
}
