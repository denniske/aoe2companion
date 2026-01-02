export type Status = 'qualified' | 'major-advantage' | 'minor-advantage' | 'none';

export const statuses: Record<
    Status,
    {
        color: string;
        title?: string;
        description?: string;
        minPlace: number;
        maxPlace: number;
        isHidden?: true;
    }
> = {
    qualified: {
        color: '#F6EAD3',
        minPlace: 1,
        maxPlace: 4,
        title: 'Direct Main Event Qualification',
        description: 'Go straight to main event in London',
    },
    'major-advantage': {
        color: '#CD2458',
        minPlace: 5,
        maxPlace: 8,
        title: 'Major Qualification Advantage',
        description: 'Go to final round of Last-Chance Qualifier',
    },
    'minor-advantage': {
        color: '#0C3E5E',
        minPlace: 9,
        maxPlace: 12,
        title: 'Minor Qualification Advantage',
        description: 'Go to 2nd last round of Last-Chance Qualifier',
    },
    none: {
        color: 'transparent',
        minPlace: 13,
        maxPlace: Infinity,
        isHidden: true,
    },
};
