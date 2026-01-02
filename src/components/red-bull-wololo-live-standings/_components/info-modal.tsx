import { Icon } from '@app/components/icon';
import { Image } from '@app/components/uniwind/image';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import Countdown from 'react-countdown';

export const InfoModal = ({ onClose, isVisible, countdownDate }: { isVisible: boolean; onClose: () => void; countdownDate: Date }) => {
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

                <div className="fixed inset-0 overflow-y-auto selection:bg-blue-600/90" style={{ colorScheme: 'dark' }}>
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
                            <DialogPanel className="w-full md:max-w-md lg:max-w-lg transform overflow-hidden rounded-2xl bg-blue-950 pt-2 p-6 text-left align-middle shadow-xl transition-all text-white relative">
                                <div className="flex flex-col gap-4 mt-4 items-center">
                                    <button onClick={onClose} className="absolute top-4 right-4">
                                        <Icon icon="times" size={24} color="white" />
                                    </button>

                                    <Image
                                        alt="Red Bull Wololo"
                                        source={require('../../../../assets/red-bull-wololo.png')}
                                        className="h-[45px] w-[50] select-none"
                                    />

                                    <DialogTitle as="h2" className="text-xl font-semibold">
                                        Ladder Qualifer Begins Soon!
                                    </DialogTitle>

                                    <Countdown
                                        date={countdownDate}
                                        renderer={({ days, hours, minutes, seconds, completed }) => {
                                            return (
                                                <div className="bg-blue-800 px-6 py-2 rounded-lg flex flex-col items-center justify-center">
                                                    <div className="font-bold">Ladder Opens In...</div>
                                                    <div className="flex justify-center text-center">
                                                        {(days > 0
                                                            ? [
                                                                  ['DAY', days],
                                                                  ['HRS', hours],
                                                                  ['MIN', minutes],
                                                                  ['SEC', seconds],
                                                              ]
                                                            : [
                                                                  ['HRS', hours],
                                                                  ['MIN', minutes],
                                                                  ['SEC', seconds],
                                                              ]
                                                        ).map(([label, seg], index) => (
                                                            <Fragment key={label}>
                                                                {index !== 0 && <div className="w-8 text-2xl font-bold">:</div>}
                                                                <div>
                                                                    <div className="text-2xl font-bold leading-tight">
                                                                        {seg.toString().padStart(2, '0')}
                                                                    </div>
                                                                    <div className="text-sm">{label}</div>
                                                                </div>
                                                            </Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />

                                    <p className="text-center">
                                        While we wait for the ladder to open, the RM 1v1 Leaderboard is being shown instead. We will use this
                                        opportunity to improve this page. Please share any ideas or feedback in our Discord channel.
                                    </p>

                                    <a href="https://discord.gg/gCunWKx" target="_blank" rel="noreferrer" className="inline">
                                        <img
                                            className="inline-block"
                                            src="https://img.shields.io/discord/727175083977736262.svg?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=2c2f33"
                                        />
                                    </a>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
