import React from 'react'
import { View, StyleSheet } from 'react-native'

type Props = {
    behind: React.ReactNode,
    front: React.ReactNode,
    under?: React.ReactNode
}

// Show something on top of other
export default class OverlayContainer extends React.Component<Props> {
    render() {
        const { behind, front, under } = this.props

        return (
                <View style={styles.container}>
                    <View style={styles.center}>
                        <View style={styles.behind}>
                            {behind}
                        </View>
                        {front}
                    </View>
                    {/*{under}*/}
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // borderColor: 'black',
        // borderWidth: 1,
        // backgroundColor: 'yellow',
        flex: 1,
        alignItems: 'center',
        // height: 100,
        justifyContent: 'center',
    },
    center: {
        // backgroundColor: 'purple',
        width: '100%',
        height: '100%',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    behind: {
        // backgroundColor: 'red',
        // alignItems: 'center',
        // justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});
