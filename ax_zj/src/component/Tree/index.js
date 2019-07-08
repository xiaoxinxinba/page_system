import React from 'react'
import {Button,
    Input,
    Icon,
    Popconfirm
} from 'antd'
import './index.css'
import Loading from '../../component/Loading'

class MyTree extends React.Component {

    constructor(props) {
        super(props);
    }
    state = {
        loadding: false
    }

    delete = (_id) => {
        this.props.onCancel(_id)
    }

    render() {
        const {dataList} = this.props;
        const loop = data => {
            if(!Array.isArray(data) || data.length <= 0) return '';
            const liList = data.map((item) => {
                if(item.children && item.children.length > 0) {
                    return <li key={'tree' + item.id}  className={!item.isOpen? 'treeName noChild': 'treeName'}>
                        <Icon type={!item.isOpen ? 'right-circle' : 'down-circle'}
                              style={{fontsize: 16}}
                              onClick={() => {item.isOpen = !item.isOpen;this.forceUpdate()}}/><span title='点击可进行修改'>
                       {item.name}</span>{loop(item.children)}</li>
                }
                return <li className="treeName" key={'tree' +item.id}>
                    <span onClick={this.onSelect} title='点击可进行修改'>{item.name}</span></li>;
            });
            return <ul style={{marginLeft:20}}>{liList}</ul>
        };

        return (
            <div>
               {loop(dataList)}
            </div>

        );
    }
}

export default MyTree;