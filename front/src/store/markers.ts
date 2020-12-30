import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";

@Module
class MarkerModule extends VuexModule {
  page = 1;
  numResults = 0;
  numPages = 0;

  @Mutation
  resetPagination() {
    // this.items = [];
    this.numPages = 0;
    this.numResults = 0;
    this.page = 1;
  }

  @Mutation
  setPage(num: number) {
    this.page = num;
  }

  @Mutation
  setPagination({
    // items,
    numResults,
    numPages,
  }: {
    // items: IMarker[];
    numResults: number;
    numPages: number;
  }) {
    // this.items = items;
    this.numResults = numResults;
    this.numPages = numPages;
  }
}

import store from "./index";
export const markerModule = new MarkerModule({ store, name: "markers" });
