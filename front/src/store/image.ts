import { VuexModule, Module, Mutation } from "vuex-class-modules";

@Module
class ImageModule extends VuexModule {
  page = 1;
  numResults = 0;
  numPages = 0;

  @Mutation
  resetPagination() {
    this.numPages = 0;
    this.numResults = 0;
    this.page = 1;
  }

  @Mutation
  setPage(num: number) {
    this.page = num;
  }

  @Mutation
  setPagination({ numResults, numPages }: { numResults: number; numPages: number }) {
    this.numResults = numResults;
    this.numPages = numPages;
  }
}

import store from "./index";
export const imageModule = new ImageModule({ store, name: "images" });
