(async()=>{
    await dao.createDataBaseIfNotExists();
    await dao.createTablesIfNotExist().then(async create_count =>{
        if(create_count > 0){
            await dao.insertProductsMasterDataIfNotExists();
        }
    });        
})()
.catch(reject =>{
    alert("データベース処理中ににエラーが発生しました。")
    throw new Error(reject)
});

var text_def = {
    system_name : "販売管理システム",
    tag_user : "ユーザー名",
    tag_password : "パスワード",
    btn_login : "ログイン",
    error_message : "ユーザー名またはパスワードが間違っています。",
    v_user:"",
    v_password:"",
    invalid: false
}

var login_form = new Vue({
    el : "#login-form",
    data : text_def,
    methods : {
        login : function(){
            if(this.v_user == "robo" && this.v_password == "ptcs"){
                sessionStorage.setItem('user',this.v_user)
                window.location.href = "./sales_managment/index.html";
            }else{
                this.invalid = true;
            }
        }
    }
})