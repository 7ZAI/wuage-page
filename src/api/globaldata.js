import axios from 'axios'

export let isLogin = undefined

export  function checkLogin(){
    return  axios.get('/wuage/systemUser/isLogin').then(res =>{
        // console.log(res)
        if(res.data.code === '0X10020'){
            setisLogin(false)
        }else{
            setisLogin(true)
        }
    }).catch(error=>{
        setisLogin(false)
    })
}

export function setisLogin(data){
    isLogin = data 
}

export function getisLogin(){
    return isLogin
}

