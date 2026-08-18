import { View } from 'react-native';
import { Card } from './card';
import { Image } from './uniwind/image';
import { Text } from './text';
import { Button } from './button';
import { Icon } from './icon';
import { faSignal, faSignalSlash } from '@fortawesome/sharp-solid-svg-icons';
import { useLoginPopup } from '@app/hooks/use-login-popup';
import { useAuthProfileId } from '@app/queries/all';
import { Link } from './link';
import { Link as ExpoLink } from 'expo-router';
import { END_DATE } from './red-bull-wololo-live-standings/dates';
import { isPast } from 'date-fns';
import { Translated } from '@app/components/translated';
import { useTranslation } from '@app/helper/translate';

export const RedBullSnippet: React.FC = () => {
    const getTranslation = useTranslation();
    const { shouldPromptLogin, showLoginPopup } = useLoginPopup();
    const authProfileId = useAuthProfileId();
    const isPastDeadline = isPast(END_DATE);

    return (
        <Card className="gap-6 px-6 py-4 md:flex-row items-center" direction="vertical">
            <Image source={require('../../assets/red-bull-wololo.png')} className="w-40 h-36" contentFit="contain" />

            <View className="flex-1 gap-3">
                <Text variant="header" className="text-center md:text-left">
                    {getTranslation(isPastDeadline ? 'redbull.snippet.title.complete' : 'redbull.snippet.title')}
                </Text>
                <Text className="text-center md:text-left">
                    {getTranslation(isPastDeadline ? 'redbull.snippet.description.complete' : 'redbull.snippet.description')}
                </Text>
                {isPastDeadline ? (
                    <Text className="text-center md:text-left">
                        {getTranslation('redbull.snippet.complete.note')}
                    </Text>
                ) : shouldPromptLogin ? (
                    <Text className="text-center md:text-left">
                        <Translated
                            text={getTranslation('redbull.snippet.compete.signup')}
                            components={{
                                link: (
                                    <Link variant="body" onPress={showLoginPopup}>
                                        {getTranslation('redbull.snippet.compete.signingup')}
                                    </Link>
                                ),
                            }}
                        />
                    </Text>
                ) : authProfileId ? (
                    <Text className="text-center md:text-left">
                        <Translated
                            text={getTranslation('redbull.snippet.compete.profile')}
                            components={{
                                link: (
                                    <Link variant="body" href={`/players/${authProfileId}`}>
                                        {getTranslation('redbull.snippet.compete.viewprofile')}
                                    </Link>
                                ),
                            }}
                        />
                    </Text>
                ) : (
                    <Text className="text-center md:text-left">
                        <Translated
                            text={getTranslation('redbull.snippet.compete.profile')}
                            components={{
                                link: (
                                    <Link variant="body" href={`/players/select`}>
                                        {getTranslation('redbull.snippet.compete.selectprofile')}
                                    </Link>
                                ),
                            }}
                        />
                    </Text>
                )}

                <View className="flex-row gap-1 justify-center md:justify-start">
                    <Icon icon={isPastDeadline ? faSignalSlash : faSignal} color="subtle" size={14} />

                    <Text variant="body-sm" color="subtle" className="text-center md:text-left italic">
                        {getTranslation(isPastDeadline ? 'redbull.snippet.standings.final' : 'redbull.snippet.standings.live')}
                    </Text>
                </View>
            </View>

            <ExpoLink className="flex rounded" href="/red-bull-wololo-live-standings" target="_blank">
                <Button>{isPastDeadline ? 'View Final Standings' : 'View Live Standings'}</Button>
            </ExpoLink>
        </Card>
    );
};
