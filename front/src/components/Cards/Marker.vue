<template>
  <v-card tile v-if="value">
    <a class="hover" v-ripple :href="sceneUrl">
      <v-img :src="thumbnail"></v-img>
    </a>
    <div class="pa-2">
      <div :title="value.name" class="font-weight-bold subtitle-1">{{ value.name }}</div>
      <div
        class="caption med--text"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        From scene
        <router-link :to="`/scene/${value.scene._id}`">{{ value.scene.name }}</router-link>
      </div>

      <div class="mt-2">
        <v-btn
          @click="favorite"
          text
          small
          :color="value.favorite ? 'red' : ''"
          class="text-none mr-2"
          >Favorite</v-btn
        >
        <v-btn
          @click="bookmark"
          text
          small
          :color="value.bookmark ? 'primary' : ''"
          class="text-none"
          >Bookmark</v-btn
        >
      </div>

      <Rating @change="rate" class="my-2 ml-3" :value="value.rating" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ApolloClient, { serverBase } from "@/apollo";
import gql from "graphql-tag";
import { copy } from "@/util/object";

@Component
export default class SceneCard extends Vue {
  @Prop(Object) value!: any;

  get thumbnail() {
    if (this.value.thumbnail)
      return `${serverBase}/media/image/${this.value.thumbnail._id}?password=${localStorage.getItem(
        "password"
      )}`;
    return `${serverBase}/broken`;
  }

  get sceneUrl() {
    return `${serverBase}/?password=${localStorage.getItem("password")}#/scene/${
      this.value.scene._id
    }?t=${this.value.time}&mk_name=${this.value.name}`;
  }

  rate($event) {
    const rating = $event;

    ApolloClient.mutate({
      mutation: gql`
        mutation($ids: [String!]!, $opts: MarkerUpdateOpts!) {
          updateMarkers(ids: $ids, opts: $opts) {
            rating
          }
        }
      `,
      variables: {
        ids: [this.value._id],
        opts: {
          rating,
        },
      },
    }).then((res) => {
      const marker = copy(this.value);
      marker.rating = res.data.updateMarkers[0].rating;
      this.$emit("input", marker);
    });
  }

  favorite() {
    ApolloClient.mutate({
      mutation: gql`
        mutation($ids: [String!]!, $opts: MarkerUpdateOpts!) {
          updateMarkers(ids: $ids, opts: $opts) {
            favorite
          }
        }
      `,
      variables: {
        ids: [this.value._id],
        opts: {
          favorite: !this.value.favorite,
        },
      },
    }).then((res) => {
      const marker = copy(this.value);
      marker.favorite = res.data.updateMarkers[0].favorite;
      this.$emit("input", marker);
    });
  }

  bookmark() {
    ApolloClient.mutate({
      mutation: gql`
        mutation($ids: [String!]!, $opts: MarkerUpdateOpts!) {
          updateMarkers(ids: $ids, opts: $opts) {
            bookmark
          }
        }
      `,
      variables: {
        ids: [this.value._id],
        opts: {
          bookmark: this.value.bookmark ? null : Date.now(),
        },
      },
    }).then((res) => {
      const marker = copy(this.value);
      marker.bookmark = res.data.updateMarkers[0].bookmark;
      this.$emit("input", marker);
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
