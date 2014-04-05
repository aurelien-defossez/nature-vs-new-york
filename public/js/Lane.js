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
		var cell = new Cell(this.scene, loader);
		cell.scene.translateX( i )
		this.cells.push(cell)

		if (i < Game.config.nature.initOwnedCells) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - Game.config.newYork.initOwnedCells) {
			cell.setOwner("newYork")
		}
	}
	//this.cell = new Cell();
	//this.cell.scene.translateX( Game.config.lane.marginLeft )
	//this.cell.scene.translateZ(- (Game.config.lane.marginBottom))
	//this.scene.add(this.cell.scene)
	//this.cell2 = new Cell(scene, position, 1);



}


Lane.prototype.update = function(time, dt){
	for (var i = 0; i < this.cells.length; i++){
		this.cells[i].update(time, dt);
	}
}
