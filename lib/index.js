/**
 * Created by qiankun6 on 2018/6/9.
 */

import {observe, proxyData} from "./observer.js";
import {setNestedValue} from "./util.js";

const originPage = Page;
function extend(options, key, func) {
    if (options[key]) {
        let originFunc = options[key];
        options[key] = function (...args) {
            func.call(this, ...args);
            return originFunc.call(this, ...args)
        }
    } else {
        options[key] = function (...args) {
            return func.call(this, ...args)
        }
    }
}

Page = function (options) {
    if (options.reactive) {
        extend(options, "onLoad", function () {
            let pageInstance = this
            let render = function () {
                pageInstance.setData(pageInstance.data)
            }
            observe(pageInstance, 'data', render)
            if(pageInstance.computed){
                proxyData.call(this, pageInstance.data, pageInstance.computed);
            }
            proxyData.call(this, pageInstance, pageInstance.data)
        });
        let timer= null
        extend(options, "updateVM", function (e) {
            //节流，防止某些手机快速输入会更新上次data的bug
            clearTimeout(timer);
            timer = setTimeout(()=>{
                let pageInstance = this
                let path = e.target.dataset.path;
                let value = e.detail.value;
                setNestedValue(pageInstance,path,value)
            },200)
        });
        extend(options, "setNestedValue", function (path,value) {
            setNestedValue(this, path, value)
        })
    }
    originPage(options);
}
export default Page