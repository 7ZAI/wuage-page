/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}



/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validNormalString(str){
  if(str.length > 0 && str.length <= 12){
    return true;
  }
  return false;
}

// 字符串验证
export var validName = (rule, value, callback) => {
//  console.log(rule)
  let fieldName = ''

 if(rule.field === 'loginName'){
   fieldName = '登陆名'
 }

 if(rule.field === 'username'){
    fieldName = '用户名'
  }

if(rule.field === 'roleName'){
  fieldName = '角色名称'
}

if(rule.field === 'menuName'){
  fieldName = '菜单名称'
}

  if (value === '' || value === undefined) {
    callback(new Error('请输入'+fieldName));
  } else if(value.length > 0 && value.length <= 20){
    callback()
  } else {
    callback(new Error(fieldName+'长度应在0~20个字符之间！'));
  }
 
}

//密码校验
export const validatePassword = (rule, value, callback) => {
  if (value === '' || value === undefined) {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error("密码格式不正确！"));
  } else {
    callback();
  }
 
}

var validatePass2 = (rule, value, callback) => {
  console.log(value)
  console.log(this.newpwd)
   if (value === '' || value === undefined) {
     callback(new Error('请再次输入密码'));
   } else if (value !== this.newpwd) {
     callback(new Error('两次输入密码不一致!'));
   } else {
     callback();
   }
}



// 手机号验证
export var validPhone = (rule, value, callback) => {

  const reg = /^1\d{10}$/

  if (value === '' || value === undefined) {
    callback(new Error('请输入手机号'));
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号码格式不正确!'));
  }
};
