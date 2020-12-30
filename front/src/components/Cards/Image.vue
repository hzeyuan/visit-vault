<template>
  <v-card width="100%" height="100%" v-if="image" outlined>
    <v-img
      eager
      class="hover"
      :src="imageLink(image)"
      :alt="image.name"
      width="100%"
      height="100%"
      min-height="100px"
      @click="$emit('click', $event)"
      v-ripple
      :contain="contain"
    >
      <div class="corner-actions">
        <slot name="action"></slot>
      </div>

      <template v-slot:placeholder>
        <v-skeleton-loader width="100%" height="100%" tile loading type="image"></v-skeleton-loader>
      </template>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { serverBase } from "@/apollo";
import IImage from "@/types/image";

@Component
export default class ImageCard extends Vue {
  @Prop(Object) image!: IImage;
  @Prop({ default: false }) contain!: boolean;

  imageLink(image: IImage) {
    // 测试
    console.log('serverBase',image)
    // return 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F52%2F62%2F31300542679117141195629117826.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611576383&t=63182d5eb71da0dc476244c3a9ceb76e'
    return `${serverBase}/media/image/${image._id}/thumbnail?password=${localStorage.getItem(
      "password"
    )}`;
  }
}
</script>

<style lang="scss" scoped>
.corner-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>