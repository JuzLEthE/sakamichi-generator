<template>
  <div id="home">
    <select
      v-model="selectedMember"
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
        forceFallback="true"
        animation="500"
        group="msgs"
        style="flex:auto"
      >
        <transition-group
          tag="div"
          class="transition-group"
        >
          <div
            class="talk-item"
            v-for="item in msgs"
            :key="item.id"
            @drop="addImage"
          >
            <div :style="avatarStyleObject"></div>
            <div class="talk-msg">
              <div class="msg-info">
                <div
                  class="msg-member"
                  v-text="memberName"
                ></div>
                <div
                  style="min-width:30px"
                  contenteditable="true"
                  v-text="item.time"
                ></div>
              </div>
              <div class="msg-bubble">
                <img
                  class="msg-img"
                  @dblclick="removeImg($event,item)"
                  hidden
                />
                <div
                  class="talktext"
                  contenteditable="true"
                  v-text="item.content"
                >
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
import "@/assets/css/nav.css"
export default {
  name: "Home",
  // 注册draggable组件
  components: {
    draggable,
  },
  data () {
    return {
      memberName: "成员名字",
      selectedMember: "",
      members: [
        { name: '潮 紗理菜', avatar: 'url(' + require('@/assets/sarina.jpg') + ')' },
        { name: '影山 優佳', avatar: 'url(' + require('@/assets/yuuka.jpg') + ')' },
        { name: '加藤 史帆', avatar: 'url(' + require('@/assets/shiho.jpg') + ')' },
        { name: '齊藤 京子', avatar: 'url(' + require('@/assets/kyonko.jpg') + ')' },
        { name: '佐々木 久美', avatar: 'url(' + require('@/assets/kumi.jpg') + ')' },
        { name: '佐々木 美玲', avatar: 'url(' + require('@/assets/mirei.jpg') + ')' },
        { name: '高瀬 愛奈', avatar: 'url(' + require('@/assets/manafi.jpg') + ')' },
        { name: '高本 彩花', avatar: 'url(' + require('@/assets/ayaka.jpg') + ')' },
        { name: '東村 芽依', avatar: 'url(' + require('@/assets/meimei.jpg') + ')' },
        { name: '金村 美玖', avatar: 'url(' + require('@/assets/miku.jpg') + ')' },
        { name: '河田 陽菜', avatar: 'url(' + require('@/assets/hina.jpg') + ')' },
        { name: '小坂 菜緒', avatar: 'url(' + require('@/assets/nao.jpg') + ')' },
        { name: '富田 鈴花', avatar: 'url(' + require('@/assets/suzuka.jpg') + ')' },
        { name: '丹生 明里', avatar: 'url(' + require('@/assets/akari.jpg') + ')' },
        { name: '濱岸 ひより', avatar: 'url(' + require('@/assets/hiyori.jpg') + ')' },
        { name: '松田 好花', avatar: 'url(' + require('@/assets/konoka.jpg') + ')' },
        { name: '宮田 愛萌', avatar: 'url(' + require('@/assets/manamo.jpg') + ')' },
        { name: '渡邉 美穂', avatar: 'url(' + require('@/assets/miho.jpg') + ')' },
        { name: '上村 ひなの', avatar: 'url(' + require('@/assets/hinano.jpg') + ')' },
        { name: '髙橋 未来虹', avatar: 'url(' + require('@/assets/mikuni.jpg') + ')' },
        { name: '森本 茉莉', avatar: 'url(' + require('@/assets/marie.jpg') + ')' },
        { name: '山口 陽世', avatar: 'url(' + require('@/assets/haruyo.jpg') + ')' },
      ],
      avatarStyleObject: {
        width: '3em',
        height: '3em',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundImage: 'url(' + require('@/assets/金村 美玖.jpg') + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        margin: '5px 5px 5px 20px',
        display: 'inline-block',
      },
      // 定义要被拖拽对象的数组
      msgs: [
        {
          // 时间
          time: "1/1 11:11",
          // 内容
          content: "带文字的消息，拖动本地图片到气泡上进行上传，双击图片取消。",
          // id
          id: 1,
          img: false,
          voice: false,
        },
      ],
      // 定义消息类型
      type: {
        "normal": {
          time: "8/7 上午 2:45",
          content: "带文字的消息，拖动本地图片到气泡上进行上传，双击图片取消。",
          img: false,
          voice: false
        },
        "img": {
          time: "8/7 上午 2:45",
          content: "仅图片的消息，拖动本地图片到气泡上进行上传，双击图片删除本条消息。",
          img: true,
          voice: false
        },
        "voice": {
          time: "8/7 上午 2:45",
          content: "请输入音频时长。",
          img: false,
          voice: true
        }
      }
    };
  },
  methods: {
    addMsg (type) {
      let msg = {}
      Object.assign(msg, this.type[type])
      msg.id = Date.now()
      this.msgs.push(msg)
    },
    removeMsg () {
      this.msgs.pop()
    },
    addImage (e) {
      e.stopPropagation()
      e.preventDefault()
      let fileData = e.dataTransfer.files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(fileData)
      let imgEl = e.currentTarget.getElementsByClassName("msg-img")[0]
      console.log(imgEl)
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
      if (item.onlyImg) {
        this.msgs.filter(item => item.id !== item.id)
        return
      }
      e.currentTarget.src = null
      e.currentTarget.hidden = 'hidden'
    },
    toImage () {
      html2canvas(this.$refs.imageWrapper, {
        allowTaint: true
      }).then(canvas => {
        let dataURL = canvas.toDataURL("image/png")
        setTimeout(() => {
          this.fileDownload(dataURL)
        }, 100);
      });
    },

    selectMember (e) {
      this.memberName = e.target.value
      const member = this.members.find(item => {
        return item.name = this.memberName
      })
      this.avatarStyleObject.backgroundImage = member.avatar
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
    }
  },
};
</script>

<style scoped>
.transition-group {
  min-height: calc(90vh - 62px);
}

#home {
  background: #37474f;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 100vh;
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
  font-family: "Fira Code";
  font-size: 22px;
  color: white;
  text-align: center;
  line-height: 60px;
}
.config-header {
  width: inherit;
  height: 60px;
  background: linear-gradient(to right, #8ec4e6 40%, #a77bd0 100%);
  font-family: "Fira Code";
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
  min-height: 70px;
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
.msg-img {
  margin-top: 1em;
  width: 80%;
}
/* talk bubble contents */
.talktext {
  margin: 0.5em;
  padding: 0.5em;
  text-align: left;
  line-height: 1.8em;
}
.talktext:focus-visible {
  outline: #8ec4e6 auto 1px;
}

.talktext p {
  /* remove webkit p margins */
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
</style>
