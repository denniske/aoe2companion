import { ILeaderboardPlayer } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { HTMLAttributes } from 'react';

export const HeadCell = ({
    className,
    children,
    columnName,
    siblingColumnName,
    sort,
    setSort,
    hideIcon,
    hideCols,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
    columnName?: keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating';
    siblingColumnName?: keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating';
    hideIcon?: boolean;
    sort: [keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating', 'desc' | 'asc'];
    setSort: (s: [keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating', 'desc' | 'asc']) => void;
    hideCols: Array<keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating'>;
} & HTMLAttributes<HTMLTableCellElement>) =>
    columnName && hideCols.includes(columnName) ? null : (
        <th scope="col" className={`py-2 px-6 whitespace-nowrap block ${className} select-none`} {...props}>
            <button
                type="button"
                className="cursor-pointer disabled:cursor-default"
                disabled={!columnName}
                onClick={() =>
                    columnName &&
                    setSort([columnName, sort[1] === 'asc' || (sort[0] !== columnName && sort[0] !== siblingColumnName) ? 'desc' : 'asc'])
                }
            >
                {children}
                {columnName && (
                    <>
                        {' '}
                        <Icon
                            icon={sort[1] === 'asc' ? 'angle-up' : 'angle-down'}
                            color={sort[0] === columnName ? 'accent-white' : 'accent-transparent'}
                            className={`max-w-4 inline-block ${hideIcon ? 'md:hidden!' : ''}`}
                        />
                    </>
                )}
            </button>
        </th>
    );

export const Cell = ({
    className,
    children,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
} & HTMLAttributes<HTMLTableCellElement>) => (
    <td className={`py-3 px-6 text-lg border-t border-t-gray-700! whitespace-nowrap flex items-center ${className} select-text`} {...props}>
        {children}
    </td>
);
