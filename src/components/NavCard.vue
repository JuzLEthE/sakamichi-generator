<template>
  <div class="card-container" v-bind:style="[widthPx]">
    <div class="tab-wrapper" v-bind:style="widthPx">
      <div v-for="item in cards" :key="item.name">
        <input type="radio" name="tab-radio" class="tab-radio" :id="item.name" checked />
        <label :for="item.name" v-bind:class="['tab-handler',group]" :style="{width:`${width/cards.length}px`}">{{item.name}}</label>
        <div class="tab-content" v-bind:style="[widthPx,heightPx]">
          <slot :name="item.name"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavCard',
  props: {
    cards: Array,
    width: Number,
    height: Number,
    group: String
  },

  data() {
    return {
      widthPx: {
        width: this.width + 'px'
      },
      heightPx: {
        height: this.height + 'px'
      }
    }
  }
}
</script>
<style scoped>
.card-container {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.tab-wrapper {
  position: relative;
  height: 40px;
  background-color: #33344a;
}
.tab-wrapper .tab-radio {
  display: none;
}
.tab-handler {
  position: relative;
  z-index: 2;
  display: block;
  float: left;
  height: 40px;
  color: #717181;
  font-size: 16px;
  line-height: 40px;
  transition: 0.3s;
  text-align: center;
}
.tab-radio:checked + .tab-handler {
  color: #fff;
  background-color: #8ec4e6;
}

.tab-radio:checked + .sakura {
  background-color: #ea94ad;
}
.tab-radio:checked + .nogi {
  background-color: #933fb9;
}
.tab-radio:checked + .tab-handler + .tab-content {
  visibility: visible;
  opacity: 1;
}
.tab-wrapper .tab-content {
  visibility: hidden;
  position: absolute;
  top: 40px;
  left: 0;
  color: #999;
  font-size: 14px;
  line-height: 1.618em;
  background-color: #fff;
  opacity: 0;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}
</style>
