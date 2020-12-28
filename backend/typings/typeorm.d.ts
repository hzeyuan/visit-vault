// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import SysUser from '../app/entity/sys/user'

declare module 'egg' {
  interface Context {
    entity: {
      User: typeof SysUser
      test: {}
    }
    repo: {
      User: Repository<SysUser>
      test: {}
    }
  }
}
