import React from 'react'
import './index.scss'
import {
    Row,
    Col,
    Card,
    Icon,
    message,
    Select,
    Menu,
    Button,
    Divider,
    Pagination,
    Form,
    Input,
    Modal,
    DatePicker,
    Checkbox
} from 'antd';
import {Link, withRouter} from 'react-router-dom'
import moment from 'moment'
import {httpClient} from "../../axios/apiHelper";
import {inject, observer} from "mobx-react";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const plainOptions = ['A组', 'B组', 'C组'];
const defaultCheckedList = ['A组'];

const COLOR_LIST = ['#dc5252', '#ffbf00', '#3db5a3', '#5eb6f1'];
const URL = {
    PAPER: '/api/v1/paper'
}

@withRouter @inject('textPaper') @observer 
class Record extends React.Component {
    state = {
        dataSearch: {}, //搜索表单数据
        dataSource: [], // 表格数据
        iconLoading: false,
        visible: false,
        current: 1,
        total: 0
    }

    params = {
        "page": 1,
        "page_count": 20
    };

    componentWillMount() {
        this.getData();
    }

    getData=(data)=>{
        this.setState({
            dataSearch: data,
        }, () => {
            this.getRecord();
        })
    }

    getRecord = (_current = 1) => {
        this.params.page = _current;
        httpClient.get({
            url: URL.PAPER,
            queryParams: {...this.params, ...this.state.dataSearch},
            success: (res) => {
                this.setState({ total: res.data_total, current: this.params.page, dataSource: res.data});
                console.log(res)
            }
        });
    };

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

    /**
     * 编辑记录
     * */
    editPaper = _id => {
        const _this = this;
        if(this.props.textPaper.getLength){
                     confirm({
            title: '编辑确认?',
            content: '您当前存在未保存的试题，查看记录会清空已选择的题目，是否继续？',
            onOk() {
                _this.props.textPaper.clearText();
                _this.props.history.push({ pathname:'/paper',state:{id : _id } })
            },
            onCancel() {}});
                 }else{
                    _this.props.history.push({ pathname:'/paper',state:{id : _id } })
                 }

        
    };

    render() {
        const {current, total, dataSource, visible} = this.state;
        return (
            <div className='content80'>
                <WrappedTimeRelatedForm getData={this.getData}/>
                <Card style={{marginTop: '14px'}}>
                    {dataSource.map(item =>
                        <div className='record' key={item.id}>
                        <h1 className='record-title'>{item.title}</h1>
                        <span className='record-edit'>
                           <a href="javascript:;" onClick={e => {this.setState({visible: true})}}>布置作业</a><Divider type='vertical'/>
                           <a href="javascript:;" onClick={this.editPaper.bind(this, item.id)}>编辑</a>
                            {/*<Divider type='vertical'/>*/}
                           {/*<a href="###">删除</a>*/}
                       </span>
                        <p className='record-d'>
                            <Icon type='star'/>
                            <span>组卷日期：{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                            <span>布置作业：{item.class_names && item.class_names.length > 0 ? item.class_names.split(', ') : '暂无'}</span>
                        </p>
                    </div>
                    )}
                    <div className='page'>
                        <div style={{textAlign: 'right',position: 'relative'}}>
                            <div style={{marginRight: '80px'}}><Pagination current={current} onChange={this.onChangePage} total={total} showQuickJumper/></div>
                            <Button style={{ position: 'absolute',right: 0, top: 0}} onClick={this.onChangePage1}>确认</Button>
                        </div>
                    </div>
                </Card>
                <Modal title="布置作业"
                       visible={visible}
                       width={700}
                       footer={false}
                       header={false}
                       onOk={() => {this.setState({visible: false})}}
                       onCancel={() => {this.setState({visible: false})}}>
                    <div className='print'>
                        <h2 className='topic-title'>请选择班级或群组</h2>
                        <ul className='grade'>
                            <li>
                                <div className='check-all'>
                                    <Checkbox
                                        indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                    >小学一年级一班
                                    </Checkbox>
                                </div>
                                <div className='check-list'>
                                    <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                                </div>
                            </li>
                            <li>
                                <div className='check-all'>
                                    <Checkbox
                                        indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                    >小学一年级二班
                                    </Checkbox>
                                </div>
                                <div className='check-list'>
                                    <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                                </div>
                            </li>
                        </ul>
                        <Divider dashed={true}/>
                        <p>额外打印： <Input type='number' style={{width: 80}}/> 份</p>
                        <div>组卷日期： <RangePicker /></div>
                        <Divider dashed={true}/>
                        <Checkbox checked={true}>下发答案解析</Checkbox>
                        <div className='topaper' style={{textAlign: 'center'}}>
                           <button>打印</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}


export default Record

// 表单组件
class SearchForm extends React.Component {
    state = {
        visible: false
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.form.validateFields();
        // Utils.selectList(['pod'], (list) => {
        //     this.setState({options: list});
        // });
        this.handleSubmit();
    }

    // 重置表单
    handleReset = () => {
        this.props.form.resetFields();
        this.handleSubmit();
    };
    // 提交表单，将表单数据传送给父组件
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.range){
                    values.start_time = values.range[0].format('YYYY-MM-DD');
                    values.end_time = values.range[1].format('YYYY-MM-DD');
                }
                const {start_time, end_time, keyword, is_used} = values;
                this.props.getData({start_time, end_time, keyword, is_used});
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 8 },
            },
            wrapperCol: {
                sm: { span: 16 },
            }
        };
        const rangeConfig = {  // 时间段的设置
            rules: [{ type: 'array', required: true, message: '请选择时间段' }],
        };
        return (
            <div>
                <Card>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={6}>
                                <FormItem label={'关键字:'}  style={{width: '100%'}}
                                          {...formItemLayout}>
                                    {getFieldDecorator('keyword')(
                                        <Input placeholder="请输入作业记录关键字"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label={'布置作业:'}  style={{width: '100%'}}
                                          {...formItemLayout}>
                                    {getFieldDecorator('is_used')(
                                        <Select>
                                            <Option value=''>请选择</Option>
                                            <Option value='false'>未布置</Option>
                                            <Option value='true'>已布置</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    label="组卷时间">
                                    {getFieldDecorator('range')(
                                        <RangePicker />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <FormItem style={{width: '100%', textAlign: 'right'}}>
                                    <Button type="primary" icon="search" loading={this.props.iconLoading} htmlType="submit">查询</Button>
                                    <Button icon="delete" style={{marginLeft: 8}}
                                            onClick={this.handleReset}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>)
    }
}
const WrappedTimeRelatedForm = Form.create()(SearchForm);