import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Constant } from '../constant';
import Constants from 'expo-constants';
import HTMLView from 'react-native-htmlview';
import { privacyHtmlEn } from '../../assets/legal/privacy-policy-html-en';

import { WebView } from 'react-native-webview';

export default function PrivacyPage() {
    const htmlContent = privacyHtmlEn;

    //require('../../assets/legal/privacy-policy-html-en');

    console.log("htmlContent2", htmlContent);

    const renderNode = (node: any, index: any, siblings: any, parent: any, defaultRenderer: any) => {
        if (node.name == 'ul' || node.name == 'li') {
            // const a = node.attribs;
            return defaultRenderer(node.children, parent);

            // return (
            //         <View key={index}>
            //             {defaultRenderer(node.children, parent)}
            //         </View>
            // );
        }
    };

    return (
            <WebView
                    source={{ html: htmlContent }}
                    // source={{ uri: 'https://infinite.red' }}
                    // contentInset={{ top: 200, left: 100 }}
                    scalesPageToFit={false}
                    // containerStyle={{ flex: 0, height: '90%' }}
                    // containerStyle={{ paddingTop: 20 }}
            />
            // <ScrollView contentContainerStyle={styles.container}>
            //     <HTMLView
            //             renderNode={renderNode}
            //             paragraphBreak=""
            //             addLineBreaks={false}
            //             value={htmlContent}
            //             // bullet=""
            //             stylesheet={styles2}
            //     />
            // </ScrollView>
    );
}

//     return (
//             <View style={styles.container}>
//                 <Text style={styles.title}>AoE II Companion</Text>
//
//                 {/*<Text style={styles.heading}>Created by</Text>*/}
//                 {/*<Text style={styles.content}>Dennis Keil</Text>*/}
//                 {/*<Text style={styles.content}>Niklas Ohlrogge</Text>*/}
//
//                 {/*<Text style={styles.heading}>Version</Text>*/}
//                 {/*<Text style={styles.content}>{Constant.version}n{Constants.nativeAppVersion}+{Constants.nativeBuildVersion}</Text>*/}
//                 {/*<Text/>*/}
//
//                 {/*<Text style={styles.textJustify}>This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or*/}
//                 {/*    registered trademarks of Microsoft Corporation in the U.S. and other countries.</Text>*/}
//
//                 {/*<Text/>*/}
//                 {/*<View style={styles.row}>*/}
//                 {/*    <Text style={styles.content}>All data in this app is fetched from </Text>*/}
//                 {/*    <TouchableOpacity onPress={() => Linking.openURL('https://aoe2.net')}>*/}
//                 {/*        <Text style={styles.link}>aoe2.net</Text>*/}
//                 {/*    </TouchableOpacity>*/}
//                 {/*    /!*<Text style={styles.content}>.</Text>*!/*/}
//
//                 {/*</View>*/}
//                 {/*<Text/>*/}
//                 {/*<View style={styles.row}>*/}
//                 {/*    <Text style={styles.content}>Icons from </Text>*/}
//                 {/*    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/madebybowtie/FlagKit')}>*/}
//                 {/*        <Text style={styles.link}>FlagKit</Text>*/}
//                 {/*    </TouchableOpacity>*/}
//                 {/*</View>*/}
//             </View>
//     );
// }

const styles2 = StyleSheet.create({
    h1: {
        margin: 0,
        padding: 0,
        fontSize: 24,
        marginVertical: 10,
    },
    h2: {
        // margin: 0,
        // padding: 0,
        fontSize: 20,
        // marginVertical: 10,
    },
    h3: {
        margin: 0,
        padding: 0,
        fontSize: 18,
        marginVertical: 10,
    },
    h4: {
        margin: 0,
        padding: 0,
        fontSize: 16,
        marginVertical: 10,
    },
    h5: {
        margin: 0,
        padding: 0,
        fontSize: 16,
        marginVertical: 10,
    },
    p: {
        marginVertical: 5,
        padding: 0,
        fontSize: 12,
        // fontWeight: 'bold',
        // color: '#FF3366', // make links coloured pink
    },
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});

const styles = StyleSheet.create({

    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
    },
    textJustify: {
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
    },
    link: {
        color: '#397AF9',
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },
});
