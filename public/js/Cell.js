function Cell(scene, loader)
{
	this.neutralColor = 0xaaaaaa
	this.natureColor = 0x00aa00
	this.newYorkColor = 0x0000aa
	this.scene = new THREE.Object3D()
	this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.05,0.9),  new THREE.MeshBasicMaterial( { color: this.neutralColor } ) )
	this.cube.position.x = 1/2
	this.cube.position.y = 0.05/2	
	this.cube.position.z = -1/2
	this.cube.castShadow = true
	this.cube.receiveShadow = true

	this.building = null;
	scene.add(this.scene)
	this.loader = loader
	this.scene.add(this.cube)
}

Cell.prototype.setOwner = function(player)
{
	if (player == "nature"){
		this.cube.material.color = new THREE.Color(this.natureColor)
	}else if (player == "newYork"){
		this.cube.material.color = new THREE.Color(this.newYorkColor)
	}
}

Cell.prototype.build = function(buildingName){
	this.building = new Building(this.scene, this.loader, buildingName);
}


Cell.prototype.update = function(time, dt){
	if (this.building){
		this.building.update(time, dt);
	}
}
