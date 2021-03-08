import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

interface IProps {
    children: any,
    delay?: number;
}

export function Delayed(props: IProps) {
    const { children, delay = 0 } = props;

    // const [visible, setVisible] = useState(true);

    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, delay);
    }, []);

    if (!visible) return <View/>;

    return children;
}
