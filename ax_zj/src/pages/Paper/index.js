import React from 'react'
import './index.scss'
import {
    Row,
    Col,
    Card,
    Icon,
    message,
    Radio,
    Menu,
    Button,
    Divider,
    InputNumber,
    Checkbox,
    Form,
    Input,
    Modal,
    Select,
    DatePicker, Affix
} from 'antd';
import {Link, withRouter} from 'react-router-dom'
import {inject, observer} from "mobx-react";
import {httpClient} from "../../axios/apiHelper";
import {strMapToObj, inject_unount} from "../../utils/utils";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;

const NUMBER_ZN = ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三'];
const NUMBER_ROMA = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ'];
const checkBoxValue = {
    value1: ['has_score_area'],
    value2: ['has_subhead','has_page_info','has_student_info','has_group_question','has_score_area'],
    value3: ['has_subhead','has_page_info','has_sbsection','has_group_question','has_score_area','has_seal_line','has_announcements','has_main_title']
};
const URL = {
    PAPER: '/api/v1/paper',
    SUBJECT_STAGE_QUENTION_TYPE: '/api/v1/subjectstagequestiontype',
}
const user = localStorage.getItem('username');


@withRouter @inject('formatePaper') @inject('textPaper') @observer @inject_unount
class Paper extends React.Component {
    state = {
        dataSearch: {}, //搜索表单数据
        dataSource: [], // 表格数据
        iconLoading: false,
        visible: false,
        focusQuestion: {},
        displayNone: false,
        checkBoxValueList: [],
        radioGroupValue: 'value3',
        groupBoxValue: checkBoxValue.value3,
        testMainTitle: '', // 试卷的主标题
        paperId: ''
    };

    componentWillMount() {
        const state = this.props.location.state;

        console.log(state)
        const list = ['has_subhead','has_page_info','has_student_info','has_sbsection','has_group_question','has_score_area','has_seal_line','has_announcements','has_main_title'];
        let map = new Map();
        list.map(k => {
            map.set(k, true);
        });
        map.set('has_student_info', false);
        this.setState({checkBoxValueList: map});

        if(state) { // 编辑试题
            this.getRecord(state.id);
            this.setState({paperId: state.id});
            localStorage.setItem('paperId',state.id);
        }else{ // 新建试题
            this.getNewPaper();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.toggleSH();
    }

    getRecord = (id) => {
        httpClient.get({
            url: `${URL.PAPER}/${id}`,
            success: (res) => {
                console.log(res)
                this.props.textPaper.getTextList(res.details);
                this.setState({testMainTitle: res.title});
                this.getSubjectType(res.subject_stage_id);

                const _checkBoxValueList = new Map();
                Object.keys(res).forEach(function(key){
                    if(key.substr(0,4) === 'has_'){
                        _checkBoxValueList.set(key, res[key]);
                    }
                });
                this.setState({checkBoxValueList: _checkBoxValueList});
    
                // this.props.formatePaper.changeSubjectStageId(res.subject_id, res.subject_stage_id);

                // details: (14) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                // difficulty: 4
                // has_announcements: true
                // has_group_question: true
                // has_main_title: true
                // has_page_info: true
                // has_sbsection: true
                // has_score_area: true
                // has_seal_line: true
                // has_student_info: false
                // has_subhead: true
                // id: 12
                // subject_stage_id: 1
                // title: "xiaoju的高中数学组卷"id: 29
                // stage: "高中"
                // subject_id: 1
                // subject_stage_id: 1
            }
        });
    }

    getNewPaper = () => {
        if(this.props.textPaper.examList){
            this.props.textPaper.getExamList();
        }
        const set = localStorage.getItem(`${user}_testSetting`);
        if(set){
            this.setState({radioGroupValue: set, groupBoxValue: checkBoxValue[set]});
        }
        this.setState({testMainTitle: `${user}的${localStorage.getItem(`${user}_ss`)}组卷`});
    }

    getData = (data) => {
        this.setState({
            dataSearch: data
        })
    };

    getSubjectType = (_id) => {
        _id &&httpClient.get({
            url: URL.SUBJECT_STAGE_QUENTION_TYPE,
            queryParams: {subject_stage_id: _id},
            success: (res) => {
                if(this.props.textPaper.typeList.length !== res.data.length){
                    this.props.textPaper.addTypes(res.data);
                    this.props.textPaper.getExamList(true);
                }
            }
        });
    }
    /**
     * 查看解析
     * */
    showModal = (item) => {
        this.setState({visible: true, focusQuestion: item});
    }

    /**
     * 隐藏答案的控制
     * */
    toggleSH = () => {
        const allS = document.getElementsByClassName('s');
        const allQuizPutTag = document.getElementsByClassName('quizPutTag');
        for (let i = 0; i < allS.length; i++) {
            let s = allS[i];
            s.classList.add('sh');
        }

        for (let i = 0; i < allQuizPutTag.length; i++) {
            let s = allQuizPutTag[i];
            s.innerHTML = ' ';
        }
    }

    /**
     * 上移试题
     * */
    upExam = (i, j) => {
        this.props.textPaper.upExam(i, j);
    }
    /**
     * 下移试题
     * */
    downExam = (i, j) => {
        this.props.textPaper.downExam(i, j);
    }
    /**
     * 删除试题
     * */
    deleteChooseExam = (type, item) => {
        this.props.textPaper.deleteChooseExam(type, item);
    }

    /**
     * 保存试题
     * */
    savePaper = () => {
        this.setState({iconLoading: true});
        const {subjectStageId} = this.props.formatePaper;
        const {aveDiff, textList} = this.props.textPaper;
        const {testMainTitle} = this.state;

        const has = strMapToObj(this.state.checkBoxValueList);
        const getJson = v => {
            return v.map(o => {
                const que = JSON.parse(JSON.stringify(o));
                const pa = {
                    "question_id": 0,
                    "score": 0,
                    "sort": 0
                };
                pa.question_id = que.id;
                return pa;
            })
        };
        const param = {
            subject_stage_id: subjectStageId,
            title: testMainTitle,
            difficulty: aveDiff.toFixed(0) - 0,
            questions: getJson(textList.slice()),

        };
        // console.log({...param, ...has});

        httpClient.post({
            url: URL.PAPER,
            body: {...param, ...has},
            success: (res) => {
                message.success('保存成功');
                this.props.textPaper.changeSave(true);
                this.setState({iconLoading: false});
            }
        });
    };

        /**
     * 打印试卷
     * */
    onPrint = () => {
        // const {printDiv} = this.props.textPaper;
        this.props.textPaper.changePrint();
        this.setState({displayNone: true}, () => {
            const print = window.document.getElementById('myText').innerHTML;
            window.document.getElementById('myPrint').innerHTML = print;
            // execScript('document.getElementById("wb").execwb 6, 2, 3','vbscript');
            window.print();
            // document.getElementById('WebBrowser').ExecWB(6,2);

            this.setState({displayNone: false});
            this.props.textPaper.changePrint();
        })
    }

    /**
     * 改变试卷配置
     * */
    changeRadioGroup = (e) => {
        const map = new Map();
        checkBoxValue[e.target.value].map(k => {
            map.set(k, true);
        });
        localStorage.setItem(`${user}_testSetting`, e.target.value);
        this.setState({radioGroupValue: e.target.value, groupBoxValue: checkBoxValue[e.target.value], checkBoxValueList: map})
    }

    clearText = () => {
        // localStorage
        this.props.textPaper.clearText();
        this.props.textPaper.examList.clear();
        localStorage.setItem(`${user}_typeList`, '');
        this.props.history.push('/');
    }
    /**
     * 继续选题
     * */
    continueText = () => {
        // localStorage
        if(this.state.paperId){
            this.props.history.push({pathname: '/', state: {paparId: this.state.paperId}});
        }else{
            this.props.history.push('/');
        }
        
    }

    /**
     * 改变试卷配置项
     * */
    changeGroup = (value) => {
        const map = new Map();
        value.map(k => {
            map.set(k, true);
        });
        this.setState({groupBoxValue: value, checkBoxValueList: map});
    }

    render() {
        const {examList, printDiv, isSave, getSaveFlag} = this.props.textPaper;
        const {visible, focusQuestion, displayNone, radioGroupValue, groupBoxValue, checkBoxValueList,testMainTitle, iconLoading} = this.state;
        const edit = {contentEditable: true, suppressContentEditableWarning: true};
        /**
         * 获取试题序号
         * @param i
         * @param j
         * @returns {*}
         */
        const getNum = (i, j) => {
            let s = 0;
            for(let k =0; k < i; k++){
                s += examList[k].list.length;
            }
            return s + j + 1
        };
        /**
         * 显示或隐藏配置项
         * */
        const getDisplay = (value) => {
            return {display: checkBoxValueList.get(value)?'block':'none'}
        }
        // overflow: 'auto', position: 'fixed',top: 0,bottom: 0
        return (
            <div>
                <div id='myPrint' style={{display: printDiv? 'block': 'none', width: '100%',height:'100%', background: '#fff', zIndex: 9999}}></div>
                <div className='content80' style={{display: !printDiv? 'block': 'none'}}>
                        <div className='paper'>
                            <Row>
                                <Col span={6}>
                                    <Affix offsetTop={60}>
                                        <div className='paper-set'>
                                            <h1 className='paper-set-title'>试卷设置</h1>
                                            <div className='paper-type'>
                                                <RadioGroup defaultValue={radioGroupValue} onChange={this.changeRadioGroup}>
                                                    <Radio value={'value1'}>简易</Radio>
                                                    <Radio value={'value2'}>普通</Radio>
                                                    <Radio value={'value3'}>正式</Radio>
                                                </RadioGroup>
                                            </div>
                                            <div className='paper-setting'>
                                                <Checkbox.Group style={{width: '100%'}} value={groupBoxValue} onChange={this.changeGroup}>
                                                    <Row>
                                                        <Col span={12}><Checkbox value="has_subhead">副标题</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_page_info">试卷信息</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_student_info">考生信息</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_sbsection">分卷及注释</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_group_question">总分栏</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_score_area">大题评分区</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_seal_line">密封线</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_announcements">注意事项</Checkbox></Col>
                                                        <Col span={12}><Checkbox value="has_main_title">保密标记</Checkbox></Col>
                                                    </Row>

                                                </Checkbox.Group>
                                            </div>
                                        </div>
                                        <div className='paper-btn'>
                                            <Row>
                                                <Col span={12}>
                                                    <Button onClick={() => {this.props.history.push('/')}}>继续选题</Button>
                                                </Col>
                                                <Col span={12}><Button  type={'primary'} loading={iconLoading} disabled={getSaveFlag} onClick={this.savePaper}><Icon type='save'/>{isSave?'已保存':'保存'}</Button></Col>
                                            </Row>
                                            <Row style={{marginTop: 10}}>
                                                <Col span={12}>
                                                    <Button type='danger' onClick={this.clearText}>清空选题</Button>
                                                </Col>
                                                <Col span={12}>
                                                    <Button type={'primary'} onClick={this.onPrint}>打印</Button>
                                                </Col>
                                            </Row>
                                            {/*<div className='to-work'>*/}
                                                {/*/!*<button className='' onClick={this.onPrint}><Icon type='download'/> 打印作业</button>*!/*/}
                                            {/*</div>*/}
                                        </div>
                                    </Affix>
                                </Col>

                                <Col span={18}>
                                    <div className='test' id='myText'>
                                        <div className='test-seal' style={{...style.testSeal, opacity: checkBoxValueList.get('has_seal_line')?1:0 }}>
                                            <img src={require('../../assets/img/peal_line.png')} alt="密封线"/>
                                        </div>
                                        <div className='test-main' style={style.testMain}>
                                            <div className='test-head'>
                                                <div className='test-mark' title='点击设置“保密标记”' style={{...style.testMark, ...getDisplay('has_main_title')}} ref="mark" {...edit}>绝密★启用前</div>
                                                <div className='test-title' style={{textAlign: 'center'}}>
                                                    <input type="text" title="点击设置“试卷主标题”"
                                                           style={style.testMaintitle}
                                                           className="test-maintitle" defaultValue={testMainTitle}
                                                           placeholder={`请输入4至60字的试卷名称，例如“${new Date().getFullYear()}年中考压轴题精选”“${new Date().getFullYear()}年XXX专题训练”`}
                                                           onChange={e => {
                                                               this.setState({testMainTitle: e.target.value})
                                                           }}
                                                    />

                                                    <div className="test-subtitle" title="点击设置“试卷副标题”" style={{...style.subtitle, ...getDisplay('has_subhead')}} ref='subtitle' contentEditable="true" suppressContentEditableWarning>试卷副标题</div>
                                                    <div className="test-testinfo" style={{...style.testTestinfo, ...getDisplay('has_page_info')}}
                                                         title="点击设置&quot;试卷信息栏&quot;" {...edit}>考试范围：xxx；考试时间：100分钟；命题人：xxx
                                                    </div>
                                                    <div className="test-studentinfo" title="点击设置&quot;考生信息填写栏&quot;" style={{...style.testStudentinfo, ...getDisplay('has_student_info')}}  {...edit}>
                                                        学校:___________姓名：___________班级：___________考号：___________
                                                    </div>
                                                    <div className="test-score" title="点击设置&quot;试卷誊分栏&quot;" style={{...style.testScore, ...getDisplay('has_group_question')}}>
                                                        <table align="center" border="1" cellPadding="0" cellSpacing="0" style={style.testScoreTable}>
                                                            <tbody>
                                                            <tr>
                                                                <td width="80" align="center" style={{padding: '.8em 1.2em'}}>题号</td>
                                                                {examList.length > 0 && examList.map((item, i) => {
                                                                    return <td width="60"  style={{padding: '.8em 1.2em'}} align="center" key={`kk${item.type}`}>{NUMBER_ZN[i]}</td>
                                                                })}
                                                            </tr>
                                                            <tr>
                                                                <td align="center"  style={{padding: '.8em 1.2em'}}>得分</td>
                                                                {examList.length > 0 && examList.map((item) => {
                                                                    return <td key={`klk${item.type}`}  style={{padding: '.8em 1.2em'}}></td>
                                                                })}
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="test-notice" title="点击设置&quot;考生注意事项栏&quot;" style={{...style.testNotice, ...getDisplay('has_announcements')}}>
                                                        <div className="test-noticetip" {...edit} style={{marginBottom: 10}}>※注意事项：</div>
                                                        <div className="test-noticetext">
                                                            <p style={{marginBottom: '10px', textIndent: '0.5em', color: '#999'}} {...edit}>1．答题前填写好自己的姓名、班级、考号等信息</p>
                                                            <p style={{marginBottom: 10, textIndent: '0.5em', color: '#999'}} {...edit}>2．请将答案正确填写在答题卡上</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {examList.length > 0 && examList[0].type === 1 && <div className='test-body' style={style.testBody}>
                                                <div className='testpart'>
                                                    <div className='parthead' style={getDisplay('has_sbsection')}>
                                                        <div className="">
                                                            <div className="partname" style={style.partname} {...edit}>
                                                                第{NUMBER_ROMA[0]}卷（选择题）
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*试卷部分*/}
                                                    <div className="partbody">
                                                        {examList.length > 0 && examList.map((obj, i) =>{
                                                            if(obj.type !== 1) return;
                                                            return <div className="questype" style={style.questype} key={`exam${obj.type}`}>
                                                                <div className="questypehead" style={style.questypehead}>
                                                                    <div className="questypeheadbox" style={{height: '40px'}}>
                                                                        <table title="评分栏" border="1" cellPadding="0"
                                                                               cellSpacing="0" style={{...style.questypeheadtable, ...getDisplay('has_score_area')}}>
                                                                            <tbody>
                                                                            <tr>
                                                                                <td width="55" height="20"
                                                                                    align="center">&nbsp;评卷人&nbsp;</td>
                                                                                <td width="55"
                                                                                    align="center">&nbsp;得&nbsp;&nbsp;分&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td height="30"
                                                                                    align="center">&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className="test-subjectnote" style={{...style.testSubjectnote, left: checkBoxValueList.get('has_score_area')?'130px':'0'}} cate="1" {...edit}>
                                                                            {NUMBER_ZN[i]}．{obj.name}（共{obj.list.length}小题）
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='questype-body'>
                                                                    <ul className="list-box">
                                                                        {obj.list.map( (item, j) => {
                                                                            return  <li key={`examlist${item.id}`}>
                                                                                <fieldset className="quesborder" style={style.quesborder}>
                                                                                    <span style={{fontSize: 14}}>{i + j + 1}. </span>
                                                                                    <div style={{marginLeft: '25px',marginTop: '-25px'}} dangerouslySetInnerHTML={{__html: `${item.content}`}}></div>
                                                                                </fieldset>
                                                                                <div className="quesfoot" style={{opacity: displayNone? '0': ''}}>
                                                                                    <div className="quesfoot-left" onClick={this.showModal.bind(this, item)}>
                                                                                        <Icon type='smile'/> 查看解析
                                                                                    </div>
                                                                                    <div className="quesfoot-right">
                                                                                        <InputNumber />分 <Divider type="vertical"/>
                                                                                        {j !== 0?<span><a href="javascript:;" onClick={this.upExam.bind(this, j, i)}>上移</a> <Divider type="vertical"/></span>: ''}
                                                                                        {j !== obj.list.length-1 ?<span><a href="javascript:;" onClick={this.downExam.bind(this,j, i)}>下移</a> <Divider type="vertical"/></span>: ''}
                                                                                        <a href="javascript:;" onClick={this.deleteChooseExam.bind(this, obj.type, item)}>删除</a> <Divider type="vertical"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            </div>}

                                            {examList.length > 0 && (examList[0].type!==1 || examList[1].type !==1) && <div className='test-body' style={style.testBody}>
                                                <div className='testpart'>
                                                    <div className='parthead' style={getDisplay('has_sbsection')}>
                                                        <div className="">
                                                            <div className="partname" style={style.partname} {...edit}>
                                                                第{examList[0].type===1?NUMBER_ROMA[1]:NUMBER_ROMA[0]}卷（非选择题）
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*试卷部分*/}
                                                    <div className="partbody">
                                                        {examList.map((obj, i) =>{
                                                            if(obj.type === 1) return;
                                                            return <div className="questype" style={style.questype} key={`exam${obj.type}`}>
                                                                <div className="questypehead" style={style.questypehead}>
                                                                    <div className="questypeheadbox" style={{height: '40px'}}>
                                                                        <table title="评分栏" border="1" cellPadding="0"
                                                                               cellSpacing="0" style={{...style.questypeheadtable, ...getDisplay('has_score_area')}}>
                                                                            <tbody>
                                                                            <tr>
                                                                                <td width="55" height="20"
                                                                                    align="center">&nbsp;评卷人&nbsp;</td>
                                                                                <td width="55"
                                                                                    align="center">&nbsp;得&nbsp;&nbsp;分&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td height="30"
                                                                                    align="center">&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div className="test-subjectnote" style={{...style.testSubjectnote, left: checkBoxValueList.get('has_score_area')?'130px':'0'}} cate="1" {...edit}>
                                                                            {NUMBER_ZN[i]}．{obj.name}（共{obj.list.length}小题）
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='questype-body'>
                                                                    <ul className="list-box">
                                                                        {obj.list.map( (item, j) => {
                                                                            return  <li key={`examlist${item.id}`}>
                                                                                <fieldset className="quesborder" style={style.quesborder}>
                                                                                    <span style={{fontSize: 14}}>{i + j + 1}. </span>
                                                                                    <div style={{marginLeft: '25px',marginTop: '-25px'}} dangerouslySetInnerHTML={{__html: `${item.content}`}}></div>
                                                                                </fieldset>
                                                                                <div className="quesfoot" style={{opacity: displayNone? '0': ''}}>
                                                                                    <div className="quesfoot-left" onClick={this.showModal.bind(this, item)}>
                                                                                        <Icon type='smile'/> 查看解析
                                                                                    </div>
                                                                                    <div className="quesfoot-right">
                                                                                        <InputNumber />分 <Divider type="vertical"/>
                                                                                        {j !== 0?<span><a href="javascript:;" onClick={this.upExam.bind(this, j, i)}>上移</a> <Divider type="vertical"/></span>: ''}
                                                                                        {j !== obj.list.length-1 ?<span><a href="javascript:;" onClick={this.downExam.bind(this,j, i)}>下移</a> <Divider type="vertical"/></span>: ''}
                                                                                        <a href="javascript:;" onClick={this.deleteChooseExam.bind(this, obj.type, item)}>删除</a> <Divider type="vertical"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Modal title="查看解析"
                               visible={visible}
                               width={700}
                               onOk={() => {this.setState({visible: false})}}
                               onCancel={() => {this.setState({visible: false})}}
                        >
                            <div dangerouslySetInnerHTML={{__html: focusQuestion.content}}></div>
                        </Modal>
                    </div>
            </div>
        )
    }
}


export default Paper


const style = {
    testSeal: { width: '58px', height: '907px', position: 'absolute', left: '15px', top: '0'},
    testMain: {marginLeft: '80px', padding: '0 20px 0 15px'},
    testMark: {
        color: '#1092ed',
        fontWeight: 'bold',
        paddingLeft: '20px',
        lineHeight: '30px',
        textAlign: 'left',
        marginTop: '8px',
    },
    testMaintitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        lineHeight: '40px',
        borderColor: 'transparent',
        display: 'block',
        textAlign: 'center',
        width: '100%',
        margin: '1px auto',
        height: '40px'
    },
    subtitle: {
        lineHeight: '30px',
        fontSize: '18px',
    },
    testTestinfo:{
        textAlign: 'center',
        lineHeight: '48px'
    },
    testStudentinfo: {
        position: 'static',
        display: 'none',
        textAlign: 'center',
    },
    testScore: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    testScoreTable:{
        margin: '0 auto',
        border: 'initial',
        borderColor: '#DCDCDC'
    },
    testNotice: {
        color: '#999999',
        textAlign: 'left'
    },
    testBody: {
        marginBottom: '0',
        marginTop: '20px'
    },
    partname: {
        lineHeight: '46px',
        fontSize: '18px',
        background: '#ececec',
        textAlign: 'center'
    },
    partnote: {
        color: '#666666',
        textAlign: 'left',
        lineHeight: '32px'
    },
    questype: {
        padding: '10px 6px',
        border: '1px solid transparent',
        marginTop: '25px'
    },
    questypehead: {
        marginBottom: '20px',
        position: 'relative'
    },
    questypeheadtable: {
        width: '150px',
        border: 'initial',
        borderColor: '#DCDCDC'
    },
    testSubjectnote: {
        position: 'absolute',
        left: '130px',
        top: '14px',
        display: 'inline-block',
        maxWidth: '420px',
        minWidth: '200px',
        fontWeight: 'bold',
        paddingLeft: '20px',
        textAlign: 'left'
    },
    quesborder:{
        display: 'block',
        padding: '0 10px',
        lineHeight: '25px',
        letterSpacing: '1px',
        wordBreak: 'break-all',
        width: '100%'
    },
    quesfoot: {
        opacity: 0
    }
}