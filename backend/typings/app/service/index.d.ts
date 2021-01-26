// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportActorReference from '../../../app/service/ActorReference';
import ExportActor from '../../../app/service/actor';
import ExportImage from '../../../app/service/image';
import ExportLabel from '../../../app/service/label';
import ExportLabelledItem from '../../../app/service/labelledItem';
import ExportPlugin from '../../../app/service/plugin';
import ExportSearch from '../../../app/service/search';

declare module 'egg' {
  interface IService {
    actorReference: AutoInstanceType<typeof ExportActorReference>;
    actor: AutoInstanceType<typeof ExportActor>;
    image: AutoInstanceType<typeof ExportImage>;
    label: AutoInstanceType<typeof ExportLabel>;
    labelledItem: AutoInstanceType<typeof ExportLabelledItem>;
    plugin: AutoInstanceType<typeof ExportPlugin>;
    search: AutoInstanceType<typeof ExportSearch>;
  }
}
