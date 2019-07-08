import {observable, action, computed, when} from 'mobx'
import {getMaterial, getMaterialGradeSemester} from '../reducer/index'

class TextPaper {
    @observable textList = []; // 题目列表
    // @observable _textList = []; //题目列表--- 用于从记录中调取编辑，不缓存
    @observable typeList = []; // 题目类型列表
    @observable diffList = [0, 0, 0, 0, 0];
    @observable aveDiff = 0; //  试题总难度；  平均数
    @observable printDiv = false; // 试卷打印设置
    @observable isSave = false; // 试卷是否保存过
    @observable examList = []; //  试题列表
    @observable _examList = []; //  副试题列表  用于储存试题最初状态，判断试题是否发生变化

    constructor() {
        this.textList = JSON.parse(this.getStorageExamList()) || [];
        if(this.getLength > 0) {
            this.textList.filter(o => {
                const x = Math.floor((o.difficulty * 10 / 2)); //  取除数
                this.diffList[x] ++;

                this.getAveDiff(o.difficulty);
            });
        }
    }

    /**
     * 添加一个题目
     * @param item
     */
    @action addText(item) {
        this.textList.push(item);
        const x = Math.floor((item.difficulty * 10 / 2)); //  取除数
        this.diffList[x] ++;

        this.getAveDiff(item.difficulty);

        this.typeList.map(obj => {
            return obj.type === item.type? {...obj, num: obj.num ++}: obj
        });

        this.setStorageExamList();
    }

    /**
     * 添加题目类型
     * @param arr
     */
    @action addTypes(arr, bool = true) {
        this.typeList = arr.map(obj => {
            const {type, name} = obj;
            if(bool){
                const num = this.textList.filter(o => o.type === type).length;
                return {type, name, num: num};
            }else{
                const num = this._textList.filter(o => o.type === type).length;
                return {type, name, num: num};
            }
        });
    }

    /**
     * 删除一个题目
     * @param item
     */
    @action deleteText(item) {
        this.textList = this.textList.filter(obj => obj.id !== item.id);

        const x = Math.floor((item.difficulty * 10 / 2)); //  取除数
        this.diffList[x] --;

        this.typeList.map(obj => {
            return obj.type === item.type? {...obj, num: obj.num --}: obj
        });

        if(this.getLength === 0){
            this.aveDiff = 0;
        }

        this.setStorageExamList();
    }

    /**
     * 清空试题蓝
     */
    @action clearText() {
        this.textList.clear();
        this.examList.clear();
        this.aveDiff = 0;
        this.typeList = this.typeList.map(o => {return {...o, num: 0}});
        this.diffList = [0, 0, 0, 0, 0];

        this.setStorageExamList();
    }

    /**
     * 计算平均数
     * @param num
     */
    @action getAveDiff(num) {
        if(this.textList.length < 2){
            this.aveDiff = num * 5;
        }else{
            this.aveDiff = ((this.aveDiff + num * 5) / 2);
        }
        // this.aveDiff = this.aveDiff.toFixed(2);
    }
    /**
     * 判断所选题目是否被选中
     * @param id
     */
    @action isSelected(id){
        return this.textList.some(obj => obj.id === id);
    }

    /**
     * 题目长度
     * @returns {number}
     */
    @computed get getLength() {
        return this.textList.length;
    }

    /**
     * 获取试卷数据
     */
    @action getExamList(bool = true) {
        this.examList.clear();
        const username = localStorage.getItem('username');
        // when(() => this.typeList.length > 0, () =>{
             const typeList = JSON.parse(localStorage.getItem(`${username}_typeList`));
               // console.log(this.examList);
            const type = this.typeList.filter(obj => obj.num > 0);
            const getList = t => this.textList.filter(o => o.type === t);
            this.examList = type.map(obj => {
                return {...obj, list: getList(obj.type)};
            });
            this._examList = JSON.stringify(this.examList);
            console.log(this.examList);
        // })
        // if(bool){ // 如果是新建的数据，textList
        //     const typeList = JSON.parse(localStorage.getItem(`${username}_typeList`));
        //     const type = typeList.filter(obj => obj.num > 0);
        //     const getList = t => this.textList.filter(o => o.type === t);
        //     this.examList = type.map(obj => {
        //         return {...obj, list: getList(obj.type)};
        //     });
        //     this._examList = JSON.stringify(this.examList);
        // }else{ // 如果是编辑试题记录里面的数据，_textList
            // const type = this.typeList.filter(obj => obj.num > 0);
            // const getList = t => this._textList.filter(o => o.type === t);
            // this.examList = type.map(obj => {
            //     return {...obj, list: getList(obj.type)};
            // });
            // this._examList = JSON.stringify(this.examList);
        // }
    }

    /**
     * 删除试题
     * @param type
     * @param item
     */
    @action deleteChooseExam(type, item){
        const t = this.examList.filter(obj => obj.type === type);
        t[0].list = t[0].list.filter(obj => obj.id !== item.id);
        if(t[0].list.length < 1){
            this.examList.filter(obj => obj.type !== type);
        }
        this.deleteText(item);
    }

    /**
     * 交换相邻数组元素
     * @param i
     * @param j
     * @param k
     * @returns {*}
     */
    swapItems = function(i, j, k) {
        this.examList[j].list[i] = this.examList[j].list.splice(k, 1, this.examList[j].list[i])[0];
    }

    /**
     * 试题上移
     * @param i
     * @param j
     */
    @action upExam(i, j) {
        if(i === 0) return;
        this.swapItems( i, j, i - 1);
    }
    /**
     * 试题下移
     * @param i
     * @param j
     */
    @action downExam(i, j) {
        if(i === this.examList[j].list.length - 1) return;
        this.swapItems( i, j, i + 1);
    }

    /**
     * 设置打印
     */
    @action changePrint() {
        this.printDiv = !this.printDiv;
    }

   /**
     * 设置试卷是否保存过
     */
    @computed get getSaveFlag() {
        const json = JSON.stringify(this.examList);
        const json1 = JSON.stringify(this._examList);
        return json1 === json;
    }

    /**
     * 更改保存试卷标志
     */
    @action changeSave(bool) {
        this.isSave = bool;
        if(bool){
            this._examList = JSON.parse(JSON.stringify(this.examList));
        }
    }

    /**
     * 缓存试卷
     */
    setStorageExamList() {
        const username = localStorage.getItem('username');
        // localStorage.removeItem(`${username}_examList`);
        // localStorage.removeItem(`${username}_typeList`);
        localStorage.setItem(`${username}_examList`, JSON.stringify(this.textList));
        localStorage.setItem(`${username}_typeList`, JSON.stringify(this.typeList));
    }

    /**
     * 获取缓存试卷内容
     */
    getStorageExamList() {
        const username = localStorage.getItem('username');
        return localStorage.getItem(`${username}_examList`);
    }

   /**
     * 将编辑中的试题直接导入试题集
     */
    @action getTextList(arr) {
        this.textList.clear();
        this.textList = arr;
        console.log(this.textList)
        // this.getExamList(false);
    }
}

export default new TextPaper()