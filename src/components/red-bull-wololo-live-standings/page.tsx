import { isFuture, isPast } from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Footer } from './_components/footer';
import { PlayerList } from './_components/player-list';
import { statuses } from './statuses';
import { InfoModal } from './_components/info-modal';
import { Image } from '../uniwind/image';


const END_DATE = new Date(1768755600000);
const START_DATE = new Date(1767373200000);

const LEADERBOARD_ID = isFuture(START_DATE) ? 'rm_1v1' : 'ew_1v1_redbullwololo';

const MAX_RATING_OVERRIDES: Record<number, number> = {};

export default function Page() {
    const [isPastDeadline, setIsPastDeadline] = useState(isPast(END_DATE));
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(
        isFuture(START_DATE)
    );

    return (
        <main
            className="flex flex-col 2xl:flex-row px-4 md:px-8 py-8 gap-12 text-white min-h-screen relative items-center 2xl:items-stretch selection:bg-blue-600/90 select-none justify-around max-w-[2600px] mx-auto overflow-y-auto md:overflow-y-visible"
            style={{ colorScheme: 'dark' }}
        >
            <div className="fixed inset-0">
                <Image source={require('../../../assets/red-bull-wololo-background.jpeg')} className="w-full h-full object-cover" />
            </div>
            <div className="fixed inset-0 bg-linear-to-r from-black/80 via-black/90 to-black" />
            <div className="flex-1 relative order-2 2xl:order-1 self-center md:self-start xl:self-center 2xl:self-center max-w-[1500px]">
                <PlayerList leaderboardId={LEADERBOARD_ID} isPastDeadline={isPastDeadline} maxRatingOverrides={MAX_RATING_OVERRIDES} />
                <div id="rankdisclaimer" className="text-center md:text-left text-sm italic select-text">
                    * In case of a tie between players, the player with the highest current rating will take precedence. In the rare case that
                    there&apos;s still a tie, Red Bull will organise an additional matchup between these players. See{' '}
                    <a
                        href="https://drive.google.com/file/d/1jW7EuH3KuaXiRJfhCd5Oc0jrmHxxQW4z/view"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        Handbook
                    </a>{' '}
                    for more information.
                </div>
                <Footer className="block 2xl:hidden" />
            </div>

            <div className="relative 2xl:w-[305px] flex flex-col justify-between order-1 2xl:order-2 select-text">
                <div className="flex flex-col gap-4 md:flex-row 2xl:flex-col items-center">
                    <a href="https://www.redbull.com/int-en/events/red-bull-wololo/red-bull-wololo" target="_blank">
                        <Image
                            alt="Red Bull Wololo"
                            source={require('../../../assets/red-bull-wololo.png')}
                            className="h-[185px] w-[203px] lg:h-[278px] lg:w-[305px] select-none"
                        />
                    </a>

                    <div className="flex flex-col gap-4 items-center">
                        <p className="text-lg inline-block text-center max-w-96">
                            The top four players advance into the main event, while 5th-12th place finishers gain an advantage for the last-chance
                            qualifier, and 13th+ finishers will be seeded via the ATP for the last-chance qualifier.
                        </p>

                        <Countdown
                            date={END_DATE}
                            onComplete={() => setIsPastDeadline(true)}
                            renderer={({ days, hours, minutes, seconds, completed }) => {
                                return (
                                    <div className="bg-blue-800 px-6 py-2 rounded-lg flex flex-col items-center justify-center">
                                        {completed ? (
                                            <p className="text-2xl font-bold text-center">
                                                Qualification has Ended
                                                <span className="text-sm text-center block">Ratings will no longer update</span>
                                            </p>
                                        ) : (
                                            <>
                                                <div className="font-bold">Qualification ends in...</div>
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
                                            </>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-6 justify-between py-4">
                        {Object.entries(statuses).map(([status, { color, title, description, isHidden }]) => {
                            if (isHidden) {
                                return null;
                            }

                            return (
                                <div className="flex flex-row gap-2 items-center" key={status}>
                                    <div className="w-6 h-6 bg-[#F6EAD3]" style={{ backgroundColor: color }} />
                                    <div>
                                        <p className="text-sm md:text-xs text-lg:text-sm uppercase font-semibold inline-block pt-1 whitespace-nowrap">
                                            {title?.split('Qualification').map((segment, index) => (
                                                <Fragment key={segment}>
                                                    {index === 0 ? null : <span className="md:hidden lg:inline">Qualification</span>}
                                                    {segment}
                                                </Fragment>
                                            ))}
                                        </p>
                                        <p className="text-xs md:hidden lg:block">{description}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <a
                            href="https://aoe2frontend.vercel.app/red-bull-wololo-ladder-format.jpg"
                            target="_blank"
                            className="uppercase font-bold text-xs px-4 py-2 rounded bg-gold-700 hover:bg-gold-800 self-center"
                        >
                            View <span className="md:hidden lg:inline">Format</span> Details
                        </a>

                        {isPastDeadline && (
                            <p className="text-xs italic">
                                Please verify the qualified players from the{' '}
                                <a href="https://www.ageofempires.com/stats/ageiidewololo/" target="_blank" rel="noreferrer" className="underline">
                                    official standings
                                </a>
                                .
                            </p>
                        )}
                    </div>
                </div>

                <Footer className="hidden 2xl:block" />
            </div>

            <InfoModal isVisible={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} countdownDate={START_DATE} />
        </main>
    );
}
