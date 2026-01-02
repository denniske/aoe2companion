import React from 'react';

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}

export const RatingDiff: React.FC<{ ratingDiff: number; suffix?: string }> = ({
    ratingDiff,
    suffix,
}) => (
    <span className={ratingDiff > 0 ? 'text-green-500' : 'text-red-500'}>
        {signed(ratingDiff)}
        {suffix ? ` ${suffix}` : null}
    </span>
);
