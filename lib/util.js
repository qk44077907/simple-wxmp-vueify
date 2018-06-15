export function isObject (obj){
    return obj !== null && typeof obj === 'object'
}

export function isFunction (obj){
    return Object.prototype.toString.call(obj) === '[object Function]'
}

const bailRE = /[^\w.$]/
export function setNestedValue(obj,path,value) {
    if (bailRE.test(path)) {
        return
    }
    let segments = path.split('.')
    for (let i = 0; i < segments.length-1; i++) {
        if (obj && isObject(obj[segments[i]])){
            obj = obj[segments[i]]
        }else {
            throw new Error('error path: '+segments[i])
        }
    }
    obj[segments[segments.length-1]] = value
}