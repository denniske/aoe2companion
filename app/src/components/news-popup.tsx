import tw from '@app/tailwind';
import { Post } from '@app/utils/news';
import BottomSheet from '@app/view/bottom-sheet';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { decode } from 'html-entities';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHtml, {
    CustomTagRendererRecord,
    HTMLContentModel,
    HTMLElementModel,
    HTMLElementModelRecord,
    TChildrenRenderer,
} from 'react-native-render-html';
import WebView from 'react-native-webview';

import { textVariantStyles } from '../utils/text.util';

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

export const NewsPopup: React.FC<{ post: Post; visible: boolean; onClose: () => void }> = ({ post, visible, onClose }) => {
    const { width } = useWindowDimensions();

    return (
        <BottomSheet showHandle title={decode(post.title.rendered)} isActive={visible} onClose={onClose}>
            <View className="pt-4">
                <RenderHtml
                    systemFonts={['Roboto_400Regular', 'Roboto_500Medium', 'Roboto_700Bold', 'Roboto_900Black']}
                    renderers={renderers}
                    customHTMLElementModels={customHTMLElementModels}
                    renderersProps={{
                        iframe: {
                            scalesPageToFit: true,
                        },
                    }}
                    WebView={WebView}
                    contentWidth={width - 32}
                    source={{ html: post.content.rendered }}
                    baseStyle={{ ...tw`text-black dark:text-white`, ...textVariantStyles['body'] }}
                    tagsStyles={{
                        h1: textVariantStyles.title,
                        h2: textVariantStyles['header-lg'],
                        h3: textVariantStyles.header,
                        h4: textVariantStyles['header-sm'],
                        h5: textVariantStyles['header-xs'],
                        h6: textVariantStyles['label'],
                        b: textVariantStyles['header-xs'],
                        strong: textVariantStyles['header-xs'],
                        blockquote: tw`bg-white dark:bg-blue-900 py-1.5 px-2.5 my-3 mx-0 border border-gray-200 dark:border-gray-800 rounded`,
                        a: tw`text-blue-600 dark:text-gold-200`,
                        figure: { margin: 0 },
                        iframe: { margin: 0 },
                        button: tw`bg-blue-800 dark:bg-gold-700 py-1.5 px-2.5 rounded`,
                    }}
                    classesStyles={{
                        'wp-block-buttons': tw`flex-row justify-around`,
                        'wp-block-button': tw`bg-blue-800 dark:bg-gold-700 py-1.5 px-2.5 rounded`,
                        'wp-block-button__link': { ...tw`text-white no-underline`, ...textVariantStyles['header-xs'] },
                        accordion__title: { ...tw`text-white`, ...textVariantStyles['header-xs'] },
                    }}
                />
            </View>
        </BottomSheet>
    );
};
