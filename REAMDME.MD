# curl - 交互

## example

```js
const model = require('flightworker-curl')({
    engine: require('axois'),
    loader: 'axois' // axois、jquery、zepto
})

const params = {
    data?: Object // 参数
    methods?: string // 请求方式
    headers?: Object // 头部设置
    dataType?: string // 类型
    url: string // url
}
// 请求
model.curl(params).then(res => console.log(res)).catch(e => console.log(e))
```