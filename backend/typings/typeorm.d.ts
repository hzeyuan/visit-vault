// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import SysActor from '../app/entity/sys/Actor'
import SysActorReference from '../app/entity/sys/ActorReference'
import SysImage from '../app/entity/sys/Image'
import SysLabel from '../app/entity/sys/Label'
import SysLabelledItem from '../app/entity/sys/LabelledItem'
import SysScene from '../app/entity/sys/Scene'

declare module 'egg' {
  interface Context {
    entity: {
      Actor: typeof SysActor
      ActorReference: typeof SysActorReference
      Image: typeof SysImage
      Label: typeof SysLabel
      LabelledItem: typeof SysLabelledItem
      Scene: typeof SysScene
      test: {}
    }
    repo: {
      Actor: Repository<SysActor>
      ActorReference: Repository<SysActorReference>
      Image: Repository<SysImage>
      Label: Repository<SysLabel>
      LabelledItem: Repository<SysLabelledItem>
      Scene: Repository<SysScene>
      test: {}
    }
  }
}
