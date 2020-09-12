module.exports = {
    configureWebpack: {
        devServer: {
            open: true,
            proxy: 'http://localhost:3000'
            // proxy: {
            //     '/netease-api': {
            //         target: 'http://localhost:3000',
            //         // pathRewrite: { '^/netease-api': '' },
            //         changeOrigin: true,
            //         secure: false,
            //     },
            // }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    @import "@/style/variables.scss";
                    @import "@/style/mixin.scss";
                `,
            },
        },
    },
}