function HUD(player)
{
	this.scene = new THREE.Object3D()

	natureTexture = THREE.ImageUtils.loadTexture('data/natureHUD.png')
	natureMaterial = new THREE.MeshLambertMaterial( { map: natureTexture } );
	natureGeometry = new THREE.PlaneGeometry(0.75, 0.3),
	natureMaterial.transparent = true
	this.natureHUD = new THREE.Mesh( natureGeometry,  natureMaterial )
	this.natureHUD.translateX(-0.5)
	this.natureHUD.translateY(0.37)
	this.scene.add(this.natureHUD)

	newYorkTexture = THREE.ImageUtils.loadTexture('data/newYorkHUD.png')
	newYorkMaterial = new THREE.MeshLambertMaterial( { map: newYorkTexture } );
	newYorkGeometry = new THREE.PlaneGeometry(0.75, 0.3),
	newYorkMaterial.transparent = true
	this.newYorkHUD = new THREE.Mesh( newYorkGeometry,  newYorkMaterial )
	this.newYorkHUD.translateX(0.5)
	this.newYorkHUD.translateY(0.37)
	this.scene.add(this.newYorkHUD)
	
	this.buildMonitor = new BuildMonitor()
}

HUD.prototype.updateMana = function(type, value) {
	document.getElementById(type == HQ.typesEnum.NATURE ? "manaCount" : "dollarsCount").innerHTML = value
}

HUD.prototype.refreshBuildMonitor = function(index, queue){
	this.buildMonitor.refreshQueue(index, queue)
	for (var input in this.buildMonitor.displayedQueues["lane"+index].nature){
		document.querySelector("#nature-build-queue ."+input+" .lane"+index+" .size")
			.innerHTML = this.buildMonitor.displayedQueues["lane"+index].nature[input].size
	}
	for (var input in this.buildMonitor.displayedQueues["lane"+index].newYork){
		document.querySelector("#newYork-build-queue ."+input+" .lane"+index+" .size")
			.innerHTML = this.buildMonitor.displayedQueues["lane"+index].newYork[input].size
	}
}

HUD.prototype.refreshBuildMonitorProgressBar = function(time){
	if (typeof(this.lastProgressRefreshTime) == "undefined" || this.lastProgressRefreshTime + this.buildMonitor.progressRefreshInterval > time) {
		for (var lane in this.buildMonitor.displayedQueues) {
			for (var input in this.buildMonitor.displayedQueues[lane].nature){
				var progress;
				if (this.buildMonitor.displayedQueues[lane].nature[input].unit != null) {
					progress = this.buildMonitor.displayedQueues[lane].nature[input].unit.getBuildPercentProgress()
					progress = "<div style='background-color:orange;width:"+progress+"%';>&nbsp;</div>"
				} else {
					progress = ""
				}
				document.querySelector("#nature-build-queue ."+input+" ."+lane+" .progress").innerHTML = progress
			}
			for (var input in this.buildMonitor.displayedQueues[lane].newYork){
				if (this.buildMonitor.displayedQueues[lane].newYork[input].unit != null) {
					progress = this.buildMonitor.displayedQueues[lane].newYork[input].unit.getBuildPercentProgress()
					progress = "<div style='background-color:orange;width:"+progress+"%';>&nbsp;</div>"
				} else {
					progress = ""
				}
				document.querySelector("#newYork-build-queue ."+input+" ."+lane+" .progress").innerHTML = progress
			}
		}
		this.lastProgressRefreshTime = time
	}
}
