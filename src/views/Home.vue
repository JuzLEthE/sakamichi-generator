<template>
  <div id="home">
    <div class="modules">
      <div class="module1" @click="to('msg')">
        <div class="description">
          <h2>MSG生成器</h2>
          <p>message图制作</p>
        </div>
      </div>
      <div class="module2" @click="to('blog')">
        <div class="description">
          <h2>blog生成器</h2>
          <p>还没做好</p>
        </div>
      </div>
      <div class="module3">
        <div class="description">
          <h2>coming...</h2>
        </div>
      </div>
      <div class="module4">
        <div class="description">
          <h2>coming...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    to(target) {
      this.$router.push(target)
    }
  }
}
</script>

<style>
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
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 30px;
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
  grid-area: 1 / 1 / 3 / 2;
}
.module2 {
  background: linear-gradient(-45deg, #28a8f7, #fdf259, #28a8f7);
  grid-area: 1 / 2 / 3 / 3;
}
.module3 {
  grid-area: 3 / 1 / 5 / 3;
}
.module4 {
  grid-area: 1 / 3 / 5 / 5;
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