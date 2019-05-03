var text_def = {
    go_next_button :{
        input: "確認画面へ",
        confirm: "保存",
        back: "メニューへ"
    },
    form : {
        order_info_title : "注文情報を入力してください",
        label_corporate_code : "企業コード",
        label_tanto_department : "担当部署",
        label_tanto_name : "担当者名",
        label_tanto_tel : "担当者電話番号",
        label_tanto_mail : "担当者メールアドレス",
        label_post : "納品先郵便番号",
        label_address : "納品先住所",
        label_order_date : "注文日",
        order_item_title : "注文内容を入力してください"
    }

} 

var app_data = {
    status:{
        isInput : true,
        isConfirm : false,
        isSuccess : false
    },
    order_info_dto:{
        corporate_code : "",
        tanto_department : "",
        tanto_name : "",
        post : "",
        address : "",
        tel : "",
        mail : "",
    },
    order_detail_dto:[
        [{product_id : "", quantity : "", delivery_data : ""}],
        [{product_id : "", quantity : "", delivery_data : ""}],
        [{product_id : "", quantity : "", delivery_data : ""}],
        [{product_id : "", quantity : "", delivery_data : ""}],
        [{product_id : "", quantity : "", delivery_data : ""}]
    ]
}

var app_header_nav = new Vue({
    el:'#header-nav'
})

var app_status_area = new Vue({
    el:'#status-area',
    data : app_data.status,
    computed : {
        InputIconClass : function() {
            return  {
                iconNowAlready : (this.isInput ||this.isConfirm || this.isSuccess)
            }
        },
        ConfirmIconClass : function() {
            return  {
                iconYet : this.isInput,
                iconNowAlready : (this.isConfirm || this.isSuccess)
            }
        },
        SuccessIconClass : function() {
            return  {
                iconYet : (this.isInput || this.isConfirm),
                iconNowAlready : (this.isSuccess)
            }
        },
        FirstBarClass : function() {
            return  {
                barNow : this.isInput,
                barAlready : (this.isConfirm || this.isSuccess)
            }
        },
        SecondBarClass : function() {
            return  {
                barYet : this.isInput,
                barNow : this.isConfirm,
                barAlready : this.isSuccess
            }
        }
    }
    
})

var app_input_page = new Vue({
    el:'#main-content',
    data: { 
        app_data : app_data,
        text : text_def.form
    }
});

var app_go_next = new Vue({
    el:'#go-next',
    data:{
        status : app_data.status,
        text:text_def.go_next_button.input
    },
    methods:{
        go_next: function(){
            if (this.status.isInput){
                this.status.isInput = false;
                this.status.isConfirm = true;
                this.text = text_def.go_next_button.confirm
            }else if(this.status.isConfirm){
                this.status.isConfirm = false;
                this.status.isSuccess = true;
                this.text = text_def.go_next_button.back;
            }else if(this.status.isSuccess){
                window.location.href = "./index.html";
            }
        }
    }
})