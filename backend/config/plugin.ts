import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  valiate: {
    enable: true,
    package: 'egg-validate',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  static: {
    enable: true,
    package: 'egg-static',
  },
  'apollo-server': {
    enable: true,
    package: 'egg-apollo-server',
  },
};

export default plugin;
