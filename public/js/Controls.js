/**
 * Actions on Gamepad:
 * faceButton0: Button A
 * faceButton1: Button B
 * faceButton2: Button X
 * faceButton3: Button Y
 * dpadUp: Cursor Up
 * dpadDown: Cursor Down
 */
function buttonAction(player, pad) {

    if(pad.faceButton0) {
        arrowAction(player, pad, 'A')
    } else if(pad.faceButton1) {
        arrowAction(player, pad, 'B')
    } else if(pad.faceButton2) {
        arrowAction(player, pad, 'X')
    } else if(pad.faceButton3) {
        arrowAction(player, pad, 'Y')
    }
}

function arrowAction(player, pad, button) {
    if( pad.dpadUp ) {
        createUnit(player, 3, button)
    } else if ( pad.dpadDown ) {
        createUnit(player, 1, button)
    } else {
        createUnit(player, 2, button)
    }
}