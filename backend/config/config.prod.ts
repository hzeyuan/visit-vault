import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import defaultConfig from './config.default';

export default (_appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  config.logger = {
    consoleLevel: 'INFO',
  }
  return {
    ...config,
  };
};
