var text_def = {
    go_next_button :{
        input: "確認画面へ",
        confirm: "保存",
        back: "メニューへ"
    },
    form : {
        order_info_title : "① 注文情報を入力してください",
        label_corporate_code : "企業コード",
        label_tanto_info : "担当情報",
        label_tanto_department : "担当部署",
        label_tanto_name : "担当者名",
        label_tanto_tel : "TEL",
        label_tanto_mail : "メールアドレス",
        label_delivery_info : "納品先情報",
        label_post : "〒",
        label_address : "納品先住所",
        label_order_date : "注文日",
        order_item_title : "② 注文内容を入力してください",
        order_item_num : "No",
        order_item_item : "商品名",
        order_item_price : "単価",
        order_item_quantity : "数量",
        order_item_amount : "小計",
        choose_item : "商品を選択してください",
        total_amount : "合計 : 0 円",
        tax : "（内消費税 : 0 円）"
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
        order_date: new Date(),
        total_amount : 0
    },
    eda_num:{
        tel_first:"",
        tel_second:"",
        tel_third:"",
        post_first:"",
        post_second:""
    },
    order_detail_dtos:[
        {num : 1,  selected_item: "", price :0,quantity:0,amount:0},
        {num : 2,  selected_item: "", price :0,quantity:0,amount:0},
        {num : 3,  selected_item: "", price :0,quantity:0,amount:0},
        {num : 4,  selected_item: "", price :0,quantity:0,amount:0},
        {num : 5,  selected_item: "", price :0,quantity:0,amount:0}        
    ],
    items: (()=>{
        // To Do : 非同期にしたい
        try{
            return dao.selectAllItems();
        }catch(e){
            alert("商品リストの取得に失敗しました");
            console.log(e);
        }
    })()
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
    },
    methods:{
        merge_tel : function(){
            this.app_data.order_info_dto.tel = this.app_data.eda_num.tel_first +
            "-" +
            this.app_data.eda_num.tel_second +
            "-" +
            this.app_data.eda_num.tel_third;
        },
        merge_post : function(){
            this.app_data.order_info_dto.post = this.app_data.eda_num.post_first +
                                            "-" +                                    
                                            this.app_data.eda_num.post_second
        },
        //注文内容の値が更新された行のデータを引数に金額の再計算を行う
        calculate_payment : function(dto){
            
            // 選択された商品の商品情報を取得
            var selected_item_info = app_data.items.filter(item=> item.product_name === dto.selected_item)
            
            // その商品の原価・小計を更新
            dto.price = selected_item_info[0].price;
            dto.amount = selected_item_info[0].price * dto.quantity;
             
            // 小計から合計を計算
            dto.quantity
            var total_amount = 0;
            for(var i = 0; i < app_data.order_detail_dtos.length; i++){
                total_amount = total_amount + app_data.order_detail_dtos[i].amount
            }
            
            // 注文情報の総額を更新
            app_data.order_info_dto.total_amount = Math.floor(total_amount * 1.08);

            // 注文内容テーブル下の合計・消費税を更新
            this.text.total_amount = "合計 : " + 
                                this.app_data.order_info_dto.total_amount.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') +
                                " 円"
            this.text.tax = "（内消費税 : " + 
                                Math.floor(total_amount * 0.08).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') +
                                " 円"
      
        }
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