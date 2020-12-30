<template>
  <div class="white--text">
    <v-hover v-slot:default="{ hover }">
      <div
        :class="{ 'video-wrapper': true, hideControls }"
        ref="videoWrapper"
        tabindex="0"
        @mousemove="startControlsTimeout"
      >
        <div :class="{ 'video-overlay': true, hideControls }">
          <v-img
            @click="togglePlay(false)"
            @dblclick="toggleFullscreen"
            :src="poster"
            cover
            max-height="100%"
            class="blurred poster"
            v-if="poster && showPoster"
          ></v-img>
          <v-img
            @click="togglePlay(false)"
            @dblclick="toggleFullscreen"
            class="poster text-center"
            :src="poster"
            contain
            max-height="100%"
            v-if="poster && showPoster"
          ></v-img>
          <v-fade-transition>
            <div v-if="videoNotice" class="notice pa-2">{{ videoNotice }}</div>
          </v-fade-transition>

          <v-fade-transition>
            <div v-if="hover && !hideControls" class="bottom-bar">
              <div>
                <v-hover v-slot:default="{ hover }">
                  <div
                    @mousemove="onMouseMove"
                    id="progress-bar"
                    class="progress-bar-wrapper"
                    @click="onProgressClick"
                  >
                    <div class="time-bar">
                      <v-fade-transition>
                        <div
                          class="elevation-4 preview-window"
                          v-if="hover && preview"
                          :style="`left: ${previewX * 100}%;`"
                        >
                          <div class="preview-wrapper">
                            <img
                              class="preview-image"
                              :style="`left: -${imageIndex * 160}px; background-position: ${
                                imageIndex * 160
                              }`"
                              :src="preview"
                            />
                          </div>
                        </div>
                      </v-fade-transition>
                    </div>

                    <template v-if="buffered">
                      <template v-for="i in buffered.length">
                        <div
                          :key="i"
                          class="buffer-bar"
                          :style="`left: ${percentOfVideo(buffered.start(i - 1)) * 100}%; right: ${
                            100 - percentOfVideo(buffered.end(i - 1)) * 100
                          }%;`"
                        ></div>
                      </template>
                    </template>
                    <div class="progress-bar" :style="`width: ${progressPercent * 100}%;`"></div>
                    <v-tooltip v-for="marker in markers" :key="marker.id" bottom>
                      <template v-slot:activator="{ on }">
                        <v-hover v-slot:default="{ hover }">
                          <div
                            @click="seek(marker.time)"
                            v-on="on"
                            :class="`marker ${hover ? 'hover' : ''}`"
                            :style="`left: ${percentOfVideo(marker.time) * 100}%;`"
                          ></div>
                        </v-hover>
                      </template>
                      {{ marker.name }}
                    </v-tooltip>
                  </div>
                </v-hover>
              </div>

              <div class="px-1 align-center d-flex" style="width: 100%; height: 100%">
                <v-btn dark @click="togglePlay(false)" icon>
                  <v-icon>{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
                </v-btn>
                <v-hover v-slot:default="{ hover }" close-delay="100">
                  <!-- close-delay to allow the user to jump the gap and hover over volume wrapper -->
                  <div>
                    <transition name="slide-up">
                      <div v-if="hover" class="volume-bar-background">
                        <div
                          id="volume-bar"
                          class="volume-bar-wrapper"
                          @click="onVolumeClick"
                          @mousedown="onVolumeMouseDown"
                          @mousemove="onVolumeDrag"
                        >
                          <div class="volume-bar"></div>
                          <div
                            v-if="!isMuted"
                            class="current-volume-bar"
                            :style="`height: ${volume * 100}%;`"
                          ></div>
                          <!-- subtract half the circle's height so the center of the circle
                          is exactly at top of the current volume bar  -->
                          <div
                            v-if="!isMuted"
                            class="current-volume-position"
                            :style="`bottom: calc(${volume * 100}% - 5px);`"
                          ></div>
                        </div>
                      </div>
                    </transition>
                    <v-btn dark @click="toggleMute" icon>
                      <v-icon>{{ isMuted ? "mdi-volume-mute" : "mdi-volume-high" }}</v-icon>
                    </v-btn>
                  </div>
                </v-hover>
                <span class="mx-2 body-2"
                  >{{ formatTime(progress) }} / {{ formatTime(duration) }}</span
                >
                <v-spacer></v-spacer>
                <v-btn dark @click="toggleFullscreen" icon>
                  <v-icon>mdi-fullscreen</v-icon>
                </v-btn>
              </div>
            </div>
          </v-fade-transition>
        </div>
        <video
          @click="togglePlay(false)"
          @dblclick="toggleFullscreen"
          id="video"
          class="video"
          ref="video"
        >
          <source :src="src" type="video/mp4" />
        </video>
      </div>
    </v-hover>
    <v-card
      v-if="paniced"
      style="z-index: 99999; position: fixed; left: 0; top: 0; width: 100%; height: 100%"
    ></v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";
import hotkeys from "hotkeys-js";

const IS_MUTED = "player_is_muted";
const VOLUME = "player_volume";

@Component
export default class VideoPlayer extends Vue {
  @Prop(String) src!: string;
  @Prop(Number) duration!: number;
  @Prop({ default: null }) poster!: string | null;
  @Prop() markers!: { _id: string; name: string; time: number }[];
  @Prop({ default: null }) preview!: string | null;

  videoNotice = "";
  noticeTimeout: null | number = null;
  previewX = 0;
  progress = 0;
  buffered = null as any;
  isPlaying = false;
  showPoster = true;

  isVolumeDragging = false;
  isMuted = localStorage.getItem(IS_MUTED) === "true";
  volume = parseFloat(localStorage.getItem(VOLUME) ?? "1");
  hideControlsTimeoutDuration = 3000;
  hideControlsTimeout: null | number = null;
  hideControls = false;

  volumeIncrementPercentage = 0.05;

  paniced = false;

  mounted() {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      vid.volume = this.volume;
      vid.muted = this.isMuted;
    }
    window.addEventListener("mouseup", this.onVolumeMouseUp);

    hotkeys("space", this.focusedTogglePlay);
    hotkeys("up", this.focusedIncrementVolume);
    hotkeys("down", this.focusedDecrementVolume);
  }

  beforeDestroy() {
    window.removeEventListener("mouseup", this.onVolumeMouseUp);

    hotkeys.unbind("space", this.focusedTogglePlay);
    hotkeys.unbind("up", this.focusedIncrementVolume);
    hotkeys.unbind("down", this.focusedDecrementVolume);
  }

  panic() {
    this.paniced = true;
    this.pause();
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      vid.src = "";
    }
    window.location.replace(localStorage.getItem("pm_panic") || "https://google.com");
  }

  formatTime(secs: number) {
    return moment().startOf("day").seconds(secs).format("H:mm:ss");
  }

  currentProgress() {
    return this.progress;
  }

  get imageIndex() {
    return Math.floor(this.previewX * 100);
  }

  startControlsTimeout() {
    if (this.hideControlsTimeout) {
      window.clearTimeout(this.hideControlsTimeout);
    }
    this.hideControls = false;
    this.hideControlsTimeout = window.setTimeout(() => {
      this.hideControls = true;
    }, this.hideControlsTimeoutDuration);
  }

  async toggleFullscreen() {
    const videoWrapper = this.$refs.videoWrapper as HTMLElement & {
      mozRequestFullScreen?(): Promise<void>;
      webkitRequestFullscreen?(): Promise<void>;
      msRequestFullscreen?(): Promise<void>;
    };

    if (!videoWrapper) return;

    if (document.fullscreenElement && document.fullscreenElement === videoWrapper) {
      document.exitFullscreen();
    } else {
      const requestFullscreen =
        videoWrapper.requestFullscreen ||
        videoWrapper.webkitRequestFullscreen ||
        videoWrapper.mozRequestFullScreen ||
        videoWrapper.msRequestFullscreen;
      if (requestFullscreen) {
        try {
          // Invoke function with element context
          await requestFullscreen.call(videoWrapper);
          // Focus the wrapper when in fullscreen, to allow
          // for focus dependant keyboard shortcuts
          videoWrapper.focus();
        } catch (err) {
          // Browser refused fullscreen for some reason, do nothing
        }
      }
    }
  }

  setVolume(volume: number, notice = false) {
    this.startControlsTimeout();

    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (volume <= 0.02) {
        this.mute();
      } else {
        if (volume > 1) {
          volume = 1;
        }
        if (notice) this.notice(`Volume: ${(volume * 100).toFixed(0)}%`);

        this.unmute();
        this.volume = volume;
        localStorage.setItem(VOLUME, volume.toString());
        vid.volume = volume;
      }
    }
  }

  onVolumeClick(ev: any) {
    const volumeBar = document.getElementById("volume-bar");
    if (volumeBar) {
      const rect = volumeBar.getBoundingClientRect();
      const y = (ev.clientY - rect.bottom) * -1;
      const yPercentage = y / rect.height;
      this.setVolume(yPercentage);
    }
  }

  onVolumeMouseDown() {
    this.isVolumeDragging = true;
  }

  onVolumeMouseUp() {
    this.isVolumeDragging = false;
  }

  onVolumeDrag(ev) {
    if (this.isVolumeDragging) {
      this.onVolumeClick(ev);
    }
  }

  onMouseMove(ev) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      this.previewX = x / rect.width;
    }
  }

  percentOfVideo(time: number) {
    return time / this.duration;
  }

  get progressPercent() {
    return this.percentOfVideo(this.progress);
  }

  seekRel(delta: number, text?: string) {
    this.startControlsTimeout();
    this.notice(`Seek: ${delta > 0 ? "+" : ""}${delta.toString()}s`);

    this.seek(Math.min(this.duration, Math.max(0, this.progress + delta)), text);
  }

  seek(time: number, text?: string, play = false) {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      vid.currentTime = time;

      if (play) this.play();

      if (text) {
        this.notice(text);
      }
    }
  }

  onProgressClick(ev: any) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const xPercentage = x / rect.width;
      this.seek(xPercentage * this.duration, "", true);
    }
  }

  notice(text: string, duration = 1500) {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
    }
    this.videoNotice = text;
    this.noticeTimeout = window.setTimeout(() => {
      this.videoNotice = "";
    }, duration);
  }

  play(notice = false) {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (notice) this.notice("Play");

      vid.play();
      this.isPlaying = true;
      this.showPoster = false;
      vid.ontimeupdate = (ev) => {
        this.progress = vid.currentTime;
        this.buffered = vid.buffered;
      };
      this.$emit("play");
    }
  }

  isPaused() {
    const vid = <HTMLVideoElement>this.$refs.video;
    return vid && vid.paused;
  }

  pause(notice = false) {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (notice) this.notice("Paused");

      vid.pause();
      this.isPlaying = false;
    }
  }

  isVideoFocused() {
    const videoWrapper = <Element>this.$refs.videoWrapper;
    return (
      videoWrapper &&
      document.activeElement &&
      (document.activeElement === videoWrapper || videoWrapper.contains(document.activeElement))
    );
  }

  focusedTogglePlay(ev: KeyboardEvent) {
    if (this.isVideoFocused()) {
      ev.preventDefault(); // prevent page scroll
      this.togglePlay(true);
    }
  }

  focusedIncrementVolume(ev: KeyboardEvent) {
    if (this.isVideoFocused()) {
      ev.preventDefault(); // prevent page scroll
      this.setVolume(this.volume + this.volumeIncrementPercentage, true);
    }
  }

  focusedDecrementVolume(ev: KeyboardEvent) {
    if (this.isVideoFocused()) {
      ev.preventDefault(); // prevent page scroll
      this.setVolume(this.volume - this.volumeIncrementPercentage, true);
    }
  }

  togglePlay(notice = false) {
    this.startControlsTimeout();

    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (vid.paused) {
        this.play(notice);
      } else {
        this.pause(notice);
      }
    }
  }

  mute(notice = false) {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (notice) this.notice("Muted");

      vid.muted = true;
      this.isMuted = true;
      localStorage.setItem(IS_MUTED, "true");
    }
  }

  unmute(notice = false) {
    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (notice) this.notice("Unmuted");

      vid.muted = false;
      this.isMuted = false;
      localStorage.setItem(IS_MUTED, "false");
    }
  }

  toggleMute(notice = false) {
    this.startControlsTimeout();

    const vid = <HTMLVideoElement>this.$refs.video;
    if (vid) {
      if (vid.muted) {
        this.unmute(notice);
      } else {
        this.mute(notice);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  cursor: pointer;
  position: relative;
  outline: none;

  // Vertically center the video
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000000;

  &.hideControls {
    cursor: none;
  }
}

.video {
  // Make sure video does not overflow wrapper
  height: 100%;
  width: 100%;
}

.video-overlay {
  pointer-events: none;
  overflow: hidden;
  z-index: 11;
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;

  &.hideControls {
    cursor: none;
  }

  .volume-bar-background {
    position: absolute;
    height: 110px;
    background-color: #121420ee;
    width: 30px;
    top: -110px;
    padding-bottom: 5px;
    // We need more padding at the top, since the current volume circle pokes past the track
    padding-top: 10px;
    user-select: none;

    &.slide-up-enter-active,
    &.slide-up-leave-active {
      transition: transform 100ms ease-out;
      transform-origin: bottom;
    }

    &.slide-up-enter,
    &.slide-up-leave-to {
      transform: scaleY(0);
    }

    .volume-bar-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      .volume-bar {
        position: absolute;
        background-color: #202a3b;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 100px;
        bottom: 0;
      }

      .current-volume-bar {
        position: absolute;
        background-color: #1c59ca;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 35px;
        bottom: 0;
      }

      .current-volume-position {
        position: absolute;
        background-color: #ffffff;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
    }
  }

  .progress-bar-wrapper {
    height: 100%;
    position: relative;
    width: 100%;
    cursor: pointer;

    .time-bar {
      width: 100%;
      height: 6px;
      background: #303a4b;

      .preview-window {
        position: absolute;
        top: -100px;
        transform: translateX(-80px);

        .preview-wrapper {
          position: relative;
          overflow: hidden;
          width: 160px;
          height: 90px;

          .preview-image {
            position: absolute;
            height: 100%;
          }
        }
      }
    }

    @mixin bar {
      pointer-events: none;
      transform: translateY(-50%);
      top: 50%;
      position: absolute;
      height: 6px;
    }

    .progress-bar {
      @include bar;
      left: 0px;
      background: #1c59ca;
    }

    .buffer-bar {
      @include bar;
      background: white;
      opacity: 0.2;
    }

    .marker {
      transition: all 0.15s ease-in-out;
      transform: translateY(-50%);
      top: 50%;
      border-radius: 4px;
      position: absolute;
      width: 4px;
      background: #489fb4;
      height: 12px;

      &.hover {
        background: #19c0fd;
        height: 16px;
      }
    }
  }

  .bottom-bar {
    cursor: default;
    pointer-events: auto;
    background: #121420ee;
    height: 48px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }

  .notice {
    background: #333333aa;
    position: absolute;
    left: 10px;
    top: 10px;
    border-radius: 6px;
  }

  .poster {
    pointer-events: auto;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    &.blurred {
      filter: blur(8px);
    }
  }
}
</style>
