## hosts
47.104.11.200 qmaixiang.com
47.104.11.200 www.qmaixiang.com
47.104.11.200 accounts.qmaixiang.com
47.104.11.200 api.qmaixiang.com

## 接口：
https://api.qmaixiang.com/docs/index.html

## 域名配置

https://api.qmaixiang.com			题库接口
https://manage.api.qmaixiang.com	管理接口

https://manage.qmaixiang.com		管理前端
https://q.qmaixiang.com				题库前端

https://accounts.qmaixiang.com		账户站点


Get   获取列表
Get/{id} 按Id获取
Post  创建
Put   更新
Patch  更新(json-patch)
Delete  删除

## API说明
## 题库系统

Subject          科目
SubjectStage        科目-学历阶段
SubjectStageGradeSemester     科目-学历阶段-年级-学期
SubjectStagePoint       科目-学历阶段-*知识点

Material         教材
MaterialSubjectStageGradeSemester   教材-科目-学历阶段-年级-学期
MaterialSubjectStageGradeSemesterUnit  教材-科目-学历阶段-年级-学期-*单元

Question         题目*
Paper          试卷*

# 接口说明

## Subject		科目

[
  {
    "id": 1,	
    "name": "数学",
    "status": 1
  },
  {
    "id": 2,
    "name": "语文",
    "status": 1
  },
  {
    "id": 3,
    "name": "英语",
    "status": 1
  }
]

## SubjectStage 科目-学历阶段

[
  {
    "id": 1,
    "subject_id": 1,	// 科目编号
    "stage": 1,			// 学历阶段 （1小学 2初中 3高中）
    "order": 0,
    "status": 1
  }
]

## SubjectStageGradeSemester 科目-学历阶段-年级-学期

[
  {
    "id": 1,
    "subject_stage_id": 1,	科目-学历阶段编号
    "grade": 3,				年级 （1-6）
    "semester": 1,			学期 （1上 2下）
    "order": 0,
    "status": 1
  },
  ...
]

## SubjectStagePoint	科目-学历阶段-知识点


[
  {
    "id": 1,
    "subject_stage_id": 1,	科目-学历阶段编号
    "parent_id": null,		父ID 空为根
    "name": "数与代数",		名称
    "order": 0,
    "status": 1
  },
  {
    "id": 2,
    "subject_stage_id": 1,
    "parent_id": 1,	
    "name": "数的认识",
    "order": 0,
    "status": 1
  },
  ...
]

## Material 教材

[
  {
    "id": 1,
    "name": "人教新版",		名称
    "status": 0
  },
  ...
]

## MaterialSubjectStageGradeSemester 教材-科目-学历阶段-年级-学期

[
  {
    "id": 1,
    "material_id": 1,							教材编号
    "subject_stage_grade_semester_id": 1,		科目-学历阶段-年级-学期编号
    "order": 0,
    "status": 1
  },
  ...
]

## MaterialSubjectStageGradeSemesterUnit 教材-科目-学历阶段-年级-学期-章节单元

[
  {
    "id": 1,
    "material_subject_stage_grade_semester_id": 1,		教材-科目-学历阶段-年级-学期编号
    "parent_id": null,									父ID 空为根
    "name": "第1章 时、分、秒",							名称
    "order": 0,
    "status": 1
  },
  {
    "id": 2,
    "material_subject_stage_grade_semester_id": 1,
    "parent_id": 1,
    "name": "43：时、分、秒及其关系、单位换算与计算",
    "order": 0,
    "status": 1
  },
  ...
]


     <div className="exam-body" id="divQues">
                                            <div className="exampart">
                                                <div className="parthead">
                                                    <div className="partheadbox exam-parthead" id="partheadbox1">
                                                        <div className="partname" id="partname1" contentEditable="true">
                                                            第Ⅰ卷（选择题）
                                                        </div>
                                                        <div className="partnote" id="partnote1" contentEditable="true">
                                                            请点击修改第I卷的文字说明
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="partbody">


                                                    <div className="questype">
                                                        <div className="questypehead">
                                                            <div className="questypeheadbox">
                                                                <table border="0" cellPadding="0" cellSpacing="0"
                                                                       style="width:100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td width="1">
                                                                            <div
                                                                                className="jcui-catescore exam-catescore questypescore"
                                                                                id="questypescore" style="width:120px">
                                                                                <table title="评分栏" border="1"
                                                                                       cellPadding="0" cellSpacing="0"
                                                                                       style="border:1px solid #666;">
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
                                                                            </div>
                                                                        </td>
                                                                        <td style="text-align:left;">
                                                                            <div
                                                                                className="exam-subjectnote questypetitle div-data-cate"
                                                                                contentEditable="true" cate="1">
                                                                                一．选择题（共2小题）
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="markarea">
                                                                <div className="part-ctrl">
                                                                    <span onClick="delGroup(this)"><i
                                                                        className="icon i-orange-delete"></i>删除</span>
                                                                    <span onClick="moveGroupUp(this)"><i
                                                                        className="icon i-orange-up"></i>上移</span>
                                                                    <span onClick="moveGroupDown(this)"><i
                                                                        className="icon i-orange-down"></i>下移</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="questypebody paper">
                                                            <ul className="list-box sortable ulQuesGroup ui-sortable"
                                                                id="typeSelect1" data-title="一．选择题（共2小题）">
                                                                <li className="QUES_LI" data-dg="0.90"
                                                                    data-point="有理数的乘方" data-dgname="易">
                                                                    <fieldset id="101209b8-6915-1558-8353-57120525a964"
                                                                              className="quesborder" s="math"
                                                                              data-cate="1">
                                                                        <div className="pt1"><span
                                                                            className="qseq">1．</span><a
                                                                            href="http://www.jyeoo.com/math/report/detail/75faaa4e-57d2-4dfb-a0dc-c0c67160f75b"
                                                                            className="ques-source"
                                                                            target="_blank">（2018秋•绥阳县期末）</a>计算：（-3）<sup>4</sup>=（
                                                                            ）</div>
                                                                        <div className="pt2">
                                                                            <table style="width:100%"
                                                                                   className="ques quesborder">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="width:23%"
                                                                                        className="selectoption"><label
                                                                                        className="">A．-12</label></td>
                                                                                    <td style="width:23%"
                                                                                        className="selectoption"><label
                                                                                        className="">B．12</label></td>
                                                                                    <td style="width:23%"
                                                                                        className="selectoption"><label
                                                                                        className="">C．-81</label></td>
                                                                                    <td style="width:23%"
                                                                                        className="selectoption"><label
                                                                                        className="">D．81</label></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                           </div>
                                                                        <div className="pt6" style="display:none"></div>
                                                                    </fieldset>
                                                                    <div className="clear2"></div>
                                                                    <div className="fieldtip">
                                                                        <div className="fieldtip-right">
                                                                            <input className="input-data-score"
                                                                                   type="text" data-degree="0.90"
                                                                                   value="0"
                                                                                   onKeyUp="value=value.replace(/[^\d|.]/g,'')"/>分
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="showDetail(this,'math','101209b8-6915-1558-8353-57120525a964','1')">查看解析</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveUp('101209b8-6915-1558-8353-57120525a964')">上移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveDown('101209b8-6915-1558-8353-57120525a964')">下移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return reMove('101209b8-6915-1558-8353-57120525a964')">删除</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="similarQues(this,'math','101209b8-6915-1558-8353-57120525a964',1)">换一题</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li className="QUES_LI" data-dg="0.90"
                                                                    data-point="科学记数法—表示较大的数" data-dgname="易">
                                                                    <fieldset id="10a834f9-f155-4151-a517-e2373258850f"
                                                                              className="quesborder" s="math"
                                                                              data-cate="1">
                                                                        <div className="pt1"><span
                                                                            className="qseq">2．</span><a
                                                                            href="http://www.jyeoo.com/math/report/detail/75faaa4e-57d2-4dfb-a0dc-c0c67160f75b"
                                                                            className="ques-source"
                                                                            target="_blank">（2018秋•绥阳县期末）</a>我县人口约为530060人，用科学记数法可表示为（
                                                                            ）</div>
                                                                        <div className="pt2">
                                                                            <table style="width:100%"
                                                                                   className="ques quesborder">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="width:48%"
                                                                                        className="selectoption"><label
                                                                                        className="">A．53006×10人</label>
                                                                                    </td>
                                                                                    <td style="width:48%"
                                                                                        className="selectoption"><label
                                                                                        className="">B．5.3006×10<sup>5</sup>人</label>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="width:48%"
                                                                                        className="selectoption"><label
                                                                                        className="">C．53×10<sup>4</sup>人</label>
                                                                                    </td>
                                                                                    <td style="width:48%"
                                                                                        className="selectoption"><label
                                                                                        className="">D．0.53×10<sup>6</sup>人</label>
                                                                                    </td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            </div>
                                                                        <div className="pt6" style="display:none"></div>
                                                                    </fieldset>
                                                                    <div className="clear2"></div>
                                                                    <div className="fieldtip">
                                                                        <div className="fieldtip-right">
                                                                            <input className="input-data-score"
                                                                                   type="text" data-degree="0.90"
                                                                                   value="0"
                                                                                   onKeyUp="value=value.replace(/[^\d|.]/g,'')"/>分
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="showDetail(this,'math','10a834f9-f155-4151-a517-e2373258850f','1')">查看解析</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveUp('10a834f9-f155-4151-a517-e2373258850f')">上移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveDown('10a834f9-f155-4151-a517-e2373258850f')">下移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return reMove('10a834f9-f155-4151-a517-e2373258850f')">删除</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="similarQues(this,'math','10a834f9-f155-4151-a517-e2373258850f',1)">换一题</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <div className="exampart">
                                                <div className="parthead">
                                                    <div className="partheadbox exam-parthead" id="partheadbox1">
                                                        <div className="partname" id="partname1" contentEditable="true">
                                                            第Ⅱ卷（非选择题）
                                                        </div>
                                                        <div className="partnote" id="partnote1" contentEditable="true">
                                                            请点击修改第Ⅱ卷的文字说明
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="partbody">


                                                    <div className="questype">
                                                        <div className="questypehead">
                                                            <div className="questypeheadbox">
                                                                <table border="0" cellPadding="0" cellSpacing="0"
                                                                       style="width:100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td width="1">
                                                                            <div
                                                                                className="jcui-catescore exam-catescore questypescore"
                                                                                id="questypescore" style="width:120px">
                                                                                <table title="评分栏" border="1"
                                                                                       cellPadding="0" cellSpacing="0"
                                                                                       style="border:1px solid #666;">
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
                                                                            </div>
                                                                        </td>
                                                                        <td style="text-align:left;">
                                                                            <div
                                                                                className="exam-subjectnote questypetitle div-data-cate"
                                                                                contentEditable="true" cate="2">
                                                                                二．填空题（共1小题）
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="markarea">
                                                                <div className="part-ctrl">
                                                                    <span onClick="delGroup(this)"><i
                                                                        className="icon i-orange-delete"></i>删除</span>
                                                                    <span onClick="moveGroupUp(this)"><i
                                                                        className="icon i-orange-up"></i>上移</span>
                                                                    <span onClick="moveGroupDown(this)"><i
                                                                        className="icon i-orange-down"></i>下移</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="questypebody paper">
                                                            <ul className="list-box sortable ulQuesGroup ui-sortable"
                                                                id="typeSelect2" data-title="二．填空题（共1小题）">
                                                                <li className="QUES_LI" data-dg="0.70"
                                                                    data-point="有理数的减法" data-dgname="较易">
                                                                    <fieldset id="cf1b101d-15e2-415c-bf52-a7bac2555ace"
                                                                              className="quesborder" s="math"
                                                                              data-cate="2">
                                                                        <div className="pt1"><span
                                                                            className="qseq">3．</span><a
                                                                            href="http://www.jyeoo.com/math/report/detail/75faaa4e-57d2-4dfb-a0dc-c0c67160f75b"
                                                                            className="ques-source"
                                                                            target="_blank">（2018秋•绥阳县期末）</a>今年，我县冬天某天的气温是-1℃～4℃，这一天的温差是
                                                                            <div className="quizPutTag"
                                                                                 contentEditable="true">&nbsp;</div>
                                                                            </div>
                                                                        <div className="pt6" style="display:none"></div>
                                                                    </fieldset>
                                                                    <div className="clear2"></div>
                                                                    <div className="fieldtip">
                                                                        <div className="fieldtip-right">
                                                                            <input className="input-data-score"
                                                                                   type="text" data-degree="0.70"
                                                                                   value="0"
                                                                                   onKeyUp="value=value.replace(/[^\d|.]/g,'')"/>分
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="showDetail(this,'math','cf1b101d-15e2-415c-bf52-a7bac2555ace','1')">查看解析</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveUp('cf1b101d-15e2-415c-bf52-a7bac2555ace')">上移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveDown('cf1b101d-15e2-415c-bf52-a7bac2555ace')">下移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return reMove('cf1b101d-15e2-415c-bf52-a7bac2555ace')">删除</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="similarQues(this,'math','cf1b101d-15e2-415c-bf52-a7bac2555ace',1)">换一题</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>


                                                    <div className="questype">
                                                        <div className="questypehead">
                                                            <div className="questypeheadbox">
                                                                <table border="0" cellPadding="0" cellSpacing="0"
                                                                       style="width:100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td width="1">
                                                                            <div
                                                                                className="jcui-catescore exam-catescore questypescore"
                                                                                id="questypescore" style="width:120px">
                                                                                <table title="评分栏" border="1"
                                                                                       cellPadding="0" cellSpacing="0"
                                                                                       style="border:1px solid #666;">
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
                                                                            </div>
                                                                        </td>
                                                                        <td style="text-align:left;">
                                                                            <div
                                                                                className="exam-subjectnote questypetitle div-data-cate"
                                                                                contentEditable="true" cate="9">
                                                                                三．解答题（共2小题）
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="markarea">
                                                                <div className="part-ctrl">
                                                                    <span onClick="delGroup(this)"><i
                                                                        className="icon i-orange-delete"></i>删除</span>
                                                                    <span onClick="moveGroupUp(this)"><i
                                                                        className="icon i-orange-up"></i>上移</span>
                                                                    <span onClick="moveGroupDown(this)"><i
                                                                        className="icon i-orange-down"></i>下移</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="questypebody paper">
                                                            <ul className="list-box sortable ulQuesGroup ui-sortable"
                                                                id="typeSelect3" data-title="三．解答题（共2小题）">
                                                                <li className="QUES_LI" data-dg="0.70"
                                                                    data-point="有理数的混合运算" data-dgname="较易">
                                                                    <fieldset id="8e2da310-1591-4150-935f-46fee9c0425d"
                                                                              className="quesborder" s="math"
                                                                              data-cate="9">
                                                                        <div className="pt1"><span
                                                                            className="qseq">4．</span><a
                                                                            href="http://www.jyeoo.com/math/report/detail/75faaa4e-57d2-4dfb-a0dc-c0c67160f75b"
                                                                            className="ques-source"
                                                                            target="_blank">（2018秋•绥阳县期末）</a>计算：（1）<span
                                                                            className="MathJye" mathtag="math"
                                                                            style="whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal"><table
                                                                            cellPadding="-1" cellSpacing="-1"
                                                                            style="margin-right:1px"><tbody><tr><td
                                                                            style="border-bottom:1px solid black">1</td></tr><tr><td>3</td></tr></tbody></table>−<table
                                                                            cellPadding="-1" cellSpacing="-1"
                                                                            style="margin-right:1px"><tbody><tr><td
                                                                            style="border-bottom:1px solid black">1</td></tr><tr><td>2</td></tr></tbody></table></span>；（2）（-2）<sup>3</sup>×15-（-5）<sup>2</sup>÷5-5
                                                                        </div>
                                                                        <div className="pt6" style="display:none"></div>
                                                                    </fieldset>
                                                                    <div className="clear2"></div>
                                                                    <div className="fieldtip">
                                                                        <div className="fieldtip-right">
                                                                            <input className="input-data-score"
                                                                                   type="text" data-degree="0.70"
                                                                                   value="0"
                                                                                   onKeyUp="value=value.replace(/[^\d|.]/g,'')"/>分
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="showDetail(this,'math','8e2da310-1591-4150-935f-46fee9c0425d','1')">查看解析</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveUp('8e2da310-1591-4150-935f-46fee9c0425d')">上移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveDown('8e2da310-1591-4150-935f-46fee9c0425d')">下移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return reMove('8e2da310-1591-4150-935f-46fee9c0425d')">删除</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="similarQues(this,'math','8e2da310-1591-4150-935f-46fee9c0425d',1)">换一题</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li className="QUES_LI" data-dg="0.70" data-point="数轴"
                                                                    data-dgname="较易">
                                                                    <fieldset id="21cb510c-3151-4515-a5fa-2d3255c08db8"
                                                                              className="quesborder" s="math"
                                                                              data-cate="9">
                                                                        <div className="pt1"><span
                                                                            className="qseq">5．</span><a
                                                                            href="http://www.jyeoo.com/math/report/detail/75faaa4e-57d2-4dfb-a0dc-c0c67160f75b"
                                                                            className="ques-source"
                                                                            target="_blank">（2018秋•绥阳县期末）</a>请在下面的数轴上注明表示数<span
                                                                            className="MathJye" mathtag="math"
                                                                            style="whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal">−3，3，−2.5，<table
                                                                            cellPadding="-1" cellSpacing="-1"
                                                                            style="margin-right:1px"><tbody><tr><td
                                                                            style="border-bottom:1px solid black">3</td></tr><tr><td>2</td></tr></tbody></table></span>的点．<img
                                                                            alt="菁优网"
                                                                            src="http://img.jyeoo.net/quiz/images/201201/28/4769eff0.png"
                                                                            style="vertical-align:middle"/>
                                                                        </div>
                                                                        <div className="pt6" style="display:none"></div>
                                                                    </fieldset>
                                                                    <div className="clear2"></div>
                                                                    <div className="fieldtip">
                                                                        <div className="fieldtip-right">
                                                                            <input className="input-data-score"
                                                                                   type="text" data-degree="0.70"
                                                                                   value="0"
                                                                                   onKeyUp="value=value.replace(/[^\d|.]/g,'')"/>分
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="showDetail(this,'math','21cb510c-3151-4515-a5fa-2d3255c08db8','1')">查看解析</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveUp('21cb510c-3151-4515-a5fa-2d3255c08db8')">上移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return moveDown('21cb510c-3151-4515-a5fa-2d3255c08db8')">下移</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="return reMove('21cb510c-3151-4515-a5fa-2d3255c08db8')">删除</a>
                                                                                <a href="javascript:void(0)"
                                                                                   onClick="similarQues(this,'math','21cb510c-3151-4515-a5fa-2d3255c08db8',1)">换一题</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>