import { View } from 'react-native';
import { useSelector } from '@app/redux/reducer';
import { Text } from '@app/components/text';


export default function ConsoleModal({ onClose }: { onClose?: () => void }) {
    const logs = useSelector((state) => state.logs);
    return (
        <View
            className={"h[1px] bg-grey"}
        >
            <Text>Console logger</Text>

            {
                logs?.map((log, i) => (
                    <View key={i} className="flex-row">
                        <Text>{log}</Text>
                    </View>
                ))
            }



        </View>
    )
}

