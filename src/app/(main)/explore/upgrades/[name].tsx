import { appConfig } from '@nex/dataset';
import NotFound from '@app/app/(main)/+not-found';
import { Aoe4UpgradeDetails } from '@app/view/aoe4-explorer/item-details';

// aoe4 only, see index.tsx.
export default function UpgradeDetailsScreen() {
    return appConfig.game === 'aoe4' ? <Aoe4UpgradeDetails /> : <NotFound />;
}
