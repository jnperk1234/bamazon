
// Require mysql and inquirer - maybe console.table???
var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = require('./constructors/keys.js');
var Table = require('cli-table2');

// Connect to mysql db

connection.connect(function (err) {
    if (err) throw err;
    showAllProducts();
});

// call up inquirer to prompt the user input
function productInfo() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the Item ID of the product you would like to buy?",
            name: "product",
            filter: Number
        },

        {
            type: "input",
            name: "quantity",
            message: "How many units of this product would you like to buy?",
            filter: Number
        }
    ]).then(function (res) {
        var item2 = res.product;
        var quantity2 = res.quantity;

        connection.query("SELECT * FROM products WHERE ?", { item_id: item2 }, function (err, response) {
            if (err) throw err;

            if (response.length === 0) {
                console.log('ERROR: Select a valid Item ID from the Products list.');
                showAllProducts();
            } else {
                // Response if the quantity requested by the user is in stock
                var productRes = response[0];
                if (quantity2 <= productRes.stock_quantity) {
                    console.log('Your Product is in stock...placing your order!');

                    // // Update the inventory
                    var updateInventory = 'UPDATE products SET stock_quantity = ' + (productRes.stock_quantity - quantity2) + ' WHERE item_id = ' + item2;

                    connection.query(updateInventory, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productRes.price * quantity2);
                        console.log('Thank you for shopping with us!');
                        console.log("-------------------------------\n");
                        keepShopping();
                    })
                } else {
                    console.log("Sorry, item's not in stock to place your order.\n" +
                        "Please change your order.\n" +
                        "Your item was " + productRes.product_name + " and it has " + productRes.stock_quantity + " left in stock.");
                    keepShopping();
                }
            }
        })
    })
}

// function showing products after initial connection upon startup - then calls up Inquirer productInfo function after listing products
function showAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log('\nItem ID: ' + res[i].item_id + " | " + 'Product Name: ' + res[i].product_name + " | " + 'Department: ' + res[i].department_name + " | " + 'Price: ' + res[i].price.toString() + " | " + 'Quantity In Stock: ' + res[i].stock_quantity.toString());
        }
        console.log("-----------------------------------");
        productInfo();
    });
}
// inquirer prompt asking if user wants to keep shopping - calls showAllProducts if yes; if no connection ends
function keepShopping() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to keep shopping?",
            name: "confirm"
        }
    ]).then(function (res) {
        if (res.confirm) {
            console.log("-----------------------------------");
            showAllProducts();
            // productInfo();
        } else {
            console.log("Thank you for shopping Bamazon!");
            connection.end();
        }
    })
}