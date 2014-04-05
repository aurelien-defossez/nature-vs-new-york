function Unit(scene, player, type) {
    console.log('Player ' + player + ' is creating a ' + type)
    
    this.scene = scene;
    
    this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.9,0.05,0.9),  new THREE.MeshBasicMaterial( { color: 0x333333 } ) )
	this.cube.position.x = 2
	this.cube.position.y = 3
	this.cube.position.z = 2
	this.cube.castShadow = true
	this.cube.receiveShadow = true
	this.scene.add(this.cube)
    
    
}