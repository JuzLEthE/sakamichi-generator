<template>
  <div id="blog">
    <div style="position:fixed;left:50px;top:50px">
      <input v-model="id" />
      <button @click="getDetail">get</button>
    </div>
    <div class="container" ref="imageWrapper">
      <div class="main-contents" v-html="html" contenteditable="true"></div>
    </div>

    <nav-buttons :buttonConfigs="buttonConfig" />
  </div>
</template>

<script>
// 导入draggable组件
// import draggable from 'vuedraggable'
import html2canvas from 'html2canvas'
import twemoji from 'twemoji'
import NavButtons from '../components/NavButtons.vue'
import '@/assets/css/blog.css'
export default {
  name: 'Blog',
  // 注册draggable组件
  components: {
    NavButtons
  },
  data() {
    return {
      id: '',
      dragDisabled: false,
      memberName: '日向坂46',
      avartarSrc: require('@/assets/img/avatar/hnt_logo.svg'),
      buttonConfig: [
        { color: 'blue', icon: 'fa fa-solid fa-plus', func: 'addMsg', args: ['normal'] },
        { color: 'green', icon: 'fa fa-solid fa-image', func: 'addMsg', args: ['image'] },
        { color: 'red', icon: 'fa fa-solid fa-user' },
        { color: 'purple', icon: 'fa fa-solid fa-download', func: 'toImage', args: [] },
        { color: 'orange', icon: 'fa fa-solid fa-trash', func: 'removeMsg', args: [] },
        { color: 'lightblue', icon: 'fa fa-solid fa-microphone', func: 'addMsg', args: ['voice'] }
      ],
      // 定义要被拖拽对象的数组
      msgs: [
        {
          id: Date.now(),
          time: new Date().format('MM/dd hh:mm'),
          content:
            '1.拖动本地图片到头像处进行替换。2.拖动本地图片到气泡上进行上传，双击图片取消。3.点击顶部文字和每条消息的时间，可以进行修改。4.如需处理emoji或者超链接，请复制后粘贴到气泡中。',
          type: 'normal'
        }
      ],
      // 定义消息类型
      type: {
        normal: {
          content: '带文字的消息，拖动本地图片到气泡上进行上传，双击图片取消。如需处理emoji或者超链接，请复制后粘贴到气泡中。'
        },
        image: {
          content: '仅图片的消息，拖动本地图片到气泡上进行上传，双击图片删除本条消息。'
        },
        voice: {
          content: '--:--'
        }
      },
      maskIcon: {
        normal:
          '<svg t="1629476284558" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="51474" width="50" height="50"><path d="M512 898.8c57.8 0 112.8-11.4 162.6-31.8 1.2-0.6 2.2-1 3.4-1.4 0.2 0 0.4 0 0.4-0.2 7-2.6 14.6-4 22.4-4 8.6 0 16.8 1.6 24.2 4.8l168 61.8-44.2-176.8c0-10.6 3-20.6 7.8-29.2 0 0 0 0 0 0 1.6-2.6 3.2-5.2 5-7.4 41.8-62.6 66-137 66-216.8C928 275.8 741.8 96 512 96 282.2 96 96 275.8 96 497.4 96 719.2 282.2 898.8 512 898.8z" p-id="51475" fill="#ffffff"></path></svg>',
        image:
          '<svg t="1629478159872" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40920" width="50" height="50"><path d="M213.333333 473.6l85.333334-85.333333 234.666666 234.666666 149.333334-149.333333 128 128V213.333333H213.333333v260.266667zM170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m490.666666 298.666667a64 64 0 1 1 0-128 64 64 0 0 1 0 128z" p-id="40921" fill="#ffffff"></path></svg>',
        voice:
          '<svg t="1629478496186" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="64042" width="50" height="50"><path d="M462.06 142.1L284.12 320H80c-26.52 0-48 21.48-48 48v288c0 26.5 21.48 48 48 48h204.12l177.94 177.9c30.06 30.06 81.94 8.94 81.94-33.94V176.04c0-42.92-51.92-63.96-81.94-33.94zM992 512c0-127.06-64.12-243.88-171.54-312.48-22.38-14.28-52.06-7.64-66.24 14.92s-7.56 52.42 14.82 66.72C848.54 331.94 896 418.22 896 512s-47.46 180.06-126.96 230.84c-22.38 14.28-29 44.14-14.82 66.72 13.02 20.72 42.24 30.28 66.24 14.92C927.88 755.88 992 639.06 992 512z m-283.54-153.74c-23.16-12.66-52.38-4.32-65.22 18.9-12.78 23.22-4.32 52.4 18.9 65.22C687.96 456.56 704 483.26 704 512c0 28.76-16.04 55.44-41.84 69.62-23.22 12.82-31.68 42-18.9 65.22 12.86 23.32 42.1 31.6 65.22 18.9 56.46-31.1 91.54-90 91.54-153.76s-35.08-122.64-91.56-153.72z" p-id="64043" fill="#ffffff"></path></svg>'
      },
      html: ''
    }
  },
  methods: {
    getDetail() {
      console.log(this.id)
      fetch('http://localhost:19211/blog/detail/' + this.id, {
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
          this.html = json.content
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

    addImage(e, item) {
      e.stopPropagation()
      e.preventDefault()
      // 音频无图片
      if (item.type === 'voice') return

      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.dataTransfer.files[0])
      let imgEl = e.currentTarget.getElementsByTagName('img')[0]
      if (item.type === 'image') {
        let content = e.currentTarget.getElementsByClassName('msg-content')[0]
        content.hidden = 'hidden'
      }
      fileReader.addEventListener('load', function () {
        // 读取完成
        let res = fileReader.result
        // res是base64格式的图片
        imgEl.src = res
        imgEl.hidden = false
      })
    },
    removeImg(e, item) {
      e.stopPropagation()
      e.preventDefault()
      e.currentTarget.src = null
      e.currentTarget.hidden = 'hidden'
      if (item.type === 'image') {
        this.msgs.splice(
          this.msgs.findIndex(msg => msg.id === item.id),
          1
        )
      }
    },
    toImage() {
      html2canvas(this.$refs.imageWrapper, {
        allowTaint: true,
        scale: 4,
        dpi: 300
      }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png')
        setTimeout(() => {
          this.fileDownload(dataURL)
        }, 500)
      })
    },

    fileDownload(downloadUrl) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.href = downloadUrl
      aLink.download = 'msg.png'
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
  background: #37474f;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;

  color: #636767;
  line-height: 1.75;
  font-size: 16px;
  letter-spacing: 1px;
  font-family: 'Overpass', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', 'ヒラギノ角ゴ ProN W3', Meiryo,
    sans-serif;
}

.container {
  margin: 20px;
  width: 700px;
  min-width: 700px;
  min-height: 90vh;
  background-color: #fefefe;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
.talk-header {
  width: inherit;
  height: 60px;
  background: linear-gradient(to right, #8ec4e6 40%, #a77bd0 100%);
  font-size: 22px;
  color: white;
  text-align: center;
  line-height: 60px;
}
.main-contents {
  width: 740px;
  padding: 60px 60px 60px 60px;
  margin: -140px 0 0 0;
  background-color: #fff;
}

.talk-avatar {
  width: 3em;
  height: 3em;
  text-align: center;
  border-radius: 50%;
  margin: 5px 5px 5px 20px;
  display: inline-block;
  overflow: hidden;
}
.talk-avatar img {
  width: 100%;

  min-height: 100%;
  object-fit: cover;
}
</style>
