import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {createStylesheet} from '../theming-new';
// import Purchases, {PURCHASE_TYPE, PurchaserInfo, PurchasesProduct} from 'react-native-purchases';
import {Button} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabBarLabel} from './components/tab-bar-label';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {openLink} from '../helper/url';
import {useTheme} from '../theming';
import {appVariants} from '../styles';
import Space from './components/space';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../App2';
import {setPurchaserInfo, useMutate, useSelector} from '../redux/reducer';

const Tab = createMaterialTopTabNavigator();


// async function getCoffeeProducts() {
//     return await Purchases.getProducts(['coffee.1', 'coffee.3', 'coffee.5'], PURCHASE_TYPE.INAPP);
// }
//
// async function getSupporterProduct() {
//     const products = await Purchases.getProducts(['supporter'], PURCHASE_TYPE.SUBS);
//     return products.filter(p => p.identifier === 'supporter')[0];
// }

export default function DonationPage(props: any) {
    return <View />;
    // return <DonationInner {...props} />;
}

// function DonationInner() {
//     const mutate = useMutate();
//     const route = useRoute<RouteProp<RootStackParamList, 'Donation'>>();
//     const styles = useStyles();
//     const [products, setProducts] = useState({});
//     const purchaserInfo = useSelector(state => state.donation?.purchaserInfo) as PurchaserInfo;
//
//     const init = async () => {
//         try {
//             Purchases.setup(Platform.OS === 'android' ? 'goog_zplywHQQpwVFHSSxskZzKlRuwZO' : 'appl_kOclOwIXEyXVRYYmCPGyRtMxXsH');
//             const info = await Purchases.getPurchaserInfo();
//             const products = await Promise.all([
//                 Purchases.getProducts(['supporter'], PURCHASE_TYPE.SUBS),
//                 Purchases.getProducts(['coffee.1', 'coffee.3', 'coffee.5'], PURCHASE_TYPE.INAPP),
//             ]);
//             mutate(setPurchaserInfo(info));
//             setProducts(products);
//             console.log('products', products);
//         } catch (e) {
//             setProducts({ text: 'Error: ' + e });
//             console.log('error', e);
//         }
//     };
//
//     useEffect(() => {
//         init();
//     }, []);
//
//     const hasActiveSubscription = purchaserInfo?.activeSubscriptions?.length > 0;
//     const coffeeTransactions = purchaserInfo?.nonSubscriptionTransactions?.filter(t => t.productId.includes('coffee'));
//     const coffeeQuantity = coffeeTransactions
//         ?.map(t => parseInt(t.productId.replace('coffee.', '')))
//         ?.reduce((a: number, b: number) => a + b, 0);
//
//     // const hasActiveSubscription = purchaserInfo != null;// true;
//     // const coffeeQuantity = 0;
//
//     return (
//         <ScrollView
//             style={styles.container}
//             contentContainerStyle={styles.content}>
//
//             <MyText style={styles.description}>
//                 <MyText style={styles.descriptionName}>Dennis Keil</MyText> is creating Apps and Tools for the Age of Empires Community
//             </MyText>
//             <MyText style={styles.supporters}>64 supporters</MyText>
//
//             {
//                 (coffeeQuantity > 0) &&
//                 <MyText style={styles.action2}>You have bought <MyText style={styles.actionName2}>{coffeeQuantity}</MyText> coffees.</MyText>
//             }
//             {
//                 (!hasActiveSubscription && coffeeQuantity > 0) &&
//                 <MyText style={styles.action}>Thanks for your support 😊</MyText>
//             }
//
//             {
//                 purchaserInfo != null &&
//                 <Tab.Navigator screenOptions={{ lazy:true, swipeEnabled: true }} initialRouteName={hasActiveSubscription ? 'DonationMembership' : 'DonationSupport'}>
//                     <Tab.Screen name="DonationMembership" options={{title: '', tabBarLabel: (x) => <TabBarLabel {...x} title="Membership"/>}} component={DonationMembership} />
//                     <Tab.Screen name="DonationSupport" options={{title: '', tabBarLabel: (x) => <TabBarLabel {...x} title="Support"/>}} component={DonationSupport} />
//                 </Tab.Navigator>
//             }
//
//             <Space/>
//
//             {
//                 route?.params?.debug &&
//                 <View>
//                     <MyText>{JSON.stringify(purchaserInfo, null, 4)}</MyText>
//                     <MyText>{JSON.stringify(products, null, 4)}</MyText>
//                 </View>
//             }
//         </ScrollView>
//     );
// }
//
// function DonationMembership() {
//     const mutate = useMutate();
//     const styles = useStyles();
//     const appStyles = useTheme(appVariants);
//     const [coffeeProduct, setCoffeeProduct] = useState<PurchasesProduct>();
//     const [totalPrice, setTotalPrice] = useState('');
//     const [error, setError] = useState();
//     const purchaserInfo = useSelector(state => state.donation?.purchaserInfo) as PurchaserInfo;
//
//     const join = async (product: PurchasesProduct) => {
//         try {
//             const result = await Purchases.purchaseProduct(product.identifier);
//             mutate(setPurchaserInfo(result.purchaserInfo));
//         } catch(e) {
//             setError(e);
//         }
//     };
//
//     const init = async () => {
//         // setActiveSubscriptions(['supporter']);
//         setCoffeeProduct(await getSupporterProduct());
//     };
//
//     useEffect(() => {
//         init();
//     }, []);
//
//     useEffect(() => {
//         if (!coffeeProduct) return;
//         setTotalPrice(coffeeProduct!.price_string);
//     }, [coffeeProduct]);
//
//     const cancelSubAppStoreLink = 'https://support.apple.com/en-us/HT202039';
//     const cancelSubPlayStoreLink = 'https://support.google.com/googleplay/answer/7018481?co=GENIE.Platform%3DAndroid&oco=1';
//     const cancelSubLink = Platform.OS === 'android' ? cancelSubPlayStoreLink : cancelSubAppStoreLink;
//
//     const activeSubscriptions = purchaserInfo?.activeSubscriptions;
//
//     if (activeSubscriptions?.length > 0) {
//         return (
//             <View style={styles.container}>
//                 <MyText style={styles.membershipHeader}>Active Membership</MyText>
//                 <MyText style={styles.membershipPrice}>{totalPrice}</MyText>
//                 <MyText style={styles.membershipFrequency}>per month</MyText>
//
//                 <MyText style={styles.action}>Thanks for your support 😊</MyText>
//
//                 <MyText style={styles.linkCenter}>
//                     You can{' '}
//                     <MyText style={appStyles.link}
//                             onPress={() => openLink(cancelSubLink)}>cancel your subscription</MyText>
//                     {' '}anytime.
//                 </MyText>
//             </View>
//         );
//     }
//
//     return (
//         <View style={styles.container}>
//             <MyText style={styles.membershipHeader}>Membership</MyText>
//             <MyText style={styles.membershipPrice}>{totalPrice}</MyText>
//             <MyText style={styles.membershipFrequency}>per month</MyText>
//
//             <Button style={styles.button} labelStyle={styles.buttonText} mode="contained" onPress={() => join(coffeeProduct!)}>Join</Button>
//
//             <DonationLink/>
//
//             {
//                 error &&
//                 <View>
//                     <MyText>{JSON.stringify(error, null, 4)}</MyText>
//                 </View>
//             }
//         </View>
//     );
// }
//
// function DonationSupport() {
//     const mutate = useMutate();
//     const styles = useStyles();
//     const [coffeeQuantity, setCoffeeQuantity] = useState(1);
//     const [coffeeProducts, setCoffeeProductss] = useState<PurchasesProduct[]>();
//     const [totalPrice, setTotalPrice] = useState('');
//     const [error, setError] = useState();
//
//     const buyCoffee = async (product: PurchasesProduct) => {
//         try {
//             const result = await Purchases.purchaseProduct(product.identifier, null, PURCHASE_TYPE.INAPP);
//             mutate(setPurchaserInfo(result.purchaserInfo));
//         } catch(e) {
//             setError(e);
//         }
//     };
//
//     const getProducts = async () => {
//       setCoffeeProductss(await getCoffeeProducts());
//     };
//
//     useEffect(() => {
//         getProducts();
//     }, []);
//
//     useEffect(() => {
//         if (!coffeeProducts) return;
//         setTotalPrice(coffeeProducts[[1, 3, 5].indexOf(coffeeQuantity)]!.price_string);
//     }, [coffeeQuantity, coffeeProducts]);
//
//     const getCoffeeButtonStyle = (quantity: number) => {
//         return [styles.coffeeButton, quantity === coffeeQuantity ? styles.coffeeButtonSelected : null];
//     };
//     const getCoffeeButtonTextStyle = (quantity: number) => {
//         return [styles.coffeeButtonText, quantity === coffeeQuantity ? styles.coffeeButtonSelectedText : null];
//     };
//
//     return (
//         <ScrollView
//             style={styles.container}
//             contentContainerStyle={styles.content}>
//
//             <MyText style={styles.action}>Buy <MyText style={styles.actionName}>Dennis Keil</MyText> a coffee</MyText>
//
//             <View style={styles.coffeeRow}>
//                 <FontAwesome5Icon style={styles.coffeeIcon} size={20} name="coffee"/>
//                 <FontAwesome5Icon style={styles.coffeeQuantityIcon} size={20} name="times"/>
//                 <Button style={getCoffeeButtonStyle(1)} labelStyle={getCoffeeButtonTextStyle(1)} compact={true} mode="contained" onPress={() => setCoffeeQuantity(1)}>1</Button>
//                 <Button style={getCoffeeButtonStyle(3)} labelStyle={getCoffeeButtonTextStyle(3)} compact={true} mode="contained" onPress={() => setCoffeeQuantity(3)}>3</Button>
//                 <Button style={getCoffeeButtonStyle(5)} labelStyle={getCoffeeButtonTextStyle(5)} compact={true} mode="contained" onPress={() => setCoffeeQuantity(5)}>5</Button>
//             </View>
//
//             <Button style={styles.button} labelStyle={styles.buttonText} mode="contained" onPress={() => buyCoffee(coffeeProducts![[1, 3, 5].indexOf(coffeeQuantity)])}>Support {totalPrice}</Button>
//
//             <DonationLink/>
//
//             {
//                 error &&
//                 <View>
//                     <MyText>{JSON.stringify(error, null, 4)}</MyText>
//                 </View>
//             }
//         </ScrollView>
//     );
// }
//
// function DonationLink() {
//     const styles = useStyles();
//     const appStyles = useTheme(appVariants);
//
//     if (Platform.OS === 'ios') {
//         return <View/>;
//     }
//
//     return (
//         <MyText style={styles.link}>
//             If you have not setup in-app purchases, you can also support me on{' '}
//             <MyText style={appStyles.link}
//                     onPress={() => openLink('https://www.buymeacoffee.com/denniskeil')}>buymeacoffee.com</MyText>
//             .
//         </MyText>
//     );
// }

const useStyles = createStylesheet(theme => StyleSheet.create({
    coffeeIcon: {
    },
    coffeeQuantityIcon: {
    },
    coffeeRow: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-around',
        width: 220,
    },
    coffeeButton: {
        borderRadius: 50,
        width: 36,
        backgroundColor: 'white',
    },
    coffeeButtonSelected: {
        backgroundColor: '#198CD5',
    },
    coffeeButtonText: {
        color: '#198CD5',
    },
    coffeeButtonSelectedText: {
        color: 'white',
    },
    description: {
        textAlign: 'center',
        alignSelf: 'center',
        maxWidth: 290,
        paddingVertical: 10,
        fontSize: 20,
        lineHeight: 30,
    },
    descriptionName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    supporters: {
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
        color: '#666',
    },
    action: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    action2: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionName2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    actionName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    button: {
        borderRadius: 10,
        marginVertical: 5,
    },
    buttonDanger: {
        borderRadius: 10,
        marginVertical: 5,
        // backgroundColor: '#D00',
    },
    buttonText: {
        borderRadius: 10,
        paddingVertical: 5,
        color: 'white',
        fontWeight: 'bold',
    },
    membershipHeader: {
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    membershipPrice: {
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 25,
        fontWeight: 'bold',
    },
    membershipFrequency: {
        textAlign: 'center',
        paddingVertical: 5,
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    link: {
        paddingVertical: 10,
        lineHeight: 19,
    },
    linkCenter: {
        paddingVertical: 10,
        lineHeight: 19,
        textAlign: 'center',
    },

    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        // alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    note: {
        color: theme.textNoteColor,
        textAlign: 'center',
    },
}));
