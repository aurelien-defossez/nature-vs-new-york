function HQ(player)
{
	this.natureHQColor = 0x00ff00
	this.newYorkHQColor = 0x0000ff
	this.scene = new THREE.Object3D()
	var color
	if (player == "nature"){
		color = this.natureHQColor
	}else if (player == "newYork"){
		color = this.newYorkHQColor
	}
	this.hqCube = new THREE.Mesh( new THREE.CubeGeometry(2,1,5),  new THREE.MeshBasicMaterial( { color: color } ) )
	this.hqCube.position.x = 1
	this.hqCube.position.y = 1/2
	this.hqCube.position.z = -5/2
	this.hqCube.castShadow = true
	this.hqCube.receiveShadow = true
	this.scene.add(this.hqCube)
}