function HUD(player)
{
	this.scene = new THREE.Object3D()

	natureTexture = THREE.ImageUtils.loadTexture('data/natureHUD.png')
	natureMaterial = new THREE.MeshLambertMaterial( { map: natureTexture } );
	natureGeometry = new THREE.PlaneGeometry(0.6, 0.25),
	natureMaterial.transparent = true
	this.natureHUD = new THREE.Mesh( natureGeometry,  natureMaterial )
	this.natureHUD.translateX(-0.7)
	this.natureHUD.translateY(0.40)
	this.scene.add(this.natureHUD)

	newYorkTexture = THREE.ImageUtils.loadTexture('data/newYorkHUD.png')
	newYorkMaterial = new THREE.MeshLambertMaterial( { map: newYorkTexture } );
	newYorkGeometry = new THREE.PlaneGeometry(0.6, 0.25),
	newYorkMaterial.transparent = true
	this.newYorkHUD = new THREE.Mesh( newYorkGeometry,  newYorkMaterial )
	this.newYorkHUD.translateX(0.7)
	this.newYorkHUD.translateY(0.40)
	this.scene.add(this.newYorkHUD)
	
	this.buildMonitor = new BuildMonitor()
}

HUD.prototype.updateMana = function(type, value) {
	document.getElementById(type == HQ.typesEnum.NATURE ? "manaCount" : "dollarsCount").innerHTML = value
}

HUD.prototype.refreshBuildMonitor = function(queue){
	console.log("refresh build-monitor")
	this.buildMonitor.refreshQueue(queue)
	for (var input in this.buildMonitor.displayedQueues.nature){
		document.querySelector("#nature-build-queue ."+input+" .size").innerHTML = this.buildMonitor.displayedQueues.nature[input].size
	}
	for (var input in this.buildMonitor.displayedQueues.newYork){
		document.querySelector("#newYork-build-queue ."+input+" .size").innerHTML = this.buildMonitor.displayedQueues.newYork[input].size
	}
}

HUD.prototype.refreshBuildMonitorProgressBar = function(time){
	if (typeof(this.lastProgressRefreshTime) == "undefined" || this.lastProgressRefreshTime + this.buildMonitor.progressRefreshInterval > time) {
		for (var input in this.buildMonitor.displayedQueues.nature){
			var progress;
			if (this.buildMonitor.displayedQueues.nature[input].unit != null) {
				progress = this.buildMonitor.displayedQueues.nature[input].unit.getBuildPercentProgress()
				progress = "<div style='background-color:orange;width:"+progress+"%';>&nbsp;</div>"
			} else {
				progress = ""
			}
			document.querySelector("#nature-build-queue ."+input+" .progress").innerHTML = progress
		}
		for (var input in this.buildMonitor.displayedQueues.newYork){
			if (this.buildMonitor.displayedQueues.newYork[input].unit != null) {
				progress = this.buildMonitor.displayedQueues.newYork[input].unit.getBuildPercentProgress()
				progress = "<div style='background-color:orange;width:"+progress+"%';>&nbsp;</div>"
			} else {
				progress = ""
			}
			document.querySelector("#newYork-build-queue ."+input+" .progress").innerHTML = progress
		}
		this.lastProgressRefreshTime = time
	}
}
