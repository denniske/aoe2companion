import Picker from '@app/view/components/picker';
import React, { useState } from 'react';
import { useTranslation } from '@app/helper/translate';
import { useSavePrefsMutation } from '@app/mutations/save-account';

export function TimespanSelect(props: any) {
    const { ratingHistoryDuration, setRatingHistoryDuration } = props;

    const getTranslation = useTranslation();

    const formatDuration = (duration: string) => getTranslation(`main.profile.ratinghistory.time.${duration}` as any);
    const savePrefsMutation = useSavePrefsMutation();

    // const [ratingHistoryDuration, setRatingHistoryDuration] = useState<string>('max');
    const values: string[] = ['max', '3m', '1m', '1w', '1d'];

    const onCountrySelected = async (str: any) => {
        setRatingHistoryDuration(str);
        savePrefsMutation.mutate({ ratingHistoryDuration: str });
    };

    return (
        <Picker
            popupAlign="right"
            itemHeight={40}
            textMinWidth={100}
            container="flatlist"
            value={ratingHistoryDuration}
            values={values}
            formatter={formatDuration}
            onSelect={onCountrySelected}
            style={{ width: 120 }}
        />
    );
}
