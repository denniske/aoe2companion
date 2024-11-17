import { Markdown, MarkdownProps } from '../components/markdown';

export const TournamentMarkdown: React.FC<Omit<MarkdownProps, 'baseUrl'>> = ({ children, ...rest }) => {
    return (
        <Markdown baseUrl="https://liquipedia.net" {...rest}>
            {children}
        </Markdown>
    );
};
