<template>
  <div id="home">
    <div class="container" ref="imageWrapper">
      <div
        :class="['talk-header','talk-header-'+group]"
        contenteditable="plaintext-only"
        spellcheck="false"
        @blur="changeName"
        v-text="memberName"
      ></div>
      <draggable :disabled="dragDisabled" v-model="msgs" forceFallback="false" animation="500" group="msgs" filter=".immovable">
        <transition-group>
          <div class="talk-item" v-for="item in msgs" :key="item.id" :ref="'item' + item.id">
            <div class="talk-avatar" contenteditable="true" @drop="setAvatar($event)">
              <img :src="avatarSrc" />
            </div>
            <div class="talk-msg" @drop="addImage($event, item)">
              <div class="msg-info">
                <div v-text="memberName"></div>
                <div
                  style="min-width: 30px"
                  contenteditable="true"
                  spellcheck="false"
                  @blur="syncTime($event.target,item)"
                  v-text="item.time"
                ></div>
              </div>
              <div class="msg-bubble">
                <div
                  class="immovable"
                  v-bind:class="[item.type,item.type+'-'+group,'mask','mask-'+group]"
                  @click="hideMask($event, 'item' + item.id)"
                  v-html="maskIcon[item.type]"
                ></div>
                <div class="content-wrapper">
                  <img @dblclick="removeImg($event, item)" hidden crossorigin="anonymous" contenteditable />
                  <div class="msg-content" v-if="item.type === 'voice'">
                    <div class="voice-wrapper">
                      <div :class="['progress','progress-'+group]"></div>
                      <div class="control-group">
                        <font-awesome-icon icon="fa-solid fa-volume-up" class="controls"></font-awesome-icon>
                        <font-awesome-icon icon="fa-solid fa-play" class="controls"></font-awesome-icon>
                        <div
                          class="controls"
                          contenteditable="true"
                          spellcheck="false"
                          @blur="syncContent($event.target,item)"
                          v-html="item.content"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="msg-content"
                    v-bind:style="{ minHeight: item.type == 'image' ? '150px' : '20px' }"
                    contenteditable="true"
                    spellcheck="false"
                    v-else
                    @paste="contentPaste"
                    @blur="syncContent($event.target,item)"
                    v-html="item.content"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <nav-card class="nav-card" :cards="settingCards" :width="270" :height="340" :group="group">
      <div slot="成员" class="member-grid">
        <div v-for="member in members" :key="member.name">
          <div class="select-avatar-wrapper">
            <img :src="member.avatar" class="select-avatar" @click="chooseMember(member.name,member.avatar,false)" />
          </div>
          <p>{{member.name}}</p>
        </div>
      </div>
      <div slot="常用">
        <div class="member-grid">
          <div v-for="(member,index) in recentMembers" :key="index">
            <div class="select-avatar-wrapper">
              <img
                :src="member.avatar"
                class="select-avatar"
                @click="chooseMember(member.name,member.avatar,true)"
                @dblclick="removeCache(index)"
              />
            </div>
            <p>{{member.name}}</p>
          </div>
        </div>
        <p v-show="cacheable&&!recentMembers.length">
          1.最多可缓存6个,超过后删除最早创建的。
          <br />2.双击删除该缓存。
          <br />3.缓存质量可能有损。
          <br />4.无痕模式下关闭后缓存消失。
        </p>
        <p v-show="!cacheable">当前浏览器设置不支持使用localStorage进行缓存。</p>
        <button @click="cacheAvatar()" style="width:135px;height:30px;position:absolute;bottom:0;left:0;cursor: pointer">缓存</button>
        <button @click="clearCache()" style="width:135px;height:30px;position:absolute;bottom:0;right:0;cursor: pointer">清空</button>
      </div>
      <div slot="msg缓存">
        <div class="member-grid">
          <div v-for="(item,index) in recentMsgs" :key="index">
            <div class="select-avatar-wrapper">
              <img
                :src="item.avatar"
                class="select-avatar"
                @click="loadMsgs(item.name,item.avatar,item.msgs)"
                @dblclick="removeMsgsCache(index)"
              />
            </div>
            <p>
              {{item.name}}
              <br />
              {{item.date}}
            </p>
          </div>
        </div>
        <p v-show="cacheable&&!recentMsgs.length">
          1.最多可缓存6个,超过后删除最早创建的。
          <br />2.双击删除该缓存。
          <br />3.不缓存图片。
          <br />4.无痕模式下关闭后缓存消失。
        </p>
        <p v-show="!cacheable">当前浏览器设置不支持使用localStorage进行缓存。</p>
        <button @click="cacheMsgs()" style="width:135px;height:30px;position:absolute;bottom:0px;left:0;cursor: pointer">缓存</button>
        <button @click="clearMsgsCache()" style="width:135px;height:30px;position:absolute;bottom:0px;right:0;cursor: pointer">清空</button>
      </div>
    </nav-card>
    <nav-buttons :buttonConfigs="buttonConfig" />
  </div>
</template>

<script>
// 导入draggable组件
import draggable from 'vuedraggable'
import html2canvas from 'html2canvas'
import twemoji from 'twemoji'
import NavButtons from '../components/NavButtons'
import NavCard from '../components/NavCard'
import '@/assets/css/common.css'
export default {
  name: 'Msg',
  // 注册draggable组件
  components: {
    draggable,
    NavButtons,
    NavCard
  },
  data() {
    return {
      settingCards: [{ name: '成员' }, { name: '常用' }, { name: 'msg缓存' }],
      recentMembers: [],
      recentMsgs: [],
      dragDisabled: false,
      group: 'hinata',
      cacheable: false,
      memberName: '日向坂46',
      avatarSrc: require('@/assets/img/avatar/hinata/hinata_logo.png'),
      sakuraAvatar: require('@/assets/img/avatar/sakura/sakura_logo.jpg'),
      nogiAvatar: require('@/assets/img/avatar/nogi/nogi_logo.png'),
      hinataMember: [
        { name: '潮 紗理菜', avatar: require('@/assets/img/avatar/hinata/sarina.jpg') },
        { name: '影山 優佳', avatar: require('@/assets/img/avatar/hinata/yuuka.jpg') },
        { name: '加藤 史帆', avatar: require('@/assets/img/avatar/hinata/shiho.jpg') },
        { name: '齊藤 京子', avatar: require('@/assets/img/avatar/hinata/kyonko.jpg') },
        { name: '佐々木 久美', avatar: require('@/assets/img/avatar/hinata/kumi.jpg') },
        { name: '佐々木 美玲', avatar: require('@/assets/img/avatar/hinata/mirei.jpg') },
        { name: '高瀬 愛奈', avatar: require('@/assets/img/avatar/hinata/manafi.jpg') },
        { name: '高本 彩花', avatar: require('@/assets/img/avatar/hinata/ayaka.jpg') },
        { name: '東村 芽依', avatar: require('@/assets/img/avatar/hinata/meimei.jpg') },
        { name: '金村 美玖', avatar: require('@/assets/img/avatar/hinata/miku.jpg') },
        { name: '河田 陽菜', avatar: require('@/assets/img/avatar/hinata/hina.jpg') },
        { name: '小坂 菜緒', avatar: require('@/assets/img/avatar/hinata/nao.jpg') },
        { name: '富田 鈴花', avatar: require('@/assets/img/avatar/hinata/suzuka.jpg') },
        { name: '丹生 明里', avatar: require('@/assets/img/avatar/hinata/akari.jpg') },
        { name: '濱岸 ひより', avatar: require('@/assets/img/avatar/hinata/hiyori.jpg') },
        { name: '松田 好花', avatar: require('@/assets/img/avatar/hinata/konoka.jpg') },
        { name: '宮田 愛萌', avatar: require('@/assets/img/avatar/hinata/manamo.jpg') },
        { name: '渡邉 美穂', avatar: require('@/assets/img/avatar/hinata/miho.jpg') },
        { name: '上村 ひなの', avatar: require('@/assets/img/avatar/hinata/hinano.jpg') },
        { name: '髙橋 未来虹', avatar: require('@/assets/img/avatar/hinata/mikuni.jpg') },
        { name: '森本 茉莉', avatar: require('@/assets/img/avatar/hinata/marie.jpg') },
        { name: '山口 陽世', avatar: require('@/assets/img/avatar/hinata/haruyo.jpg') }
      ],
      sakuraMember: [],
      nogiMember: [],
      // 定义要被拖拽对象的数组
      msgs: [
        {
          id: Date.now(),
          time: new Date().format('M/dd hh:mm'),
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
          '<svg t="1645534977043" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19021" width="50" height="50"><path d="M512 898.8c57.8 0 112.8-11.4 162.6-31.8 1.2-0.6 2.2-1 3.4-1.4 0.2 0 0.4 0 0.4-0.2 7-2.6 14.6-4 22.4-4 8.6 0 16.8 1.6 24.2 4.8l168 61.8-44.2-176.8c0-10.6 3-20.6 7.8-29.2 0 0 0 0 0 0 1.6-2.6 3.2-5.2 5-7.4 41.8-62.6 66-137 66-216.8C928 275.8 741.8 96 512 96 282.2 96 96 275.8 96 497.4 96 719.2 282.2 898.8 512 898.8z" p-id="19022"></path></svg>',
        image:
          '<svg t="1629478159872" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40920" width="50" height="50"><path d="M213.333333 473.6l85.333334-85.333333 234.666666 234.666666 149.333334-149.333333 128 128V213.333333H213.333333v260.266667zM170.666667 128h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m490.666666 298.666667a64 64 0 1 1 0-128 64 64 0 0 1 0 128z" p-id="40921" ></path></svg>',
        voice:
          '<svg t="1629478496186" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="64042" width="50" height="50"><path d="M462.06 142.1L284.12 320H80c-26.52 0-48 21.48-48 48v288c0 26.5 21.48 48 48 48h204.12l177.94 177.9c30.06 30.06 81.94 8.94 81.94-33.94V176.04c0-42.92-51.92-63.96-81.94-33.94zM992 512c0-127.06-64.12-243.88-171.54-312.48-22.38-14.28-52.06-7.64-66.24 14.92s-7.56 52.42 14.82 66.72C848.54 331.94 896 418.22 896 512s-47.46 180.06-126.96 230.84c-22.38 14.28-29 44.14-14.82 66.72 13.02 20.72 42.24 30.28 66.24 14.92C927.88 755.88 992 639.06 992 512z m-283.54-153.74c-23.16-12.66-52.38-4.32-65.22 18.9-12.78 23.22-4.32 52.4 18.9 65.22C687.96 456.56 704 483.26 704 512c0 28.76-16.04 55.44-41.84 69.62-23.22 12.82-31.68 42-18.9 65.22 12.86 23.32 42.1 31.6 65.22 18.9 56.46-31.1 91.54-90 91.54-153.76s-35.08-122.64-91.56-153.72z" p-id="64043"></path></svg>'
      },
      buttonConfig: [
        { color: 'blue', icon: 'fa-solid fa-plus', func: 'addMsg', args: ['normal'] },
        { color: 'green', icon: 'fa-solid fa-image', func: 'addMsg', args: ['image'] },
        { color: 'red', icon: 'fa-solid fa-home', func: 'to', args: ['/'] },
        { color: 'purple', icon: 'fa-solid fa-download', func: 'toImage', args: [] },
        { color: 'orange', icon: 'fa-solid fa-trash', func: 'removeMsg', args: [] },
        { color: 'lightblue', icon: 'fa-solid fa-microphone', func: 'addMsg', args: ['voice'] }
      ]
    }
  },
  computed: {
    members() {
      switch (this.group) {
        case 'sakura':
          return this.sakuraMember
        case 'nogi':
          return this.nogiMember
        case 'hinata':
        default:
          return this.hinataMember
      }
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
    chooseMember(name, src, isCache) {
      this.memberName = name
      this.avatarSrc = src
      this.isCache = isCache
    },
    setAvatar(e) {
      e.stopPropagation()
      e.preventDefault()
      const _this = this
      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.dataTransfer.files[0])
      fileReader.addEventListener('load', function () {
        // res是base64格式的图片
        _this.avatarSrc = fileReader.result
        _this.isCache = false
      })
    },
    addMsg(type) {
      let msg = {
        id: Date.now(),
        time: new Date().format('M/dd hh:mm'),
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
      aLink.download = this.memberName + '_' + new Date().format('MMdd') + '.png'
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },
    syncContent(target, item) {
      item.content = target.innerHTML
    },
    syncTime(target, item) {
      item.time = target.innerHTML
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
    },
    localStorageAvailable() {
      if (window.Storage && window.localStorage && window.localStorage instanceof Storage) {
        return true
      } else {
        return false
      }
    },
    cacheAvatar() {
      if (this.cacheable) {
        const name = this.memberName
        const src = this.getAvatarDataUrl()
        if (this.recentMembers.length >= 6) {
          this.recentMembers.pop()
        }
        this.recentMembers.unshift({ name: name, avatar: src })
        try {
          localStorage.setItem(this.group + 'RecentMembers', JSON.stringify(this.recentMembers))
        } catch (e) {
          alert('缓存失败')
          console.log('Storage failed: ' + e)
        }
      }
    },
    clearCache() {
      if (this.cacheable) {
        this.recentMembers = []
        try {
          localStorage.setItem(this.group + 'RecentMembers', JSON.stringify(this.recentMembers))
        } catch (e) {
          alert('清空缓存失败')
          console.log('Storage failed: ' + e)
        }
      }
    },
    getAvatarDataUrl() {
      const img = document.querySelector('.talk-item .talk-avatar img')
      const ratio = 4
      let imgCanvas = document.createElement('canvas')
      let imgContext = imgCanvas.getContext('2d')
      imgCanvas.height = img.height * ratio
      imgCanvas.width = img.width * ratio
      imgContext.drawImage(img, 0, 0, img.width * ratio, img.height * ratio)
      return imgCanvas.toDataURL('image/png')
    },
    removeCache(index) {
      this.recentMembers.splice(index, 1)
      try {
        localStorage.setItem(this.group + 'RecentMembers', JSON.stringify(this.recentMembers))
      } catch (e) {
        alert('缓存失败')
        console.log('Storage failed: ' + e)
      }
    },

    cacheMsgs() {
      if (this.cacheable && this.msgs.length > 0) {
        try {
          let cacheObj = {
            date: new Date().format('MM-dd hh:mm:ss'),
            msgs: JSON.stringify(this.msgs),
            name: this.memberName,
            avatar: this.avatarSrc
          }

          if (this.recentMsgs.length >= 6) {
            this.recentMsgs.pop()
          }
          this.recentMsgs.unshift(cacheObj)
          localStorage.setItem(this.group + 'RecentMsgs', JSON.stringify(this.recentMsgs))
          console.log('msgs saved')
        } catch (e) {
          console.log('cache msg failed: ' + e)
        }
      }
    },
    clearMsgsCache() {
      if (this.cacheable) {
        this.recentMsgs = []
        try {
          localStorage.setItem(this.group + 'RecentMsgs', JSON.stringify(this.recentMsgs))
        } catch (e) {
          alert('清空缓存失败')
          console.log('Storage failed: ' + e)
        }
      }
    },
    loadMsgs(name, src, msgsStr) {
      this.memberName = name
      this.avatarSrc = src

      this.msgs.length = 0
      let msgs = JSON.parse(msgsStr)
      msgs.forEach(element => {
        this.msgs.push(element)
      })
    },
    removeMsgsCache(index) {
      if (!confirm('确定要清除该缓存吗？')) {
        return
      }
      this.recentMsgs.splice(index, 1)
      try {
        localStorage.setItem(this.group + 'RecentMsgs', JSON.stringify(this.recentMsgs))
      } catch (e) {
        alert('清空缓存失败')
        console.log('Storage failed: ' + e)
      }
    }
  },
  mounted() {
    switch (this.$route.params.group) {
      case 'sakura':
        this.memberName = '櫻坂46'
        this.avatarSrc = this.sakuraAvatar
        this.group = 'sakura'
        break
      case 'nogi':
        this.memberName = '乃木坂46'
        this.avatarSrc = this.nogiAvatar
        this.group = 'nogi'
        break
      default:
        this.group = 'hinata'
    }

    if (this.localStorageAvailable()) {
      this.cacheable = true
      let recentMembers = JSON.parse(localStorage.getItem(this.group + 'RecentMembers'))
      if (recentMembers && recentMembers instanceof Array) {
        this.recentMembers = recentMembers
      }
      let recentMsgs = JSON.parse(localStorage.getItem(this.group + 'RecentMsgs'))
      if (recentMsgs && recentMsgs instanceof Array) {
        this.recentMsgs = recentMsgs
      }
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: u0800;
  src: url('../assets/css/u0800.woff');
}

#home {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
  font-family: 'PingFang SC', 'Noto Sans SC Regular', u0800;
}

.nav-card {
  bottom: 700px;
  right: 57px;
  position: fixed;
}

.member-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  overflow: auto;
  height: inherit;
  column-gap: 10px;
  text-align: center;
}

.select-avatar-wrapper {
  width: 60px;
  height: 60px;
  overflow: hidden;
  margin: 5px auto;

  border-radius: 50%;
}

.select-avatar {
  width: 100%;

  min-height: 100%;
  object-fit: cover;
}

.select-avatar:hover {
  cursor: pointer;
}

.container {
  margin: 20px;
  width: 500px;
  min-width: 500px;
  min-height: 200px;
  background-color: #fefefe;
  padding-bottom: 20px;
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

.talk-header-sakura {
  background: white;
  color: #f390b1;
  background-image: linear-gradient(to right, white 5%, #f390b1 65%, #a254a5);
  background-size: 100% 2px;
  background-position: bottom;
  background-repeat: no-repeat;
}

.talk-header-nogi {
  background: linear-gradient(to right, #c485e6, #933fb9 100%);
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
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  fill: white;
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

.mask-sakura:after {
  left: -12px;
  top: 8px;
}

.mask-sakura:before {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -8px;
  right: auto;
  top: 10px;
  bottom: auto;
  z-index: 2;
  border: 11px solid;
  border-top: 15px solid white;
  border-color: white transparent transparent transparent;
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

.normal-sakura {
  color: #ea94ad;
  fill: #ea94ad;
  box-sizing: border-box;
  border: #ea94ad 2px solid;
  background-color: white;
}

.normal-nogi {
  background-color: #aa96ef;
}

.normal:after {
  border-top: 15px solid #aaddf0;
}

.normal-sakura:after {
  border-top: 15px solid #ea94ad;
}

.normal-nogi:after {
  border-top: 15px solid #aa96ef;
}

.image {
  background-color: #aacaf0;
}

.image-sakura {
  color: #ea9493;
  fill: #ea9493;
  box-sizing: border-box;
  border: #ea9493 2px solid;
  background-color: white;
}

.image-nogi {
  background-color: #ee92d5;
}

.image:after {
  border-top: 15px solid #aacaf0;
}

.image-sakura:after {
  border-top: 15px solid #ea9493;
}

.image-nogi:after {
  border-top: 15px solid #ee92d5;
}

.voice {
  background-color: #b8abf0;
}

.voice-sakura {
  color: #d494eb;
  fill: #d494eb;
  box-sizing: border-box;
  border: #d494eb 2px solid;
  background-color: white;
}

.voice-nogi {
  background-color: #d39df3;
}

.voice:after {
  border-top: 15px solid #b8abf0;
}

.voice-sakura:after {
  border-top: 15px solid #d494eb;
}

.voice-nogi:after {
  border-top: 15px solid #d39df3;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 5.7em;
}

.progress {
  width: 85%;
  height: 0.3em;
  border-radius: 1em;
  touch-action: none;
  background-color: #e5e7ea;
  align-items: center;
  line-height: 0.5em;

  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 40px;
}

.progress::before {
  width: 0.8em;
  content: ' ';
  height: 0.8em;
  border-radius: 50%;
  position: absolute;
  background-color: #8f34b4;
}

.progress-sakura::before {
  background-color: #ed93b1;
}

.control-group {
  width: 80%;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.controls:nth-child(1) {
  width: 26%;
  height: 35px;
  line-height: 25px;
  color: #b2b2b2;
  text-align: center;
}

.controls:nth-child(2) {
  width: 26%;
  height: 35px;
  line-height: 25px;
  color: #6f6f6f;
  text-align: center;
}

.controls:nth-child(3) {
  width: 26%;
  height: 35px;
  font-size: 1.2em;
  line-height: 35px;
  color: #b2b2b2;
  text-align: center;
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

.volume-icon-sakura {
  background: #d496eb;
  border: 3px solid #d496eb;
}

.voice-content {
  margin-left: calc(48% + 25px);
  color: #879fc1;
  font-size: 20px;
  line-height: 30px;
}
</style>
