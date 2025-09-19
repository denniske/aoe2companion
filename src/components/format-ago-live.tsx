import { useMinuteRerender } from '@app/hooks/use-minute-rerender';
import { formatAgo } from '@nex/data';
import { Text } from './text';

export const FormatAgoLive: React.FC<{ started: Date }> = ({ started }) => {
    useMinuteRerender(started); // forces re-render on aligned minute
    return (
        <Text>{formatAgo(started)}</Text>
    );
};
