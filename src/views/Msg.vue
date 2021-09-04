<template>
  <div id="home">
    <select v-model="memberName" @change="selectMember">
      <option disabled value="请选择成员">请选择成员</option>
      <option v-for="member in members" :key="member.name">{{ member.name }}</option>
    </select>
    <div class="container" ref="imageWrapper">
      <div class="talk-header" contenteditable="plaintext-only" spellcheck="false" @blur="changeName" v-text="memberName"></div>
      <draggable :disabled="dragDisabled" v-model="msgs" forceFallback="false" animation="500" group="msgs" filter=".immovable">
        <transition-group>
          <div class="talk-item" v-for="item in msgs" :key="item.id" :ref="'item' + item.id">
            <div class="talk-avatar" contenteditable="true" @drop="setAvatar($event)">
              <img :src="avartarSrc" />
            </div>
            <div class="talk-msg" @drop="addImage($event, item)">
              <div class="msg-info">
                <div v-text="memberName"></div>
                <div style="min-width: 30px" contenteditable="true" spellcheck="false" v-text="item.time"></div>
              </div>
              <div class="msg-bubble">
                <div class="mask immovable" :class="item.type" @click="hideMask($event, 'item' + item.id)" v-html="maskIcon[item.type]"></div>
                <div class="content-wrapper">
                  <img @dblclick="removeImg($event, item)" hidden crossorigin="anonymous" contenteditable />
                  <div
                    class="msg-content"
                    v-bind:style="{ minHeight: item.type == 'image' ? '150px' : '20px' }"
                    contenteditable="true"
                    spellcheck="false"
                    v-if="item.type !== 'voice'"
                    @paste="contentPaste"
                  >{{ item.content }}</div>
                  <div class="msg-content" v-if="item.type === 'voice'">
                    <div class="voice-wrapper">
                      <i class="fa fa-solid fa-volume-up volume-icon"></i>
                      <div class="voice-content" contenteditable="true" spellcheck="false" v-text="item.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <nav-buttons :buttonConfigs="buttonConfig" />
  </div>
</template>

<script>
// 导入draggable组件
import draggable from 'vuedraggable'
import html2canvas from 'html2canvas'
import twemoji from 'twemoji'
import NavButtons from '../components/NavButtons.vue'
import '@/assets/css/common.css'
export default {
  name: 'Msg',
  // 注册draggable组件
  components: {
    NavButtons,
    draggable
  },
  data() {
    return {
      dragDisabled: false,
      memberName: '日向坂46',
      avartarSrc: require('@/assets/img/avatar/hnt_logo.svg'),
      members: [
        { name: '潮 紗理菜', avatar: require('@/assets/img/avatar/sarina.jpg') },
        { name: '影山 優佳', avatar: require('@/assets/img/avatar/yuuka.jpg') },
        { name: '加藤 史帆', avatar: require('@/assets/img/avatar/shiho.jpg') },
        { name: '齊藤 京子', avatar: require('@/assets/img/avatar/kyonko.jpg') },
        { name: '佐々木 久美', avatar: require('@/assets/img/avatar/kumi.jpg') },
        { name: '佐々木 美玲', avatar: require('@/assets/img/avatar/mirei.jpg') },
        { name: '高瀬 愛奈', avatar: require('@/assets/img/avatar/manafi.jpg') },
        { name: '高本 彩花', avatar: require('@/assets/img/avatar/ayaka.jpg') },
        { name: '東村 芽依', avatar: require('@/assets/img/avatar/meimei.jpg') },
        { name: '金村 美玖', avatar: require('@/assets/img/avatar/miku.jpg') },
        { name: '河田 陽菜', avatar: require('@/assets/img/avatar/hina.jpg') },
        { name: '小坂 菜緒', avatar: require('@/assets/img/avatar/nao.jpg') },
        { name: '富田 鈴花', avatar: require('@/assets/img/avatar/suzuka.jpg') },
        { name: '丹生 明里', avatar: require('@/assets/img/avatar/akari.jpg') },
        { name: '濱岸 ひより', avatar: require('@/assets/img/avatar/hiyori.jpg') },
        { name: '松田 好花', avatar: require('@/assets/img/avatar/konoka.jpg') },
        { name: '宮田 愛萌', avatar: require('@/assets/img/avatar/manamo.jpg') },
        { name: '渡邉 美穂', avatar: require('@/assets/img/avatar/miho.jpg') },
        { name: '上村 ひなの', avatar: require('@/assets/img/avatar/hinano.jpg') },
        { name: '髙橋 未来虹', avatar: require('@/assets/img/avatar/mikuni.jpg') },
        { name: '森本 茉莉', avatar: require('@/assets/img/avatar/marie.jpg') },
        { name: '山口 陽世', avatar: require('@/assets/img/avatar/haruyo.jpg') }
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
        normal: '<i class="fa fa-solid fa-comment" style="font-size:45px;color:white"></i>',
        image:
          '<svg t="1629478159872" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40920" width="50" height="50"><path d="M213.333333 473.6l85.333334-85.333333 234.666666 234.666666 149.333334-149.333333 128 128V213.333333H213.333333v260.266667zM170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m490.666666 298.666667a64 64 0 1 1 0-128 64 64 0 0 1 0 128z" p-id="40921" fill="#ffffff"></path></svg>',
        voice:
          '<svg t="1629478496186" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="64042" width="50" height="50"><path d="M462.06 142.1L284.12 320H80c-26.52 0-48 21.48-48 48v288c0 26.5 21.48 48 48 48h204.12l177.94 177.9c30.06 30.06 81.94 8.94 81.94-33.94V176.04c0-42.92-51.92-63.96-81.94-33.94zM992 512c0-127.06-64.12-243.88-171.54-312.48-22.38-14.28-52.06-7.64-66.24 14.92s-7.56 52.42 14.82 66.72C848.54 331.94 896 418.22 896 512s-47.46 180.06-126.96 230.84c-22.38 14.28-29 44.14-14.82 66.72 13.02 20.72 42.24 30.28 66.24 14.92C927.88 755.88 992 639.06 992 512z m-283.54-153.74c-23.16-12.66-52.38-4.32-65.22 18.9-12.78 23.22-4.32 52.4 18.9 65.22C687.96 456.56 704 483.26 704 512c0 28.76-16.04 55.44-41.84 69.62-23.22 12.82-31.68 42-18.9 65.22 12.86 23.32 42.1 31.6 65.22 18.9 56.46-31.1 91.54-90 91.54-153.76s-35.08-122.64-91.56-153.72z" p-id="64043" fill="#ffffff"></path></svg>'
      },
      buttonConfig: [
        { color: 'blue', icon: 'fa fa-solid fa-plus', func: 'addMsg', args: ['normal'] },
        { color: 'green', icon: 'fa fa-solid fa-image', func: 'addMsg', args: ['image'] },
        { color: 'red', icon: 'fa fa-solid fa-home', func: 'to', args: ['/'] },
        { color: 'purple', icon: 'fa fa-solid fa-download', func: 'toImage', args: [] },
        { color: 'orange', icon: 'fa fa-solid fa-trash', func: 'removeMsg', args: [] },
        { color: 'lightblue', icon: 'fa fa-solid fa-microphone', func: 'addMsg', args: ['voice'] }
      ]
    }
  },
  methods: {
    to(target) {
      if (confirm('确定要跳转吗？')) {
        this.$router.push(target)
      }
    },
    hideMask(e, msgItemRef) {
      const _target = e.currentTarget
      _target.classList.add('remove-mask')
      const msgItem = this.$refs[msgItemRef][0]
      msgItem.classList.add('immovable')
      setTimeout(() => {
        _target.style.display = 'none'
        msgItem.classList.remove('immovable')
      }, 1000)
    },
    changeName(e) {
      this.memberName = e.currentTarget.innerText
    },
    selectMember() {
      const selected = this.members.find(item => {
        return item.name === this.memberName
      })
      this.avartarSrc = selected.avatar
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
    addMsg(type) {
      let msg = {
        id: Date.now(),
        time: new Date().format('MM/dd hh:mm'),
        type
      }
      Object.assign(msg, this.type[type])
      this.msgs.push(msg)
    },
    removeMsg() {
      this.msgs.pop()
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
      return twemoji.parse(plainText.replace(exp, "<a href='$1'>$1</a>"), {
        attributes: () => {
          return { crossorigin: 'anonymous' }
        }
      })
    }
  }
}
</script>

<style scoped>
#home {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
  font-family: 'Noto Sans SC';
}
.container {
  margin: 20px;
  width: 500px;
  min-width: 500px;
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
/* 消息相关css */
.talk-item {
  display: flex;
  justify-content: start;
  align-items: flex-start;
  margin-top: 1em;
  margin-right: 5px;
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
.talk-msg {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  width: -moz-calc(100% - 5em);
  width: -webkit-calc(100% - 5em);
  width: calc(100% - 5.5em);
  overflow: hidden;
}
.msg-info {
  width: 95%;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: gray;
}

/* 气泡相关css */
.msg-bubble {
  margin-top: 0.5em;
  position: relative;
  width: 97%;
  background-color: #f6f6f6;
  display: inline-block;
  font-size: 1em;
  border-radius: 2%;
  text-align: center;
}
.msg-bubble:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -10px;
  right: auto;
  top: 10px;
  bottom: auto;
  border-top: 15px solid #f6f6f6;
  border-left: 10px solid transparent;
  z-index: 0;
}
/* 气泡mask相关css */
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 2%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
@keyframes mask-slide {
  0% {
    left: 0%;
  }
  25% {
    left: -2em;
  }
  100% {
    left: calc(100% + 10px);
  }
}
.remove-mask {
  animation: mask-slide 1s;
  animation-fill-mode: forwards;
}
.normal {
  background-color: #aaddf0;
}
.normal:after {
  border-top: 15px solid #aaddf0;
}
.image {
  background-color: #aacaf0;
}
.image:after {
  border-top: 15px solid #aacaf0;
}
.voice {
  background-color: #b8abf0;
}
.voice:after {
  border-top: 15px solid #b8abf0;
}
.video {
  background-color: #d4abf1;
}
.video:after {
  border-top: 15px solid #d4abf1;
}
.mask:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -10px;
  right: auto;
  top: 10px;
  bottom: auto;
  border-left: 11px solid transparent;
  z-index: 1;
}
/* 气泡内容相关css */
.content-wrapper {
  padding: 0.5em;
}
.msg-bubble .content-wrapper img {
  padding: 0.5em;
  width: 80%;
}
.msg-content {
  padding: 0.5em;
  text-align: left;
  line-height: 1.8em;
  -webkit-user-modify: 'read-write-plaintext-only';
}

.msg-content:focus-visible {
  outline: #8ec4e6 auto 1px;
}

.voice-wrapper {
  height: 2em;
}
.volume-icon {
  background: #879fc1;
  border: 3px solid #879fc1;
  border-radius: 100%;
  width: 25px;
  height: 25px;
  line-height: 25px;
  color: #fefefe;
  text-align: center;
  position: absolute;
  left: 48%;
  margin-left: -15px;
  font-size: 20px;
}
.voice-content {
  margin-left: calc(48% + 25px);
  color: #879fc1;
  font-size: 20px;
  line-height: 30px;
}
</style>