import {request} from "~/utils/request";
export const UploadApi = {
    getOssInfo(){
        return request({
            url: '/manage/getOssInfo',
            method: 'post',
        })
    },
    uploadOss(url,params){
        return request({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: [(data) => {
                return data
            }],
            data:params
        })
    }
};
