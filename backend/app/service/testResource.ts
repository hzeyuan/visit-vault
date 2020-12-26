import { Service } from 'egg';


export default class TestResourceService extends Service {
  // create======================================================================================================>
  async create(payload) {
    return {

    };
    // return ctx.model.User.create(payload)
  }

  // destroy======================================================================================================>
  async destroy(_id) {
    return {

    };
  }

  // update======================================================================================================>
  async update(_id, payload) {
    return {

    };
  }

  // show======================================================================================================>
  async show(_id) {
    return {};
  }

  // index======================================================================================================>
  async index(payload) {
    return {};
  }


  async removes(payload) {
    return {};
  }

  // Commons======================================================================================================>
  async findByMobile(mobile) {
    return {};
  }

  async find(id) {
    return {};
  }

  async findByIdAndUpdate(id, values) {
    return {};
  }
}
