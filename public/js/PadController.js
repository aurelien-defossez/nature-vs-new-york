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
}

PadController.prototype.checkAction = function(player) {

    var pads,
        pad;

    if(Gamepad.supported) {
        pads = Gamepad.getStates();
        pad = pads[this.padNumber];
        if(pad) {

            buildingMode = (pad.leftShoulder1 > 0.3)||(pad.rightShoulder1 > 0.3)
            if(pad.faceButton0) {
                arrowAction(player, pad, 'A', buildingMode)
            } else if(pad.faceButton1) {
                arrowAction(player, pad, 'B', buildingMode)
            } else if(pad.faceButton2) {
                arrowAction(player, pad, 'X', buildingMode)
            } else if(pad.faceButton3) {
                arrowAction(player, pad, 'Y', buildingMode)
            }
        }
    }else{
        console.log("Gamepad Not supported")
    }
}

function arrowAction(player, pad, button, buildingMode) {
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