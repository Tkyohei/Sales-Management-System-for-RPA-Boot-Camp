var dao = {
    createDataBaseIfNotExists  : ()=>{
        return new Promise((resolve,reject)=>{
            try{
                const sql_create = "CREATE localStorage DATABASE IF NOT EXISTS sales_management;";
                const sql_attach = "ATTACH localStorage DATABASE sales_management;";
                const sql_use = "USE sales_management;";
                alasql(sql_create);
                alasql(sql_attach);
                alasql(sql_use);
                resolve();
            }catch(e){
                reject(e)
            }
        })
        
        
    },
    createTablesIfNotExist : ()=>{
        return new Promise((resolve,reject)=>{
            try{
                const sql_create_products =
                "CREATE TABLE IF NOT EXISTS t_products (id INT, product_name STRING, price INT);"
        
                const sql_create_order_info =
                "CREATE TABLE IF NOT EXISTS t_order_info(order_num INT, order_date DATE, total_amount INT, corporate_code STRING ," +
                "tanto_department STRING, tanto_name STRING, post STRING, address STRING, tel STRING, mail STRING);"
        
                const sql_create_order_detail = 
                "CREATE TABLE IF NOT EXISTS t_order_detail(detail_id INT, order_num INT, product_id INT, quantity INT, delivery_date DATE);"
                
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
                resolve();
            }catch(e){
                reject(e)
            }
        })
    },
    insertProductsMasterDataIfNotExists : ()=>{
        return new Promise((resolve,reject)=>{
            try{
                const sql_insert_products = "INSERT INTO t_products VALUES ?;";
                const sql_insert_tokuisaki = "INSERT INTO t_tokuisaki VALUES ?;";
                const sql_insert_stock = "INSERT INTO t_stock VALUES ?;";
                
                for (var i = 0; i < initial_data.products_data.length;i++){
                    alasql(sql_insert_products,initial_data.products_data[i]);
                }

                for (var i = 0; i < initial_data.tokuisaki_data.length;i++){
                    alasql(sql_insert_tokuisaki,initial_data.tokuisaki_data[i]);
                }

                for (var i = 0; i < initial_data.stock_data.length;i++){
                    alasql(sql_insert_stock,initial_data.stock_data[i]);
                }
                              
                resolve();

            }catch(e){
                reject(e)
            }
        })
    },
    dropDatabase : ()=>{
        return new Promise((resolve,reject)=>{
            try{
                const sql_drop = "DROP localStorage DATABASE sales_management";
                alasql(sql_drop);
                resolve();
            }catch(e){
                reject(e)
            }
        })
    },
    selectAllItems : () =>{
        try{
            const sql_select = "SELECT * from t_products";
            return alasql(sql_select);
        }catch(e){
            throw new Error(e)
        }
    }
}