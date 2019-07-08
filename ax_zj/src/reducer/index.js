import {httpClient} from "../axios/apiHelper";
const URL = {
    MATERIAL: '/api/v1/material',
    MATERIAL_SUBJECT_STAGE_GRADE_SEMESTER: '/api/v1/materialsubjectstagegradesemester'
};

const params = {
    "page": 1,
    "page_count": 99
};

export function getMaterial(_id, callback) {
    if(!_id) return;
    httpClient.get({
        url: URL.MATERIAL,
        queryParams: {...params, subject_stage_id: _id},
        success: (res) => {
            const data = res.data.map((item) => {
                return {...item, 'key': `material${item.id}`, active: false}
            });
            data[0].active = true;
            data && callback(data)
        }
    });
}

export function getMaterialGradeSemester(_mid, _sid, callback) {
    if(!_sid || !_mid) return;
    httpClient.get({
        url: URL.MATERIAL_SUBJECT_STAGE_GRADE_SEMESTER,
        queryParams: {...params, subject_stage_id: _sid, material_id: _mid},
        success: (res) => {
            console.log(res);
            const data = res.data.map((item) => {
                return {...item, 'key': `materialstage${item.id}`, active: false}
            });
            data[0].active = true;
            data && callback(data)
        }
    });
}