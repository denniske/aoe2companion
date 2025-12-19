import { View } from 'react-native';
import { Text } from './text';
import { Href, useLocalSearchParams, useSegments } from 'expo-router';
import startCase from 'lodash/startCase';
import { Link } from './link';
import { Icon } from './icon';
import { Fragment } from 'react';
import { SkeletonText } from './skeleton';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

const replaceParamsInPath = (segment: string, params: Record<string, string | undefined>) =>
    Object.entries(params).reduce((acc, [key, value]) => acc.replace(`[${key}]`, value?.toString() ?? ''), segment.toString());

export const Breadcrumbs: React.FC<{ title: string }> = ({ title }) => {
    const params = useLocalSearchParams<Record<string, string>>();
    const segments = useSegments();
    const screenNames = segments.filter((segment) => segment !== 'more').map((segment) => replaceParamsInPath(segment, params));
    const TextComponent = title ? Text : SkeletonText;

    return (
        <View className={cn('flex-row items-center gap-1 py-1.5', containerClassName)}>
            <Link href="/">Home</Link>
            <Icon icon="chevron-right" size={12} />

            {screenNames.map((segment, index) => {
                const isLast = index === screenNames.length - 1;
                const allSegments = [...screenNames.slice(0, index), segment];
                const fullPath = `/${allSegments.join('/')}`;

                return isLast ? (
                    <TextComponent key={fullPath} color="brand" variant="label" className={!title ? 'w-10!' : undefined} alt>
                        {title}
                    </TextComponent>
                ) : (
                    <Fragment key={fullPath}>
                        <Link href={fullPath as Href}>{startCase(segment)}</Link>
                        <Icon icon="chevron-right" size={12} />
                    </Fragment>
                );
            })}
        </View>
    );
};
