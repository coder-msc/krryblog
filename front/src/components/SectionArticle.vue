<template>
  <section ref="blogSection" class="section-article">
    <article v-for="(val, index) in blogShowList" :key="index">
      <span v-if="val.isTop && isHome" class="top-icon">
        <i class="iconfont icon-Up-1" />
      </span>
      <div class="bg-container">
        <div
          class="bg-img"
          :style="val.id | setLink({background: `url(${basePath}${val.image}) 0% 0% / cover`})"
        ></div>
      </div>
      <!-- 这里使用命名路由，效果与下面一样，使用过滤器控制骨架屏的链接 -->
      <router-link :to="val.id | setLink({name: 'blog', params: {id: val.id, title: val.title}})">
        <div class="bg-cover">
          <p v-html="val.description"></p>
        </div>
      </router-link>
      <div class="other-bgcover right-bgcover"></div>
      <div class="other-bgcover"></div>
      <div class="desc">
        <!-- 这里直接用 id 作为路径，使用过滤器控制骨架屏的链接 -->
        <router-link :to="val.id | setLink(`/${val.id}`)">
          <p class="title" :title="val.title">{{val.title}}</p>
        </router-link>
        <div class="desc-bottom">
          <div :class="{'d-detail': true, 'hidden-detail': !val.id}">
            <Icon type="md-calendar" />
            <span>{{val.createTime}}</span>
            <Icon type="md-eye" />
            <span>{{val.hit}}</span>
            <Icon type="md-chatboxes" />
            <span>{{val.comment}}</span>
          </div>
          <router-link :to="val.id | setLink(`/category/${val.classifyId}`)">
            <Tooltip :content="val.classify || 'Krryblog'" theme="light" placement="top-end">
              <div class="item-icon" :style="{backgroundPosition: `0 ${-val.classifyId*70}px`}"></div>
            </Tooltip>
          </router-link>
        </div>
      </div>
    </article>
    <div class="clear"></div>
  </section>
</template>

<script>
export default {
  props: {
    blogList: {
      type: Array
    }
  },
  data() {
    return {
      blogShowList: [
        {
          classify: '',
          title: '',
          description: '',
          id: '',
          image: '',
          createTime: '2018-08-23',
          hit: 20,
          comment: 20,
          classifyId: 1
        },
        {
          classify: '',
          title: '',
          description: '',
          id: '',
          image: '',
          createTime: '2018-08-23',
          hit: 20,
          comment: 20,
          classifyId: 2
        },
        {
          classify: '',
          title: '',
          description: '',
          id: '',
          image: '',
          createTime: '2018-08-23',
          hit: 20,
          comment: 20,
          classifyId: 3
        }
      ]
    }
  },
  filters: {
    setLink(id, link) {
      return id ? link : ''
    }
  },
  created() {
    if (this.blogList.length > 0) {
      this.blogShowList = this.blogList
    }
  },
  computed: {
    basePath() {
      return process.env.API_ROOT + '/krryblog/'
    },
    isHome() {
      return this.$route.name === 'home' || this.$route.name === 'homePage'
    }
  },
  watch: {
    blogList(newVal, oldVal) {
      this.blogShowList = newVal
      if (oldVal.length !== 0) {
        // 共用组件，每次数据变化产生过渡效果
        this.$refs.blogSection.style['display'] = 'none'
        setTimeout(() => {
          this.$refs.blogSection.style['display'] = 'block'
        }, 0)
      }
    }
  },
  methods: {
    // handleIsTopData (data) {
    //   let topData = [];
    //   data = data.filter(item => {
    //     if (item.isTop) {
    //       topData.push(item);
    //       return false;
    //     }
    //     return true;
    //   });
    //   return [...topData, ...data];
    // },
  },
  components: {}
}
</script>

<style lang='scss' scoped>
section {
  animation: fadeIn 0.6s linear;
  max-width: 960px;
  margin: 0 auto;
  box-sizing: border-box;

  article {
    width: 280px;
    height: 340px;
    float: left;
    position: relative;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    margin: 20px;
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;

    &:hover {
      box-shadow: 1px 2px 12px 1px rgba(0, 0, 0, 0.15);
      background: #fff;

      .bg-img {
        filter: blur(3px);
        transform: scale(1.1);
      }

      .bg-cover {
        background-color: rgba(0, 0, 0, 0.5);
        transition: 0.5s;
        p {
          transition: 0.5s;
          margin-top: 0px;
          opacity: 1;
        }
      }
    }

    .top-icon {
      width: 46px;
      opacity: 0.86;
      height: 46px;
      position: absolute;
      left: -9px;
      top: -4px;
      text-align: center;
      line-height: 44px;
      color: #fff;
      background: url('../assets/pic/tag.png');
      background-size: cover;

      i {
        font-size: 19px;
      }
    }

    .bg-container {
      &::before {
        content: 'Loading...';
        position: absolute;
        border-radius: 5px 5px 0 0;
        width: 100%;
        left: 0;
        background-color: rgba(169, 169, 169, 0.75);
        text-align: center;
        line-height: 230px;
        font-size: 26px;
        color: #333333;
        z-index: -1;
      }

      &::after {
        content: '';
        position: absolute;
        border-radius: 5px 5px 0 0;
        width: 100%;
        left: 0;
        background-color: rgba(255, 255, 255, 0);
        line-height: 230px;
        z-index: -1;
      }

      .bg-img {
        transition: all 0.5s ease;
        height: 230px;
        border-radius: 5px 5px 0 0;
      }
    }

    .bg-cover {
      position: absolute;
      top: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      padding: 40px 28px;
      cursor: url(../assets/pic/cursor.cur), pointer !important;

      p {
        font-size: 14px;
        margin: 0;
        margin-top: 26px;
        padding: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        opacity: 0;
        line-height: 26px;
        color: #fff;
      }
    }

    .other-bgcover {
      position: absolute;
      z-index: 0;
      right: 0;
      bottom: 1px;
      left: 0;
      width: 110%;
      min-height: 100px;
      transform: rotate(5deg) translate(-10px, -20px);
      background-color: #fff;
    }
    .right-bgcover {
      transform: rotate(-10deg) translate(10px, -30px);
      opacity: 0.7;
      background-color: rgba(0, 0, 0, 0.5) !important;
    }

    .desc {
      width: 100%;
      height: 110px;
      background: #fff;
      position: relative;
      padding: 7px 15px 10px;
      box-sizing: border-box;

      .title {
        color: #000;
        font-size: 16px;
        display: -webkit-inline-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        &:hover {
          color: #ff8b18;
        }
      }

      .desc-bottom {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        padding: 0 15px 10px;
        text-align: right;

        .d-detail {
          position: absolute;
          bottom: 10px;

          i {
            font-size: 14px;
            margin-top: -2px;

            &:not(:first-child) {
              margin-left: 12px;
            }
          }
        }
        .hidden-detail {
          span {
            visibility: hidden;
          }
        }

        .item-icon {
          background: url(../assets/pic/bg-ico.png) no-repeat;
          height: 37px;
          width: 37px;
          float: right;
          border: 1px solid #eaeaea;
          border-radius: 50%;
          background-size: cover;
        }
      }
    }
  }
}
@keyframes fadeInNoOpa {
  from {
    margin-top: -20px;
  }
  to {
    margin-top: 0;
  }
}
</style>
