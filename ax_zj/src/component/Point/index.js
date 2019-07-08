import React from 'react'
import {Icon, Badge, Divider, Button, Popover, Row, Col, Dropdown, Tree} from 'antd'
import { inject, observer } from 'mobx-react'
import './index.scss'
import {httpClient} from "../../axios/apiHelper";
import {observable, action, reaction, autorun} from 'mobx'
import {buildTree} from '../../utils/utils'
const { TreeNode } = Tree;

const URL = {
    MATERIAL_SUBJECT_STAGE_GRADE_SEMESTER_UNIT: '/api/v1/materialsubjectstagegradesemesterunit',
    SUBJECT_STAGE_POINT:'/api/v1/subjectstagepoint'
}

@inject('formatePaper') @observer
class Point extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            materialName: '',
            materialSemesterName: '',
            points: []
        };
    }

    params = {
        "page": 1,
        "page_count": 999
    };

    componentWillMount() {
        let timer = null;
        autorun(() => {
            const _this = this;
            const {subjectStageGradeSemesterList, materialList, subjectStageId,subjectOrMaterial} = _this.props.formatePaper;
            if(!subjectOrMaterial) {
                if(_this.props.formatePaper.materialId && _this.props.formatePaper.materialId === _this.props.formatePaper.materialList[0].id){
                    subjectStageGradeSemesterList.length > 0 && _this.setState({materialName: materialList[0].name,
                            materialSemesterName: subjectStageGradeSemesterList[0].subject_stage_grade_semester_name},
                        () => {
                            if(timer){
                                clearInterval(timer);
                                timer = setTimeout(() => {
                                    _this.getPoint(subjectStageGradeSemesterList[0].id)
                                }, 200);
                            }else{
                                timer = setTimeout(() => {
                                    _this.getPoint(subjectStageGradeSemesterList[0].id)
                                }, 200);
                            }
                        })
                }
            }else{
                if(timer){
                    clearInterval(timer);
                    timer = setTimeout(() => {
                        _this.getPoint1(subjectStageId);
                    }, 200);
                }else{
                    timer = setTimeout(() => {
                        _this.getPoint1(subjectStageId);
                    }, 200);
                }

            }

        })
    }

    changeMateial =(item) => {
        this.props.formatePaper.changeMaterial(item.id);
        const materialSemesterName = this.props.formatePaper.subjectStageGradeSemesterList[0].subject_stage_grade_semester_name;
        const materialSemesterId = this.props.formatePaper.subjectStageGradeSemesterList[0].id;
        const _this = this;
        this.setState({materialName: item.name,
            materialSemesterName: materialSemesterName},
            () => {
                _this.getPoint(materialSemesterId);
            })
    };

    changesubjectStageGradeSemester = (item) => {
        this.props.formatePaper.changeMaterialGradeSemester(item);
        this.setState({materialSemesterName: item.subject_stage_grade_semester_name});
        this.getPoint(item.id);
    };

    /**
     * 获取教材知识点  -- - 根据教材查询的知识点
     **/
    getPoint = (_id) => {
        this.setState({defaultExpandedKeys: []});
        httpClient.get({
            url: URL.MATERIAL_SUBJECT_STAGE_GRADE_SEMESTER_UNIT,
            queryParams: {...this.params, material_subject_stage_grade_semester_id: _id},
            success: (res) => {
                const data = buildTree(res.data);

                const selectKey = this.getKey(data).id;
                const parent_id = this.getKey(data).parent_id;
                const parent_ids = res.data.filter(k => k.id === parent_id)[0];

                const defaultExpandedKeys = parent_ids ? [`${parent_id}`, `${parent_ids.parent_id}`]: [`${parent_id}`];

                this.props.formatePaper.changeMaterialSubjectStageGradeSemesterUnitId(selectKey);
                this.setState({points: data, defaultExpandedKeys})
            }
        });
    }
    /**
     * 获取章节知识点   -- - 根据科目查询的知识点
     **/
    getPoint1 = (_id) => {
        this.setState({defaultExpandedKeys: []});
        httpClient.get({
            url: URL.SUBJECT_STAGE_POINT,
            queryParams: {...this.params, subject_stage_id: _id},
            success: (res) => {
                const data = buildTree(res.data);
                // console.log(data)
                const selectKey = this.getKey(data).id;
                const parent_id = this.getKey(data).parent_id;
                const parent_ids = res.data.filter(k => k.id === parent_id)[0];

                const defaultExpandedKeys = parent_ids ? [`${parent_id}`, `${parent_ids.parent_id}`]: [`${parent_id}`];

                this.props.formatePaper.changeSubjectStagePointId(selectKey);
                this.setState({points: data, defaultExpandedKeys})
            }
        });
    }

    getKey = (d) => {
        if(d[0].children) return this.getKey(d[0].children);
        return d[0]
    };

    select = (selectedKeys) => {
        const {subjectOrMaterial} = this.props.formatePaper;
        subjectOrMaterial ? this.props.formatePaper.changeSubjectStagePointId(selectedKeys[0])
            :this.props.formatePaper.changeMaterialSubjectStageGradeSemesterUnitId(selectedKeys[0]);
    }


    render () {
        const {materialName, materialSemesterName, points, defaultExpandedKeys} = this.state;
        const {materialList, materialId, subjectStageGradeSemesterList, materialStageGradeSemesterId,
            materialSubjectStageGradeSemesterUnitId, subjectStagePointId, subjectOrMaterial} = this.props.formatePaper;
        const menu = (
            materialList && <div className='menu-list' style={{width: '500px'}}>
                <h1 className='menu-list-title'>教材</h1>
                <div className='menu-list-body'>{materialList.map(item => {
                    return <a href="javascript:;" key={item.key} className={materialId === item.id ? 'active' : ''}
                              onClick={this.changeMateial.bind(this, item)}>{item.name}</a>
                })}</div>
                <Divider/>
                <h1 className='menu-list-title'>年级-学期</h1>
                <div className='menu-list-body'>{subjectStageGradeSemesterList.map(item => {
                    return <a href="javascript:;" key={item.key}
                              className={materialStageGradeSemesterId === item.id ? 'active' : ''}
                              onClick={this.changesubjectStageGradeSemester.bind(this, item)}>{item.subject_stage_grade_semester_name}</a>
                })}</div>
            </div>
        )

        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return <TreeNode key={`${item.id}`} title={item.name}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={`${item.id}`} title={item.name}/>;
        });
    return (
        <div className='point'>
            <Popover content={subjectOrMaterial?'请选择知识点': menu} placement="rightTop">
                <h1 className='point-header'>{subjectOrMaterial?'知识点': `${materialName}-${materialSemesterName}`}
                    <Icon type='down' className='down'/>
                </h1>
            </Popover>
            <div className='point-content'>
                {materialSubjectStageGradeSemesterUnitId && defaultExpandedKeys && defaultExpandedKeys.length > 0 && <Tree
                    showLine
                    showIcon={false}
                    defaultSelectedKeys={[`${materialSubjectStageGradeSemesterUnitId}`]}
                    defaultExpandedKeys={defaultExpandedKeys}
                    onSelect={this.select}
                >{loop(points)}</Tree>}

                {subjectStagePointId && defaultExpandedKeys && defaultExpandedKeys.length > 0 && <Tree
                    showLine
                    showIcon={false}
                    defaultSelectedKeys={[`${subjectStagePointId}`]}
                    defaultExpandedKeys={defaultExpandedKeys}
                    onSelect={this.select}
                >{loop(points)}</Tree>}
            </div>
        </div>
    )
  }
}

export default Point