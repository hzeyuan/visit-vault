import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  validate: {
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
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
};

export default plugin;
