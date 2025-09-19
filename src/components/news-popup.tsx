import tw from '@app/tailwind';
import { Post } from '@app/utils/news';
import {BottomSheet} from '@app/view/bottom-sheet';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { decode } from 'html-entities';
import { useRef, useState } from 'react';
import { View, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import RenderHtml, {
    CustomTagRendererRecord,
    HTMLContentModel,
    HTMLElementModel,
    HTMLElementModelRecord,
    TChildrenRenderer,
} from 'react-native-render-html';
import WebView from 'react-native-webview';
import { Icon } from '@app/components/icon';
import { textVariantStyles } from '../utils/text.util';
import { BlurView } from 'expo-blur';
import { INews } from '@app/api/helper/api.types';

const Article = ({ TDefaultRenderer, ...props }: { TDefaultRenderer: any; [name: string]: any }) => {
    const [visible, setVisible] = useState(false);
    if (props.tnode.classes.includes('accordion')) {
        const onPress = () => setVisible(!visible);
        const first = props.tnode.children.slice(0, 1);
        const second = props.tnode.children.slice(1, 2);
        return (
            <TDefaultRenderer {...props} onPress={onPress}>
                <TChildrenRenderer tchildren={first} />

                {visible && <TChildrenRenderer tchildren={second} />}
            </TDefaultRenderer>
        );
    }
    return <TDefaultRenderer {...props} />;
};

const renderers: CustomTagRendererRecord = {
    iframe: IframeRenderer,
    article: Article,
};

const customHTMLElementModels: HTMLElementModelRecord = {
    iframe: iframeModel,
    button: HTMLElementModel.fromCustomModel({
        tagName: 'button',
        contentModel: HTMLContentModel.block,
    }),
};

export const NewsPopup: React.FC<{ news: INews; visible: boolean; onClose: () => void }> = ({ news, visible, onClose }) => {
    const { width, height } = useWindowDimensions();

    const [scriptInjected, setScriptInjected] = useState(false);
    const webviewRef = useRef<WebView>(null);

    const hideCookieBannerScript = `
        (function() {
            const existingStyle = document.getElementById('__rn_injected_hide');
            if (existingStyle) return true;
        
            const style = document.createElement('style');
            style.innerHTML = \`
              #cookie-banner, 
              .sticky-header,
              .sidebar,
              .related-articles,
              .insider-subscribe,
              footer {
                display: none !important;
              }
              html, body {
                overscroll-behavior: none;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                margin: 0;
                padding: 0 !important;
              }
              article {
                padding-top: 30px !important;
              }
            \`;
            document.head.appendChild(style);
            // alert('Injected'); // For debugging
            true;
        })();
    `;

    return (
        <BottomSheet
            showHandle={false}
            closeButton
            isActive={visible}
            onClose={onClose}
            isFullHeight={true}
            extendBottom={true}
            container="none"
            containerClassName="bg-blue-950"
        >
            <View className="flex-1">
                {
                    Platform.OS !== 'web' &&
                    <WebView
                        overScrollMode="never"
                        bounces={false}
                        scrollEnabled={true}
                        decelerationRate="normal"
                        ref={webviewRef}
                        source={{ uri: news.link }}
                        style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0)' }} // or #181c29
                        className={'flex-1'}
                        onLoadProgress={({ nativeEvent }) => {
                            webviewRef.current?.injectJavaScript(hideCookieBannerScript);
                        }}
                    />
                }

                <BlurView intensity={50} className="absolute left-0 right-0 top-0 p-4 flex-row" >
                    <View className="flex-1"></View>
                    <TouchableOpacity onPress={onClose}>
                        <Icon size={24} prefix="fasr" icon="times" />
                    </TouchableOpacity>
                </BlurView>

                {/*<TouchableOpacity className="absolute right-1 top-1 p-5" onPress={onClose}>*/}
                {/*    <Icon size={24} prefix="fasr" icon="times" />*/}
                {/*</TouchableOpacity>*/}

                {/*<BlurView intensity={50} className="absolute right-2 top-1 p-4 rounded-full overflow-hidden" >*/}
                {/*    <Icon size={24} prefix="fasr" icon="times" />*/}
                {/*</BlurView>*/}

                {/*{*/}
                {/*    Platform.OS === 'web' &&*/}
                {/*    <RenderHtml*/}
                {/*        systemFonts={['Roboto_400Regular', 'Roboto_500Medium', 'Roboto_700Bold', 'Roboto_900Black']}*/}
                {/*        renderers={renderers}*/}
                {/*        customHTMLElementModels={customHTMLElementModels}*/}
                {/*        renderersProps={{*/}
                {/*            iframe: {*/}
                {/*                scalesPageToFit: true,*/}
                {/*            },*/}
                {/*            // h1: {*/}
                {/*            //     textWrapperStyle: {*/}
                {/*            //         marginTop: 0,*/}
                {/*            //         marginBottom: 0,*/}
                {/*            //     },*/}
                {/*            // },*/}
                {/*            // text: {*/}
                {/*            //     textWrapperStyle: {*/}
                {/*            //         marginTop: 0,*/}
                {/*            //         marginBottom: 0,*/}
                {/*            //     },*/}
                {/*            // },*/}
                {/*        }}*/}
                {/*        WebView={WebView}*/}
                {/*        contentWidth={width - 32}*/}
                {/*        source={{ html: news.content.rendered.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '') }}*/}
                {/*        baseStyle={{ ...tw`text-black dark:text-white`, ...textVariantStyles['body'] }}*/}
                {/*        tagsStyles={{*/}
                {/*            h1: { ...textVariantStyles.title, marginTop: 50, marginBottom: 0 },*/}
                {/*            h2: textVariantStyles['header-lg'],*/}
                {/*            h3: textVariantStyles.header,*/}
                {/*            h4: textVariantStyles['header-sm'],*/}
                {/*            // h5: textVariantStyles['header-xs'],*/}
                {/*            h5: { ...textVariantStyles['header-xs'], marginTop: 10, marginBottom: 10 },*/}
                {/*            h6: textVariantStyles['label'],*/}
                {/*            b: textVariantStyles['header-xs'],*/}
                {/*            strong: textVariantStyles['header-xs'],*/}
                {/*            blockquote: tw`bg-white dark:bg-blue-900 py-1.5 px-2.5 my-3 mx-0 border border-gray-200 dark:border-gray-800 rounded`,*/}
                {/*            a: tw`text-blue-600 dark:text-gold-200 no-underline`,*/}
                {/*            figure: { margin: 0 },*/}
                {/*            iframe: { margin: 0 },*/}
                {/*            button: tw`bg-blue-800 dark:bg-gold-700 py-1.5 px-2.5 rounded`,*/}
                {/*        }}*/}
                {/*        classesStyles={{*/}
                {/*            'wp-block-buttons': tw`flex-row justify-around`,*/}
                {/*            'wp-block-button': tw`bg-blue-800 dark:bg-gold-700 py-1.5 px-2.5 rounded`,*/}
                {/*            'wp-block-button__link': { ...tw`text-white no-underline`, ...textVariantStyles['header-xs'] },*/}
                {/*            accordion__title: { ...tw`text-white`, ...textVariantStyles['header-xs'] },*/}
                {/*            article__info: tw`flex-row mb-4 items-center`,*/}
                {/*            article__author__avatar: tw`rounded-full mr-2 overflow-hidden`,*/}
                {/*            avatar: tw`h-8 w-8`,*/}
                {/*        }}*/}
                {/*    />*/}
                {/*}*/}
            </View>
        </BottomSheet>
    );
};
