var app_data = {
    status: {
        isInput: true,
        isConfirm: false,
        isSuccess: false
    },
    order_info_dto: {
        corporate_code: "",
        tanto_department: "",
        tanto_name: "",
        post: "",
        address: "",
        tel: "",
        mail: "",
        order_date: null,
        total_amount: 0
    },
    eda_num: {
        tel_first: "",
        tel_second: "",
        tel_third: "",
        post_first: "",
        post_second: ""
    },
    // selected_idとamountは描画には必要だが、DB更新には必要ない。設計ミスった。
    order_detail_dtos: [
        { num: 1, item_id: null, selected_item: "", price: 0, quantity: 0, amount: 0 },
        { num: 2, item_id: null, selected_item: "", price: 0, quantity: 0, amount: 0 },
        { num: 3, item_id: null, selected_item: "", price: 0, quantity: 0, amount: 0 },
        { num: 4, item_id: null, selected_item: "", price: 0, quantity: 0, amount: 0 },
        { num: 5, item_id: null, selected_item: "", price: 0, quantity: 0, amount: 0 }
    ],
    items: (() => {
        // To Do : 非同期にしたい
        try {
            return dao.selectAllItems();
        } catch (e) {
            alert("商品リストの取得に失敗しました");
            console.log(e);
        }
    })(),
    order_num :null,
    error: {
        corporate_code: {
            hasError: false,
            errorMsg: ""
        },
        tanto_department: {
            hasError: false,
            errorMsg: ""
        },
        tanto_name: {
            hasError: false,
            errorMsg: ""
        },
        tel: {
            hasError: false,
            errorMsg: ""
        },
        mail: {
            hasError: false,
            errorMsg: ""
        },
        post: {
            hasError: false,
            errorMsg: ""
        },
        address: {
            hasError: false,
            errorMsg: ""
        },
        order_date: {
            hasError: false,
            errorMsg: ""
        },
        detail: {
            hasError: false,
            errorMsgs: []
        }

    }
}

var app_header_nav = new Vue({
    el: '#header-nav'
})

var app_status_area = new Vue({
    el: '#status-area',
    data: app_data.status,
    computed: {
        InputIconClass: function () {
            return {
                iconNowAlready: (this.isInput || this.isConfirm || this.isSuccess)
            }
        },
        ConfirmIconClass: function () {
            return {
                iconYet: this.isInput,
                iconNowAlready: (this.isConfirm || this.isSuccess)
            }
        },
        SuccessIconClass: function () {
            return {
                iconYet: (this.isInput || this.isConfirm),
                iconNowAlready: (this.isSuccess)
            }
        },
        FirstBarClass: function () {
            return {
                barNow: this.isInput,
                barAlready: (this.isConfirm || this.isSuccess)
            }
        },
        SecondBarClass: function () {
            return {
                barYet: this.isInput,
                barNow: this.isConfirm,
                barAlready: this.isSuccess
            }
        }
    }

})

var app_input_page = new Vue({
    el: '#main-content',
    data: {
        app_data: app_data,
        text: text_def.form
    },
    computed: {
        CorporateCodeClass: function () {
            return {
                'is-danger': this.app_data.error.corporate_code.hasError,
            }
        },
        TantoDepartmentClass: function () {
            return {
                'is-danger': this.app_data.error.tanto_department.hasError,
            }
        },
        TantoNameClass: function () {
            return {
                'is-danger': this.app_data.error.tanto_name.hasError,
            }
        },
        TelClass: function () {
            return {
                'is-danger': this.app_data.error.tel.hasError,
            }
        },
        MailClass: function () {
            return {
                'is-danger': this.app_data.error.mail.hasError,
            }
        },
        PostClass: function () {
            return {
                'is-danger': this.app_data.error.post.hasError,
            }
        },
        AddressClass: function () {
            return {
                'is-danger': this.app_data.error.address.hasError,
            }
        },
        OrderDateClass: function () {
            return {
                'is-danger': this.app_data.error.order_date.hasError,
            }
        }
    },
    methods: {
        merge_tel: function () {
            this.app_data.order_info_dto.tel = this.app_data.eda_num.tel_first +
                "-" +
                this.app_data.eda_num.tel_second +
                "-" +
                this.app_data.eda_num.tel_third;
        },
        merge_post: function () {
            this.app_data.order_info_dto.post = this.app_data.eda_num.post_first +
                "-" +
                this.app_data.eda_num.post_second
        },
        //注文内容の値が更新された行のデータを引数に金額の再計算を行う
        calculate_payment: function (dto) {

            // 選択された商品の商品情報を取得
            var selected_item_info = app_data.items.filter(item => item.product_name === dto.selected_item)

            // その商品の原価・小計を更新
            dto.price = selected_item_info[0].price;
            dto.amount = selected_item_info[0].price * dto.quantity;

            // IDを取得
            dto.item_id = selected_item_info[0].id;

            // 小計から合計を計算
            var total_amount = 0;
            for (var i = 0; i < app_data.order_detail_dtos.length; i++) {
                total_amount = total_amount + app_data.order_detail_dtos[i].amount
            }

            // 注文情報の総額を更新
            app_data.order_info_dto.total_amount = Math.floor(total_amount * 1.08);

            // 注文内容テーブル下の合計・消費税を,をつけて更新
            this.text.total_amount = "合計 : " +
                this.app_data.order_info_dto.total_amount.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') +
                " 円"
            this.text.tax = "（内消費税 : " +
                Math.floor(total_amount * 0.08).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') +
                " 円）"
        }
    }
});

var app_go_next = new Vue({
    el: '#go-next',
    data: {
        status: app_data.status,
        text: text_def.go_next_button.input,
        loading: false,
        modalShow: false,
        order_num: app_data.order_num,
        allErrorMsgs: []
    },
    computed: {
        GoNextBtnClass: function () {
            return {
                'is-loading': this.loading
            }
        },
        ModalClass: function () {
            return {
                'is-active': this.modalShow
            }
        }
    },
    methods: {
        go_next: function () {//状態ごとにメソッドを用意して、処理を切り出したい

            this.loading = true;
            this.allErrorMsgs = [];


            // 外部通信を出している感を出すためにsetTimeoutを使用
            // 乱数を使い、通信速度のバラつきを出す
            // 場合によっては通信エラーを出す
            var randomNum = Math.floor(Math.random() * 10);
            var connectTime;

            if (randomNum == 0) { //通信エラー
                connectTime = 12000;
            }
            else if (0 < randomNum && randomNum <= 5) {
                connectTime = 1000;
            }
            else if (5 < randomNum && randomNum <= 7) {
                connectTime = 3000;
            }
            else if (randomNum == 8) {
                connectTime = 5000
            }
            else if (randomNum == 9) {
                connectTime = 10000
            }

            if(this.status.isSuccess) connectTime = 0

            setTimeout((() => {
                
                check_inputed_data.check();
                
                if (this.status.isInput && randomNum != 0) { // 入力画面の場合の処理
                    // モーダル表示用にエラーメッセージを全取得
                    for (key in app_data.error) {
                        if (key == "detail") { //detailのみエラーメッセージが配列
                            if (app_data.error[key].hasError) {
                                for (var i = 0; i < app_data.error[key].errorMsgs.length; i++) {                                    
                                    this.allErrorMsgs.push(app_data.error[key].errorMsgs[i])
                                }
                            }
                        } else {
                            if (app_data.error[key].hasError) this.allErrorMsgs.push(app_data.error[key].errorMsg);
                            
                        }
                    }

                    // エラーが一つでもあればモーダルを表示し、先には進まない。
                    if (this.allErrorMsgs.length > 0) {
                        this.modalShow = true;
                    } else {

                        // 注文内容の空白行を削除
                        app_data.order_detail_dtos = app_data.order_detail_dtos.filter(function (item, index) {
                            if (item.selected_item != "") return true;
                        });

                        this.status.isInput = false;
                        this.status.isConfirm = true;
                        this.text = text_def.go_next_button.confirm
                    }

                }
                else if (this.status.isConfirm && randomNum != 0) { // 確認画面の場合の処理
                    this.loading = true;
                    
                    dao.insertNewOrder(app_data.order_info_dto, app_data.order_detail_dtos)
                        .then((result) => {
                            if(result.info && result.stock && result.detail){
                                app_data.order_num = result.order_num;
                                this.status.isConfirm = false;
                                this.status.isSuccess = true;
                                this.text = text_def.go_next_button.back;
                            }else{
                                this.allErrorMsgs.push(text_def.error_messeages.failedToInsert);
                                this.modalShow = true;
                            }
                            
                        })
                        .catch(e => {
                            this.allErrorMsgs.push(text_def.error_messeages.failedToInsert);
                            this.modalShow = true;
                            throw new Error(e);
                        })
                }
                else if(randomNum == 0){
                    window.location.href = "./error.html";
                }
                else if (this.status.isSuccess) { // 成功画面の場合の処理
                    window.location.href = "./index.html";
                }

                this.loading = false;
                scrollTo(0, 0);

            }), connectTime);
        },
        backToInput : function(){ // 確認画面の戻るボタンを実装したい。。。
            this.status.isInput = true;
            this.status.isConfirm = false;
        },
        close_modal: function () {
            this.modalShow = false;
        }
    }
})

var check_inputed_data = {
    // 算出プロパティを使えばよいものもあるが、途中までエラー内容がわからない方がRPA練習的には楽しいので使用していない。
    check: function () {
        this.errorCount = 0;
        this.initErrorProp(); // エラーを保持するプロパティを初期化しないと前回のチェックを引き継いでしまう

        this.checkNull();
        this.checkTelFormat();
        this.checkMailFormat();
        this.checkPostFormat();
        this.checkQuantityFormat();
        this.checkZeroItem();
        this.checkFromTopToBottom();
        this.checkDuplication();

        // 非同期にしたかったがモーダル表示に間に合わないため同期処理にした
        this.checkCorporateCodeAndTransactionLimit();
        this.checkStock();

    },
    initErrorProp: function () {
        for (key in app_data.error) {
            if (key != "detail") {
                app_data.error[key].hasError = false;
                app_data.error[key].errorMsg = "";
            } else {
                app_data.error[key].hasError = false;
                app_data.error[key].errorMsgs = [];
            }
        }
    },
    checkNull: function () {
        var infoDto = app_data.order_info_dto;
        var edaNum = app_data.eda_num
        var detailDtos = app_data.order_detail_dtos;
        var error = app_data.error;
        var texts = text_def.form

        if (infoDto.corporate_code == "") this.isNullError(texts.label_corporate_code, error.corporate_code);
        if (infoDto.tanto_department == "") this.isNullError(texts.label_tanto_department, error.tanto_department);
        if (infoDto.tanto_name == "") this.isNullError(texts.label_tanto_name, error.tanto_name);
        if (edaNum.tel_first == "" || edaNum.tel_second == "" || edaNum.tel_third == "") {
            this.isNullError(texts.label_tanto_tel, error.tel);
        }
        if (infoDto.mail == "") this.isNullError(texts.label_tanto_mail, error.mail);
        if (edaNum.post_first == "" || edaNum.post_second == "") {
            this.isNullError(texts.label_post, error.post);
        }
        if (infoDto.address == "") this.isNullError(texts.label_address, error.address);
        if (infoDto.order_date == null){
            this.isNullError(texts.label_order_date, error.order_date);
        } 
        else if(infoDto.order_date.length != 10){
            this.isNullError(texts.label_order_date, error.order_date);
        }

        var Syohin_Ga_Hitotsumo_Nyuryoku_Saretenai = true;
        for (var i = 0; i < detailDtos.length; i++) {
            if (detailDtos[i].selected_item != "") Syohin_Ga_Hitotsumo_Nyuryoku_Saretenai = false;
        }
        if (Syohin_Ga_Hitotsumo_Nyuryoku_Saretenai) this.isNullError(text_def.form.order_item_item, error.detail);

    },
    isNullError: function (item_name, errorProp) {
        errorProp.hasError = true;
        if (!Array.isArray(errorProp.errorMsgs)) {
            errorProp.hasError = true;
            errorProp.errorMsg = item_name + text_def.error_messeages.isNull
        } else { // 注文内容のみエラーメッセージが配列
            errorProp.hasError = true;
            errorProp.errorMsgs.push(item_name + text_def.error_messeages.isNull);
        }

    },
    checkTelFormat: function () {
        // 値が入力されている場合（checkNullに引っかかっていない）のみチェック
        if (!app_data.error.tel.hasError) {
            var invalid = (app_data.order_info_dto.tel.match(/^\d{2,5}-\d{1,4}-\d{4}$/) == null);
            if (invalid) {
                app_data.error.tel.hasError = true;
                app_data.error.tel.errorMsg = text_def.form.label_tanto_tel +
                    text_def.error_messeages.isInvalidFormat

            }
        }
    },
    checkMailFormat: function () {
        // 値が入力されている場合（checkNullに引っかかっていない）のみチェック
        if (!app_data.error.mail.hasError) {
            var invalid = (app_data.order_info_dto.mail.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/) == null);
            if (invalid) {
                app_data.error.mail.hasError = true;
                app_data.error.mail.errorMsg = text_def.form.label_tanto_mail +
                    text_def.error_messeages.isInvalidFormat

            }
        }
    },
    checkPostFormat: function () {
        // 値が入力されている場合（checkNullに引っかかっていない）のみチェック
        if (!app_data.error.post.hasError) {
            var invalid = (app_data.order_info_dto.post.match(/^\d{3}-\d{4}$/) == null);
            if (invalid) {
                app_data.error.post.hasError = true;
                app_data.error.post.errorMsg = text_def.form.label_post +
                    text_def.error_messeages.isInvalidFormat

            }
        }
    },
    checkQuantityFormat: function () {
        var details = app_data.order_detail_dtos
        for (var i = 0; i < details.length; i++) {
            var invalid
            if (details[i].quantity == 0) {
                invalid = false;
            } else {
                invalid = (details[i].quantity.match(/^[0-9]+$/) == null)
            }
            if (invalid) {
                app_data.error.detail.hasError = true;
                app_data.error.detail.errorMsgs.push(details[i].num + "の" + text_def.form.order_item_quantity + text_def.error_messeages.isInvalidFormat)

            }
        }
    },
    checkZeroItem: function () {
        var details = app_data.order_detail_dtos
        for (var i = 0; i < details.length; i++) {
            var invalid = (details[i].selected_item != "" && details[i].quantity == 0)
            if (invalid) {
                app_data.error.detail.hasError = true;
                app_data.error.detail.errorMsgs.push(details[i].selected_item + "の" + text_def.form.order_item_quantity + text_def.error_messeages.isZero)

            }
        }
    },
    checkFromTopToBottom: function () {
        var TopRowHasNoItem = 0; // 商品が選択されたいない行のうち、一番上の行の行番号を保持
        var BottomRowHasItem = 0; // 商品が選択されている行のうち、一番下の行の行番号を保持
        var details = app_data.order_detail_dtos
        for (var i = 0; i < details.length; i++) {
            var selectedItemOfThisRow = details[i].selected_item;
            var rowNum = details[i].num;
            if (TopRowHasNoItem == 0 && selectedItemOfThisRow == "") {
                TopRowHasNoItem = rowNum;
            }

            if (BottomRowHasItem < rowNum && selectedItemOfThisRow != "") {
                BottomRowHasItem = rowNum
            }

        }

        if (TopRowHasNoItem < BottomRowHasItem && TopRowHasNoItem != 0) {
            app_data.error.detail.hasError = true;
            app_data.error.detail.errorMsgs.push(text_def.error_messeages.detailIsNotFromTopToBottom)

        }
    },
    checkDuplication: function () {
        var selectedItems = []
        for (var i = 0; i < app_data.order_detail_dtos.length; i++) {
            if (app_data.order_detail_dtos[i].selected_item != "") {
                selectedItems.push(app_data.order_detail_dtos[i].selected_item);
            }
        }
        var duplicatedItem = selectedItems.filter(function (x, i, self) {
            return self.indexOf(x) === i && i !== self.lastIndexOf(x);
        });

        if (duplicatedItem.length > 0) {
            app_data.error.detail.hasError = true;
            for (var i = 0; i < duplicatedItem.length; i++) {
                app_data.error.detail.errorMsgs.push(duplicatedItem[i] + text_def.error_messeages.isDuplicated);

            }
        }
    },
    checkCorporateCodeAndTransactionLimit: function () {
        if (!app_data.error.corporate_code.hasError) {
            var tokuisaki = dao.selectTokuisakiByCorporateCode(app_data.order_info_dto.corporate_code)
            if (tokuisaki.length != 0) {
                if (tokuisaki[0].transaction_limit < app_data.order_info_dto.total_amount) {
                    app_data.error.detail.hasError = true;
                    app_data.error.detail.errorMsgs.push(tokuisaki[0].corporate_name + text_def.error_messeages.overTransactionLimit)
                }
            } else {
                app_data.error.corporate_code.hasError = true;
                app_data.error.corporate_code.errorMsg = text_def.error_messeages.invalidCorporateCode;
            }
        }
    },
    checkStock: function () {
        // 選択された商品のリストを取得する
        var selectedItemList = app_data.order_detail_dtos.filter(item => item.selected_item != "" && item.quantity > 0);
        var outOfStock = dao.selectProductOutOfStock(selectedItemList)
        for (var i = 0; i < outOfStock.length; i++) {
            app_data.error.detail.hasError = true;
            app_data.error.detail.errorMsgs.push(outOfStock[i].selected_item + text_def.error_messeages.isOutOfStock);
        }
    }
}