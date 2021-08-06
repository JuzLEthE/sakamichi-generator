<template>
  <div id="home">
    <button @click="toImage">Save</button>
    <select v-model="selected_member" @change='selectMember'>
      <option disabled value="请选择成员">请选择成员</option>
      <option v-for="member in member_lists" :key="member.name">{{ member.name }}</option>
    </select>
    <div
      class="container"
      ref="imageWrapper"
    >
      <div class="talk-header">{{member_name}}</div>
      <draggable
        v-model="myArray"
        chosenClass="chosen"
        forceFallback="true"
        group="people"
        animation="500"
        @start="onStart"
        @end="onEnd"
      >
        <transition-group>
          <div
            class="talk-item"
            v-for="element in myArray"
            :key="element.id"
          >
            <div v-bind:style="avatarStyleObject"></div>
            <div class="talk-msg">
              <div class="msg-info">
                <div class="msg-member">{{member_name}}</div>
                <div class="msg-time">8/5 11:50</div>
              </div>
              <div
                class="msg-bubble"
                @drop="addImage"
              >
                <img
                  class="msg-img"
                  @dblclick="changeVisible"
                  hidden
                />
                <div
                  class="talktext"
                  contenteditable="true"
                  v-text="element.name"
                >
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
// 导入draggable组件
import draggable from "vuedraggable";
import html2canvas from "html2canvas"
export default {
  name: "Home",
  // 注册draggable组件
  components: {
    draggable,
  },
  data () {
    return {
      member_name: "成员名字",
      selected_member: '',
      member_lists: [
        {name: '丹生 明里', avatar: 'url('+require('@/assets/nibu.jpg')+')'},
        {name: '金村 美玖', avatar: 'url('+require('@/assets/knmr.jpg')+')'},
      ],
      avatarStyleObject: {
        width: '3em',
        height: '3em',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundImage: 'url('+require('@/assets/hnt_logo.svg')+')',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        margin: '5px 5px 5px 20px',
        display: 'inline-block',
      },
      drag: false,
      // 定义要被拖拽对象的数组
      myArray: [
        {
          people: "cn1",
          id: 1,
          name: "Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。",
        },
        {
          people: "cn",
          id: 2,
          name: "ひがしむらめい🍓「昨日はミーグリでした！全握ミーグリでいちごミルクのペアでした！いちごミルクは佐々木久美のあだ名のくみるくと東村芽依のあだ名のめいちご合わせて｢いちごミルク｣です🍓🍼いちごミルクのペアが好きっていう方もたくさんで嬉しかったです🥰」 ",
        },
        {
          people: "cn3",
          id: 3,
          name: "background: linear-gradient(to right, #8ec4e6 40%, #a77bd0 100%);",
        },
      ],
    };
  },
  methods: {
    // 开始拖拽事件
    onStart () {
      this.drag = true;
    },
    // 拖拽结束事件
    onEnd () {
      console.log(this.myArray)
      this.drag = false;
    },
    addImage (e) {
      e.stopPropagation()
      e.preventDefault()
      let fileData = e.dataTransfer.files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(fileData)
      let imgEl = e.currentTarget.firstElementChild
      console.log(imgEl)
      fileReader.addEventListener('load', function () {
        // 读取完成
        let res = fileReader.result
        // res是base64格式的图片
        imgEl.src = res
        imgEl.hidden = false
      })
    },
    changeVisible (e) {
      e.stopPropagation()
      e.preventDefault()
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
    selectMember() {
      console.log(this.selected_member)
      this.member_name = this.selected_member
      let avatar_url = ""
      for (const item of this.member_lists) {
        if (item.name == this.member_name) {
          avatar_url = item.avatar
        }
      }
      console.log(avatar_url)
      this.avatarStyleObject.backgroundImage = avatar_url
    },

    fileDownload (downloadUrl) {
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = downloadUrl;
      aLink.download = "msg.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
  },
};
</script>

<style scoped>
/* container */

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
  /* border: 7px solid;
  border-color: #f6f6f6 #f6f6f6 transparent transparent; */
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
