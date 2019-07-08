import React from 'react';
import Editor from 'react-umeditor';

class MyEditor extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            content: ""
        }
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }

    getIcons(){
        return [
            "source | undo redo"
        ]
        // "source | undo redo | bold italic underline strikethrough fontborder | ",
        //     "paragraph fontfamily fontsize | superscript subscript | ",
        //     "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
        //     "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
        //     "horizontal date time  | image formula spechars | inserttable"
    }
    render() {
        const icons = this.getIcons();
        return (<Editor ref="editor" icons={icons}
                        value=''
                        defaultValue="<p>提示文本</p>"
                        onChange={this.handleChange.bind(this)}
        />)
    }
}

export default MyEditor;