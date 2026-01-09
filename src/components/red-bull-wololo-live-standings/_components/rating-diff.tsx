import { Icon } from '@app/components/icon';
import React from 'react';
import cn from 'classnames';

export const RatingDiff: React.FC<{ ratingDiff: number; suffix?: string }> = ({ ratingDiff, suffix }) => (
    <span className={cn({ 'text-green-500': ratingDiff > 0, 'text-red-500': ratingDiff < 0 })}>
        {ratingDiff === 0 ? null : (
            <Icon
                icon={ratingDiff > 0 ? 'plus' : 'minus'}
                className="inline-block -mt-0.5"
                color={ratingDiff > 0 ? 'accent-green-500' : 'accent-red-500'}
                size={12}
            />
        )}
        {Math.abs(ratingDiff)}
        {suffix ? ` ${suffix}` : null}
    </span>
);
