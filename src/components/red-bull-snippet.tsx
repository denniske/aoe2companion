import { View } from 'react-native';
import { Card } from './card';
import { Image } from './uniwind/image';
import { Text } from './text';
import { Button } from './button';
import { Icon } from './icon';
import { useLoginPopup } from '@app/hooks/use-login-popup';
import { useAuthProfileId } from '@app/queries/all';
import { Link } from './link';
import { Link as ExpoLink } from 'expo-router';
import { END_DATE } from './red-bull-wololo-live-standings/dates';
import { isPast } from 'date-fns';

export const RedBullSnippet: React.FC = () => {
    const { shouldPromptLogin, showLoginPopup } = useLoginPopup();
    const authProfileId = useAuthProfileId();
    const isPastDeadline = isPast(END_DATE);

    return (
        <Card className="gap-6 px-6 py-4 md:flex-row items-center" direction="vertical">
            <Image source={require('../../assets/red-bull-wololo.png')} className="w-40 h-36" contentFit="contain" />

            <View className="flex-1 gap-3">
                <Text variant="header" className="text-center md:text-left">
                    {isPastDeadline ? 'Red Bull Wololo: Ladder Qualifier — Complete' : 'Red Bull Wololo: Ladder Qualifier'}
                </Text>
                <Text className="text-center md:text-left">
                    {isPastDeadline
                        ? 'The ladder qualifier for Red Bull Wololo: Londinium has concluded.'
                        : 'Track real-time rankings, win streaks, and qualification spots as AoE II players compete for a place at Red Bull Wololo: Londinium.'}
                </Text>
                {isPastDeadline ? (
                    <Text className="text-center md:text-left">
                        Explore the final standings, qualification cut-off, and top performers from the event.
                    </Text>
                ) : shouldPromptLogin ? (
                    <Text className="text-center md:text-left">
                        Anyone can compete for a spot! Track your ranking by{' '}
                        <Link variant="body" onPress={showLoginPopup}>
                            signing up
                        </Link>{' '}
                        for an account.
                    </Text>
                ) : authProfileId ? (
                    <Text className="text-center md:text-left">
                        Anyone can compete for a spot! Track your ranking by{' '}
                        <Link variant="body" href={`/players/${authProfileId}`}>
                            viewing your profile
                        </Link>
                        .
                    </Text>
                ) : (
                    <Text className="text-center md:text-left">
                        Anyone can compete for a spot! Track your ranking by{' '}
                        <Link variant="body" href={`/players/select`}>
                            selecting your profile
                        </Link>
                        .
                    </Text>
                )}

                <View className="flex-row gap-1 justify-center md:justify-start">
                    <Icon icon={isPastDeadline ? 'signal-slash' : 'signal'} color="subtle" size={14} />

                    <Text variant="body-sm" color="subtle" className="text-center md:text-left italic">
                        {isPastDeadline ? 'Standings are now final.' : 'Standings update automatically during live matches'}
                    </Text>
                </View>
            </View>

            <ExpoLink className="flex rounded" href="/red-bull-wololo-live-standings" target="_blank">
                <Button>{isPastDeadline ? 'View Final Standings' : 'View Live Standings'}</Button>
            </ExpoLink>
        </Card>
    );
};
