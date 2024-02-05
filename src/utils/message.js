import { ElMessage } from 'element-plus'

function msgErr(msg){
    if (msg!='' ){
        console.error(msg);
        ElMessage.error(msg)
    }
    
}

function expErr(err){
    if (err.code==40001){
        msgErr(err.message)
    }
}
export {expErr,msgErr};