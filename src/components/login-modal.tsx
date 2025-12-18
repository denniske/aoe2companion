import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Icon } from './icon';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './text';
import Login from './login';

export const LoginModal = ({ onClose, isVisible }: { isVisible: boolean; onClose: () => void }) => {
    return (
        <Transition appear show={isVisible} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/90" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-2xl transform rounded-2xl bg-gold-50 dark:bg-blue-950 p-6 text-left align-middle shadow-xl transition-all flex flex-col relative gap-4 items-center">
                                <Text variant="title" color="brand" align="center">
                                    Sign In Required
                                </Text>

                                <TouchableOpacity onPress={onClose} className="absolute top-4 right-4">
                                    <Icon icon="times" size={32} prefix="fasr" />
                                </TouchableOpacity>

                                <Text variant="body-lg" align="center">
                                    An account lets you follow players and save your favorites. Your information syncs automatically across devices.
                                </Text>

                                <View className="self-stretch">
                                    <Login onComplete={onClose} />
                                </View>

                                <Text className="italic" variant="body-sm" align="center">
                                    No spam. No paywall. Just saves your stuff.
                                </Text>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
