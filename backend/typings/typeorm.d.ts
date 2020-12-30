// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import SysImage from '../app/entity/sys/Image'

declare module 'egg' {
  interface Context {
    entity: {
      Image: typeof SysImage
      test: {}
    }
    repo: {
      Image: Repository<SysImage>
      test: {}
    }
  }
}
