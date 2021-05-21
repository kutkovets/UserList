import {notification} from 'antd';

const ls = {
    get: (key, p = false) => {
        const ls = localStorage.getItem(key);
        if (ls && ls.length) return p ? JSON.parse(ls) : ls;
        return null;
    },
    set: (key, value, s = false) => {
        localStorage.setItem(key, s
            ? JSON.stringify(value)
            : value
        );
    },
    remove: (key) => {
        key.constructor === [].constructor
            ? key.forEach(it => localStorage.removeItem(it))
            : localStorage.removeItem(key)
    },
    add: (key, obj) => {
        const l = localStorage.getItem(key);
        if (l && l.length) {
            const ls = JSON.parse(l);
            localStorage.setItem(key, JSON.stringify({...ls, ...obj}))
        } else localStorage.setItem(key, JSON.stringify(obj))
    },
    del: (key, k) => {
        const l = localStorage.getItem(key);
        if (l && l.length) {
            const ls = JSON.parse(l);
            const keys = Object.keys(ls);
            if (k.constructor === [].constructor) k.forEach(i => {
                if (keys.includes(i)) delete ls[i]
            });
            else if (keys.includes(k)) delete ls[k];
            localStorage.setItem(key, JSON.stringify(ls))
        }
    }
};
const is = {
    Request: ({res} = {}) => {
        const {status, data} = res;
        return status
            ? status === 200 && data
            : false
    },
    Success: ({res} = {}) => ((res || {}).status || -1) === 200
};

const makeAlert = obj => {
    const
        message = obj.status === 200
            ? "Success"
            : "Error",
        description = obj.message || obj.error || ""
    ;
    notification.open({message, description});
    return obj;
};

export const LS = ls;
export const IS = is;
export const Alert = makeAlert;