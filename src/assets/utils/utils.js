const setCookie = (name, value, options = {}) => {
    options = {path: '/', ...options};
    if (options.expires instanceof Date) options.expires = options.expires.toUTCString();
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) updatedCookie += "=" + optionValue;
    }
    document.cookie = updatedCookie;
};
const ls = {
    g: (key, p = false) => {
        const ls = localStorage.getItem(key);
        if (ls && ls.length) return p ? JSON.parse(ls) : ls;
        return null;
    },
    s: (key, value, s = false) => {
        localStorage.setItem(key, s
            ? JSON.stringify(value)
            : value
        );
    },
    r: (key) => {
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
    },
    reset: () => ["cb", "phone"].forEach(it => localStorage.removeItem(it))

};
const getParams = () => {
    const
        params = {},
        pathname = window.location.href.replace(window.location.origin, ""),
        queries = pathname.split("?"),
        query = queries[queries.length - 1].replace(window.location.pathname, "")
    ;
    query
        .split("&")
        .forEach(it => {
            const arr = it.split('=');
            params[arr[0]] = arr[1];
        });
    return params;
};

export const Cookie = setCookie;
export const L = ls;
export const Param = getParams;