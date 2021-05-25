<template>
    <div v-bind:style="{ backgroundColor : this.dotData.color }" v-on:click="pinChange" class="dot"></div>
</template>

<script>
  import ColorConstants from '../../src/data/constants';

  export default {
    name: 'Dot',
    methods: {
        pinChange: function() {

          // If on and color differs from current, leave on & set to current
          if (this.dotData.on && this.dotData.color !== this.selectedColor) {
            this.dotData.color = this.selectedColor;
          }

          // If on and current color, turn off
          else if (this.dotData.on && this.dotData.color === this.selectedColor) {
            this.dotData.on = false;
            this.dotData.color = ColorConstants.DEFAULT_COLOR_OFF;
          }

          // If off, turn on and set to selected color
          else if (!this.dotData.on) {
            this.dotData.on = true;
            this.dotData.color = this.selectedColor;
          }
        }
    },
    props: ['dot-data', 'selected-color']
  }
</script>

<style lang="scss" scoped>
    .dot {
        background-color: #2D2D2D;
        border-radius: 50%;
        height: 1.5rem;
        margin: 0 2px;
        width: 1.5rem;
        &:hover {
          cursor: pointer;
        }
    }
</style>