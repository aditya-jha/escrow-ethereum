/*
 * created by aditya on 03/02/18
 */

import * as Colors from 'material-ui/styles/colors';
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

export default {
    spacing: spacing,
    fontFamily: "Roboto, sans-serif",
    palette: {
        primary1Color: Colors.white,
        primary2Color: Colors.teal100,
        primary3Color: Colors.teal500,
        accent1Color: Colors.amberA700,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: fade(Colors.darkBlack, 0.87),
        secondaryTextColor: fade(Colors.lightBlack, 0.54),
        alternateTextColor: Colors.black,
        canvasColor: Colors.black,
        borderColor: Colors.grey300,
        disabledColor: fade(Colors.darkBlack, 0.3),
        pickerHeaderColor: Colors.teal500,
        clockCircleColor: fade(Colors.darkBlack, 0.07),
        shadowColor: Colors.fullBlack,
    },
    appBar: {
        height: 64,
        titleFontWeight: 400
    }
};