var text_def = {
    menu_buttons:[
            {id:1, text: " 受注入力", icon: "fa fa-yen-sign", link:"order_entry.html"},
            {id:2, text: " 受注一覧", icon: "fa fa-list", link:"./order_list.html"},
            {id:3, text: " 請求管理", icon: "fa fa-file-invoice", link:"./error.html"},
            {id:4, text: " 入金消込", icon: "fa fa-calculator", link:"./error.html"},
            {id:5, text: " 出荷管理", icon: "fa fa-truck", link:"./error.html"},
            {id:6, text: " 販売履歴", icon: "fa fa-book", link:"./error.html"}
        ]
}

var app_header_nav = new Vue({
    el:'#header-nav'
})

var app_menu_buttons = new Vue({
    el : "#menu-buttons",
    data :{
        buttons:text_def.menu_buttons
    }
})
