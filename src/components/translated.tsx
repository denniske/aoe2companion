import React, { Fragment, ReactNode } from 'react';

const tagPattern = /<(\w+)>([\s\S]*?)<\/\1>/g;

/**
 * Renders a translated sentence that contains a component, e.g. an inline link
 * or a button.
 *
 * The whole sentence — including the component's own label — lives in a single
 * translation key, with the label wrapped in a tag:
 *
 *     "main.profile.signup": "<button>Sign up</button> to manage your profile."
 *
 *     <Translated
 *         text={getTranslation('main.profile.signup')}
 *         components={{ button: (label) => <Button href="/more/account">{label}</Button> }}
 *     />
 *
 * Each entry in `components` receives the text between its tags and returns the
 * element to render in its place. Keeping the label inside the sentence lets
 * translators move the component wherever their language needs it, and inflect
 * the label to match the surrounding grammar.
 */
export const Translated: React.FC<{ text: string | undefined; components: Record<string, (children: string) => ReactNode> }> = ({
    text,
    components,
}) => {
    if (!text) return null;

    const parts: ReactNode[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(tagPattern)) {
        const render = components[match[1]];

        // Leave unknown tags as literal text rather than dropping them, so a
        // typo in a translation is visible instead of silently swallowed.
        if (render === undefined) continue;

        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(render(match[2]));
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>{part}</Fragment>
            ))}
        </>
    );
};
