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
  'apollo-server': {
    enable: true,
    package: 'egg-apollo-server',
  },
};

export default plugin;
