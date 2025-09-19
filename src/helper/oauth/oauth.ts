import { appConfig } from '@nex/dataset';
import { Platform } from 'react-native';

export const oAuthRedirectUri = Platform.OS === 'web' ? window.location.origin + '/more/account' : `https://api.${appConfig.hostAoeCompanion}/v2/deeplink/account`;
