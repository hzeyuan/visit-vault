import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // router.get('/', controller.home.index);
  router.delete('/api/v2/testResource', controller.testResource.removes);
  router.resources('testResource', '/api/v2/testResource', controller.testResource);
};
