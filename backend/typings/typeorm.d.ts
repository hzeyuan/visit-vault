// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import SysImage from '../app/entity/sys/Image'
import SysActor from '../app/entity/sys/actor'
import SysLabel from '../app/entity/sys/label'
import SysLabelledItem from '../app/entity/sys/labelledItem'
import SysScene from '../app/entity/sys/scene'

declare module 'egg' {
  interface Context {
    entity: {
      Image: typeof SysImage
      Actor: typeof SysActor
      Label: typeof SysLabel
      LabelledItem: typeof SysLabelledItem
      Scene: typeof SysScene
      test: {}
    }
    repo: {
      Image: Repository<SysImage>
      Actor: Repository<SysActor>
      Label: Repository<SysLabel>
      LabelledItem: Repository<SysLabelledItem>
      Scene: Repository<SysScene>
      test: {}
    }
  }
}
