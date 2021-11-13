<template>
  <div class="card-container" v-bind:style="[widthPx]">
    <div class="tab-wrapper" v-bind:style="widthPx">
      <!--tab section 1-->
      <div v-for="item in cards" :key="item.name">
        <input type="radio" name="tab-radio" class="tab-radio" :id="item.name" checked />
        <label :for="item.name" class="tab-handler" v-bind:class="{'sakura':isSakura}">{{item.name}}</label>
        <div class="tab-content" v-bind:style="[widthPx,heightPx]">
          <slot :name="item.name"></slot>
        </div>
      </div>
      <!--       
      <input type="radio" name="tab-radio" class="tab-radio" id="tab-radio-2" />
      <label for="tab-radio-2" class="tab-handler tab-handler-2">常用</label>
      <div class="tab-content tab-content-2">
        <slot name="second"></slot>
      </div>
      <input type="radio" name="tab-radio" class="tab-radio" id="tab-radio-3" />
      <label for="tab-radio-3" class="tab-handler tab-handler-3">字体</label>
      <div class="tab-content tab-content-3">
        <slot name="third"></slot>
      </div>
      <input type="radio" name="tab-radio" class="tab-radio" id="tab-radio-4" />
      <label for="tab-radio-4" class="tab-handler tab-handler-4">历史</label>
      <div class="tab-content tab-content-4">
        <slot name="fourth"></slot>
      </div>-->
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
    isSakura: Boolean
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
  width: 135px;
  text-align: center;
}
.tab-radio:checked + .tab-handler {
  color: #fff;
  background-color: #8ec4e6;
}

.tab-radio:checked + .sakura {
  background-color: #ea94ad;
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
