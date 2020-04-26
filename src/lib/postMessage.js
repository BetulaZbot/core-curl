const prefix = '_FLIGHT_PREFIX_'

module.exports = params => new Promise(resolve => {
    const {timeout, postMessage, data, url, methods} = params || {}
    const $date = new Date
    let key = `${prefix}${$date.getTime()}`
    const $body = document.querySelector('body')
    const $iframe = document.createElement('iframe')

    $iframe.setAttribute('style', 'display:none')
    $iframe.setAttribute('name', `${key}_NAME`)
    $iframe.setAttribute('id', `${key}_ID`)
    $body.appendChild($iframe)
    const $form = document.createElement('form')
    $form.setAttribute('target', `${key}_NAME`)
    $form.setAttribute('method', methods && methods.toUpperCase() || 'POST')
    $form.setAttribute('action', url)
    $body.appendChild($form)
    Object.keys(data || {}).forEach(name => {
        const $input = document.createElement('input')
        $input.setAttribute('type', 'hidden')
        $input.setAttribute('name', name)
        $input.setAttribute('value', JSON.stringify(data[name]))
        $form.appendChild($input)
    })
    let target, name
    if(typeof postMessage === 'string'){
        name = postMessage
    }else if(typeof postMessage === 'object'){
        target = postMessage.target
        name = postMessage.name
    }
    target = target || window.parent
    let addEventListener, removeEventListener, message
    if(target.addEventListener){
        addEventListener = target.addEventListener
        removeEventListener = target.removeEventListener
        message = 'message'
    }else{
        addEventListener = target['attachEvent']
        removeEventListener = target['deattachEvent']
        message = 'onmessage'
    }
    let loadState = false
    const func = e => {
        if(typeof e.data !== 'string'){
            return
        }
        let [type, state, data] = e.data.split('#')
        if(type !== name){
            return 
        }
        if(!state){
            return 
        }
        if(loadState === true){
            return
        }
        loadState = true
        removeEventListener(message, func)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        return resolve(data)
    }
    addEventListener(message, func, false)
    $form.submit()
    if(timeout !== 0 && timeout){
        let timer = setTimeout(() => {
            clearTimeout(timer)
            loadState = true
            if(!loadState){
                'warn' in console && console.warn(`接口[${url}]超时(${timeout}s)`)
                return resolve({})
            }
        }, timeout)
    }
})