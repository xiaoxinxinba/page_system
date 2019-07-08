import React from 'react'
import './index.scss'
import {Row, Col, Card, Icon, message, Dropdown, Menu, Button, Divider, Checkbox, Form, Input, Modal, Select, DatePicker} from 'antd';
import {Link} from 'react-router-dom'
import Point from "../../component/Point";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const COLOR_LIST = ['#dc5252', '#ffbf00', '#3db5a3', '#5eb6f1'];
const plainOptions = ['A组', 'B组', 'C组'];
const defaultCheckedList = ['A组'];
class SmartTopic extends React.Component {
    state = {
        dataSearch: {}, //搜索表单数据
        dataSource: [], // 表格数据
        iconLoading: false,
        visible: false,
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false,
        goNext: false
    }
    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
    }

    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    render() {
        return (
            <div className='content80'>
                <Row>
                    <Col span={6}>
                        <div>
                            智能选题
                        </div>
                        {/*<Point></Point>*/}
                    </Col>
                    <Col span={18}>
                        {!this.state.goNext && <div>
                            <div className='topic bg-img'>
                                <h2 className='topic-title'>题目设置</h2>
                                <div className='topic-choose'>
                                    <p>请选择题型:</p>
                                    <Button type="dashed">全部</Button>
                                    <Button type='primary'>单选题</Button>
                                    <Button type="dashed">多选题</Button>
                                    <Button type="dashed">判断题</Button>
                                    <Button type="dashed">简答题</Button>
                                </div>
                                <div className='topic-choose'>
                                    <p>请选择题量:</p>
                                    <Input addonBefore='单选题' defaultValue="1" type='number'/>
                                    <Input addonBefore='多选题' defaultValue="1" type='number'/>
                                    <Input addonBefore='单选题' defaultValue="1" type='number'/>
                                </div>
                                <h2 className='topic-title'>难度设置</h2>
                                <div className='topic-choose'>
                                    <p>请选择难度:</p>
                                    <Button type="dashed">全部</Button>
                                    <Button type='primary'>易</Button>
                                    <Button type="dashed">交易</Button>
                                    <Button type="dashed">中档</Button>
                                    <Button type="dashed">较难</Button>
                                    <Button type="dashed">难</Button>
                                </div>
                                <h2 className='topic-title'>题类设置</h2>
                                <div className='topic-choose'>
                                    <p>请选择题类:</p>
                                    <Button type="dashed">全部</Button>
                                    <Button type="dashed">常考题</Button>
                                    <Button type="primary">易错题</Button>
                                    <Button type="dashed">压轴题</Button>
                                </div>
                            </div>
                            <div className='topaper'>
                                <button onClick={() => {this.setState({goNext: true})}}>生成试卷</button>
                            </div>
                        </div>}
                        {this.state.goNext && <div className='print bg-img'>
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
                            </ul>
                            <Divider dashed={true}/>
                            <p>额外打印： <Input type='number' style={{width: 80}}/> 份</p>
                            <div>组卷日期： <RangePicker /></div>
                            <Divider dashed={true}/>
                            <Checkbox checked={true}>下发答案解析</Checkbox>
                            <div className='topaper' style={{textAlign: 'center'}}>
                                <a href="javascript:;" style={{paddingRight: '10px'}} onClick={() => {this.setState({goNext: false})}}>返回上一层</a> <button>打印</button>
                            </div>
                        </div>}
                    </Col>
                </Row>
            </div>
        )
    }
}


export default SmartTopic