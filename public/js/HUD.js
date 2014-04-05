function HUD(player)
{
	this.scene = new THREE.Object3D()


	natureTexture = THREE.ImageUtils.loadTexture('data/natureHUD.png')
	natureMaterial = new THREE.MeshLambertMaterial( { map: natureTexture } );
	natureGeometry = new THREE.PlaneGeometry(0.6, 0.25),
	this.natureHUD = new THREE.Mesh( natureGeometry,  natureMaterial )
	this.natureHUD.translateX(-0.7)
	this.natureHUD.translateY(0.42)
	this.scene.add(this.natureHUD)

	newYorkTexture = THREE.ImageUtils.loadTexture('data/newYorkHUD.png')
	newYorkMaterial = new THREE.MeshLambertMaterial( { map: newYorkTexture } );
	newYorkGeometry = new THREE.PlaneGeometry(0.5, 0.2),
	this.newYorkHUD = new THREE.Mesh( newYorkGeometry,  newYorkMaterial )
	this.newYorkHUD.translateX(0.7)
	this.newYorkHUD.translateY(0.42)
	this.scene.add(this.newYorkHUD)
}

HUD.prototype.updateMana = function(type, value) {
	document.getElementById(type == HQ.typesEnum.NATURE ? "mana" : "dollars").innerHTML = value
}
