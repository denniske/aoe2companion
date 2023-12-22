import { StyleSheet, TextStyle } from 'react-native';
import { createStylesheet } from '../../theming-new';
import MarkdownComponent from 'react-native-markdown-display';
import { openLink } from '../../helper/url';

export interface MarkdownProps {
    children: string;
    baseUrl?: string;
    textAlign?: TextStyle['textAlign'];
    color?: TextStyle['color'];
}

export const Markdown: React.FC<MarkdownProps> = ({ children, baseUrl, textAlign = 'left', color }) => {
    const styles = useStyles();

    return (
        <MarkdownComponent
            onLinkPress={(path) => {
                openLink(`${baseUrl}${path}`);
                return false;
            }}
            style={{
                body: StyleSheet.flatten([styles.text, color ? { color } : undefined]),
                textgroup: { textAlign, width: '100%' },
            }}
        >
            {children}
        </MarkdownComponent>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        text: {
            fontSize: 14,
            color: theme.textColor,
        },
    })
);
