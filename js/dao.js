var dao = {
    createDataBaseIfNotExists: () => {
        return new Promise((resolve, reject) => {
            try {
                const sql_create = "CREATE localStorage DATABASE IF NOT EXISTS sales_management;";
                const sql_attach = "ATTACH localStorage DATABASE sales_management;";
                const sql_use = "USE sales_management;";
                alasql(sql_create);
                alasql(sql_attach);
                alasql(sql_use);
                resolve();
            } catch (e) {
                reject(e)
            }
        })


    },
    createTablesIfNotExist: () => {
        return new Promise((resolve, reject) => {
            try {
                const sql_create_products =
                    "CREATE TABLE IF NOT EXISTS t_products (id INT, product_name STRING, price INT);"

                const sql_create_order_info =
                    "CREATE TABLE IF NOT EXISTS t_order_info(order_num INT, order_date DATE, total_amount INT, corporate_code STRING ," +
                    "tanto_department STRING, tanto_name STRING, post STRING, address STRING, tel STRING, mail STRING);"

                const sql_create_order_detail =
                    "CREATE TABLE IF NOT EXISTS t_order_detail(num INT, order_num INT, item_id INT, quantity INT);"

                const sql_create_tokuisaki =
                    "CREATE TABLE IF NOT EXISTS t_tokuisaki(code STRING, corporate_name STRING, transaction_limit INT);";

                const sql_create_stock =
                    "CREATE TABLE IF NOT EXISTS t_stock(id INT, stock INT);"

                var create_count = 0;
                create_count = create_count + alasql(sql_create_products);
                create_count = create_count + alasql(sql_create_order_info);
                create_count = create_count + alasql(sql_create_order_detail);
                create_count = create_count + alasql(sql_create_tokuisaki);
                create_count = create_count + alasql(sql_create_stock);
                resolve(create_count);
            } catch (e) {
                reject(e)
            }
        })
    },
    insertProductsMasterDataIfNotExists: () => {
        return new Promise((resolve, reject) => {
            try {
                const sql_insert_products = "INSERT INTO t_products VALUES ?;";
                const sql_insert_tokuisaki = "INSERT INTO t_tokuisaki VALUES ?;";
                const sql_insert_stock = "INSERT INTO t_stock VALUES ?;";

                for (var i = 0; i < initial_data.products_data.length; i++) {
                    alasql(sql_insert_products, initial_data.products_data[i]);
                }

                for (var i = 0; i < initial_data.tokuisaki_data.length; i++) {
                    alasql(sql_insert_tokuisaki, initial_data.tokuisaki_data[i]);
                }

                for (var i = 0; i < initial_data.stock_data.length; i++) {
                    alasql(sql_insert_stock, initial_data.stock_data[i]);
                }

                resolve();

            } catch (e) {
                reject(e)
            }
        })
    },
    dropDatabase: () => {
        return new Promise((resolve, reject) => {
            try {
                const sql_drop = "DROP localStorage DATABASE sales_management";
                alasql(sql_drop);
                resolve();
            } catch (e) {
                reject(e)
            }
        })
    },
    selectAllItems: () => {
        try {
            const sql_select = "SELECT * FROM t_products";
            return alasql(sql_select);
        } catch (e) {
            throw new Error(e)
        }
    },
    selectTokuisakiByCorporateCode: (corporate_code) => {
        const sql_select = "SELECT * FROM t_tokuisaki WHERE code = ?"
        var tokuisaki =  alasql(sql_select, corporate_code);
        return tokuisaki;
    },
    selectProductOutOfStock: (products_info) => {
        var outOfStock = [];
        const sql_select = "SELECT stock FROM t_stock WHERE id = ?"

        for (var i = 0; i < products_info.length; i++) {
            var stockInfo = alasql(sql_select, products_info[i].item_id);
            if (stockInfo[0].stock < products_info[i].quantity) {
                outOfStock.push(products_info[i]);
            }
        }
        
        return outOfStock;

    },
    insertNewOrder: (info, details) => {
        return new Promise((resolve, reject) => {
            
            var result = {
                info : null,
                stock : null,
                detail : null,
                order_num : null
            }

            // トランスアクションでやろうとしたが、データの更新がうまくいかないため断念
            try {
                var order_num = alasql("SELECT MAX(order_num) AS max_num from t_order_info ;")[0].max_num;
                order_num == null ? order_num = 1 : order_num++;
                info.order_num = order_num;
                result.order_num = order_num;

                1 == alasql("INSERT INTO t_order_info VALUES ?;", [info]) ? result.info = true : result.info = false;

                var stockUpdateCount = 0;
                var detailInsertCount = 0;

                for (var i = 0; i < details.length; i++) {
                    details[i].order_num = order_num;
                    delete details[i].selected_item;
                    delete details[i].amount;
                    delete details[i].price;
                    stockUpdateCount = stockUpdateCount + alasql("UPDATE t_stock SET stock = stock - ? WHERE id = ?",[details[i].quantity, details[i].item_id])
                    detailInsertCount = detailInsertCount + alasql("INSERT INTO t_order_detail VALUES ?",[details[i]])
                }

                details.length == stockUpdateCount ? result.stock = true : result.stock = false;
                details.length == detailInsertCount ? result.detail = true : result.detail = false;

                resolve(result);

            } catch (e) {
                reject(e);
            }
        })
    }

}