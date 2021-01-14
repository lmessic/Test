<template>
  <div class="contain">
    <div class="content" :class="setBk()">
      <div class="title" v-if="isSet">多层营销知识库系统</div>
      <div class="title-result" v-else-if="!isSet && !showDetail">信息查询结果</div>
      <div class="title-detail" v-if="showDetail">
        <span class="back" @click="back">
          <i class="el-icon-arrow-left"></i>
          Back
        </span>
        <span>知识库详情</span>
      </div>
      <div v-if="showDetail" class="detail">
        <h4>{{ currentTitle }}</h4>
        <div class="artical">
          <div v-for="(item,index) in articalContent" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="bk" v-if="showImg">
          <img src="@/assets/homePage.png">
        </div>
        <div class="search">
          <span class="ipt">
            <el-input v-model="input" placeholder="输入您想要查询的知识库信息" suffix-icon="el-icon-microphone"></el-input>
          </span>
          <span class="btn" @click="query">
            <img src="@/assets/search_u.png" />
          </span>
        </div>
        <div class="history">
          <span class="left">
            历史查询：
          </span>
          <span v-for="(item,index) in historyData" :key="index" class="link" @click="searchHistory(item)">
            {{ item }}
          </span>
        </div>
        <div v-if="showContent">
          <div class="intro">
            <el-row class="form">
              <el-col :span="24">
                <span>用户类型：</span>
                <span>{{ customer }}</span>
              </el-col>
              <el-col :span="24">
                <span>用户需求：</span>
                <span v-for="(item,index) in requirement" :key="index">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">{{ item.description }}</div>
                    <span style="margin-right: 5px;">{{ item.name }}</span>
                  </el-tooltip>
                </span>
              </el-col>
              <el-col :span="24">
                <span>提供的产品：</span>
                <span>{{ product }}</span>
              </el-col>
              <el-col :span="24">
                <span>提供的服务：</span>
                <span>{{ service }}</span>
              </el-col>
            </el-row>
            <p>{{ curContent }}</p>
            <div>
              信息来源：<span @click="viewDetail" class="link-text" v-if="currentTitle">《{{ currentTitle }}》</span>
            </div>
          </div>
          <div class="refrence">
            <div class="desc">参考知识：</div>
            <div class="ref-content">
              <div v-for="(item,index) in dataList" :key="index" class="directory">
                <el-row>
                  <el-col :span="5">
                    <div class="icon">

                    </div>
                  </el-col>
                  <el-col :span="19">
                    <div @click="viewDetail(item.name[0])" class="link-text">
                      <el-tooltip v-if="item.name[0].length > 16" effect="dark" placement="top">
                        <div slot="content">{{ item.name[0] }}</div>
                        <span>{{ item.name[0].slice(0,14) }}...</span>
                      </el-tooltip>
                      <span v-else>{{ item.name[0] }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bot">
        <el-row class="operate">
          <el-col :span="12">
            <div style="cursor: pointer" @click="showInfo">
              <img src="@/assets/search_c.png" class="search-c" v-if="informationsIcon" />
              <img src="@/assets/search_u.png" class="search-c" v-else />
              <div>信息查</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="cursor: pointer" @click="showAI">
              <img src="@/assets/AI_c.png" class="search-c" v-if="AIIcon" />
              <img src="@/assets/AI_u.png" class="search-c" v-else />
              <div>AI专家</div>
            </div>
          </el-col>
        </el-row>
        <div v-if="false" class="keyboard">
          键盘
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getData } from '@/api/index'
export default {
  data () {
    return {
      input: '',
      isSet: true,
      showImg: true,
      showKeyboard: false,
      showContent: false,
      dataList: [],
      historyData: JSON.parse(sessionStorage.getItem('history')),
      informationsIcon: true,
      AIIcon: false,
      showDetail: false,
      curContent: '',
      customer: '',
      requirement: [],
      product: '',
      service: '',
      articalContent: '',
      currentTitle: '' // 当前标题
    }
  },
  computed: {
    setBk () {
      return function () {
        if (this.isSet) {
          return 'white'
        } else {
          return 'gray'
        }
      }
    }
  },
  mounted () {
    // sessionStorage.removeItem('history')
  },
  methods: {
    query () {
      this.showImg = false
      this.showKeyboard = true
      let historyData = (sessionStorage.getItem('history') !== null && sessionStorage.getItem('history') !== undefined) ? JSON.parse(sessionStorage.getItem('history')) : []
      // if (this.input && historyData.length < 4) {
      //   historyData.push(this.input)
      //   sessionStorage.setItem('history', JSON.stringify(historyData))
      // }
      if (this.input) {
        if (historyData.length < 4) {
          historyData.unshift(this.input)
        } else {
          historyData.splice(historyData.length - 1, 1)
        }

        console.log(historyData)
        sessionStorage.setItem('history', JSON.stringify(historyData))
        this.isSet = false
        this.showKeyboard = false
        this.showContent = true
        getData({'search': this.input}).then(res => {
          res.data.map(item => {
            let index = item.name[0].indexOf('.')
            item.name[0] = item.name[0].slice(0, index)
          })
          this.dataList = res.data
          let intData = res.data[0]
          this.curContent = intData.overview[0]
          this.customer = intData.customer[0].type
          this.requirement = intData.requirment
          this.product = intData.product[0].name
          this.service = intData.service[0].name
          this.currentTitle = intData.name[0]
          this.articalContent = intData.case
        })
      }
    },
    searchHistory (value) {
      this.showContent = true
      this.showImg = false
      this.isSet = false
      getData({'search': value}).then(res => {
        res.data.map(item => {
          let index = item.name[0].indexOf('.')
          item.name[0] = item.name[0].slice(0, index)
        })
        this.dataList = res.data
        let intData = res.data[0]
        this.curContent = intData.overview[0]
        this.customer = intData.customer[0].type
        this.requirement = intData.requirment
        this.product = intData.product[0].name
        this.service = intData.service[0].name
        this.currentTitle = intData.name[0]
        this.articalContent = intData.case
      })
    },
    showInfo () {
      this.informationsIcon = true
      this.AIIcon = false
    },
    showAI () {
      this.AIIcon = true
      this.informationsIcon = false
    },
    viewDetail (key) {
      this.showDetail = true
      this.dataList.map(item => {
        if (item.name[0] === key) {
          this.articalContent = item.case
          this.currentTitle = item.name[0]
        }
      })
    },
    back () {
      this.showDetail = false
      this.showImg = true
      this.showContent = false
      this.isSet = true
    }
  }
}
</script>
<style lang="less" scoped>
  .contain {
    width: 620px;
    margin: 0 auto;
    height: 850px;
    background-image: url('../assets/phone.png');
    background-repeat: no-repeat;
    background-size: cover;
    padding-top: 70px;
  }
  .content {
    width: 388px;
    height: 96%;
    margin-left: 116px;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    background: rgb(242, 242, 242);
    position: relative;
  }
  .white {
    background: #fff;
  }
  .gray {
    background: rgb(242, 242, 242);
  }
  .title {
    text-align: center;
    padding: 10px 0;
    margin-top: 10px;
    background: rgb(242, 242, 242);
  }
  .title-result {
    text-align: center;
    padding: 10px 0;
    margin-top: 10px;
    background: #fff;
  }
  .title-detail {
    padding: 10px 10px;
    margin-top: 10px;
    background: #fff;
    text-align: center;
    position: relative;
    .back {
      position: absolute;
      top: 13px;
      left: 10px;
      color: rgb(25, 125, 255);
      cursor: pointer;
    }
  }
  .bk {
    width: 100%;
    height: 200px;
    text-align: center;
    img {
      width: 100px;
      height: 100px;
      margin-top: 50px;
    }
  }
  .search {
    width: 320px;
    height: 38px;
    padding-top: 20px;
    margin-left: 35px;
    span {
      display: inline-block;
      line-height: 40px;
    }
    .ipt {
      width: 87%;
    }
    /deep/ .el-input__inner {
      width: 100%;
    }
    .btn {
      font-size: 20px;
      margin-left: 12px;
      height: 35px;
      cursor: pointer;
      vertical-align: middle;
      img {
        width: 25px;
        height: 25px;
      }
    }
    /deep/ .el-input__suffix {
      font-size: 20px;
    }
  }
  .history {
    text-align: left;
    padding: 0 10px;
    font-size: 12px;
    margin: 20px 35px;
    width: 280px;
    min-height: 50px;
    color: rgb(16, 16, 16);
    font-family: PingFangSC;
    font-weight: 400;
    span {
      display: inline-block;
    }
  }
  .link {
    color: rgb(25, 125, 255);
    font-family: PingFangSC;
    min-width: 60px;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
  .intro {
    width: 90%;
    min-height: 240px;
    background: rgb(255, 255, 255);
    text-align: left;
    padding: 10px 5%;
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 400;
    .form {
      .el-col {
        height: 22px;
        line-height: 22px;
      }
    }
    p {
      text-indent: 2em;
      line-height: 22px;
    }
  }
  .link-text {
    cursor: pointer;
    color: rgb(25, 125, 255);
  }
  .refrence {
    height: 210px;
    margin-top: 50px;
    font-size: 14px;
    .ref-content {
      height: 100%;
      overflow-y: scroll;
      background: rgb(255, 255, 255);
    }
    .ref-content .directory:nth-last-child(1) {
      border: none;
    }
    .desc {
      margin-bottom: 10px;
      padding-left: 20px;
    }
    .directory {
      height: 86px;
      line-height: 87px;
      border-bottom: 1px solid;
      padding-left: 20px;
    }
    .icon {
      width: 55px;
      height: 55px;
      line-height: 55px;
      margin-top: 15px;
      border: 1px solid;
    }
  }
  .bot {
    width: 100%;
    min-height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
  }
  .operate .el-col {
    border-top: 1px solid #ccc;
    padding-top: 10px;
    text-align: center;
    font-size: 14px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .keyboard {
    height: 280px;
  }
  .detail {
    height: 85%;
    background: #fff;
    padding: 0 10px;
    h4 {
      text-align: center;
      padding-top: 10px;
    }
  }
  .artical {
    text-indent: 2em;
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 400;
    line-height: 22px;
    max-height: 640px;
    overflow-y: scroll;
    div {
      margin-top: 10px;
    }
  }
  .artical>div:nth-last-child(1) {
    margin-bottom: 20px;
  }
</style>
