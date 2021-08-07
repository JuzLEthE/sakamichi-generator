<template>
  <div id="home">
    <select
      v-model="memberName"
      @change="selectMember"
    >
      <option
        disabled
        value="请选择成员"
      >请选择成员</option>
      <option
        v-for="member in members"
        :key="member.name"
      >{{ member.name }}</option>
    </select>
    <div
      class="container"
      ref="imageWrapper"
    >
      <div
        class="talk-header"
        v-text="memberName"
      ></div>
      <draggable
        v-model="msgs"
        forceFallback="false"
        animation="500"
        group="msgs"
      >
        <transition-group>
          <div
            class="talk-item"
            v-for="item in msgs"
            :key="item.id"
            @drop="addImage($event,item)"
          >
            <div
              :style="avatarStyle"
              @dblclick="removeImg($event,item)"
            ></div>
            <div class="talk-msg">
              <div class="msg-info">
                <div v-text="memberName"></div>
                <div
                  style="min-width:30px"
                  contenteditable="true"
                  v-text="item.time"
                ></div>
              </div>
              <div class="msg-bubble">
                <img
                  @dblclick="removeImg($event,item)"
                  hidden
                />
                <div
                  class="msg-content"
                  contenteditable="true"
                  v-if="!item.voice"
                  v-on:paste="contentPaste"
                >{{item.content}}
                </div>
                <div
                  class="msg-content"
                  v-if="item.voice"
                ><i class="fa fa-solid fa-volume-up volume-icon"></i>
                  <div
                    class="voice-content"
                    contenteditable="true"
                    v-text="item.content"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <nav class="menu">
      <input
        type="checkbox"
        href="#"
        class="menu-open"
        name="menu-open"
        id="menu-open"
      />
      <label
        class="menu-open-button"
        for="menu-open"
      >
        <span class="lines line-1"></span>
        <span class="lines line-2"></span>
        <span class="lines line-3"></span>
      </label>

      <!-- 新增消息 -->
      <a
        href="#"
        @click="addMsg('normal')"
        class="menu-item blue"
      > <i class="fa fa-solid fa-plus"></i> </a>
      <!-- 新增仅图片消息 -->
      <a
        href="#"
        class="menu-item green"
        @click="addMsg('img')"
      > <i class="fa fa-solid fa-image"></i> </a>
      <!-- 选择成员 -->
      <a
        href="#"
        class="menu-item red"
      > <i class="fa fa-solid fa-user"></i> </a>
      <!-- 将html保存成图片 -->
      <a
        href="#"
        @click="toImage"
        class="menu-item purple"
      > <i class="fa fa-solid fa-download"></i> </a>
      <!-- 删除一条 -->
      <a
        href="#"
        @click="removeMsg"
        class="menu-item orange"
      > <i class="fa fa-solid fa-trash"></i> </a>
      <!-- 新增音频消息 -->
      <a
        href="#"
        @click="addMsg('voice')"
        class="menu-item lightblue"
      > <i class="fa fa-solid fa-microphone"></i> </a>
    </nav>

  </div>
</template>

<script>
// 导入draggable组件
import draggable from "vuedraggable";
import html2canvas from "html2canvas"
import twemoji from "twemoji"
import "@/assets/css/nav.css"
export default {
  name: "Home",
  // 注册draggable组件
  components: {
    draggable,
  },
  data () {
    return {
      memberName: "日向坂46",
      members: [
        { name: '潮 紗理菜', avatar: 'url(' + require('@/assets/img/avatar/sarina.jpg') + ')' },
        { name: '影山 優佳', avatar: 'url(' + require('@/assets/img/avatar/yuuka.jpg') + ')' },
        { name: '加藤 史帆', avatar: 'url(' + require('@/assets/img/avatar/shiho.jpg') + ')' },
        { name: '齊藤 京子', avatar: 'url(' + require('@/assets/img/avatar/kyonko.jpg') + ')' },
        { name: '佐々木 久美', avatar: 'url(' + require('@/assets/img/avatar/kumi.jpg') + ')' },
        { name: '佐々木 美玲', avatar: 'url(' + require('@/assets/img/avatar/mirei.jpg') + ')' },
        { name: '高瀬 愛奈', avatar: 'url(' + require('@/assets/img/avatar/manafi.jpg') + ')' },
        { name: '高本 彩花', avatar: 'url(' + require('@/assets/img/avatar/ayaka.jpg') + ')' },
        { name: '東村 芽依', avatar: 'url(' + require('@/assets/img/avatar/meimei.jpg') + ')' },
        { name: '金村 美玖', avatar: 'url(' + require('@/assets/img/avatar/miku.jpg') + ')' },
        { name: '河田 陽菜', avatar: 'url(' + require('@/assets/img/avatar/hina.jpg') + ')' },
        { name: '小坂 菜緒', avatar: 'url(' + require('@/assets/img/avatar/nao.jpg') + ')' },
        { name: '富田 鈴花', avatar: 'url(' + require('@/assets/img/avatar/suzuka.jpg') + ')' },
        { name: '丹生 明里', avatar: 'url(' + require('@/assets/img/avatar/akari.jpg') + ')' },
        { name: '濱岸 ひより', avatar: 'url(' + require('@/assets/img/avatar/hiyori.jpg') + ')' },
        { name: '松田 好花', avatar: 'url(' + require('@/assets/img/avatar/konoka.jpg') + ')' },
        { name: '宮田 愛萌', avatar: 'url(' + require('@/assets/img/avatar/manamo.jpg') + ')' },
        { name: '渡邉 美穂', avatar: 'url(' + require('@/assets/img/avatar/miho.jpg') + ')' },
        { name: '上村 ひなの', avatar: 'url(' + require('@/assets/img/avatar/hinano.jpg') + ')' },
        { name: '髙橋 未来虹', avatar: 'url(' + require('@/assets/img/avatar/mikuni.jpg') + ')' },
        { name: '森本 茉莉', avatar: 'url(' + require('@/assets/img/avatar/marie.jpg') + ')' },
        { name: '山口 陽世', avatar: 'url(' + require('@/assets/img/avatar/haruyo.jpg') + ')' },
      ],
      avatarStyle: {
        width: '3em',
        height: '3em',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundImage: 'url(' + require('@/assets/img/avatar/hnt_logo.svg') + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        margin: '5px 5px 5px 20px',
        display: 'inline-block',
      },
      // 定义要被拖拽对象的数组
      msgs: [],
      // 定义消息类型
      type: {
        "normal": {
          content: "带文字的消息，拖动本地图片到气泡上进行上传，双击图片取消。如需处理emoji或者超链接，请复制后粘贴到气泡中。",
          img: false,
          voice: false
        },
        "img": {
          content: "仅图片的消息，拖动本地图片到气泡上进行上传，双击图片删除本条消息。",
          img: true,
          voice: false
        },
        "voice": {
          content: "--:--",
          img: false,
          voice: true
        }
      }
    };
  },
  methods: {

    selectMember () {
      const selected = this.members.find(item => {
        return item.name === this.memberName
      })
      this.avatarStyle.backgroundImage = selected.avatar
    },

    addMsg (type) {
      let msg = { id: Date.now(), time: new Date().format("MM/dd hh:mm") }
      Object.assign(msg, this.type[type])
      this.msgs.push(msg)
    },
    removeMsg () {
      this.msgs.pop()
    },
    addImage (e, item) {
      console.log(e.currentTarget)
      e.stopPropagation()
      e.preventDefault()
      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.dataTransfer.files[0])
      let imgEl = e.currentTarget.getElementsByTagName("img")[0]
      if (item.img) {
        console.log(e.currentTarget)
        let content = e.currentTarget.getElementsByClassName("msg-content")[0]
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
    removeImg (e, item) {
      e.stopPropagation()
      e.preventDefault()
      e.currentTarget.src = null
      e.currentTarget.hidden = 'hidden'
      if (item.img) {
        this.msgs.splice(this.msgs.findIndex(msg => msg.id === item.id), 1)
      }
    },
    toImage () {
      html2canvas(this.$refs.imageWrapper, {
        allowTaint: true,
        scale: 4,
        dpi: 300,
      }).then(canvas => {
        let dataURL = canvas.toDataURL("image/png")
        setTimeout(() => {
          this.fileDownload(dataURL)
        }, 100);
      });
    },

    fileDownload (downloadUrl) {
      let aLink = document.createElement("a")
      aLink.style.display = "none"
      aLink.href = downloadUrl
      aLink.download = "msg.png"
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },

    contentPaste (e) {
      e.stopPropagation();
      e.preventDefault();
      let pastedText
      if (window.clipboardData && window.clipboardData.getData) {
        // 获取拷贝进剪切板指定格式的数据 (此处用的Text格式)
        pastedText = window.clipboardData.getData('Text')
      } else if ((e.clipboardData || e.originalEvent.clipboardData) && (e.clipboardData || e.originalEvent.clipboardData).getData) {
        pastedText = (e.originalEvent || e).clipboardData.getData('text/plain')
      }
      document.execCommand("insertHTML", false, this.handleEmojiLink(pastedText));
    },
    handleEmojiLink (plainText) {
      let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i;
      return twemoji.parse(plainText.replace(exp, "<a href='$1'>$1</a>"))
    }
  },
  created () {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  },
  mounted () {
    this.addMsg('normal')
  }
};
</script>

<style scoped>
#home {
  background: #37474f;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
  font-family: "Noto Sans SC";
}
.container {
  margin: 20px;
  width: 500px;
  min-width: 500px;
  min-height: 90vh;
  background-color: #fefefe;
  border-radius: 10px;
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
  border-radius: 10px 10px 0px 0px;
  font-size: 22px;
  color: white;
  text-align: center;
  line-height: 60px;
}

.talk-item {
  display: flex;
  justify-content: start;
  align-items: flex-start;
  margin-top: 0.5em;
  margin-right: 5px;
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
}
.msg-info {
  width: 95%;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: gray;
}

/* CSS talk bubble */
.msg-bubble {
  margin-top: 0.5em;
  position: relative;
  width: 95%;
  background-color: #f6f6f6;
  display: inline-block;
  font-size: 1em;
  border-radius: 2%;
  text-align: center;
  padding: 0.5em;
}
.msg-bubble:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -10px;
  right: auto;
  top: 10px;
  bottom: auto;
  border-top: 15px solid #f6f6f6;
  border-left: 10px solid transparent;
}
.msg-bubble img {
  padding: 0.5em;
  width: 80%;
}
/* talk bubble contents */
.msg-content {
  padding: 0.5em;
  text-align: left;
  line-height: 1.8em;
  -webkit-user-modify: "read-write-plaintext-only";
}
.msg-content:focus-visible {
  outline: #8ec4e6 auto 1px;
}

.volume-icon {
  background: #879fc1;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #fefefe;
  text-align: center;
  position: absolute;
  left: 50%;
  margin-left: -15px;
  font-size: 20px;
}
.voice-content {
  margin-left: calc(50% + 25px);
  color: #879fc1;
  font-size: 20px;
}
</style>
