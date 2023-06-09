import React from 'react';
import { Pressable as PressableRaw } from 'react-native';

function Pressable(props){
    return <PressableRaw
        onPress={props.onPress}
        hitSlop={props.hitSlop}
        style={({ pressed }) => [props.style || {}, {backgroundColor:pressed ? props.afterCol : props.beforeCol}]}
        >{props.children}</PressableRaw>
}

export default Pressable;