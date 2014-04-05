function Lane(scene, loader)
{


	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	this.cells = [];
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