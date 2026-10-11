import { appConfig } from '@nex/dataset';
import { Redirect } from 'expo-router';
import Aoe4ItemList from '@app/view/aoe4-explorer/item-list';

// aoe4 only: aoe2's unit upgrades live on the unit pages.
export default function UpgradeListScreen() {
    return appConfig.game === 'aoe4' ? <Aoe4ItemList type="upgrades" /> : <Redirect href="/explore/units" />;
}
