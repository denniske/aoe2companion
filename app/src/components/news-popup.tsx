import { Post } from '@app/utils/news';
import BottomSheet from '@app/view/bottom-sheet';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { decode } from 'html-entities';
import { useColorScheme } from 'nativewind';
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

import themeColors from '../colors';
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
    const { colorScheme } = useColorScheme();

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
                    baseStyle={{ color: colorScheme === 'dark' ? themeColors.white : themeColors.black, ...textVariantStyles['body'] }}
                    tagsStyles={{
                        h1: textVariantStyles.title,
                        h2: textVariantStyles['header-lg'],
                        h3: textVariantStyles.header,
                        h4: textVariantStyles['header-sm'],
                        h5: textVariantStyles['header-xs'],
                        h6: textVariantStyles['label'],
                        b: textVariantStyles['header-xs'],
                        strong: textVariantStyles['header-xs'],
                        blockquote: {
                            backgroundColor: colorScheme === 'dark' ? themeColors.blue[900] : themeColors.white,
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            marginVertical: 12,
                            marginHorizontal: 0,
                            borderColor: colorScheme === 'dark' ? themeColors.gray[800] : themeColors.gray[200],
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                        a: {
                            color: colorScheme === 'dark' ? themeColors.gold[200] : themeColors.blue[600],
                            textDecorationColor: colorScheme === 'dark' ? themeColors.gold[200] : themeColors.blue[600],
                        },
                        figure: { margin: 0 },
                        iframe: { margin: 0 },
                        button: {
                            backgroundColor: colorScheme === 'dark' ? themeColors.gold[700] : themeColors.blue[800],
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 4,
                        },
                    }}
                    classesStyles={{
                        'wp-block-buttons': { flexDirection: 'row', justifyContent: 'space-around' },
                        'wp-block-button': {
                            backgroundColor: colorScheme === 'dark' ? themeColors.gold[700] : themeColors.blue[800],
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 4,
                        },
                        'wp-block-button__link': { color: themeColors.white, textDecorationLine: 'none', ...textVariantStyles['header-xs'] },
                        accordion__title: { color: themeColors.white, ...textVariantStyles['header-xs'] },
                    }}
                />
            </View>
        </BottomSheet>
    );
};
