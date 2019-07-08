import React from 'react'
import './index.scss'
import {Row, Col, Card, Icon, message, Modal, Pagination, Button, Divider, Rate, Affix} from 'antd';
import {Link, withRouter} from 'react-router-dom'
import Point from "../../component/Point";
import {httpClient} from "../../axios/apiHelper";
import {buildTree} from "../../utils/utils";
import {autorun, reaction} from "mobx";
import {inject, observer} from "mobx-react";
import formatePaper from "../../store/formatePaper";
import textPaper from "../../store/textPaper";

const URL = {
    QUESTION: '/api/v1/question',
    SUBJECT_STAGE_QUENTION_CATEGORY: '/api/v1/subjectstagequestioncategory',
    SUBJECT_STAGE_QUENTION_TYPE: '/api/v1/subjectstagequestiontype',
    SUBJECT_STAGE_QUENTION_SOURCE: '/api/v1/subjectstagequestionsource',
}

@withRouter @inject('formatePaper') @inject('textPaper') @observer
class Home extends React.Component {
    state = {
        isVResize: false, //是否移动
        vNum: 400, //试题的宽度
        vNumLimit: 400, //限制拖动到宽度
        rightHeight: 300, //右边试题篮的高度
        marginTop: 0, //试题篮的margin-top, 当滑动之后 顶部高度改变时，固定试题篮
        questions: [],
        current: 1,
        total: 0,
        category: [],
        type: [],
        source: [],
        visible: false, //查看详情模态框
        focusQuestion: {}, // 当前聚焦的题目
        subjectStageId: '',
        paparId: '' // 试卷的ID, 用于编辑的时候判断试题蓝的显示
    }

    resizeOffsetInfo = { //初始化高度
        clientTop: 0, 
        clientLeft: 0
    }

    leftHeight = 0; // 左边试卷的高度
    footerHeight = 190; // 左边试卷的高度

    containerWidth = 0; //试卷和试题篮的宽度
    timer = false;

    params = {
        "page": 1,
        "page_count": 20
    };

    // componentWillmount(){
    //     const state = this.props.location.state;
    //     if(state){
    //         console.log(state);
    //         this.setState({paparId: state.paparId});
    //     }
    // }

    componentDidMount() {
        this.initResizeInfo(); //初始化
        this.containerWidth = document.getElementById('v_resize_container').offsetWidth;

        this.setState({
            rightHeight: document.documentElement.clientHeight - 220
        });

        // this.getQuestions();
        let timer = null;

        autorun(() => {
            const {subjectStageId} = this.props.formatePaper;

            if(this.state.subjectStageId !== subjectStageId){
                this.getSubjectType('SUBJECT_STAGE_QUENTION_CATEGORY', 'category');
                this.getSubjectType('SUBJECT_STAGE_QUENTION_TYPE', 'type');
                this.getSubjectType('SUBJECT_STAGE_QUENTION_SOURCE', 'source');
                this.setState({subjectStageId: subjectStageId});
            }

            const reaction2 = reaction(() => formatePaper.materialSubjectStageGradeSemesterUnitId,
                (materialSubjectStageGradeSemesterUnitId) => {
                    if(materialSubjectStageGradeSemesterUnitId){
                        if(timer){
                            clearInterval(timer);
                            timer = setTimeout(this.getQuestions, 200);
                        }else{
                            timer = setTimeout(this.getQuestions, 200);
                        }
                    }
                });
            const reaction3= reaction(() => formatePaper.subjectStagePointId,
                (subjectStagePointId) => {
                if(subjectStagePointId){
                    if(timer){
                        clearInterval(timer);
                        timer = setTimeout(this.getQuestions, 200);
                    }else{
                        timer = setTimeout(this.getQuestions, 200);
                    }
                }
            });
        })

        this.getQuestions();
        window.onresize = () => {
            this.initResizeInfo()
        };
        window.onscroll = () => {
            this.changeChooseHeight();
        };
    }

    componentWillUnmount() {
        window.onresize = null;
        window.onscroll = null;
    }

    /**
     * 获取滑动条的高度
     * @returns {number}
     */
    getScrollTop = () => {
        let scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop){
            scrollTop = document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    /**
     * 滑动条高度改变时，更改试题蓝的margin-top 和 显示高度
     */
    changeChooseHeight = () => {
        let height = this.getScrollTop();
        // if(height === 0) return;
        if(height < 140){
            this.setState({
                rightHeight: document.documentElement.clientHeight - 230 + height,
                marginTop: 0
            })
        }else {
            const _hei = this.state.rightHeight + height -150;
            const hEle = document.getElementById('h_resize_container');
            this.leftHeight = hEle.offsetHeight;
            if(_hei >= this.leftHeight) return;
            this.setState({
                rightHeight: document.documentElement.clientHeight - 80,
                marginTop: height -140
            })
        }
    }
    /**
     * 初始化resize信息
     */
    initResizeInfo = () => {
        const hEle = document.getElementById('h_resize_container');
        this.resizeOffsetInfo = this.getEleOffset(hEle);
        this.leftHeight = hEle.offsetHeight;
        this.containerWidth = document.getElementById('v_resize_container').offsetWidth;
        const kkk = document.getElementById('chooseFooter');
        if(kkk) {
            this.footerHeight = kkk.offsetHeight;
        }

        if(this.containerWidth < 800){
            this.setState({
                vNum: this.containerWidth - 56
            })
        // }else if(this.containerWidth < 1200){
        //     this.setState({
        //         vNumLimit: 300,
        //         vNum: this.containerWidth - this.state.vNumLimit
        //     })
        }else{
            this.setState({
                vNumLimit: 400,
                vNum: this.containerWidth - this.state.vNumLimit
            })
        }
    }

    /**
     * 获取元素的偏移信息
     */
    getEleOffset(ele) {
        let clientTop = ele.offsetTop;
        let clientLeft = ele.offsetLeft;
        let current = ele.offsetParent;
        while (current !== null) {
            clientTop += current.offsetTop;
            clientLeft += current.offsetLeft;
            current = current.offsetParent
        }
        return {
            clientTop,
            clientLeft,
            height: ele.offsetHeight,
            width: ele.offsetWidth
        }
    }


    /**
     * 开始拖动试题
     */
    vResizeDown = () => {
        this.setState({
            isVResize: true
        })
    }

    /**
     * 拖动时改变宽度
     */
    vResizeOver = (e) => {
        const { isVResize, vNum, vNumLimit } = this.state
        if (isVResize && vNum >= vNumLimit && (this.containerWidth - vNum >= vNumLimit)) {
            let newValue = e.clientX - this.resizeOffsetInfo.clientLeft
            if (newValue < vNumLimit) {
                newValue = vNumLimit
            }
            if (newValue > this.containerWidth - vNumLimit) {
                newValue = this.containerWidth - vNumLimit
            }
            this.setState({
                vNum: newValue
            })
        }
    }

    /**
     * 只要鼠标松开或者离开区域，那么就停止resize
     */
    stopResize = () => {
        this.setState({
            isVResize: false
        })
    };

    toPaper = () => {
        // this.props.textPaper.getExamList();
        this.props.history.push('/paper');
    };

    getQuestions = (_current = 1) => {
        const {materialSubjectStageGradeSemesterUnitId, type, category, source, difficulty, subjectStagePointId} = this.props.formatePaper;
        this.setState({marginTop: 0});
        if(!(subjectStagePointId || materialSubjectStageGradeSemesterUnitId)) return;

        let request = {
            type: type,
            category: category,
            source: source,
            difficulty: difficulty,
            subject_stage_point_id: subjectStagePointId,
            material_subject_stage_grade_semester_unit_id: materialSubjectStageGradeSemesterUnitId,
            order: 2
        };
        this.params.page = _current;
        httpClient.get({
            url: URL.QUESTION,
            queryParams: {...this.params, ...request},
            success: (res) => {
                // console.log(res.data)
                let type = this.state.type;
                const gettypename = (id) => {
                    const t = type.filter((obj) => obj.type === id);
                    return t[0].name;
                };
                const data = res.data.map((item) => {
                    return {...item, selected: this.props.textPaper.isSelected(item.id), typename: gettypename(item.type)}
                });
                this.setState({questions: data, total: res.data_total, current: this.params.page}, () => {
                    this.initResizeInfo();
                    this.toggleSH();
                })
            }
        });
    }
    /**
     * next  page
     * @param page
     */
    onChangePage = (page) => {
        if(page > this.state.total/20) {
            message.warning('请选择正确页码');
            return;
        }
        this.getQuestions(page);
    }
    // ant-pagination-options-quick-jumper

    onChangePage1 = () => {
        const page = window.document.getElementsByClassName('ant-pagination-options-quick-jumper')[0].getElementsByTagName('input')[0];
        if(page.value){
            this.onChangePage(page.value - 0);
        }else{
            message.warning('请填写页码');
        }
    }

    getSubjectType = (url, stateKey) => {
        const _id = this.props.formatePaper.subjectStageId;
        _id &&httpClient.get({
            url: URL[url],
            queryParams: {...this.params, subject_stage_id: _id},
            success: (res) => {
                if(stateKey === 'type' && this.props.textPaper.typeList.length !== res.data.length){
                    this.props.textPaper.addTypes(res.data);
                }
                const all = {id: '', name: '全部'};
                let da = res.data;
                da.unshift(all);
                const data1 = da.map((item) => {
                    return {...item, active: false}
                });
                let data = {};

                data[stateKey] = data1;
                this.setState({...data})
            }
        });
    }

    changeType = (key, id) => {
        key && this.props.formatePaper.changeMaterialSubjectStageID(key, id);
        this.getQuestions();
    }
    /**
     * 查看解析
     * */
    showModal = (item) => {
        this.setState({visible: true, focusQuestion: item});
    }
    /**
     * 查看或隐藏答案
     * */
    toggleAnswer = () => {
        this.props.formatePaper.toggleAnswer();
        // const answer = this.props.formatePaper.seeAnswer;
        this.toggleSH();
    }
    /**
     * 隐藏答案的控制
     * */
    toggleSH = () => {
        const allS = document.getElementsByClassName('s');
        const allQuizPutTag = document.getElementsByClassName('quizPutTag');
        const seeAnswer = this.props.formatePaper.seeAnswer;
        if (!seeAnswer) {
            for (let i = 0; i < allS.length; i++) {
                let s = allS[i];
                s.classList.remove('sh');
            }
            for (let i = 0; i < allQuizPutTag.length; i++) {
                let s = allQuizPutTag[i];
                let answer = s.nextSibling.nextSibling.firstChild.cloneNode();
                s.innerHTML = '';
                s.append(answer);
            }

        } else {
            for (let i = 0; i < allS.length; i++) {
                let s = allS[i];
                s.classList.add('sh');
            }
            for (let i = 0; i < allQuizPutTag.length; i++) {
                let s = allQuizPutTag[i];
                s.innerHTML = ' ';
            }

        }
    }

    /**
     * 添加题目
     * */
    addText = (item) => {
        item.selected = true;
        item && this.props.textPaper.addText(item);
    }
    /**
     * 删除题目
     * */
    deleteText = (obj) => {
        obj && this.props.textPaper.deleteText(obj);
        this.setState({
            questions: this.state.questions.map((item) => {
            if(obj.id === item.id) return {...item, selected: false};
                return {...item}
            })
        })
    }

    clearText = () => {
        this.props.textPaper.clearText();
        // this.getQuestions();
        this.setState({questions: this.state.questions.map((item) => {
                return {...item, selected: false}
            })})
    }

    render() {
        const {questions, current, total, isVResize, vNum, visible, focusQuestion, paperId} = this.state;
        const {category, type, source, difficulty, seeAnswer} = this.props.formatePaper;
        const {textList, diffList, aveDiff, getLength,typeList} = this.props.textPaper;
        const vCursor = isVResize ? 'col-resize' : 'default';
        const vColor = isVResize ? '#ddd' : '#fff';
        const quesDiff = [{name: '全部', id: ''}, {name: '易', id: 1},{name: '较易', id: 2},{name: '中档', id: 3},{name: '较难', id: 4},{name: '难', id: 5}];
        const diffListStr = ['易', '较易', '中档', '较难' , '难'];
        const menu = (
            <div className='menu-list'>
                <ul  className='menu-list-one'>
                    <li>题型</li>
                    <li className='menu-list-btn'>
                        {this.state.type.map((item) => {
                            return <a href="javascript:;" className={item.id === type ? 'active': ''} key={'key' + item.id} onClick={this.changeType.bind(this, 'type', item.id)}>{item.name}</a>
                        })}
                    </li>
                </ul>
                <ul  className='menu-list-one'>
                    <li>题类</li>
                    <li className='menu-list-btn'>
                        {this.state.category.map((item) => {
                            return <a href="javascript:;" className={item.id === category ? 'active': ''} key={'key' + item.id} onClick={this.changeType.bind(this, 'category', item.id)}>{item.name}</a>
                        })}
                    </li>
                </ul>
                <ul  className='menu-list-one'>
                    <li>难度</li>
                    <li className='menu-list-btn'>
                        {quesDiff.map((item) => {
                            return <a href="javascript:;" className={item.id === difficulty ? 'active': ''} key={'key' + item.id} onClick={this.changeType.bind(this, 'difficulty', item.id)}>{item.name}</a>
                        })}
                    </li>
                </ul>
                <ul  className='menu-list-one'>
                    <li>来源</li>
                    <li className='menu-list-btn'>
                        {this.state.source.map((item) => {
                            return <a href="javascript:;" className={item.id === source ? 'active': ''} key={'key' + item.id} onClick={this.changeType.bind(this, 'source', item.id)}>{item.name}</a>
                        })}
                    </li>
                </ul>
                {total>0 && <div>
                    <p style={{textAlign: 'right'}}><a href="javascript:;" title='点击查看或者隐藏答案' onClick={this.toggleAnswer}>{seeAnswer ?<span><Icon type="eye" /> 显示</span>:<span><Icon type="eye-invisible" /> 隐藏</span>}答案</a> 当前有<span style={{color:　'red'}}> {total} </span>题</p>
                </div>}
            </div>
        )
        return (
            <div className='content'  onMouseUp={this.stopResize} onMouseLeave={this.stopResize}>
                    <div className='point-div'>
                        <Affix offsetTop={60}>
                            <Point></Point>
                        </Affix>
                    </div>
                <div id='v_resize_container' className='container' onMouseMove={this.vResizeOver}>
                    {/*选题部分*/}
                    <div id='h_resize_container' className='qus' style={{ width: vNum, cursor: vCursor, height: '100%' }}>
                        <div className='qus-type'>
                            {menu}
                        </div>
                        <div className='qus-content'>
                            {questions.length > 0 ? <div>{questions.map((item, i) => {
                                    return <div className={`qus-card ${item.selected? 'selected': null}`} key={item.id}>
                                    <div className='qus-card-header'>
                                    <span>题型：{item.typename}</span><Divider type='vertical'/>
                                    <span>难易度：{item.difficulty}</span><Divider type='vertical'/>
                                    </div>
                                    <div className='qus-card-content'>
                                        <span style={{fontSize: 14}}>{i + 1}.</span>
                                        <div style={{marginLeft: '25px',marginTop: '-16px'}} dangerouslySetInnerHTML={{__html: item.content}}></div>
                                    </div>
                                    <div className='qus-card-footer'>
                                    <a href="javascript:;" onClick={this.showModal.bind(this, item)}><Icon type='file'/> 查看解析</a>
                                    <Button type={item.selected?'':'primary'} onClick={!item.selected? this.addText.bind(this, item): this.deleteText.bind(this, item)}>{!item.selected? '+ 试题篮': '- 试题篮'}</Button>
                                    </div>
                                    </div>
                                })}
                                    <div style={{textAlign: 'right',position: 'relative'}}>
                                        <div style={{marginRight: '80px'}}><Pagination current={current} onChange={this.onChangePage} total={total} showQuickJumper/></div>
                                        <Button style={{ position: 'absolute',right: 0, top: 0}} onClick={this.onChangePage1}>确认</Button>
                                    </div>
                                </div>
                                : <p className='text-center'>当前没有数据。</p>}

                        </div>
                    </div>
                    {this.containerWidth > 800 && <div style={{right: this.containerWidth - vNum -8, backgroundColor: vColor }} draggable={false}
                         title='左右拖动我，可以调整宽度哟'
                         onMouseDown={this.vResizeDown} className={'v-resize'} />}
                    {/*试题篮部分*/}
                    {this.containerWidth > 800 ?<div className='choose' style={{width: this.containerWidth - vNum - 10, cursor: vCursor}}>
                        <div className='choose-main' style={{height: this.state.rightHeight, marginTop: this.state.marginTop, borderColor: getLength > 0?'#b7c5f8':'#fff' }}>
                            <div className='choose-header'>
                                <p className='choose-num' style={{opacity: getLength > 0 ?1: 0.7}}>{getLength}</p>
                                <ul className='choose-type'>
                                    {diffList.map((x, i) => {
                                        return <li key={`key${i}`}><span>{x}</span> {diffListStr[i]}</li>
                                    })}
                                </ul>
                            </div>
                            <div className='choose-content'>
                                <h1 className='choose-title'>题目 {getLength > 0?<a href="javascript:;" style={{float: 'right',marginRight: 10}} onClick={this.clearText}>清空</a>: ''}</h1>
                               <ul className='choose-content-list' style={{height: this.state.rightHeight - this.footerHeight - 160}}>
                                    {getLength > 0 ? textList.map((item, i) => {
                                    return <li key={item.id}>
                                        <span style={{fontSize: 14}}>{i + 1}.</span>
                                        <div  style={{marginLeft: '25px',marginTop: '-16px'}} className='question-show' dangerouslySetInnerHTML={{__html: item.content}} onClick={this.showModal.bind(this, item)}></div>
                                        <p className='choose-time'>难度：{item.difficulty}</p>
                                        <a href='javascript:;' className='delete' title='点击移除该题' onClick={this.deleteText.bind(this, item)}><Icon type='delete'/></a>
                                    </li>})
                                        :<p>ヽ(✿ﾟ▽ﾟ)ノ： 这里空空的，赶紧加点题目进来</p>}
                                </ul>
                            </div>
                            <div className='choose-footer' id='chooseFooter'>
                                <p className='choose-footer-type'>
                                    {typeList.map(obj => {
                                        return <span key={obj.type}>{obj.name}: <span>{obj.num}</span></span>;
                                    })}
                                </p>
                                <h2 className='difficult'>
                                    <span>试题总难度</span>
                                    <div className='difficult-rate'>
                                        <Rate allowHalf value={aveDiff} style={{fontSize: 22}} disabled/>
                                    </div>
                                </h2>
                                <div className='paper-btn'>
                                    <button disabled={textList.length < 1} style={{background: textList.length < 1?'#ccc':''}} onClick={this.toPaper}>试题设置 <Icon type="arrow-right"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :<div className='small-button' style={{opacity: getLength > 0 ?1: 0.7, top: this.state.marginTop> 0?'60px':'200px'}} title='前往试题设置' onClick={this.toPaper}>
                            <span>{getLength}</span>
                            <p>试题设置
                                <Icon type="arrow-right"/>
                            </p>
                    </div>
                    }
                </div>
                <Modal title="查看解析"
                    visible={visible}
                       width={700}
                    onOk={() => {this.setState({visible: false})}}
                    onCancel={() => {this.setState({visible: false})}}>
                    <div dangerouslySetInnerHTML={{__html: focusQuestion.content}}></div>
                </Modal>
            </div>
        )
    }
}


export default Home

