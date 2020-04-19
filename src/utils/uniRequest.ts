const BASEURL: string = "http://106.52.57.152:3000/api/";
const uniRequest = ({ url = "", method = 'GET', data = {}, tipName = '加载中...' }) => {
    // 封装的request方法，里面要返回一个promise对象。
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: tipName
        });
        const header = {
            Authorization: ''
        }
        if (uni.getStorageSync('my_token')) {
            header.Authorization = uni.getStorageSync('my_token')
        }
        uni.request({
            url: `${BASEURL}${url}`,
            method,
            data,
            header,
            success: (res) => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete: () => {
                uni.hideLoading()
            }
        });


    })
}
export default uniRequest