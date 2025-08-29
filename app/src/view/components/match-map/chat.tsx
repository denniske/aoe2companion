import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated';

interface IChatMessage {
    time: number;
    color: string | undefined;
    timestamp: string;
    audience: string;
    message: string;
    origination: string;
    playerName?: string;
    index: number;
}

interface Props {
    time: SharedValue<number>;
    chat: IChatMessage[];
}

const shallowArrayEqual = (a: any[], b: any[]): boolean => {
    if (a === b) return true;
    if (a.length !== b.length) {
        // console.log('len', a.length, b.length);
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            // console.log('a[i]', a[i], 'b[i]', b[i]);
            return false;
        }
    }

    return true;
};

export default function Chat({ time, chat }: Props) {
    const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);

    // console.log('RERENDER CHAT');

    const updateMessages = (time: number) => {
        // console.log('updateMessages', time)
        const messages = chat.filter((c) => c.time > time && c.time < time + 70 * 1000);
        if (!shallowArrayEqual(messages, currentMessages)) {
            // console.log('update', messages);
            setCurrentMessages(messages);
        }
    };

    useAnimatedReaction(
        () => time.value,
        (newTime, prevTime) => {
            if (newTime !== prevTime) {
                runOnJS(updateMessages)(newTime);
            }
        },
        [currentMessages]
    );

    return (
        <View
            style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: 150,
                display: currentMessages.length > 0 ? 'flex' : 'none',
            }}
            className="mx-3 bg-gray-800/60 gap-1 p-2"
        >
            {currentMessages.map((message) => (
                <Text
                    key={message.index}
                    style={{
                        color: message.color?.toLowerCase(),
                        fontSize: 10,
                    }}
                >
                    {message.origination} - {message.playerName}: {message.message}
                </Text>
            ))}
        </View>
    );
}
