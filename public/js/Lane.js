function Lane(scene, loader)
{


	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	this.cells = [];
    this.units = [];
	laneWidth = Game.config.lane.cellNumber
	this.naturePosition = Game.config.nature.initOwnedCells;
	this.newYorkPosition = Game.config.newYork.initOwnedCells;
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

		if (i < this.naturePosition) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - this.newYorkPosition) {
			cell.setOwner("newYork")
		}
	}
	//this.cell = new Cell();
	//this.cell.scene.translateX( Game.config.lane.marginLeft )
	//this.cell.scene.translateZ(- (Game.config.lane.marginBottom))
	//this.scene.add(this.cell.scene)
	//this.cell2 = new Cell(scene, position, 1);



}

Lane.prototype.popBuilding = function(button, playerName){
	if (playerName == "nature"){
		for (var i = 0; i <= this.naturePosition; i++){
			if (this.cells[i].building == null){
				this.cells[i].build(button, playerName)
			}
		}
	}else if (playerName == "newYork"){
		for (var i = this.cells.length -1 ; i >= this.cells.length - this.newYorkPosition ; i--){
			if (this.cells[i].building == null){
				this.cells[i].build(button, playerName)
			}
		}
	}
}


Lane.prototype.update = function(time, dt){
	for (var i = 0; i < this.cells.length; i++){
		this.cells[i].update(time, dt);
	}
    for (var i = 0; i < this.units.length; i++){
		this.units[i].update(time, dt);
	}
}
