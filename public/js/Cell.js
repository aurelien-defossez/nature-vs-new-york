function Cell()
{
	this.neutralColor = 0xaaaaaa
	this.natureColor = 0x00aa00
	this.newYorkColor = 0x0000aa
	this.scene = new THREE.Object3D()
	this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.5,0.9),  new THREE.MeshBasicMaterial( { color: this.neutralColor } ) )
	this.cube.position.x = 1/2
	this.cube.position.y = 1/4
	this.cube.position.z = -1/2
	this.cube.castShadow = true
	this.cube.receiveShadow = true
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

