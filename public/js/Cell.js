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


	this.building = null;
	scene.add(this.scene)
	this.loader = loader
	this.scene.add(this.cube)
	this.scene.add(this.captureCube)

	console.log("captureCube", this.captureCube)
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
	} else if (value < 0 && this.captureProgress >= 0) {
		this.captureCube.material.color = new THREE.Color(this.newYorkColor)
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

Cell.prototype.build = function(buildingName){
	if (this.building)
	{
		this.building.destroy()
	}
	this.building = new Building(this.scene, this.loader, buildingName);
}


Cell.prototype.update = function(time, dt){
	if (this.building){
		this.building.update(time, dt);
	}
}
