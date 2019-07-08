import React from 'react'
import {Icon, Popover, Affix, Modal} from 'antd'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import {httpClient} from "../../axios/apiHelper";

const confirm = Modal.confirm;
const URL = {
    SUBJECT_STAGE: '/api/v1/subjectstage'
}

@withRouter @inject('formatePaper') @inject('textPaper') @observer
class Nav extends React.Component {
  state = {
      visible: false,
      subjectStageList: [], // 科目学历列表
      stage_name: '',
      subject_name: ''
  }

  params = {
      "page": 1,
      "page_count": 99
  }

  componentWillMount() {
      this.getSubjectStage();
  }

    getSubjectStage = () => {
        const _this = this;
        const username = localStorage.getItem('username');
        httpClient.get({
            url: URL.SUBJECT_STAGE,
            queryParams: {...this.params},
            success: (res) => {
                console.log(res);
                const data = res.data.map((item) => {
                    item.subject_stages.length > 0 && item.subject_stages.map((it) => {
                        return {...it, 'key': `stage${it.id}`, 'active': false}
                    });
                    return {...item, 'key': `stage${item.stage}`}
                });
                data[0].subject_stages[0].active = true;
                this.setState({subjectStageList: data}, () => {
                    if(!localStorage.getItem(`${username}_ss`)){
                        this.initSubjectStage(data[0].stage_name, data[0].subject_stages[0]);
                    }else{
                        const arr = localStorage.getItem(`${username}_subjectStage`).split('*');
                        if(arr.length > 1){
                            const n = data.filter( o => o.stage_name === arr[1]);
                            const itrm = n[0].subject_stages.filter(o => o.subject_id == arr[0]);
                            this.initSubjectStage(arr[1], itrm[0]);
                        }
                    }
                })
            }
        })
  }

    changeSubjectStage = (name, item) => {
        const username = localStorage.getItem('username');
        const subjectStage = localStorage.getItem(`${username}_subjectStage`);
        const _this = this;
        if(subjectStage){
            if(subjectStage !== `${item.subject_id}*${name}`){
                if(_this.props.textPaper.getLength > 0){
                    confirm({
                        title: '切换科目确认?',
                        content: '切换科目将清空当前选题，您确认这样做吗？',
                        onOk() {
                            _this.props.textPaper.clearText();
                            localStorage.setItem(`${username}_subjectStage`, `${item.subject_id}*${name}`);
                            _this.initSubjectStage(name, item);
                        },
                        onCancel() {},
                    });
                }else{
                    localStorage.setItem(`${username}_subjectStage`, `${item.subject_id}*${name}`);
                    _this.initSubjectStage(name, item);
                }
            }
        }else{
            localStorage.setItem(`${username}_subjectStage`, `${item.subject_id}*${name}`)
        }
    }

    initSubjectStage = (name, item) => {
        const username = localStorage.getItem('username');
        let list = this.state.subjectStageList;

        if(list){
            for(let i = 0; i<list.length; i++){
                const item = list[i].subject_stages;
                for(let j = 0; j<item.length; j++){
                    item[j].active = false;
                }
            }
        }

        this.setState({
            stage_name: name,
            subject_name: item.subject_name,
            subjectStageList: list
        }, () => {
            localStorage.setItem(`${username}_ss`, name + item.subject_name);
        });
        item.active = true;

        this.props.formatePaper.changeSubjectStageId(item.subject_id, item.id);
        localStorage.setItem(`${username}_subjectStage`, `${item.subject_id}*${name}`);
    };

    changePoint = () => {
      this.props.formatePaper.changePoint();
    };

  render () {
    const {subjectStageList, stage_name, subject_name} = this.state;
    const {subjectOrMaterial, toggleChooseUnit} = this.props.formatePaper;
      const menu = (
          <div className='menu-list' style={{width: '500px'}}>
              {subjectStageList.map((item) => {
                  return <ul  className='menu-list-one'  key={item.key}>
                      <li>{item.stage_name}</li>
                      <li className='menu-list-btn'>
                          {item.subject_stages.map((it) => {
                              return <a href="javascript:;" className={it.active ? 'active': ''} key={it.subject_id}
                                        onClick={this.changeSubjectStage.bind(this, item.stage_name, it)}>{it.subject_name}</a>
                          })}
                      </li>
                  </ul>
              })}
          </div>
      )
    return (
        <Affix offsetTop={0}>
            <div className='nav'>
                <ul className='nav-menu'>
                    <li className='stage-subject' onClick={() => this.setState({visible: true})}>
                        <Popover content={menu} placement="bottomLeft">
                            <a href='javascript:;' id='subjectStage'>{stage_name} {subject_name} <Icon type='down'/></a>
                        </Popover>
                    </li>
                    {toggleChooseUnit && <li><a href="javascript:;" onClick={this.changePoint}><span style={!subjectOrMaterial?style.blur: {}}>章节</span> / <span style={subjectOrMaterial?style.blur: {}}>知识点</span>选题</a></li>}
                </ul>
            </div>
        </Affix>
    )
  }
}

export default Nav

const style = {
    blur: {
        color: '#ffca00',
        fontSize: 15
    }
}