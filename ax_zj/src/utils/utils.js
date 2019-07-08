/**
 * 对数组对象的数据转换成树状
 * @param data
 * @returns {*}
 */
export function buildTree(data) {
  let parents = data.filter(value => value.parent_id == 'undefined' || value.parent_id == null);
  let children = data.filter(value => value.parent_id !== 'undefined' && value.parent_id != null);
  let translator = (parents, children) => {
    parents.forEach((parent) => {
          children.forEach((current, index) => {
                if (current.parent_id === parent.id) {
                  let temp = JSON.parse(JSON.stringify(children));
                  temp.splice(index, 1);
                  translator([current], temp);
                  typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                }
              }
          )
        }
    )
  };
  translator(parents, children);
  return parents;
}

/**
 * 分页
 * @param page
 * @param callback
 * @returns {{onChange: onChange, current: *, pageSize: number, total: number, showTotal: (function(): string), showQuickJumper: boolean}}
 */

export function pagination(page, callback) {
    return {
        onChange: (current) => {
            callback(current)
        },
        current: page.page,
        pageSize: page.page_count,
        total: page.data_total,
        showTotal: () => {
            return `total:${page.data_total}`
        },
        showQuickJumper: page.data_total > page.page_count
    }
}


/**
 * Map转对象
 * @param strMap
 * @returns {any}
 */
export function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

/**
 * 图片预加载
 * @param arr
 * @constructor
 */
export function preloadingImages(arr) {
  arr.forEach(item=>{
    const img = new Image()
    img.src = item
  })
}

export function inject_unount (target){
        // 改装componentWillUnmount，销毁的时候记录一下
        let next = target.prototype.componentWillUnmount
        target.prototype.componentWillUnmount = function () {
            if (next) next.call(this, ...arguments);
            this.unmount = true
         }
         // 对setState的改装，setState查看目前是否已经销毁
        let setState = target.prototype.setState
        target.prototype.setState = function () {
            if ( this.unmount ) return ;
            setState.call(this, ...arguments)
        }
    }





