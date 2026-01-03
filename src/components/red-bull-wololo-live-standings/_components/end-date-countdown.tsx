import { Fragment } from 'react';
import Countdown from 'react-countdown';

export const EndDateCountdown: React.FC<{ endDate: Date; onComplete?: () => void; className?: string }> = ({ endDate, onComplete, className }) => {
    return (
        <Countdown
            date={endDate}
            onComplete={onComplete}
            renderer={({ days, hours, minutes, seconds, completed }) => {
                return (
                    <div className={className}>
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
                                                <div className="text-2xl font-bold leading-tight">{seg.toString().padStart(2, '0')}</div>
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
    );
};
