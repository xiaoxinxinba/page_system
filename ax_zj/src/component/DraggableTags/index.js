import {DraggableAreasGroup} from 'react-draggable-tags';
import React from 'react'
import {Icon, Modal, Divider, Button, Popover, Row, Col, Dropdown, Tree, message} from 'antd'
import { inject, observer } from 'mobx-react'
import {httpClient} from "../../axios/apiHelper";
import './index.scss'

const confirm = Modal.confirm;

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea('area_1');
const DraggableArea2 = group.addArea('area_2');
const DraggableArea3 = group.addArea('area_3');
const DraggableArea4 = group.addArea('area_4');
const DraggableArea5 = group.addArea('area_5');
const DraggableArea6 = group.addArea('area_6');
const DraggableArea7 = group.addArea('area_7');
const DraggableArea8 = group.addArea('area_8');
const DraggableArea9 = group.addArea('area_9');
const DraggableArea = group.addArea('');


const URL = {
    ALL_STUDENT: '/api/v1/student/getallgroupstudent',
    MOVE_STUDENT: '/api/v1/student/movetogroup',
    GROUP: '/api/v1/group'
}


export default class DraggableTags extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            allGroup: [], // 所以分组以及学生
            allGroup_1: [], // 所以分组以及学生副本  比较是否发生变化
        };
        this.classId = props.classId;
        this.onSave = props.onSave;
    }
    group = [];

    componentDidMount() {
        this.getAllGroupList();
    }

    getAllGroupList = () => {
        httpClient.get({
            url: URL.ALL_STUDENT,
            queryParams: {class_id: this.classId},
            success: (res) => {
                console.log(res);
                this.setState({allGroup: res, allGroup_1: res});
            }
        });
    };

    changeTags = (tags, {fromArea, toArea}) => {
        const {allGroup} = this.state;
        const getNum = v => v.replace(/[^0-9]/ig,""); // 获取字符串中的数字
        if(fromArea.id){
            const num = getNum(fromArea.id) - 1;
            const tag = fromArea.tag;
            let _allGroup = allGroup.slice();
            const _group = allGroup[num].students.filter(o => o.id !== tag.id);
            _allGroup[num].students = _group;
            this.setState({allGroup: _allGroup});
        }
        if(toArea.id){
            const num = getNum(toArea.id) - 1;
            const tag = toArea.tag;
            let _allGroup = allGroup.slice();
            _allGroup[num].students.push(tag);
            this.setState({allGroup: _allGroup});
        }
    }

    save = () => {
        httpClient.put({
            url: `${URL.MOVE_STUDENT}`,
            body: this.state.allGroup,
            success: (res) => {
                message.success('重新分组成功');
                // this.setState({allGroup: [], allGroup_1: []});
                this.onSave();
                this.getAllGroupList();
            }
        });
    }


    render() {
        const {allGroup, allGroup_1} = this.state;
        const config = (obj) => {
            return {
                tags: obj.students,
                render: ({tag}) => (
                    <div className="tag">
                        {tag.name}
                    </div>),
                onChange: (tags, {fromArea, toArea}) => {
                    this.changeTags(tags, {fromArea, toArea})
                }
            }
        }
        return (
            <div>
                <div className="CrossArea">
                    {allGroup.length > 0 && allGroup.map((obj, i) =>
                        <div className="square" key={obj.group_id}>
                            <h1 className='square-title'>{obj.group_title}</h1>
                            {i ===0 && <DraggableArea1 {...config(obj)}/>}
                            {i ===1 && <DraggableArea2 {...config(obj)}/>}
                            {i ===2 && <DraggableArea3 {...config(obj)}/>}
                            {i ===3 && <DraggableArea4 {...config(obj)}/>}
                            {i ===4 && <DraggableArea5 {...config(obj)}/>}
                            {i ===5 && <DraggableArea6 {...config(obj)}/>}
                            {i ===6 && <DraggableArea7 {...config(obj)}/>}
                            {i ===7 && <DraggableArea8 {...config(obj)}/>}
                            {i ===8 && <DraggableArea9 {...config(obj)}/>}
                            {i > 8 && <DraggableArea {...config(obj)}/>}
                        </div>)}
                </div>
                <div className='save'>
                    <Button type='primary' size='large' style={{width: 200}} disabled={allGroup_1 === allGroup} onClick={this.save}>保存</Button>
                </div>
            </div>
        );
    }
}
