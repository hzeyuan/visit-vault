<template>
  <v-container fluid>
    <BindFavicon />
    <BindTitle value="Images" />
    <v-banner app sticky class="mb-2">
      {{ selectedImages.length }} images selected
      <template v-slot:actions>
        <v-btn v-if="selectedImages.length" text @click="selectedImages = []" class="text-none"
          >Deselect</v-btn
        >
        <v-btn
          v-else-if="!selectedImages.length"
          text
          @click="selectedImages = images.map((im) => im._id)"
          class="text-none"
          >Select all</v-btn
        >
        <v-btn
          v-if="selectedImages.length"
          @click="deleteSelectedImagesDialog = true"
          text
          class="text-none"
          color="error"
          >Delete</v-btn
        >
      </template>
    </v-banner>

    <v-navigation-drawer v-if="showSidenav" style="z-index: 14" v-model="drawer" clipped app>
      <v-container>
        <v-btn
          :disabled="refreshed"
          class="text-none mb-2"
          block
          color="primary"
          text
          @click="resetPagination"
          >Refresh</v-btn
        >

        <v-text-field
          @keydown.enter="resetPagination"
          solo
          flat
          single-line
          hide-details
          clearable
          color="primary"
          v-model="query"
          label="Search query"
          class="mb-2"
        ></v-text-field>

        <div class="d-flex align-center">
          <v-btn
            :color="favoritesOnly ? 'red' : undefined"
            icon
            @click="favoritesOnly = !favoritesOnly"
          >
            <v-icon>{{ favoritesOnly ? "mdi-heart" : "mdi-heart-outline" }}</v-icon>
          </v-btn>

          <v-btn
            :color="bookmarksOnly ? 'primary' : undefined"
            icon
            @click="bookmarksOnly = !bookmarksOnly"
          >
            <v-icon>{{ bookmarksOnly ? "mdi-bookmark" : "mdi-bookmark-outline" }}</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <Rating @input="ratingFilter = $event" :value="ratingFilter" />
        </div>

        <Divider icon="mdi-label">Labels</Divider>

        <LabelFilter
          @change="onSelectedLabelsChange"
          class="mt-0"
          v-model="selectedLabels"
          :items="allLabels"
        />

        <Divider icon="mdi-account">Actors</Divider>

        <ActorSelector v-model="selectedActors" :multiple="true" />

        <Divider icon="mdi-sort">Sort</Divider>

        <v-select
          solo
          flat
          single-line
          hide-details
          color="primary"
          item-text="text"
          item-value="value"
          v-model="sortBy"
          placeholder="Sort by..."
          :items="sortByItems"
          class="mt-0 pt-0 mb-2"
        ></v-select>
        <v-select
          solo
          flat
          single-line
          :disabled="sortBy == 'relevance' || sortBy == '$shuffle'"
          hide-details
          color="primary"
          item-text="text"
          item-value="value"
          v-model="sortDir"
          placeholder="Sort direction"
          :items="sortDirItems"
        ></v-select>
      </v-container>
    </v-navigation-drawer>

    <div class="text-center" v-if="fetchError">
      <div>There was an error</div>
      <v-btn class="mt-2" @click="loadPage(page)">Try again</v-btn>
    </div>
    <div v-else>
      <div class="mb-2 d-flex align-center">
        <div class="mr-3">
          <span class="display-1 font-weight-bold mr-2">{{ fetchLoader ? "-" : numResults }}</span>
          <span class="title font-weight-regular">images found</span>
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="openUploadDialog" icon>
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </template>
          <span>Upload image</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" :disabled="sortBy != '$shuffle'" @click="rerollSeed" icon>
              <v-icon>mdi-dice-3-outline</v-icon>
            </v-btn>
          </template>
          <span>Reshuffle</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <div>
          <v-pagination
            v-if="!fetchLoader && $vuetify.breakpoint.mdAndUp"
            @input="loadPage"
            v-model="page"
            :total-visible="7"
            :disabled="fetchLoader"
            :length="numPages"
          ></v-pagination>
        </div>
      </div>
      <v-row v-if="!fetchLoader && numResults">
        <v-col
          class="pa-0"
          v-for="(image, index) in images"
          :key="image._id"
          :cols="6"
          :sm="4"
          :md="3"
          :lg="2"
          :xl="2"
        >
          <ImageCard
            :class="
              selectedImages.length && !selectedImages.includes(image._id) ? 'not-selected' : ''
            "
            width="100%"
            height="100%"
            @click="onImageClick(image, index, $event, false)"
            :image="image"
            :contain="true"
          >
            <template v-slot:action>
              <v-checkbox
                color="primary"
                :input-value="selectedImages.includes(image._id)"
                readonly
                @click.native.stop="onImageClick(image, index, $event, true)"
                class="mt-0"
                hide-details
                :contain="true"
              ></v-checkbox>
            </template>
          </ImageCard>
        </v-col>
      </v-row>
      <NoResults v-else-if="!fetchLoader && !numResults" />
      <Loading v-else />
    </div>
    <div class="mt-3" v-if="numResults && numPages > 1">
      <v-pagination
        @input="loadPage"
        v-model="page"
        :total-visible="7"
        :disabled="fetchLoader"
        :length="numPages"
      ></v-pagination>
    </div>

    <v-dialog :persistent="isUploading" scrollable v-model="uploadDialog" max-width="400px">
      <ImageUploader @update-state="isUploading = $event" @uploaded="addNewItem" />
    </v-dialog>

    <v-dialog v-model="deleteSelectedImagesDialog" max-width="400px">
      <v-card>
        <v-card-title>Really delete {{ selectedImages.length }} images?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="text-none" color="error" text @click="deleteSelection">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <transition name="fade">
      <Lightbox
        @update="updateImage"
        @delete="removeImage"
        :items="images"
        :index="lightboxIndex"
        @index="lightboxIndex = $event"
      />
    </transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ApolloClient from "@/apollo";
import gql from "graphql-tag";
import LabelSelector from "@/components/LabelSelector.vue";
import { contextModule } from "@/store/context";
import ImageCard from "@/components/Cards/Image.vue";
import Lightbox from "@/components/Lightbox.vue";
import actorFragment from "@/fragments/actor";
import imageFragment from "@/fragments/image";
import ImageUploader from "@/components/ImageUploader.vue";
import IImage from "@/types/image";
import ILabel from "@/types/label";
import DrawerMixin from "@/mixins/drawer";
import { mixins } from "vue-class-component";
import { imageModule } from "@/store/image";
import IActor from "@/types/actor";
import ActorSelector from "@/components/ActorSelector.vue";

@Component({
  components: {
    LabelSelector,
    ImageCard,
    Lightbox,
    ImageUploader,
    ActorSelector,
  },
})
export default class ImageList extends mixins(DrawerMixin) {
  addNewItem(image: IImage) {
    this.images.unshift(image);
  }

  get showSidenav() {
    return contextModule.showSidenav;
  }

  rerollSeed() {
    const seed = Math.random().toString(36);
    localStorage.setItem("pm_seed", seed);
    if (this.sortBy === "$shuffle") this.loadPage(this.page);
    return seed;
  }

  images = [] as IImage[];

  fetchLoader = false;
  fetchError = false;
  fetchingRandom = false;

  lightboxIndex = null as number | null;

  tryReadLabelsFromLocalStorage(key: string) {
    return (localStorage.getItem(key) || "").split(",").filter(Boolean) as string[];
  }

  allLabels = [] as ILabel[];
  selectedLabels = {
    include: this.tryReadLabelsFromLocalStorage("pm_imageInclude"),
    exclude: this.tryReadLabelsFromLocalStorage("pm_imageExclude"),
  };

  selectedActors = (() => {
    const fromLocalStorage = localStorage.getItem("pm_imageActors");
    if (fromLocalStorage) {
      return JSON.parse(fromLocalStorage);
    }
    return [];
  })() as IActor[];

  get selectedActorIds() {
    return this.selectedActors.map((ac) => ac._id);
  }

  onSelectedLabelsChange(val: any) {
    localStorage.setItem("pm_imageInclude", val.include.join(","));
    localStorage.setItem("pm_imageExclude", val.exclude.join(","));
    this.refreshed = false;
  }

  // largeThumbs = localStorage.getItem("pm_imageLargeThumbs") == "true" || false;

  query = localStorage.getItem("pm_imageQuery") || "";

  set page(page: number) {
    imageModule.setPage(page);
  }

  get page() {
    return imageModule.page;
  }

  get numResults() {
    return imageModule.numResults;
  }

  get numPages() {
    return imageModule.numPages;
  }

  sortDir = localStorage.getItem("pm_imageSortDir") || "desc";
  sortDirItems = [
    {
      text: "Ascending",
      value: "asc",
    },
    {
      text: "Descending",
      value: "desc",
    },
  ];

  sortBy = localStorage.getItem("pm_imageSortBy") || "relevance";
  sortByItems = [
    {
      text: "Relevance",
      value: "relevance",
    },
    {
      text: "Added to collection",
      value: "addedOn",
    },
    {
      text: "Rating",
      value: "rating",
    },
    {
      text: "Bookmarked",
      value: "bookmark",
    },
    {
      text: "Random",
      value: "$shuffle",
    },
  ];

  favoritesOnly = localStorage.getItem("pm_imageFavorite") == "true";
  bookmarksOnly = localStorage.getItem("pm_imageBookmark") == "true";
  ratingFilter = parseInt(localStorage.getItem("pm_imageRating") || "0");

  uploadDialog = false;
  isUploading = false;

  selectedImages = [] as string[];
  lastSelectionImageId: string | null = null;
  deleteSelectedImagesDialog = false;

  isImageSelected(id: string) {
    console.log('isImageSelected');
    return !!this.selectedImages.find((selectedId) => id === selectedId);
  }

  selectImage(id: string, add: boolean) {
    this.lastSelectionImageId = id;
    console.log('选择图片')
    if (add && !this.isImageSelected(id)) {
      this.selectedImages.push(id);
    } else {
      this.selectedImages = this.selectedImages.filter((i) => i != id);
    }
  }

  /**
   * @param image - the clicked image
   * @param index - the index of the image in the array
   * @param event - the mouse click event
   * @param forceSelectionChange - whether to force a selection change, instead of opening the image
   */
  onImageClick(image: IImage, index: number, event: MouseEvent, forceSelectionChange = true) {
    // Use the last selected image or the current one, to allow toggling
    // even when no previous selection
    console.log('onImageClick')
    let lastSelectionImageIndex =
      this.lastSelectionImageId !== null
        ? this.images.findIndex((im) => im._id === this.lastSelectionImageId)
        : index;
    lastSelectionImageIndex = lastSelectionImageIndex === -1 ? index : lastSelectionImageIndex;
    console.log('lastSelectionImageId',this.lastSelectionImageId,index);
    console.log('event.shiftKey',event.shiftKey);
    if (event.shiftKey) {
      // Next state is opposite of the clicked image state
      const nextSelectionState = !this.isImageSelected(image._id);

      // Use >= to include the currently clicked image, so it can be toggled
      // if necessary
      if (index >= lastSelectionImageIndex) {
        for (let i = lastSelectionImageIndex + 1; i <= index; i++) {
          this.selectImage(this.images[i]._id, nextSelectionState);
        }
      } else if (index < lastSelectionImageIndex) {
        for (let i = lastSelectionImageIndex; i >= index; i--) {
          this.selectImage(this.images[i]._id, nextSelectionState);
        }
      }
    } else if (forceSelectionChange || event.ctrlKey) {
      this.selectImage(image._id, !this.isImageSelected(image._id));
    } else if (!forceSelectionChange) {
      this.lightboxIndex = index;
    }
  }

  deleteSelection() {
    ApolloClient.mutate({
      mutation: gql`
        mutation($ids: [String!]!) {
          removeImages(ids: $ids)
        }
      `,
      variables: {
        ids: this.selectedImages,
      },
    })
      .then((res) => {
        for (const id of this.selectedImages) {
          this.images = this.images.filter((img) => img._id != id);
        }
        this.selectedImages = [];
        this.deleteSelectedImagesDialog = false;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  }

  removeImage(index: number) {
    ApolloClient.mutate({
      mutation: gql`
        mutation($ids: [String!]!) {
          removeImages(ids: $ids)
        }
      `,
      variables: {
        ids: [this.images[index]._id],
      },
    })
      .then((res) => {
        this.images.splice(index, 1);
        this.lightboxIndex = null;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  }

  updateImage({ index, key, value }: { index: number; key: string; value: any }) {
    console.log('updateImage')
    const images = this.images[index];
    images[key] = value;
    Vue.set(this.images, index, images);
  }

  openUploadDialog() {
    this.uploadDialog = true;
  }

  refreshed = true;

  resetPagination() {
    imageModule.resetPagination();
    this.refreshed = true;
    this.loadPage(this.page).catch(() => {
      this.refreshed = false;
    });
  }

  @Watch("ratingFilter", {})
  onRatingChange(newVal: number) {
    localStorage.setItem("pm_imageRating", newVal.toString());
    this.refreshed = false;
  }

  @Watch("favoritesOnly")
  onFavoriteChange(newVal: boolean) {
    localStorage.setItem("pm_imageFavorite", "" + newVal);
    this.refreshed = false;
  }

  @Watch("bookmarksOnly")
  onBookmarkChange(newVal: boolean) {
    localStorage.setItem("pm_imageBookmark", "" + newVal);
    this.refreshed = false;
  }

  @Watch("sortDir")
  onSortDirChange(newVal: string) {
    localStorage.setItem("pm_imageSortDir", newVal);
    this.refreshed = false;
  }

  @Watch("sortBy")
  onSortChange(newVal: string) {
    localStorage.setItem("pm_imageSortBy", newVal);
    this.refreshed = false;
  }

  @Watch("selectedLabels")
  onLabelChange() {
    this.refreshed = false;
  }

  @Watch("query")
  onQueryChange(newVal: string | null) {
    localStorage.setItem("pm_imageQuery", newVal || "");
    this.refreshed = false;
  }

  @Watch("selectedActorIds", { deep: true })
  onSelectedActorsChange(newVal: string[]) {
    localStorage.setItem("pm_sceneActors", JSON.stringify(this.selectedActors));
    this.refreshed = false;
  }

  async fetchPage(page: number, take = 24, random?: boolean, seed?: string) {
    try {
      const result = await ApolloClient.query({
        query: gql`
          query($query: ImageSearchQuery!, $seed: String) {
            getImages(query: $query, seed: $seed) {
              numItems
              numPages
              items {
                ...ImageFragment
                labels {
                  _id
                  name
                  color
                }
                studio {
                  _id
                  name
                }
                actors {
                  ...ActorFragment
                  avatar {
                    _id
                    color
                  }
                }
                scene {
                  _id
                  name
                  thumbnail {
                    _id
                  }
                }
              }
            }
          }
          ${imageFragment}
          ${actorFragment}
        `,
        variables: {
          query: {
            include: this.selectedLabels.include,
            exclude: this.selectedLabels.exclude,
            query: this.query || "",
            take,
            page: page - 1,
            sortDir: this.sortDir,
            sortBy: random ? "$shuffle" : this.sortBy,
            favorite: this.favoritesOnly,
            bookmark: this.bookmarksOnly,
            rating: this.ratingFilter,
            actors: this.selectedActorIds,
          },
          seed: seed || localStorage.getItem("pm_seed") || "default",
        },
      });

      return result.data.getImages;
    } catch (err) {
      throw err;
    }
  }

  labelAliases(label: any) {
    return label.aliases.slice().sort().join(", ");
  }

  loadPage(page: number) {
    this.fetchLoader = true;
    this.selectedImages = [];

    return this.fetchPage(page)
      .then((result) => {
        this.fetchError = false;
        imageModule.setPagination({
          numResults: result.numItems,
          numPages: result.numPages,
        });
        this.images = result.items;
      })
      .catch((err) => {
        console.error(err);
        this.fetchError = true;
      })
      .finally(() => {
        this.fetchLoader = false;
      });
  }

  refreshPage() {
    this.loadPage(imageModule.page);
  }

  mounted() {
    if (!this.images.length) this.refreshPage();
  }

  beforeMount() {
    ApolloClient.query({
      query: gql`
        {
          getLabels {
            _id
            name
            color
          }
        }
      `,
    })
      .then((res) => {
        this.allLabels = res.data.getLabels;
        if (!this.allLabels.length) {
          this.selectedLabels.include = [];
          this.selectedLabels.exclude = [];
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
</script>

<style lang="scss">
.not-selected {
  transition: all 0.15s ease-in-out;
  filter: brightness(0.6);
}
</style>