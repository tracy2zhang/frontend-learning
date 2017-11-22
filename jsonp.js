let head = null
let callbackIndex = 0

function serialize (obj) {
  // 不是对象就不做转换
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return obj
  }
  return Object.keys(obj).map(k => `${k}=${obj[k]}`).join('&')
}

export function jsonp (url, params, timeout = 5000) {
  const cbName = `jp${callbackIndex++}`
  if (!head) {
    head = document.querySelector('head')
  }
  const script = document.createElement('script')
  head.appendChild(script)
  script.setAttribute('src', `${url}?callback=${cbName}&${serialize(params)}`)
  return new Promise((resolve, reject) => {
    const over = () => {
      window[cbName] = undefined
      head.removeChild(script)
    }
    let to = setTimeout(() => {
      over()
      reject(new Error('timeout'))
    }, timeout)
    script.addEventListener('error', err => {
      over()
      reject(err)
    })
    window[cbName] = data => {
      if (to) {
        clearTimeout(to)
        to = null
      }
      resolve(data)
      over()
    }
  })
}
