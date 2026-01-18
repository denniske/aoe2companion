import { View } from 'react-native';
import { Text } from './text';
import { Href, useGlobalSearchParams, useLocalSearchParams, useSegments } from 'expo-router';
import startCase from 'lodash/startCase';
import { Link } from './link';
import { Icon } from './icon';
import { Fragment } from 'react';
import { SkeletonText } from './skeleton';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

const replaceParamsInPath = (segment: string, params: Record<string, string | null>) =>
    Object.entries(params).reduce((acc, [key, value]) => acc.replace(`[${key}]`, value?.toString() ?? ''), segment.toString());

export const Breadcrumbs: React.FC<{ title: string; paramReplacements?: Record<string, string | null> }> = ({ title, paramReplacements }) => {
    const params = useGlobalSearchParams<Record<string, string>>();
    const segments = useSegments();
    const screenNames = segments
        .filter((segment) => segment !== 'more' && segment !== '(main)')
        .map((segment) => ({ key: segment.replace(/[\[\]']+/g, ''), value: replaceParamsInPath(segment, params) }));
    const TextComponent = title ? Text : SkeletonText;

    return (
        <View className={cn('flex-row items-center gap-1 py-1.5', containerClassName)}>
            <Link href="/" color="subtle">
                Home
            </Link>
            <Icon icon="chevron-right" size={12} />

            {screenNames.map(({ key, value: segment }, index) => {
                const isLast = index === screenNames.length - 1;
                const allSegments = [...screenNames.slice(0, index).map(s => s.value), segment];
                const fullPath = `/${allSegments.join('/')}`;
                const replacement = paramReplacements?.[key] === undefined ? undefined : paramReplacements[key];
                const LinkComponent = replacement === null ? SkeletonText : Link;

                return isLast ? (
                    <TextComponent key={fullPath} color="subtle" variant="label" className={!title ? 'w-10!' : undefined} alt>
                        {title}
                    </TextComponent>
                ) : (
                    <Fragment key={fullPath}>
                        <LinkComponent
                            href={fullPath as Href}
                            color="subtle"
                            className={replacement === null ? 'w-10!' : undefined}
                            alt={replacement === null}
                        >
                            {replacement ?? startCase(segment)}
                        </LinkComponent>
                        <Icon icon="chevron-right" size={12} color="subtle" />
                    </Fragment>
                );
            })}
        </View>
    );
};
