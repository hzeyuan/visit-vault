import { Context } from 'egg';
import { app, assert } from 'egg-mock/bootstrap';

describe('test/app/service/testResource.test.js', () => {
  let ctx: Context;

  beforeEach(() => {
    // 创建一个匿名的 context 对象，可以在 ctx 对象上调用 service 的方法
    ctx = app.mockContext();
  });

  describe('service ===> create()', () => {

    it('should create success', async () => {
      // 不影响 CNode 的正常运行，我们可以将对 CNode 的调用按照接口约定模拟掉
      // app.mockHttpclient 方法可以便捷的对应用发起的 http 请求进行模拟
      app.mockHttpclient(`${ctx.service.testResource.index}`, 'GET', 'index');
      const res = await ctx.service.testResource.index({});
      assert(JSON.stringify(res) === '{}');
    });
  });
});
