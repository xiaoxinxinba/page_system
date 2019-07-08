import React from 'react'
import './index.scss'
import {Row, Col, Card, Icon, message, Popconfirm, Tooltip,Upload, Pagination, Divider, Table, Form, Input, Modal, Select, DatePicker} from 'antd';
import {Link} from 'react-router-dom';
import {httpClient, BASE_URL} from "../../../axios/apiHelper";
import { isToken } from '../../../utils/Session'
import {pagination} from "../../../utils/utils";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const Dragger = Upload.Dragger;

const COLOR_LIST = ['#dc5252', '#ffbf00', '#3db5a3', '#5eb6f1'];

const stageData = [{key: 'primary', name: '小学'}, {key: 'middle', name: '初中'}, {key: 'high', name: '高中'}];
const classData = {
    primary: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    middle: ['七年级', '八年级', '九年级'],
    high: ['高一', '高二', '高三'],
};

const URL = {
    CLASS: '/api/v1/class',
    GET_TEMP: '/api/v1/class/gettemp',
    CLASS_IMPORT: '/api/v1/class/import',
}

class StageClass extends React.Component {
    state = {
        dataSearch: {}, //搜索表单数据
        dataSource: [], // 表格数据
        iconLoading: false,
        visible: false,
        visible1: false,
        classId: '',
        modalValue:{},
        pagination:{}
    }
    params = {
        "page": 1,
        "page_count": 20
    };

    componentWillMount() {
        this.getClass();
    }

    getClass = () => {
        httpClient.get({
            url: URL.CLASS,
            queryParams: {...this.params},
            success: (res) => {
                this.setState({dataSource: res.data,
                    pagination: pagination({...res.page, data_total: res.data_total}, (current) => {
                        this.params['page'] = current;
                        this.getClass();
                    })
                });
            }
        });
    }

    showModal = (item) => {
        if(item){
            this.setState({ visible: true, modalValue: item });
        }else{
            this.setState({ visible: true});
        }

    }

    showModal1 = (id) => {
        this.setState({ visible1: true, classId: id});
    }

    handleCancel = () => {
        this.setState({ visible: false, visible1: false});
    }

    /**
     * 新建班级
     * */
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
            const getValue = v => stageData.filter(o => o.key === v)[0].name;
            const {update, id} = this.state.modalValue;
            if(update){
                httpClient.put({
                    url: `${URL.CLASS}/${id}`,
                    body: {title: `${getValue(values.stage)}${values.class}${values.classclass}`},
                    success: (res) => {
                        message.success('修改班级成功');
                        this.getClass();
                    }
                });
            }else{
                httpClient.post({
                    url: URL.CLASS,
                    body: {title: `${getValue(values.stage)}${values.class}${values.classclass}`},
                    success: (res) => {
                        message.success('创建班级成功');
                        this.getClass();
                    }
                });
            }
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    handleCreate1 = () => {
        this.getClass();
        this.setState({ visible1: false });
    }

    deleteClass = (id) => {
        if(!id) return;
        const _this = this;
        httpClient.delete({
            url: `${URL.CLASS}/${id}`,
            success: (res) => {
                message.success('删除成功');
                _this.getClass();
            }
        })
    }

    render() {
        const {classList, classId} = this.state;
        const columns = [{ // 表格列名
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (t,r,i) => i+1
        },{
            title: '年级-班级',
            dataIndex: 'title',
            key: 'title'
        },{
            title: '人数',
            dataIndex: 'number',
            key: 'number'
        },{
            title: '操作',
            dataIndex: 'op',
            key: 'op',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" className={'btn-link'}  onClick={this.showModal.bind(this, {...record, update: true})}>
                        <Tooltip title='编辑'><Icon type="edit" theme="outlined" style={{fontSize: 16}}/></Tooltip>
                    </a>
                    <Divider type="vertical"></Divider>
                 <Popconfirm placement="bottomRight" title={`确定删除 "${record.title}" 以及对应学生?`} onConfirm={this.deleteClass.bind(this, record.id)} okText="YES" cancelText="NO">
                        <a href="javascript:;" className={'btn-link'}>
                            <Tooltip title='删除'><Icon type="delete" theme="outlined" style={{fontSize: 16}}/></Tooltip>
                        </a>
                    </Popconfirm>
                                 <Divider type="vertical"></Divider>
                    <a href="javascript:;" className={'btn-link'} onClick={this.showModal1.bind(this, record.id)}>
                        <Tooltip title='导入学生名单'><Icon type="cloud-upload" style={{fontSize: 16}}/></Tooltip>
                    </a>
                </span>
            )
        }]
        return (
            <div className='content80'>
                <div style={{marginTop: '14px'}}  className='class-manage bg-img'>
                    <div className='class-list'>
                       <div className='class-list-head'>
                           <h2 className='topic-title'>我的班级 <Link to={'/classManage'} style={{color:'#666', fontSize: 14, fontWeight: '500'}}><Icon type='left'/>返回上级</Link></h2>
                           <span className='class-list-edit'>
                            <a href='javascript:;' className='new-btn' onClick={this.showModal.bind(this, {})}><Icon type='plus-circle' style={{color: 'red'}}/> 新建班级</a>
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
                <NewClassForm wrappedComponentRef={this.saveFormRef}
                                      visible={this.state.visible}
                                      modalValue={this.state.modalValue}
                                      onCancel={this.handleCancel}
                                      onCreate={this.handleCreate}/>
                <UploadStudents visible={this.state.visible1}
                                classId={classId}
                              onCancel={this.handleCancel}
                              onCreate={this.handleCreate1}/>

            </div>
        )
    }
}


export default StageClass

// 新建班级
const NewClassForm = Form.create()(
    class extends React.Component {
        // 重置表单
        handleReset = () => {
            this.props.form.resetFields();
        };

        render() {
            const {visible, onCancel, onCreate, form, modalValue} = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    sm: { span: 4, offset: 4 }
                },
                wrapperCol: {
                    sm: { span: 16}
                }
            };
            let defaultValue = {
                classList: classData[stageData[0].key],
                stageData: stageData[0].key,
                classTitle: classData[stageData[0].key][0],
                classclass: '1班'
            };
            if(modalValue.title) {
                const s = modalValue.title.substr(0, 2);

                const getValue = v => stageData.filter(o => o.name === v)[0];
                const sKey = getValue(s);
                defaultValue = {
                    classList: classData[sKey.key],
                    stageData: sKey.key,
                    classTitle: modalValue.title.substr(2, modalValue.title.length-4),
                    classclass: modalValue.title.substr(modalValue.title.length-2),
                }
            }
            const classclass = () => {
                let arr = [];
                for(let i =0; i<30; i++){
                    arr.push(`${i+1}班`)
                }
                return arr;
            }
            return (
                <Modal
                    visible={visible}
                    title="班级管理"
                    okText="保存"
                    // width={700}
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label={'学历等级:'} style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('stage', {
                                initialValue: defaultValue.stageData,
                                onChange: (value) => {
                                    this.setState({classList: classData[value]})
                                }
                            })(
                                <Select>
                                    {stageData.map(o => <Option key={o.key} value={o.key}>{o.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={'年级:'} style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('class', {
                                initialValue: defaultValue.classTitle
                            })(
                                <Select>
                                    {defaultValue.classList.map((o, i) => <Option key={i} value={o}>{o}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={'班级:'} style={{width: '100%'}}
                                  {...formItemLayout}>
                            {getFieldDecorator('classclass', {
                                initialValue: defaultValue.classclass
                            })(
                                <Select>
                                    {classclass().map((o, i) => <Option key={i} value={o}>{o}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

// 上传学生名单
const UploadStudents = Form.create()(
    class extends React.Component {
        // 上传的配置， 返回配置项
        // getUpload = () => {
        //     const _this = this;
        //     const data = _this.props.classId;
        //     console.log(data);
        //     // const urldata = data.id && JSON.stringify(data.id).replace(/\"|{|}/g, '').replace(':', '=');
        //     const props = {
        //         name: 'files',
        //         multiple: true,
        //         action: `${BASE_URL}${URL.CLASS_IMPORT}/${data}`,
        //         supportServerRender: true,
        //         headers: {
        //             'Authorization': `Bearer ${isToken()}`,
        //         },
        //         showUploadList: false,
        //         beforeUpload(file) {
        //             const isLt2M = file.size / 1024 / 1024 < 100;
        //             if (!isLt2M) {
        //                 message.error('文件不能超过 20MB!');
        //             }
        //             return isLt2M;
        //         },
        //         onChange(info) {
        //             const status = info.file.status;
        //             const res = info.file.response;
        //             _this.setState({uploading: true});
        //             if (status !== 'uploading') {
        //                 // console.log(info.file, info.fileList);
        //                 _this.setState({
        //                     percent: 50
        //                 })
        //             }
        //             if (status === 'done') {
        //                 console.log(info.fileList);
        //                 if(res.status === 0){
        //                     _this.setState({percent: 100, status: 'success'});
        //                     message.success(`${info.file.name} file uploaded successfully.`);
        //                     _this.getTableData();
        //                     setTimeout(() => {
        //                         _this.setState({percent: 0, status: 'normal'});
        //                     }, 1000)
        //                 }else{
        //                     message.error(`file upload failed.${res.message}`);
        //                     _this.setState({percent: 90, status: 'exception'});
        //                 }
        //
        //             } else if (status === 'error') {
        //                 message.error(`${info.file.name} file upload failed.`);
        //             }
        //         }
        //     };
        //     return props;
        // };

        render() {
            const {visible, onCancel, onCreate, classId} = this.props;
            const token = `Bearer ${isToken()}`;
            const props = {
                name: 'files',
                multiple: false,
                method: 'post',
                // Accept: 'application/json',
                supportServerRender: true,
                headers: {
                    'Authorization': token,
                    'Access-Control-Allow-Origin':['localhost:3000', '*.qmaixiang.com']
                },
                action: `${BASE_URL}${URL.CLASS_IMPORT}/${classId}`,
                onChange(info) {
                    const status = info.file.status;
                    if (status !== 'uploading') {
                        console.log(info);
                    }
                    if (status === 'done') {
                        message.success(`${info.file.name} 文件上传成功.`);
                    } else if (status === 'error') {
                        message.error(`${info.file.name} 文件上传失败.`);
                    }
                },
            };

            return (
                <Modal
                    visible={visible}
                    title="导入学生名单"
                    okText="确定"
                    // width={700}
                    // footer={false}
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <p>学生名单：<a href={`${BASE_URL}${URL.GET_TEMP}`} download><Icon type='download'/>下载模板</a></p>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            {/*<Icon type="inbox" />*/}
                            <Icon type="cloud-upload" />
                        </p>
                        <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                        <p className="ant-upload-hint">支持单个或批量上传。</p>
                    </Dragger>
                </Modal>
            );
        }
    }
);
