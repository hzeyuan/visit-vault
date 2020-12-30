<template>
  <div style="display: none"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

const defaultIcon = "/assets/favicon.png";

@Component
export default class BindFavicon extends Vue {
  @Prop(String) value!: string;

  setIcon(url: string) {
    let link = document.querySelector("link[rel~='icon']") as HTMLAnchorElement;
    if (link) {
      link.href = url;
    }
  }

  mounted() {
    this.setIcon(this.value || defaultIcon);
  }

  @Watch("value")
  onValueChange(str?: string) {
    this.setIcon(str || defaultIcon);
  }
}
</script>
