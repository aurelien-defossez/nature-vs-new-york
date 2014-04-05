function Cell()
{
	this.scene = new THREE.Object3D()
	this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.9,0.9),  new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) )
	this.cube.position.x = 1/2
	this.cube.position.z = -1/2
	this.cube.castShadow = true
	this.cube.receiveShadow = true
	this.scene.add(this.cube)
}