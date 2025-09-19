import React, {useState} from 'react';
import {View} from 'react-native';
import {useTimeout} from "../../../data/src/hooks/use-timeout";

interface IProps {
    children: any,
    delay?: number;
}

export function Delayed(props: IProps) {
    const { children, delay = 0 } = props;
    const [visible, setVisible] = useState(false);

    useTimeout(() => setVisible(true), delay);

    if (!visible) return <View/>;
    return children;
}
