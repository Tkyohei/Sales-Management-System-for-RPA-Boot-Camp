var header_text = {
    system_title : "販売管理システム",
    btn_init : "データベース初期化"
}

Vue.component('header-nav',{
    data: function(){
        return header_text;
    },
    methods: {
        init_db : function(){
            if(window.confirm("データベースを初期化するとデータが全て削除されます。続行しますか？")){
                (async()=>{
                    await dao.dropDatabase();
                    await dao.createDataBaseIfNotExists();
                    await dao.createTablesIfNotExist();
                    await dao.insertProductsMasterDataIfNotExists();
                })()
                .then(()=>{
                    alert("データベースを初期化しました。")
                })
                .catch(reject =>{
                    alert("データベース処理中ににエラーが発生しました。")
                    throw new Error(reject)
                });
            }
        }
    },
    template:'<nav class="navbar has-background-white header-body">' +
                '<div class="navbar-brand">' +
                    '<a class="navbar-item" href="index.html">' +
                            "<img src='../img/logo.png'>" +
                    '</a>' +
                    '<div class="navbar-item">' +
                        '<span class="navbar-items is-size-5 has-text-grey">{{ system_title }}</span>' +
                    '</div>' +
                '</div>' +
                '<div class="navbar-menu">' +
                    '<div class="navbar-end">' +
                        '<div class="navbar-item">' +
                            '<a class="button is-danger is-outlined" v-on:click="init_db">{{ btn_init }}</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</nav>'
})

Vue.component("menu-button",{
    props:["text","icon","link"],
    data : function(){
        return{
            
        }
    },
    methods :{
        transition : function(){
            window.location.href = this.link
        }
    },
    template : '<div class="column is-half">' +
                    '<a class="button is-primary is-fullwidth container-menu-area-button" v-on:click="transition">' +
                        '<span class="icon is-large">' +
                            '<i v-bind:class="[icon]"></i>' +
                        '</span>' +
                        '<span>{{ text }}</span>' +
                    '</a>' +
                '</div>'
})

