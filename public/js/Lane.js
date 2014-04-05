function Lane(scene, loader)
{


	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	this.cells = [];
    this.units = [];
	laneWidth = Game.config.lane.cellNumber

	laneHeight = 1
	//this.laneCube = new THREE.Mesh( new THREE.CubeGeometry(laneWidth,0.1,laneHeight),  new THREE.MeshBasicMaterial( { color: 0x0000ff } ) )
	//this.laneCube.position.x = laneWidth/2
	//this.laneCube.position.z = -1/2
	//this.scene.add(this.laneCube)


	//this.position = position
	for (var i = 0; i < Game.config.lane.cellNumber; i++ ){
		var cell = new Cell(this.scene);
		cell.scene.translateX( i )
		this.cells.push(cell)

	}
	//this.cell = new Cell();
	//this.cell.scene.translateX( Game.config.lane.marginLeft )
	//this.cell.scene.translateZ(- (Game.config.lane.marginBottom))
	//this.scene.add(this.cell.scene)
	//this.cell2 = new Cell(scene, position, 1);


	this.animations = {}
	this.currentAnimation = null
	var self = this
	loader.load("data/stupid.js", function(geometry, materials)
	{
		self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
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
		self.animations.create.loop = false
		self.animations.destroy = new THREE.Animation(self.mesh, "destroy", THREE.AnimationHandler.CATMULLROM)
		self.animations.destroy.loop = false
		self.currentAnimation = self.animations.destroy
		//self.animations.idle = new THREE.Animation(self.mesh, "idle", THREE.AnimationHandler.CATMULLROM)
		//self.animations.walk = new THREE.Animation(self.mesh, "walk", THREE.AnimationHandler.CATMULLROM)
		//self.currentAnimation = self.animations.walk
		self.currentAnimation.play()
	})

Lane.prototype.changeAnimation = function(nextAnimation)
{
	if (this.currentAnimation.data.name != nextAnimation)
	{
		this.currentAnimation.stop()
		this.currentAnimation = this.animations[nextAnimation]
		this.currentAnimation.play()
	}
}

Lane.prototype.update = function(time, dt){
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


}

Lane.prototype.setPlayerPosition = function(player, position){
	var firstCell = 0
	var lastCell = this.cells.length -1
	if (player == "nature"){
		lastCell = position - 1
	}else if (player == "newYork"){
		firstCell = this.cells.length - position 
	}
	for (var i = firstCell; i <= lastCell; i++)
	{
		this.cells[i].setOwner(player);
	}
}