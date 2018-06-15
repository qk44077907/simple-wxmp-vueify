/**
 * Created by qiankun6 on 2018/6/9.
 */
import {
    isObject,
    isFunction
} from './util.js'

let isRendering =false
let isRenderInStack =false
export function observe(origin,key,render) {
    let originData = origin[key]
    if(!isObject(originData)){
        return
    }
    for(let childKey in originData){
        let child = originData[childKey]
        if(isObject(child)){
            observe(originData,childKey,render)
        }
    }
    let proxyObj = new Proxy(originData, {
        get: function(target, key, receiver) {
            return target[key];
        },
        set: function(target, key, value, receiver) {
            if(isRendering || target[key] === value){
                return true
            }
            target[key] = value;
            observe(target,key,render)
            if(isRenderInStack){
                return true
            }
            isRenderInStack = true
            Promise.resolve().then(()=>{
                isRendering = true;
                render()
                isRendering = false;
                isRenderInStack = false;
            })
            return true;
        },
    });
    origin[key] = proxyObj
}

export function proxyData(origin,data) {
    let context = this
    for(let key in data){
        Object.defineProperty(origin,key,{
            enumerable: true,
            configurable: true,
            get:function () {
                if(isFunction(data[key])){
                    return data[key].call(context)
                }
                return data[key]
            },
            set:function (newVal) {
                data[key] = newVal
            }
        })
    }
    return origin
}


