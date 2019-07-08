const LOGIN_COOKIE_NAME = 'username';
const LOGIN_COOKIE_TOKEN = 'token';

export function isAuthenticated () {
    return _getCookie(LOGIN_COOKIE_NAME)
}

export function isToken () {
    return _getCookie(LOGIN_COOKIE_TOKEN)
}

export function authenticateSuccess (username, token) {
    _setCookie(LOGIN_COOKIE_NAME, username);
    _setCookie(LOGIN_COOKIE_TOKEN, token);
}

export function logout () {
    _removeCookie(LOGIN_COOKIE_NAME);
    _removeCookie(LOGIN_COOKIE_TOKEN);
}

function _getCookie (name) {
    // let cookie = {};
    // document.cookie.split(';').forEach(function(el) {
    //     let [k,v] = el.split('=');
    //     cookie[k.trim()] = v;
    // });
    // return cookie[name];  //上面是使用cookie的方式   测试有效
    return localStorage.getItem(name);
}

function _setCookie (name, value, expire) {
    localStorage.setItem(name, value);
    // let date = new Date();
    // date.setDate(date.getDate() + expire)
    // document.cookie = name + '=' + escape(value) + '; path=/' + (expire ? ';expires=' + date.toGMTString() : '')
}

function _removeCookie (name) {
    localStorage.removeItem(name);
}