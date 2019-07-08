import {observable, action, computed, when} from 'mobx'
import {getMaterial, getMaterialGradeSemester} from '../reducer/index'

class FormatePaper {
    @observable subjectOrMaterial = false; //章节选题还是知识点选题   科目为false, 默认
    @observable subjectId = 1; //所选的科目ID, 默认为1--- 数学
    @observable subjectStageId = 1; //所选的学历ID, 默认为1--- 小学

    @observable materialId = ''; // 所选教材ID
    @observable materialList = []; // 教材列表

    @observable materialStageGradeSemesterId = ''; // 所选教材学历ID
    @observable subjectStageGradeSemesterList = []; // 教材学历列表

    @observable materialSubjectStageGradeSemesterUnitId = ''; // 教材知识点id
    @observable subjectStagePointId = ''; // 教材知识点id
    @observable type = ''; //
    @observable category = ''; //
    @observable source = ''; //
    @observable difficulty = ''; //

    @observable seeAnswer = ''; // 是否显示答案
    @observable toggleChooseUnit = true; // 是否显示答案

    // 更新教材列表的value以及所选择的教材ID
    @action setMaterialList(value) {
        this.materialList = value;
        this.materialId = value[0].id;

        this.materialId && this.getMaterialGradeSemesterData();
    }

    @action changePoint() {
        this.subjectOrMaterial = !this.subjectOrMaterial;
        if(!this.subjectOrMaterial){
            this.materialSubjectStageGradeSemesterUnitId = '';
        }else{
            this.subjectStagePointId = '';
        }
    }

    // 教材更新之后  更新对应的学历学期
    @action getMaterialGradeSemesterData() {
        getMaterialGradeSemester(this.materialId, this.subjectStageId, (d) => {
            this.subjectStageGradeSemesterList = d;
            const username = localStorage.getItem('username');
            const semester = localStorage.getItem(`${username}_semester`);
            if(semester){
                const se = d.filter(o => o.subject_stage_grade_semester_id + '' === semester);
                if(se.length > 0){
                    this.storgeMaterialStageGradeSemesterId(se[0]);
                }else{
                    this.storgeMaterialStageGradeSemesterId(d[0]);
                }
            }else{
                this.storgeMaterialStageGradeSemesterId(d[0]);
            }
        });
    }

    /**
     * 存储教材对应的学期以及存储教材的ID
     * @param se
     */
    storgeMaterialStageGradeSemesterId = (se) => {
        this.materialStageGradeSemesterId = se.id;
        const username = localStorage.getItem('username');
        localStorage.setItem(`${username}_semester`, se.subject_stage_grade_semester_id);
    };

    /**
     * 改变教材和学历阶段时候  改变对应的教材目录
     * @param subject_id
     * @param stage_id
     */
    @action changeSubjectStageId(subject_id, stage_id) {
        this.subjectId = subject_id;
        this.subjectStageId = stage_id;
        
        const _this = this;
        // 改变对应教材目录
        when(() => this.subjectStageId, () => {
            getMaterial(stage_id, (d) => {
                _this.setMaterialList(d)
            });
        });
    }

    @action changeMaterial(_id) {
      this.materialId = _id;
      this.materialId && this.getMaterialGradeSemesterData();
    }

    @action changeMaterialGradeSemester(item) {
        this.storgeMaterialStageGradeSemesterId(item);
    }

    @action changeMaterialSubjectStageGradeSemesterUnitId(_id) {
        if(!_id) return;
        this.materialSubjectStageGradeSemesterUnitId = _id;
        this.subjectStagePointId = '';
    }

    @action changeSubjectStagePointId(_id) {
        if(!_id) return;
        this.subjectStagePointId = _id;
        this.materialSubjectStageGradeSemesterUnitId = '';
    }

    @action changeMaterialSubjectStageID(key, _id) {
        this[key] = _id;
    }
    @action toggleAnswer() {
        this.seeAnswer = !this.seeAnswer;
    }

    @action toggleChooseUnitFun(bool) {
        this.toggleChooseUnit = bool;
    }


}

export default new FormatePaper()