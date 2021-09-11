<template>
  <div id="blog">
    <div style="position:fixed;left:50px;top:50px">
      <input v-model="id" />
      <button @click="getDetail">get</button>
    </div>
    <div class="blog-container" ref="imageWrapper">
      <div class="p-blog-head-container">
        <div class="p-blog-head">
          <h2 class="c-blog-page__title">OFFICIAL BLOG</h2>
          <h3 class="c-blog-page__subtitle">{{detail.name}} 公式ブログ</h3>
        </div>
        <div class="c-blog-avatar">
          <img class="c-blog-avatar__img" :src="detail.avatar" />
        </div>
      </div>

      <div class="p-blog-article__head">
        <div class="c-blog-article__title" v-html="detail.title"></div>
        <div class="p-blog-article__info">
          <div class="c-blog-article__date" v-text="detail.time"></div>
          <div class="c-blog-article__name" v-text="detail.name"></div>
        </div>
      </div>

      <div class="c-blog-article__text" v-html="detail.content" contenteditable="true"></div>

      <footer></footer>
    </div>

    <nav-buttons :buttonConfigs="buttonConfig" />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import twemoji from 'twemoji'
import NavButtons from '../components/NavButtons.vue'
import '@/assets/css/blog.css'
export default {
  name: 'Blog',
  components: {
    NavButtons
  },
  data() {
    return {
      baseUrl: '/api/',
      id: '',
      dragDisabled: false,
      buttonConfig: [
        { color: 'red', icon: 'fa fa-solid fa-home', func: 'to', args: ['/'] },
        { color: 'purple', icon: 'fa fa-solid fa-download', func: 'toImage', args: [] }
      ],
      detail: {
        title: '标题',
        name: '日向坂46',
        avatar: 'https://cdn.hinatazaka46.com/images/14/cf8/a6b6ee6cf204f3258a046340a262b/400_320_102400.jpg',
        time: '2021.9.4 10:43',
        content:
          '1.将原博客地址栏中/diary/detail/后面的数字输入左边input中，点get爬取。2.因为图片涉及到跨域，需要浏览器关闭安全限制才可以转图片，还有就是等图片加载完再转。可以看下 https://www.cnblogs.com/laden666666/p/5544572.html 和 https://zhuanlan.zhihu.com/p/258076891 '
      }
    }
  },
  computed: {
    avatarStyle: function () {
      return 'background-image:url(' + this.detail.avatar + ');'
    }
  },
  methods: {
    to(target) {
      if (confirm('确定要跳转吗？')) {
        this.$router.push(target)
      }
    },
    getDetail() {
      fetch(this.baseUrl + 'blog/detail/' + this.id, {
        headers: {
          method: 'GET',
          mode: 'cors',
          'content-type': 'application/json'
        }
      })
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.detail.name = json.name
          this.detail.avatar = json.avatar
          this.detail.time = json.time
          this.detail.content = twemoji.parse(json.content)
          this.detail.title = twemoji.parse(json.title)
        })
    },
    setAvatar(e) {
      e.stopPropagation()
      e.preventDefault()
      const _this = this
      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.dataTransfer.files[0])
      fileReader.addEventListener('load', function () {
        // res是base64格式的图片
        _this.avartarSrc = fileReader.result
      })
    },

    toImage() {
      html2canvas(this.$refs.imageWrapper, {
        useCORS: true,
        scale: 2,
        dpi: 300
      }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png')
        this.fileDownload(dataURL)
      })
    },

    fileDownload(downloadUrl) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.href = downloadUrl
      aLink.download = 'blog.png'
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },

    contentPaste(e) {
      e.stopPropagation()

      e.preventDefault()
      let pastedText
      if (window.clipboardData && window.clipboardData.getData) {
        // 获取拷贝进剪切板指定格式的数据 (此处用的Text格式)
        pastedText = window.clipboardData.getData('Text')
      } else if ((e.clipboardData || e.originalEvent.clipboardData) && (e.clipboardData || e.originalEvent.clipboardData).getData) {
        pastedText = (e.originalEvent || e).clipboardData.getData('text/plain')
      }
      document.execCommand('insertHTML', false, this.handleEmojiLink(pastedText))
    },
    handleEmojiLink(plainText) {
      let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
      return twemoji.parse(plainText.replace(exp, "<a href='$1'>$1</a>"))
    }
  }
}
</script>

<style scoped>
#blog {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
  font-family: 'Noto Sans SC';
}
.blog-container {
  margin: 20px;
  width: 375px;
  min-width: 500px;
  min-height: 90vh;
  background-color: #fefefe;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;
}
.p-blog-head-container {
  background-image: url('https://cdn.hinatazaka46.com/files/14/hinata/product/images/bg_shakehands_v8_k9ynpcde.jpg');
  background-color: #f3d072;
  width: 100%;
  background-color: #5abee4;
  background-repeat: no-repeat;
  background-position: center 100%;
  background-size: cover;
  position: relative;
}
.p-blog-head {
  width: 100%;
  padding: 60px 20px 40px 20px;
}
.c-blog-page__title {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1.2;
  position: relative;
  z-index: 100;
  color: #ffffff;
}
.c-blog-page__subtitle {
  font-size: 10px;
  margin-top: 2px;
  color: #ffffff;
  line-height: 1.2;
  position: relative;
  z-index: 100;
}
.p-blog-article__head {
  margin-top: 80px;
  padding: 0 50px 0 50px;
  z-index: 200;
}
.c-blog-avatar {
  width: 90px;
  height: 90px;
  text-align: center;
  border-radius: 50%;
  margin-top: -40px;
  margin-left: 40px;
  margin-bottom: 34px;
  position: absolute;
  overflow: hidden;
  z-index: 300;
}
.c-blog-avatar__img {
  width: 100%;

  min-height: 100%;
  object-fit: cover;
  z-index: 300;
}
.c-blog-article__title {
  color: #464646;
  font-size: 30px;
  margin-bottom: 20px;
}
.c-blog-article__date {
  color: #738c8c;
  font-size: 14px;
  margin-right: 10px;
  display: inline-block;
}
.c-blog-article__name {
  background-color: #f1f4f4;
  border-radius: 4px;
  padding: 3px 8px;
  line-height: 1.1;
  color: #738c8c;
  display: inline-block;
}
.c-blog-article__text {
  margin-top: 10px;
  flex: 1;
  padding: 50px;
  color: #636767;
  line-height: 1.75;
  background: #fff;
  font-size: 1rem;
  letter-spacing: 1px;
  font-family: 'Overpass', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', 'ヒラギノ角ゴ ProN W3', Meiryo,
    sans-serif;
  word-break: break-all;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  word-wrap: break-word;
}
p,
address,
blockquote,
pre,
div,
abbr,
acronym,
dfn,
cite,
q,
code,
kbd,
samp,
var,
dl,
ol,
ul,
caption,
th {
  font-weight: normal;
  font-style: normal;
}
.c-blog-article__text img {
  width: auto !important;
  max-height: 500px;
  max-width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;

  border: 0 none;
  vertical-align: top;
  width: 100%;
  height: auto;
}
</style>
