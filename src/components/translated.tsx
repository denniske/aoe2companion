import React, { Fragment, ReactNode } from 'react';

const placeholderPattern = /\{(\w+)\}/g;

/**
 * Renders a translated sentence that contains a component, e.g. an inline link
 * or a button.
 *
 * The whole sentence lives in a single translation key with a `{name}` marker
 * where the component belongs, so translators can move the component to
 * wherever their language needs it:
 *
 *     "redbull.snippet.compete": "Anyone can compete for a spot! Track your ranking by {link} for an account."
 *
 *     <Translated
 *         text={getTranslation('redbull.snippet.compete')}
 *         components={{ link: <Link onPress={showLoginPopup}>{getTranslation('redbull.snippet.compete.link')}</Link> }}
 *     />
 *
 * Splitting such a sentence into `.before` / `.after` keys instead would bake
 * English word order into the layout.
 */
export const Translated: React.FC<{ text: string | undefined; components: Record<string, ReactNode> }> = ({ text, components }) => {
    if (!text) return null;

    const parts: ReactNode[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(placeholderPattern)) {
        const component = components[match[1]];

        // Leave unknown placeholders as literal text rather than dropping them,
        // so a typo in a translation is visible instead of silently swallowed.
        if (component === undefined) continue;

        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(component);
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
