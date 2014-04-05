function Cell(scene, loader)
{
	this.neutralColor = 0xaaaaaa
	this.natureColor = 0x00aa00
	this.newYorkColor = 0x0000aa
	this.owner = null
	this.captureProgress = 0
	this.scene = new THREE.Object3D()

	this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.05,0.9),  new THREE.MeshBasicMaterial( { color: this.neutralColor } ) )
	this.cube.position.x = 1/2
	this.cube.position.y = 0.05/2	
	this.cube.position.z = -1/2
	this.cube.castShadow = true
	this.cube.receiveShadow = true

	this.captureCube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.05,0.9),  new THREE.MeshBasicMaterial( { color: this.neutralColor } ) )
	this.captureCube.position.x = 1/2
	this.captureCube.position.y = 0.1/2	
	this.captureCube.position.z = -1/2
	this.captureCube.castShadow = false
	this.captureCube.receiveShadow = false
	this.captureCube.visible = false


	this.animations = {}
	this.currentAnimation = null

	this.building = null;
	scene.add(this.scene)
	this.loader = loader
	this.scene.add(this.cube)
	this.scene.add(this.captureCube)
}

Cell.prototype.setOwner = function(player)
{
	this.owner = player

	if (player == "nature"){
		this.cube.material.color = new THREE.Color(this.natureColor)
	}else if (player == "newYork"){
		this.cube.material.color = new THREE.Color(this.newYorkColor)
	}
}

Cell.prototype.capture = function(value){
	if (value > 0 && this.captureProgress <= 0) {
		this.captureCube.material.color = new THREE.Color(this.natureColor)
		this.loadMesh(this.loader, Game.config.nature.buildings['natureCell'].modelFile)
		if (this.mesh)
		{
			this.scene.remove(this.mesh)
		}
		this.scene.add(this.mesh)
	} else if (value < 0 && this.captureProgress >= 0) {
		this.captureCube.material.color = new THREE.Color(this.newYorkColor)
		this.loadMesh(this.loader, Game.config.newYork.buildings['natureCell'].modelFile)
		if (this.mesh)
		{
			this.scene.remove(this.mesh)
		}
		this.scene.add(this.mesh)
	}

	this.captureProgress += value

	if (this.captureProgress >= 1) {
		this.captureProgress = 1
		this.captureCube.visible = false
		this.setOwner("nature")
	} else if (this.captureProgress <= -1) {
		this.captureProgress = -1
		this.captureCube.visible = false
		this.setOwner("newYork")
	}

	if (this.captureProgress != 0) {
		this.captureCube.visible = true
		this.captureCube.scale.x = Math.abs(this.captureProgress)
	}
}

Cell.prototype.build = function(button, player){
	if (this.building)
	{
		this.building.destroy()
	}
	this.building = new Building(this.scene, this.loader, button, player);
}


Cell.prototype.update = function(time, dt){
	if (this.building){
		this.building.update(time, dt);
	}

	if (this.currentAnimation != null)
	{
		if (this.currentAnimation.isPlaying){

			this.currentAnimation.update(dt)
		}
	}
}

Cell.prototype.loadMesh = function(loader, fileName){

	var self = this
	loader.load(fileName, function(geometry, materials)
	{
		self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
		self.mesh.castShadow = true
		self.scene.add(self.mesh)
		
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
