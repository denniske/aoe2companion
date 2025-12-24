import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Skeleton } from './skeleton';
import { Image } from './uniwind/image';
import { Icon } from './icon';
import { Pressable, View } from 'react-native';
import { useAccount, useProfileFast } from '@app/queries/all';
import cn from 'classnames';
import { Link } from 'expo-router';
import { Text } from './text';
import useAuth from '@/data/src/hooks/use-auth';
import { useLoginPopup } from '@app/hooks/use-login-popup';

export const AccountMenu: React.FC = () => {
    const { showLoginPopup } = useLoginPopup();
    const { data: account, isPending, logout } = useAccount();
    const user = useAuth();
    const { data: profile, isLoading: isLoadingProfile } = useProfileFast(account?.profileId);
    const isLoading = isPending || isLoadingProfile;

    return (
        <Menu>
            {({ close }) => (
                <>
                    <MenuButton
                        disabled={isLoading}
                        className={cn(
                            'flex-row justify-center items-center gap-2.5 rounded-lg px-1 fill-subtle',
                            !isLoading && 'hocus:bg-gold-50 dark:hocus:bg-blue-700 cursor-pointer'
                        )}
                    >
                        {isLoading ? (
                            <Skeleton className="w-10 h-10 rounded-full bg-white dark:bg-black" />
                        ) : profile ? (
                            <Image className="w-10 h-10 rounded-full" source={{ uri: profile?.avatarFullUrl }} />
                        ) : (
                            <View className="w-10 h-10 justify-center items-center">
                                <Icon icon="user" size={24} />
                            </View>
                        )}
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 origin-top-right rounded-lg border border-border bg-background p-1 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none! data-closed:scale-95 data-closed:opacity-0 shadow-lg"
                    >
                        {account?.profileId && (
                            <MenuItem>
                                <Link
                                    onPress={close}
                                    href={`/players/${account.profileId}`}
                                    className="flex flex-row w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-hoverBackground"
                                >
                                    <Icon icon="user" />
                                    <Text variant="body-lg">Profile</Text>
                                </Link>
                            </MenuItem>
                        )}

                        {user && account && (
                            <>
                                <MenuItem>
                                    <Link
                                        onPress={close}
                                        href="/more/account"
                                        className="flex flex-row w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-hoverBackground"
                                    >
                                        <Icon icon="user-circle" />
                                        <Text variant="body-lg">Account</Text>
                                    </Link>
                                </MenuItem>

                                <MenuItem>
                                    <Link
                                        onPress={close}
                                        href="/more/settings"
                                        className="flex flex-row w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-hoverBackground"
                                    >
                                        <Icon icon="cog" />
                                        <Text variant="body-lg">Settings</Text>
                                    </Link>
                                </MenuItem>

                                <View className="my-1 h-px bg-border" />

                                <MenuItem>
                                    <Pressable
                                        onPress={() => {
                                            close();
                                            logout();
                                        }}
                                        className="flex flex-row w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-hoverBackground"
                                    >
                                        <Icon icon="arrow-right-from-bracket" />
                                        Logout
                                    </Pressable>
                                </MenuItem>
                            </>
                        )}

                        {!user && (
                            <MenuItem>
                                <Pressable
                                    onPress={() => {
                                        close();
                                        showLoginPopup();
                                    }}
                                    className="flex flex-row w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-hoverBackground"
                                >
                                    <Icon icon="arrow-right-to-bracket" />
                                    Login
                                </Pressable>
                            </MenuItem>
                        )}
                    </MenuItems>
                </>
            )}
        </Menu>
    );
};
