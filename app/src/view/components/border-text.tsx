import React from 'react';
import {TextStyle} from 'react-native';
import {MyText, MyTextProps} from "./my-text";


const offset = 0.75;

export function BorderText(props: MyTextProps) {
    const { children, style, ...rest } = props;

    const style1 = {
        flex: 1,
        // color: 'red',
        // position: 'absolute',
        textShadowColor: '#000',
        textShadowOffset: {width: offset, height: 0},
        textShadowRadius: 0.3,
    } as TextStyle;

    const style2 = {
        // color: 'red',
        position: 'absolute',
        textShadowColor: '#000',
        textShadowOffset: {width: -offset, height: 0},
        textShadowRadius: 0.3,
    } as TextStyle;

    const style3 = {
        // color: 'red',
        position: 'absolute',
        textShadowColor: '#000',
        textShadowOffset: {height: offset, width: 0},
        textShadowRadius: 0.3,
    } as TextStyle;

    const style4 = {
        // color: 'red',
        position: 'absolute',
        textShadowColor: '#000',
        textShadowOffset: {height: -offset, width: 0},
        textShadowRadius: 0.3,
    } as TextStyle;

    return (
        <MyText style={[style, { }]}>
            <MyText {...rest} style={[style, style1, {}]} numberOfLines={1}>{children}</MyText>
            {/*<MyText {...rest} style={[style, style2]}>{children}</MyText>*/}
            {/*<MyText {...rest} style={[style, style3]}>{children}</MyText>*/}
            {/*<MyText {...rest} style={[style, style4]}>{children}</MyText>*/}
        </MyText>
    );
}
