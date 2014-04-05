function Building(scene, loader, name){

	var fileName = ""
	if (Game.config.objectMapping[name]){
		fileName = Game.config.objectMapping[name].file
	}else{
		return
	}
	
	this.parentScene = scene
	this.animations = {}
	this.currentAnimation = null
	var self = this
	loader.load(fileName, function(geometry, materials)
	{
		self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
		self.mesh.castShadow = true
		self.parentScene.add(self.mesh)
		
		//self.mesh.position.set(0.5, 0.5, -0.5)
		//self.mesh.rotation.set(0, Math.PI/2, 0)
		
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
		
		self.animations.create = new THREE.Animation(self.mesh, "create", THREE.AnimationHandler.CATMULLROM)
		self.animations.create.loop = true
		//self.animations.destroy = new THREE.Animation(self.mesh, "destroy", THREE.AnimationHandler.CATMULLROM)
		//self.animations.destroy.loop = false
		self.currentAnimation = self.animations.create
		//self.animations.idle = new THREE.Animation(self.mesh, "idle", THREE.AnimationHandler.CATMULLROM)
		//self.animations.walk = new THREE.Animation(self.mesh, "walk", THREE.AnimationHandler.CATMULLROM)
		//self.currentAnimation = self.animations.walk
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

Building.prototype.update = function(time, dt){
	if (this.currentAnimation != null)
	{
		if (this.currentAnimation.isPlaying){

			this.currentAnimation.update(dt / 1000)
		}
		else{
			if (this.currentAnimation.data.name == "destroy"){
				this.changeAnimation("create");
			}else{
				this.changeAnimation("destroy");
			}
		}
	}
}

Building.prototype.destroy = function(){
	this.parentScene.remove(this.mesh)
}