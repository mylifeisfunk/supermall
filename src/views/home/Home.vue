<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-contorl class="tab-contorl"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper';
  import RecommendView from './childComps/RecommendView';
  import FeatureView from "./childComps/FeatureView";

  import NavBar from 'components/common/navbar/NavBar';
  import TabContorl from 'components/content/tabContorl/TabContorl';
  import GoodsList from 'components/content/goods/GoodsList';
  import Scroll from 'components/common/scroll/Scroll';
  import BackTop from 'components/content/backtop/BackTop';

  import {getHomeMultidata,getHomeGoods} from "network/home";


  export default {
    name: "Home",
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          //设计数据结构，分别对应三个标签，
          //每个数据都有自身对应的显示数据数，保存的数据
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        //获取当前类型
        currentType:'pop',
        isShowBackTop:false
      }
    },
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabContorl,
      GoodsList,
      Scroll,
      BackTop
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    //在组件创建完成之后马上发送网络请求
    created() {//1、请求多个数据,异步操作
      this.getHomeMultidata();

      //2、请求商城数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    methods:{
      /**
       *  事件监听提供相关方法
      */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,500);
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 2000
      },
      loadMore(){
        this.getHomeGoods(this.currentType);
        //再获取真实高度之前进行一次刷新，保证better-scroll获取的高度都是我们
        //下拉加载图片完成后的高度
        // this.$refs.scroll.scroll.refresh()
      },
      /*
        网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
          console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        //获取原来的页码，加1，方便组件复用
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then( res =>{
          //使用结构的方式将所有的数据放置到数组中
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp();
        })
      },
    }
  }
</script>

<style scoped>
  #home{
    padding-top:44px;
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999;
  }
  .tab-contorl{
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content{
    overflow: hidden;
    position: absolute;
    top:44px;
    bottom:49px;
    left: 0;
    right: 0;
  }
  /*.content{*/
  /*  height: calc(100% - 100px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
