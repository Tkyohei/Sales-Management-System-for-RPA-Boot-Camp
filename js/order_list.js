var orderListData = {
    orders: (() => {
        try {
            return dao.selectAllOrders();
        } catch (e) {
            alert(text_def.error_messeages.failedToSelect);
            throw new Error(e);
        }
    })()
}

var orderDetailData = {
    detailClicked: false,
    items: [],
    tax: 0,
    orderInfo: null
}

var app_header_nav = new Vue({
    el: '#header-nav'
})

var appOrderList = new Vue({
    el: '#order-list',
    data: {
        orders: orderListData,
        text: text_def
    },
    methods: {
        showDetail: function (order) {
            orderDetailData.orderInfo = order
            orderDetailData.items = (() => {
                try {
                    return dao.selectOrderDetail(order.order_num);
                } catch (e) {
                    alert(text_def.error_messeages.failedToSelect);
                    throw new Error(e);
                }
            })()

            var amountOfNoTax = 0;
            for(var i = 0; i < orderDetailData.items.length; i++){
                amountOfNoTax = amountOfNoTax + (orderDetailData.items[i].price * orderDetailData.items[i].quantity)
            }
            orderDetailData.tax = Math.floor(amountOfNoTax * 0.08)

            orderDetailData.detailClicked = true;
        }
    }
})

var appDetail = new Vue({
    el: '#modal-detail',
    data: {
        detail: orderDetailData,
        text: text_def
    },
    computed: {
        ModalClass: function () {
            return {
                'is-active': this.detail.detailClicked
            }
        }
    },
    methods: {
        closeModal: function () {
            this.detail.detailClicked = false;
        }
    }
})