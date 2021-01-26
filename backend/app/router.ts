import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/media/image/:image', controller.image.image);
  router.get('/media/image/:image/thumbnail', controller.image.imageThumbnail);
};
