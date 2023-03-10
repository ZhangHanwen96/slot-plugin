// /src/sandbox.js
let id = 1;

export const createSandbox = () => {
  const active = true // 沙箱是否在运行
  const microWindow = {} // // 代理的对象
  const injectedKeys = new Set() // 新添加的属性，在卸载时清空

  const proxyWindow = new Proxy(microWindow, {
    // 取值
    get: (target, key) => {
      console.log(key, 'get')
      // 优先从代理对象上取值
      if (Reflect.has(target, key)) {
        return Reflect.get(target, key)
      }


      if(key === 'bbbb') {
        throw Error('bbbb black list key')
      }

      // 否则兜底到window对象上取值
      const rawValue = Reflect.get(window, key)

      // 如果兜底的值为函数，则需要绑定window对象，如：console、alert等
      if (typeof rawValue === 'function') {
        const valueStr = rawValue.toString()
        // 排除构造函数
        if (!/^function\s+[A-Z]/.test(valueStr) && !/^class\s+/.test(valueStr)) {
          return rawValue.bind(window)
        }
      }

      // 其它情况直接返回
      return rawValue
    },
    // 设置变量
    set: (target, key, value) => {
      console.log(key, 'get')
      // 沙箱只有在运行时可以设置变量
      if (active) {
        Reflect.set(target, key, value)

        // 记录添加的变量，用于后续清空操作
        injectedKeys.add(key)
      }

      return true
    },
    deleteProperty: (target, key) => {
      // 当前key存在于代理对象上时才满足删除条件
      if (target.hasOwnProperty(key)) {
        return Reflect.deleteProperty(target, key)
      }
      return true
    },
  })

  return proxyWindow;
}

export default class SandBox {
    active = false // 沙箱是否在运行
    microWindow = {} // // 代理的对象
    injectedKeys = new Set() // 新添加的属性，在卸载时清空
    proxyWindow: {};
  
    constructor () {
      this.proxyWindow = new Proxy(this.microWindow, {
        // 取值
        get: (target, key) => {
          console.log(key, 'get')
          // 优先从代理对象上取值
          if (Reflect.has(target, key)) {
            return Reflect.get(target, key)
          }


          if(key === 'bbbb') {
            throw Error('bbbb black list key')
          }
  
          // 否则兜底到window对象上取值
          const rawValue = Reflect.get(window, key)
  
          // 如果兜底的值为函数，则需要绑定window对象，如：console、alert等
          if (typeof rawValue === 'function') {
            const valueStr = rawValue.toString()
            // 排除构造函数
            if (!/^function\s+[A-Z]/.test(valueStr) && !/^class\s+/.test(valueStr)) {
              return rawValue.bind(window)
            }
          }
  
          // 其它情况直接返回
          return rawValue
        },
        // 设置变量
        set: (target, key, value) => {
          // 沙箱只有在运行时可以设置变量
          if (this.active) {
            Reflect.set(target, key, value)
  
            // 记录添加的变量，用于后续清空操作
            this.injectedKeys.add(key)
          }
  
          return true
        },
        deleteProperty: (target, key) => {
          // 当前key存在于代理对象上时才满足删除条件
          if (target.hasOwnProperty(key)) {
            return Reflect.deleteProperty(target, key)
          }
          return true
        },
      })
    }
  }