import { app, mock, assert } from 'egg-mock/bootstrap';

describe('test/app/controller/testResource.test.js', () => {
  // 测试请求参数错误时应用的响应
  it('(index) ==> should GET /api/v2/testResource/ 200', () => {
    app.mockCsrf();
    return app.httpRequest()
      .get('/api/v2/testResource')
      .expect(200)
      .expect('index');
  });
  it('(create) ==> should POST /api/v2/testResource/ 200', () => {
    app.mockCsrf();
    return app.httpRequest().post('/api/v2/testResource').expect(200)
      .expect('create');
  });
  it('(show) ==> should POST /api/v2/testResource/1 200', () => {
    app.mockCsrf();
    return app.httpRequest().get('/api/v2/testResource/1').expect(200)
      .expect('show');
  });
  it('(update) ==> should POST /api/v2/testResource/2 200', () => {
    app.mockCsrf();
    return app.httpRequest().put('/api/v2/testResource/2').expect(200)
      .expect('update');
  });
  it('(destory) ==> should del /api/v2/testResource/2 200', () => {
    app.mockCsrf();
    return app.httpRequest().delete('/api/v2/testResource/2').expect(200)
      .expect('destroy');
  });
  it('(removes) ==> should del /api/v2/testResource 200', () => {
    app.mockCsrf();
    return app.httpRequest().delete('/api/v2/testResource').send({ id: '1,2,3' })
      .expect(200)
      .expect('removes');
  });
});
