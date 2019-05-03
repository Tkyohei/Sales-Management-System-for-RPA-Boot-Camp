var text_def = {
    go_next_button :{
        input: "次へ",
        confirm: "確定",
    }

} 

var AppStatus = {
    isInput : true,
    isConfirm : false,
    isSuccess : false
}

var app_header_nav = new Vue({
    el:'#header-nav'
})

var app_status_area = new Vue({
    el:'#status-area',
    data : AppStatus,
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
    data:AppStatus
})

var app_go_next = new Vue({
    el:'#go-next',
    data:{
        status : AppStatus,
        text:text_def.go_next_button.input
    },
    methods:{
        go_next: function(){
            if (AppStatus.isInput){
                AppStatus.isInput = false;
                AppStatus.isConfirm = true;
                this.text = text_def.go_next_button.confirm
            }else if(AppStatus.isConfirm){
                AppStatus.isConfirm = false;
                AppStatus.isSuccess = true;
            }
        }
    }
})