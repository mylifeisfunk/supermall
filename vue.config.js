module.exports = {
    configureWebpack:{
        resolve:{
            // extensions:[],//无需配置，cli3已默认配置
            alias:{//别名
                'assets':"@/assets",
                'common':"@/common",
                'components':"@/components",
                'network':"@/network",
                'views':"@/views",
            }
        }
    }
}
//router 和 store 是不需要配置的，
// 因为在其他组件都可以通过this.$router 和 this.$route 拿到对象