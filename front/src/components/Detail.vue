<template>
  <article class="detail-article" ref="article">
    <div class="art-header" v-if="hasShowHeader">
      <h1>{{blog.title}}</h1>
      <div class="header-info">
        <Icon type="md-pricetags"/>
        <router-link :to="`/category/${blog.classifyId}`">{{blog.classify}}</router-link>
        <Icon type="md-calendar"/>
        {{blog.createTime | subTime(0)}}
        <Icon type="md-eye"/>
        {{blog.hit}}
        <Icon type="md-chatboxes"/>
        <span ref="commentSpan">{{blog.comment}}</span>
      </div>
      <div class="header-tag" v-if="hasShowTags">
        <router-link
          :to="{ name: 'tag', params: { name: tags }}"
          v-for="(tags, index) in blogLabel"
          :key="index"
        >{{tags}}</router-link>
      </div>
      <div class="tag-time">
        <Icon type="md-time"/>
        {{blog.createTime | subTime(1)}}
      </div>
    </div>
    <router-link
      class="modifyBtn"
      :style="hasShowHeader || 'margin-top: -15px;'"
      v-if="isLogined"
      :to="{
      name: 'edit',
      params: {
        id: blog.id,
        imgName: blog.imageName,
        uploadImgUrl: blog.image
      }}"
    >修改</router-link>
    <div id="blog" class="content markdown-body" v-html="blog.content_hm"></div>
    <div class="content-footer">
      <p>
        本文由
        <router-link to="/">{{blog.userName}}</router-link>&nbsp;创作，转载请注明
      </p>
      <p>最后编辑时间：{{blog.updateTime}}</p>
    </div>
    <my-reward></my-reward>
    <aside id="directory"></aside>
    <div id="zooms" class="zoom-shadow">
      <img ref="zoomImg" class="zoom-big-img">
    </div>
    <p class="comments-desc" v-if="isloaded">
      <span>发表评论</span>
    </p>
    <div id="vcomments" ref="vcomments"></div>
  </article>
</template>

<script>
import '@/assets/css/markdown.css'
import '@/assets/css/github.css'
import Catalog from '@/util/catalog.js'
import Valine from 'valine'
import { addBlogComment } from '@/service'
export default {
  props: {
    blog: {
      type: Object
    }
  },
  filters: {
    // 2018-09-20 11:33:46 取年月日、取时分秒
    subTime(time, index) {
      return time ? time.split(' ')[index] : ''
    }
  },
  data() {
    return {
      isloaded: false,
      submitBtn: null
    }
  },
  computed: {
    blogLabel() {
      return this.blog['label'] ? this.blog['label'].split(',') : []
    },
    hasShowTags() {
      return this.blogLabel.length > 0
    },
    hasShowHeader() {
      // 当标题是 关于我 或 友情链接，不显示文章头部信息
      return this.blog.title !== '关于我' && this.blog.title !== '友情链接'
    },
    isLogined() {
      return sessionStorage.getItem('username') !== null
    }
  },
  mounted() {
    // 加载目录和评论插件
    if (JSON.stringify(this.blog) !== '{}' && this.blog !== null) {
      this.getCatalogZoomsComment()
    }
    // 这里使用深度监听 blog 对象的属性变化
    this.$watch('blog', this.getCatalogZoomsComment, {
      deep: true
    })
  },
  methods: {
    getCatalogZoomsComment() {
      // 设置文章目录
      Catalog({
        contentEl: 'blog',
        catalogEl: 'directory',
        selector: ['h1', 'h2', 'h3']
      })
      let wrapper = document.getElementsByClassName('cl-wrapper')[0]
      // 没有目录，就隐藏
      if (wrapper.innerHTML === '') {
        wrapper.style.display = 'none'
      }
      // 设置图片点击放大
      // 事件委托，处理全部 img 标签的点击事件
      let blog = document.getElementById('blog')
      let zooms = document.getElementById('zooms')
      let zoomImg = this.$refs.zoomImg
      let target = ''
      blog.addEventListener('click', ev => {
        let eve = ev || window.event
        target = eve.target || eve.srcElement
        if (target.nodeName.toLowerCase() === 'img') {
          zoomImg.src = target.src
          zooms.style.visibility = 'visible'
          zooms.style.opacity = '1'
        }
      })
      zooms.addEventListener('click', ev => {
        zooms.style.visibility = 'hidden'
        zooms.style.opacity = '0'
      })
      // 加载评论系统
      this.getComment()
      this.isloaded = true
    },
    getComment() {
      Valine({
        el: '#vcomments',
        appId: 'AXcd7u8mPqn0JWnsXku8MgdU-gzGzoHsz',
        appKey: 'xDI01iWSsPVlKzITBp5ODinq',
        verify: true,
        path: window.location.pathname,
        avatar: 'mp',
        placeholder: '留下你的足迹... （支持 Markdown）'
      })
      // 获取按钮的容器
      let buttonContainer = document.getElementsByClassName('text-right')[0]
      // 获取提交按钮并移除提交按钮
      this.submitBtn = document.getElementsByClassName('vsubmit')[0]
      this.submitBtn.style['display'] = 'none'
      buttonContainer.removeChild(this.submitBtn)

      // 获取输入的昵称、邮箱、评论内容
      let nick = document.getElementsByName('nick')[0]
      let mail = document.getElementsByName('mail')[0]
      let textDiv = document.getElementById('veditor')

      // 邮箱正则
      const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/

      // 创建新的按钮替换
      let btn = document.createElement('button')
      btn.className = 'new-btn'
      btn.innerText = '提交评论'
      buttonContainer.appendChild(btn)
      // 提交评论的事件
      btn.addEventListener('click', async e => {
        let nickText = nick.value
        let mailText = mail.value
        let textDesc = textDiv.value
        let isok = emailReg.test(mailText)
        if (nickText.trim() === '') {
          this.$Message.warning('先输入昵称哦~~')
        } else if (mailText.trim() && !isok) {
          this.$Message.warning('邮箱格式不正确哦~~')
        } else if (textDesc.trim() === '') {
          this.$Message.warning('先输入评论哦~~')
        } else {
          // 触发提交按钮
          buttonContainer.appendChild(this.submitBtn)
          this.submitBtn.click()

          const commentCount = await addBlogComment(this.blog.id)
          // 需要展示头部的文章，就设置当前评论量
          if (this.hasShowHeader) {
            this.$refs.commentSpan.innerText = commentCount
          }
          // 移除评论按钮
          buttonContainer.removeChild(this.submitBtn)
        }
      })
    }
  },
  components: {
    myReward: () => import('./models/MyReward')
  }
}
</script>

<style lang='scss' scoped>
article {
  animation: fadeIn 0.6s linear;
  max-width: 700px;
  padding: 0 25px 30px;
  margin: 0 auto;
  background-color: #fff;
  position: relative;

  .art-header {
    padding-top: 100px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #b7b7b7;
    position: relative;

    h1 {
      font-size: 22px;
      color: #222;
      font-weight: 400;
      line-height: 1.8;
    }

    .header-info {
      margin: 12px 0px 0;
      i {
        &:not(:first-child) {
          margin-left: 12px;
        }

        font-size: 14px;
        margin-top: -2px;
      }
    }
    .header-tag {
      width: 85%;
      a {
        margin-top: 14px;
        color: #fff;
        border: 1px solid #f16d71;
        border-radius: 15px;
        background: #f16d71;
        display: inline-block;
        margin-right: 10px;
        padding: 0 15px;
        height: 25px;
        line-height: 25px;
        transition: 0.4s;

        &:hover {
          color: #5f5f5f !important;
          border: 1px solid #f7f7f7;
          outline-style: none;
          background: #f7f7f7;
        }
      }
    }

    .tag-time {
      position: absolute;
      right: 0;
      bottom: 12px;
      line-height: 14px;

      i {
        font-size: 14px;
        margin-top: -2px;
      }
    }
  }
  .modifyBtn {
    position: absolute;
    right: 26px;
    margin-top: 4px;
  }
  .content {
    margin: 26px 0;
  }
  .content-footer {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    color: #24292e;
    font-size: 14px;

    a {
      border-bottom: 1px solid #ccc;

      &:hover {
        border-bottom: 1px solid #eb5055;
      }
    }
  }
}
.zoom-shadow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  z-index: 1500;
  transition: 0.3s;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;

  .zoom-big-img {
    position: fixed;
    cursor: zoom-out;
    max-width: 86%;
    max-height: 86%;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transform: scale(1);
  }
}
</style>
<style lang="scss">
#directory {
  position: fixed;
  top: 50%;
  margin-left: 686px;
  max-width: 400px;
  transform: translateY(-54%);
  .cl-wrapper {
    padding: 5px 0;
    border-left: 2px solid #ddd;
    ul li {
      position: relative;
      line-height: 29px;
      div:hover {
        color: #f44336 !important;
      }
      .cl-link-active {
        &::before {
          position: absolute;
          top: 10.3px;
          left: -5px;
          display: inline-block;
          width: 8px;
          height: 8px;
          content: '';
          border-radius: 50%;
          background-color: #f44336 !important;
        }
      }
      .cl-link {
        display: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: #272727;
        cursor: url(../assets/pic/cursor.cur), pointer;
      }
    }
    & > ul > li {
      position: relative;
      padding-left: 15px;
      & > ul > li {
        .cl-link-active {
          &::before {
            left: -20px;
          }
        }
        & > ul > li {
          div {
            margin-left: 20px;
            color: #8e8e8e !important;
          }
        }
        div {
          margin-left: 10px;
          color: #5f5f5f !important;
        }
      }

      .cl-link-active {
        color: #f44336 !important;
      }
    }
  }
}
/* 评论样式 */
.comments-desc {
  &::before {
    font-size: 24px;
    content: '|';
    color: #eb5055;
    font-weight: bold;
    position: absolute;
    left: 0;
    top: -8px;
  }
  margin-top: 52px;
  color: #24292e;
  font-size: 1.4em;
  position: relative;
  margin-bottom: 16px;

  span {
    margin-left: 12px;
  }
}
#vcomments {
  .txt-right {
    display: none;
  }
  .veditor {
    min-height: 6rem;
    max-height: 12rem;
  }
  .vcontrol {
    padding-top: 10px;
    & > .col:first-child {
      visibility: hidden;
    }
    .text-right {
      .new-btn {
        border: none;
        border-radius: 0.3rem;
        padding: 0.5rem 1.25rem;
        font-size: 0.875rem;
        line-height: 1.42857143;
        outline: none;
        background: #ff9800;
        color: #fff;
        border: 1px solid #ff9800;
        &:hover {
          border: 1px solid #f60;
        }
      }
      .vsubmit {
        background: #ff9800;
        color: #fff;
        &:hover {
          border: 1px solid #f60;
        }
      }
    }
  }
  .vinfo {
    display: none !important;
  }
  .vlist {
    & > .vcard > .vh {
      border-bottom: 1px solid #e5e9ef !important;
    }
    .vcard {
      padding-top: 20px;
      .vimg {
        border: none;
        margin-top: 0.1rem;
        width: 3.25rem;
        height: 3.25rem;
      }
      .vh {
        border: none;
        &:hover {
          & .vmeta .vat {
            display: block;
          }
        }
        .vhead {
          .vnick {
            color: #6d757a;
            font-weight: 700;
            &::before {
              background: #eb5055;
            }
            &:hover {
              color: #eb5055;
              cursor: url(../assets/pic/cursor.cur), pointer;
            }
            &[href="https://ainyi.com"] {
              color: #eb5055;
            }
          }
          .vsys {
            display: none;
          }
        }
        .vmeta .vat {
          display: none;
          color: #b3b3b3;
          cursor: url(../assets/pic/cursor.cur), pointer;

          &:hover {
            color: #eb5055;
          }
        }
        .vcontent {
          padding-top: 2px;
          margin-bottom: 0;
          .at {
            color: #ff9800;
            &::before {
              background: #eb5055;
            }
          }
          p {
            display: inline;
            margin-left: 6px;
          }
          a {
            &::before {
              background: #eb5055;
            }
          }
        }
      }
      .vquote {
        border: none;
        margin-top: 0;
        padding-left: 0;

        .vimg {
          width: 2.8rem;
          height: 2.8rem;
        }
      }
    }
  }
  .vpage {
    .vmore {
      background: #ff9800;
      color: #fff;
      &:hover {
        border: 1px solid #f60;
      }
    }
  }
  .vcancel {
    background: #ff4d43;
    color: #fff;
    border: 1px solid #ff6969;
  }
  .vsure {
    background: #4373ff;
    color: #fff;
    border: 1px solid #4f87ff;
  }
}
</style>
