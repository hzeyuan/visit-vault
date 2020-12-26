import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (_appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  return {
    ...config,
  };
};
