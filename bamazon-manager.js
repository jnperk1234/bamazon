var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = require('./constructors/keys.js');

// Connect to mysql db
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "password",
//     database: "bamazon_db"
// });

listOptions();

function listOptions() {
    
    inquirer.prompt([{
            name: "choice",
            type: "list",
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Quit"],
            message: "What would you like to do?"
        }])
        .then(function (answer) {
            if (answer.choice === "View Products For Sale") {
                viewProducts();
            } else if (answer.choice === "View Low Inventory") {
                viewProducts(true);
            } else if (answer.choice === "Add To Inventory") {
                addInventory();
            } else if (answer.choice === "Add New Product") {
                addNewProduct();
            } else {
                console.log("Have a nice day!");
                connection.end();
            }
        });
}

// View Products For Sale -- AND -- View Low Inventory
function viewProducts(low) {
    var q = "SELECT * FROM products";
    // If a true value was passed, view just the low inventory instead of all of it
    if (low) {
        q = "SELECT * FROM products WHERE stock_quantity < 5";
    }
    connection.query(q, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("+----+------------------------------------------+------------------+----------+-----+");
        console.log("|  # | NAME                                     | DEPARTMENT       | PRICE    | QTY |");
        console.log("+----+------------------------------------------+------------------+----------+-----+");
        // Display all available items, including itemID, name, price, quantity
        for (let i = 0; i < res.length; i++) {
            let item_id = res[i].item_id.toString();
            let product_name = res[i].product_name;
            let department_name = res[i].department_name;
            let price = "$" + res[i].price;
            let stock_quantity = res[i].stock_quantity.toString();
            // Update the temp strings by including white space. This will size the tables correctly.
            while (item_id.length < 2) {
                item_id = " " + item_id;
            }
            while (product_name.length < 40) {
                product_name = product_name + " ";
            }
            while (department_name.length < 16) {
                department_name = department_name + " ";
            }
            while (price.length < 8) {
                price = " " + price;
            }
            while (stock_quantity.length < 3) {
                stock_quantity = " " + stock_quantity;
            }
            console.log("| " + item_id + " | " + product_name + " | " + department_name + " | " + price + " | " + stock_quantity + " |");
        }
        console.log("+----+------------------------------------------+------------------+----------+-----+\n");
        listOptions();
    });
}

// Add To Inventory
function addInventory() {
    // query the database for all items with at least 1 in stock
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to buy
        inquirer.prompt([{
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item would you like to add more of?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many more should be ordered?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // There is enough; reduce the stock in the database and provide the customer's total
                var newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("You have added " + answer.quantity + " units. You now have " + newQuantity + ".");
                        listOptions();
                    }
                );
            });
    });
}

// Add New Product
function addNewProduct() {
    // Input name (validate length)
    // Input description (validate length)
    // Input price (validate double)
    // Input qty (validate integer)
    // Update MySQL
    connection.query("SELECT department_name FROM departments", function (err, results) {
        if (err) throw err;
        inquirer.prompt([{
                    name: "product_name",
                    type: "input",
                    message: "What is the name of the new product?"
                },
                {
                    name: "department_name",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].department_name);
                        }
                        return choiceArray;
                    },
                    message: "Which department does this belong to?"
                },
                {
                    name: "price",
                    type: "input",
                    message: "What is the MSRP of this item? (Please only input a number.)",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many should be ordered?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                connection.query(
                    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.product_name + "', '" + answer.department_name + "', '" + answer.price + "', '" + answer.stock_quantity + "')",
                    function (error) {
                        if (error) {
                            console.log(error);
                            throw error;
                        }
                        console.log("You have added " + answer.stock_quantity + " units of " + answer.product_name + ".");
                        listOptions();
                    }
                );
            });
    });
}


