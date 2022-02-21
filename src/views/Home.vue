<template>
  <div id="home">
    <div class="modules">
      <div class="module1" @click="to('msg')">
        <div class="description">
          <h2>日向坂MSG生成器</h2>
          <p>message图制作</p>
        </div>
      </div>
      <div class="module2" @click="to('msg/sakura')">
        <div class="description">
          <h2>樱坂MSG生成器</h2>
          <p>message图制作</p>
        </div>
      </div>
      <div class="module3" @click="to('msg/nogi')">
        <div class="description">
          <h2>乃木坂MSG生成器</h2>
          <p>message图制作</p>
        </div>
      </div>
      <div class="module4" @click="to('blog')">
        <div class="description">
          <h2>Blog生成器</h2>
          <p>鸽了</p>
        </div>
      </div>
      <div class="module5">
        <div class="description">
          <h2>coming soon...</h2>
        </div>
      </div>
    </div>
    <footer class="login-footer login-flex" height="40px">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow">
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">鲁ICP备2021003532号-1</p>
      </a>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37040302000156"
        style="display:inline-block;text-decoration:none;height:20px;line-height:20px;margin-left:10px"
      >
        <img :src="beianImg" style="float:left;" />
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">鲁公网安备 37040302000156号</p>
      </a>
    </footer>
  </div>
</template>

<script>
import beianImg from '@/assets/img/beian.png'
export default {
  name: 'Home',
  data() {
    return { beianImg: beianImg }
  },
  methods: {
    to(target) {
      this.$router.push(target)
    }
  }
}
</script>

<style>
.login-footer {
  color: white;
  background: #333e46;
  box-shadow: -5px 5px 10px #333e46, 5px -5px 10px #333e46;
  z-index: 1;
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#home {
  min-height: 100vh;
  margin: 0;
  font-family: 'Noto Sans SC';
}
.modules {
  margin: 0 auto;
  padding: 50px;
  display: grid;
  height: 500px;
  width: 900px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 30px;
}

h2 {
  font-size: 1.3em;
}

.modules > div {
  border-radius: 10px;
  box-shadow: 0 0 3rem -1rem rgba(0, 0, 0, 0.5);
  transition: background-position 0.5s, transform 0.1s ease-in-out, box-shadow 0.1s;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

.modules > div:hover {
  background-position: right center;
  transform: translateY(-0.5rem) scale(1.0125);
  box-shadow: 0 0.5em 3rem -1rem rgba(0, 0, 0, 0.5);
}

.description {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 1em 0.5em;
  color: #515151;
  text-decoration: none;
}

.description > h2 {
  margin: 0 0 0.5em;
}

.description > p {
  margin: 0;
}

.module1 {
  background: linear-gradient(-45deg, #23a6d5, #a77bd0, #23a6d5);
  grid-area: 1 / 1 / 2 / 2;
}
.module2 {
  background: linear-gradient(-45deg, #a254a5, #f390b1, white);
  grid-area: 1 / 2 / 2 / 3;
}
.module3 {
  background: linear-gradient(-45deg, #c485e6, #933fb9, #c485e6);
  grid-area: 2 / 1 / 3 / 2;
}
.module4 {
  background: linear-gradient(-45deg, #28a8f7, #fdf259, #28a8f7);
  grid-area: 2 / 2 / 3 / 3;
}
.module5 {
  grid-area: 1 / 3 / 3 / 5;
}
@keyframes gradient {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>