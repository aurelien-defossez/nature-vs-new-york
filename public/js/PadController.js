/**
 * Actions on Gamepad:
 *
 * faceButton0: Button A
 * faceButton1: Button B
 * faceButton2: Button X
 * faceButton3: Button Y
 * dpadUp: Cursor Up
 * dpadDown: Cursor Down
 */
function PadController(padNumber) {
    this.padNumber = padNumber;

    this.buttons = {
        a: 0,
        b: 0,
        x: 0,
        y: 0
    }
}

PadController.prototype.checkAction = function(player) {

    var pads,
        pad;

    if(Gamepad.supported) {
        pads = Gamepad.getStates();
        pad = pads[this.padNumber];
        if(pad) {
            buildingMode = (pad.leftShoulder1 > 0.3)||(pad.rightShoulder1 > 0.3)
            if(pad.faceButton0 && !this.buttons.a) {
                this.arrowAction(player, pad, 'A', buildingMode)
            } else if(pad.faceButton1 && !this.buttons.b) {
                this.arrowAction(player, pad, 'B', buildingMode)
            } else if(pad.faceButton2 && !this.buttons.x) {
                this.arrowAction(player, pad, 'X', buildingMode)
            } else if(pad.faceButton3 && !this.buttons.y) {
                this.arrowAction(player, pad, 'Y', buildingMode)
            }

            displayMana = (pad.leftShoulder0 == 1)||(pad.rightShoulder0 == 1)
            if (displayMana)
                player.displayManaCount()
            else
                player.hideManaCount()

                // Enregistrement du statut du pad
                this.savePadState(pad);
        }
    }else{
        console.log("Gamepad Not supported")
    }
}

PadController.prototype.savePadState = function(pad) {
    this.buttons.a = pad.faceButton0;
    this.buttons.b = pad.faceButton1;
    this.buttons.x = pad.faceButton2;
    this.buttons.y = pad.faceButton3;
}

PadController.prototype.arrowAction = function(player, pad, button, buildingMode) {
    var lane;
    if( pad.dpadUp ) {
        lane = 2;
    } else if ( pad.dpadDown ) {
        lane = 0;
    } else {
        lane = 1;
    }
    if (buildingMode)
    {
        player.createBuilding(button, lane);
    }else{
        player.createUnit(button, lane);
    }
}