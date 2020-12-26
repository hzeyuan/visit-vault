import { Controller } from 'egg';

export default class TestResourceController extends Controller {

  // 创建资源
  async create() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate({});
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    await service.testResource.create(payload);
    // 设置响应内容和响应状态码
    this.ctx.body = 'create';
  }

  // 删除单个资源
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.testResource.destroy(id);
    // 设置响应内容和响应状态码
    this.ctx.body = 'destroy';
  }

  // 修改资源
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate({});
    // 组装参数
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    await service.testResource.update(id, payload);
    // 设置响应内容和响应状态码
    this.ctx.body = 'update';
  }

  // 获取单个资源
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.testResource.show(id);
    // 设置响应内容和响应状态码
    this.ctx.body = 'show';
  }

  // 获取所有资源(分页/模糊)
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    await service.testResource.index(payload);
    // 设置响应内容和响应状态码
    this.ctx.body = 'index';
  }

  // 删除所选资源(条件id[])
  public async removes() {
    const { ctx, service } = this;
    // 组装参数
    // const payload = ctx.queries.id
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];
    // 调用 Service 进行业务处理
    await service.testResource.removes(payload);
    // 设置响应内容和响应状态码
    this.ctx.body = 'removes';
  }
}
