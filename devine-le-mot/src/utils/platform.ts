import {Platform} from 'react-native';

const os = Platform.OS as string;
export const isWindows = os === 'windows';
export const isAndroid = os === 'android';
