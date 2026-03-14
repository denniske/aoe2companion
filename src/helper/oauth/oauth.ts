import { appConfig } from '@nex/dataset';
import { Platform } from 'react-native';

export const oAuthRedirectUri = Platform.OS === 'web' ? `https://www.${appConfig.hostAoeCompanion}/more/account` : `https://api.${appConfig.hostAoeCompanion}/v2/deeplink/account`;
