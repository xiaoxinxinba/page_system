import React from 'react'
import './index.scss'
import {
    Row,
    Col,
    Card,
    Icon,
    message,
    Popconfirm,
    Tooltip,
    Upload,
    Button,
    Divider,
    Table,
    Form,
    Input,
    Modal,
    Select,
    DatePicker,
    Tag
} from 'antd';
import {Link} from 'react-router-dom';
import {httpClient} from "../../axios/apiHelper";
import DraggableTags from "../../component/DraggableTags";
import {pagination} from "../../utils/utils";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const Dragger = Upload.Dragger;

const COLOR_LIST = ['#dc5252', '#ffbf00', '#3db5a3', '#5eb6f1', '#66839b'];

const stageData = [{key: 'primary', name: '小学'}, {key: 'middle', name: '初中'}, {key: 'high', name: '高中'}];
const classData = {
    primary: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    middle: ['七年级', '八年级', '九年级'],
    high: ['高一', '高二', '高三'],
};

const URL = {
    CLASS: '/api/v1/class',
    CLASS_GROUP: '/api/v1/group/classgroup',
    GROUP: '/api/v1/group',
    STUDENT: '/api/v1/student',
}

class ClassManage extends React.Component {
    state = {
        dataSearch: {
            class_id: '',
            group_id: ''
        }, //搜索学生
        dataSource: [], // 表格数据
        iconLoading: false,
        visible: false,
        visible1: false,
        visible2: false,
        class_id:'',
        classValue: {
            title: '',
            number: ''
        },
        groupList: [],
        classGroupList: [], // 班级列表
        modalValue:{},
        pagination: {}
    }
    params = {
        "page": 1,
        "page_count": 50
    };

    componentDidMount() {
        this.getClassGroup();
    }

    getClassGroup = () => {
        httpClient.get({
            url: URL.CLASS_GROUP,
            queryParams: {...this.params},
            success: (res) => {
                const data = this.state.dataSearch;
                this.setState({classGroupList: res});
                if(!data.class_id){
                    this.setState({dataSearch: {
                        class_id: res[0]?res[0].id: '',
                            group_id: ''},
                        classValue: {title: res[0]?res[0].title: '', number: res[0].number}
                        }, () => {
                        this.getStudentList();
                    });
                }else{
                    this.getStudentList();
                }
            }
        });
    }


    getStudentList = () => {
        httpClient.get({
            url: URL.STUDENT,
            queryParams: {...this.params, ...this.state.dataSearch},
            success: (res) => {
                this.setState({dataSource: res.data,
                    pagination: pagination({...res.page, data_total: res.data_total}, (current) => {
                        this.params['page'] = current;
                        this.getStudentList();
                    })
                });
            }
        });
    }

    searchStudenList = (_obj, title, number) => {
        const obj = JSON.parse(JSON.stringify(_obj));
        if(obj.id === this.state.dataSearch.group_id){
            obj.id = '';
        }
        this.setState({
            dataSearch: {
                class_id:  obj.class_id,
                group_id: obj.id
            },
            classValue: {
                title: title,
                number: number
            },
        }, () => {
            this.getStudentList();
        })
    }

    getGroup = () => {
        httpClient.get({
            url: URL.GROUP,
            queryParams: {...this.params, page_count: 999, class_id: this.state.dataSearch.class_id},
            success: (res) => {
                this.setState({groupList: res.data});
            }
        });
    }

    showModal = (num, id, value) => {
        if(num === 1){
            this.setState({ visible: true, modalValue: value});
            this.getGroup();
        }else if(num === 2){
            this.setState({ visible1: true, class_id: id});
        }else{
            this.setState({ visible2: true });
        }

    }

    handleCancel = () => {
        this.setState({ visible: false, visible1: false , visible2: false });
    }
    handleCancel1 = () => {
        this.setState({visible2: false });
        this.getClassGroup();
    }


    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            const {update, id} = this.state.modalValue;
            if(update){
                httpClient.put({
                    url: `${URL.STUDENT}/${id}`,
                    body: {...this.state.modalValue, ...values},
                    success: (res) => {
                        message.success('修改班级成功');
                        this.getStudentList();
                        // this.getClassGroup();
                    }
                });
            }else{
                httpClient.post({
                    url: URL.STUDENT,
                    body: {...values, class_id: this.state.dataSearch.class_id},
                    success: (res) => {
                        message.success('创建学生成功');
                        this.getStudentList();
                        // this.getClassGroup();
                    }
                });
            }
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    /**
     * 新建分组
     * */
    saveFormRef1 = (formRef) => {
        this.formRef1 = formRef;
    }

    handleCreate1 = () => {
        const form = this.formRef1.props.form;
        const _this = this;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            values.title && httpClient.post({
                url: URL.GROUP,
                body: {...values, class_id: _this.state.class_id},
                success: (res) => {
                    message.success('创建分组成功');
                    this.getClassGroup();
                }
            })
            form.resetFields();
            this.setState({ visible1: false });
        });
    }

    /**
     * 新建分组
     * */
    saveFormRef2 = (formRef) => {
        this.formRef2 = formRef;
    }

    toStateClass = () => {
        this.props.history.push('/classManage/stageClass');
    }

    deleteClass = (id) => {
        if(!id) return;
        const _this = this;
        httpClient.delete({
            url: `${URL.STUDENT}/${id}`,
            success: (res) => {
                message.success('删除成功');
                _this.getStudentList();
            }
        })
    }

    handleCreate2 = () => {

    }

    // 删除分组
    deleteGroup = (e) => {
        // console.log(id)
        e && e.preventDefault();
        const groupId = this.state.dataSearch.group_id;
        if(!groupId) return;
        const _this = this;
        confirm({
            title: '您确定删除该分组吗?',
            content: '删除该分组不会删除对应所有学生。',
            onOk() {
                httpClient.delete({
                    url: `${URL.GROUP}/${groupId}`,
                    success: (res) => {
                        message.success('删除分组成功');
                        const data = _this.state.dataSearch;
                        _this.setState({dataSearch: {...data, group_id: ''}});
                        _this.getClassGroup();
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const {classGroupList, classValue,dataSearch} = this.state;
        const columns = [{ // 表格列名
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (t,r,i) => i+1
        },{
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '群组',
            dataIndex: 'group_title',
            key: 'group_title',
            render: (t, r) => {
                const f = r.group_id;
                // switch(f){
                //     case f%4 === 0:
                //         return <Tag color={COLOR_LIST[0]}></Tag>;
                //     case f%4 === 1:
                //         return <Tag color={COLOR_LIST[1]}>{t}</Tag>;
                //     case f%4 === 2:
                //         return <Tag color={COLOR_LIST[2]}>{t}</Tag>;
                //     case f%4 === 3:
                //         return <Tag color={COLOR_LIST[3]}>{t}</Tag>;
                //     // default:
                //     //     return '未知';
                // }
                return f && f%5 === 0?<Tag color={COLOR_LIST[0]}>{t}</Tag>:
                    f%5===1 ?<Tag color={COLOR_LIST[1]}>{t}</Tag>:
                    f%5===2 ?<Tag color={COLOR_LIST[2]}>{t}</Tag>:
                    f%5===3 ?<Tag color={COLOR_LIST[3]}>{t}</Tag>:
                    f%5===4 ?<Tag color={COLOR_LIST[4]}>{t}</Tag>: ''
            }
        },{
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: t => {
                return t === 1?<Tag color="cyan">男</Tag>:t===2 ?<Tag color="orange">女</Tag>:'未知'
            }
        },{
            title: '家长姓名',
            dataIndex: 'guardian',
            key: 'guardian'
        },{
            title: '家长电话',
            dataIndex: 'phone',
            key: 'phone'
        },{
            title: '操作',
            dataIndex: 'op',
            key: 'op',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" className={'btn-link'} onClick={this.showModal.bind(this, 1, null, {...record, update: true})}>
                        <Tooltip title='编辑'><Icon type="edit" theme="outlined" style={{fontSize: 16}}/></Tooltip>
                    </a>
                    <Divider type="vertical"></Divider>
                 <Popconfirm placement="bottomRight" title='确定删除此项?' onConfirm={this.deleteClass.bind(this, record.id)} okText="YES" cancelText="NO">
                        <a href="javascript:;" className={'btn-link'}>
                            <Tooltip title='删除'><Icon type="delete" theme="outlined" style={{fontSize: 16}}/></Tooltip>
                        </a>
                    </Popconfirm>
                </span>
            )
        }]
        return (
            <div className='content80'>
                <div style={{marginTop: '14px'}}  className='class-manage bg-img'>
                    <div className='my-class'>
                        <h2 className='topic-title'>我的班级 <span className='title-txt'>(请选择班级或群组)</span></h2>
                        <ul className='my-class-list'>
                            {classGroupList.map(item => <li key={item.id}>
                                <span className='my-class-name'>{item.title}（{item.number}人）</span>
                                {item.groups.map(obj => <span key={obj.id} className={item.id===dataSearch.class_id && obj.id===dataSearch.group_id?'active':''}
                                                              onClick={this.searchStudenList.bind(this, obj, item.title, item.number)}>{obj.title} ({obj.number})人</span>)}
                                {/*<span style={{paddingLeft: 10}}>*/}
                                       <Icon type='plus-circle' title='点击添加分组' style={{color: '#4A9EFA', fontSize: 18,paddingLeft: 10}} onClick={this.showModal.bind(this, 2, item.id)}/>{' '}
                                    {item.id===dataSearch.class_id && dataSearch.group_id > 0 && <Icon type='minus-circle' title='点击删除分组' style={{color: '#4A9EFA', fontSize: 18}} onClick={this.deleteGroup}/>}
                                {/*</span>*/}
                            </li>)}
                        </ul>
                        <a href='javascript:;' className='new-btn new-class' onClick={this.toStateClass}><Icon type='block' style={{color: '#13865d'}}/> 我的班级</a>
                    </div>
                    <Divider dashed={true}/>
                    <div className='class-list'>
                       <div className='class-list-head'>
                           <h2 className='topic-title'>{classValue.title} ({classValue.number}人)</h2>
                           <span className='class-list-edit'>
                            <a href='javascript:;' className='new-btn' onClick={this.showModal.bind(this, 1, null, {})}><Icon type='plus-circle' style={{color: 'red'}}/> 新建学生</a>
                            <a href='javascript:;' className='new-btn' onClick={this.showModal.bind(this, 3)}><Icon type='usergroup-add' style={{color: '#f95604'}}/> 群组管理</a>
                        </span>
                       </div>
                        <Table
                            bordered
                            rowKey = {record => record.id}
                            columns={columns}
                            pagination={this.state.pagination}
                            dataSource={this.state.dataSource}/>
                    </div>
                </div>
                <CollectionCreateForm wrappedComponentRef={this.saveFormRef}
                                      visible={this.state.visible}
                                      groupList = {this.state.groupList}
                                      modalValue = {this.state.modalValue}
                                      onCancel={this.handleCancel}
                                      onCreate={this.handleCreate}/>
                <NewClassForm wrappedComponentRef={this.saveFormRef1}
                                      visible={this.state.visible1}
                                      onCancel={this.handleCancel}
                                      onCreate={this.handleCreate1}/>
                {this.state.visible2 && <Modal
                    visible={this.state.visible2}
                    title={<span style={{color: '#2489F6'}}>{classValue.title}的学生</span>}
                    okText="保存"
                    width={'fit-content'}
                    style={{maxWidth: '70%'}}
                    footer={false}
                    onCancel={this.handleCancel1}
                    // onOk={onCreate}
                    >
                    <DraggableTags classTitle={classValue.title} classId={dataSearch.class_id} onSave={this.handleCancel1}></DraggableTags>
                </Modal>}
                {/*// <ClassGroupManageForm wrappedComponentRef={this.saveFormRef2}*/}
                {/*//               visible={this.state.visible2}*/}
                {/*//               classId={dataSearch.class_id}*/}
                {/*//               classTitle={classValue.title}*/}
                {/*//               onCancel={this.handleCancel1}*/}
                {/*//               onCreate={this.handleCreate2}/>*/}
            </div>
        )
    }
}


export default ClassManage

// 新建学生
const CollectionCreateForm = Form.create()(
    class extends React.Component {
        // 重置表单
        handleReset = () => {
            this.props.form.resetFields();
        };

        render() {
            const {visible, onCancel, onCreate, form, groupList, modalValue} = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    sm: { span: 4, offset: 4 }
                },
                wrapperCol: {
                    sm: { span: 16}
                }
            };
            return (
                <Modal
                    visible={visible}
                    title={`${modalValue.update?'修改':'添加'}学生`}
                    okText="保存"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label={'姓名:'}  style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: modalValue.name || '',
                                rules:[{
                                    required:true, message:'学生姓名必填'
                                }]
                            })(
                                <Input placeholder="请输入姓名"/>
                            )}
                        </FormItem>

                        <FormItem label={'性别:'}  style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('gender', {
                                initialValue: modalValue.gender?modalValue.gender+'':''
                            })(
                                <Select>
                                        <Option value="">请选择</Option>
                                    <Option value="2">女</Option>
                                    <Option value="1">男</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem label={'家长姓名:'}  style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('guardian', {
                                initialValue: modalValue.guardian || ''
                            })(
                                <Input placeholder="请输入家长姓名"/>
                            )}
                        </FormItem>

                        <FormItem label={'家长电话:'}  style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                initialValue: modalValue.phone
                            })(
                                <Input placeholder="请输入家长电话"/>
                            )}
                        </FormItem>

                        <FormItem label={'群组:'}  style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('group_id', {
                                initialValue: modalValue.group_id || '0'
                            })(
                                <Select>
                                    <Option value='0'>请选择</Option>
                                    {groupList.map(o => <Option key={o.id} value={o.id}>{o.title}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);
// 新建分组
const NewClassForm = Form.create()(
    class extends React.Component {
        state = {
            classList: classData[stageData[0].key],
        }
        // 重置表单
        handleReset = () => {
            this.props.form.resetFields();
        };

        render() {
            const {visible, onCancel, onCreate, form,} = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    sm: { span: 4, offset: 4 }
                },
                wrapperCol: {
                    sm: { span: 16}
                }
            };
            return (
                <Modal
                    visible={visible}
                    title="添加分组"
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label={'组名:'} style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('title', {
                                initialValue: ''
                            })(
                               <Input placeholder='请输入组名'/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);
// 群组管理
// const ClassGroupManageForm = Form.create()(
//     class extends React.Component {
//         // 重置表单
//         handleReset = () => {
//             this.props.form.resetFields();
//         };
//         render() {
//             const {visible, onCancel, onCreate, form, classId, classTitle} = this.props;
//             const { getFieldDecorator } = form;
//             const formItemLayout = {
//                 labelCol: {
//                     sm: { span: 4, offset: 4 }
//                 },
//                 wrapperCol: {
//                     sm: { span: 16}
//                 }
//             };
//             return (
//                 <Modal
//                     visible={visible}
//                     title={<span style={{color: '#2489F6'}}>{classTitle}的学生</span>}
//                     okText="保存"
//                     width={'fit-content'}
//                     style={{minWidth: 500}}
//                     footer={false}
//                     onCancel={onCancel}
//                     // onOk={onCreate}
//                 >
//                     <DraggableTags classTitle={classTitle} classId={classId} onSave={onCancel}></DraggableTags>
//                 </Modal>
//             );
//         }
//     }
// );