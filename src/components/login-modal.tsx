import { PressableOpacity } from '@app/components/pressable-opacity';
import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Icon } from './icon';
import { faTimes } from '@fortawesome/sharp-regular-svg-icons';
import { View } from 'react-native';
import { Text } from './text';
import Login from './login';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { useTranslation } from '@app/helper/translate';

export const LoginModal = ({ onClose, isVisible }: { isVisible: boolean; onClose: () => void }) => {
    const getTranslation = useTranslation();
    const { isMedium } = useBreakpoints();

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
                                <Text variant={isMedium ? 'title' : 'header-lg'} color="brand" align="center">
                                    {getTranslation('login.required.title')}
                                </Text>

                                <PressableOpacity onPress={onClose} className="absolute top-5 right-5">
                                    <Icon icon={faTimes} size={32} />
                                </PressableOpacity>

                                <Text variant="body-lg" align="center">
                                    {getTranslation('login.required.description')}
                                </Text>

                                <View className="self-stretch">
                                    <Login onComplete={onClose} />
                                </View>

                                <Text className="italic" variant="body-sm" align="center">
                                    {getTranslation('login.required.note')}
                                </Text>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
