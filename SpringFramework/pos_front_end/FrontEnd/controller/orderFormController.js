/*
 *
 *  * Developed by - mGunawardhana
 *  * Contact email - mrgunawardhana27368@gmail.com
 *  * what's app - 071 - 9043372
 *
 */
let baseURL = "http://localhost:8080/Spring_With_Maven_war/place_order";

/** array for storing order details */
let orderDetails = [];

/** array for storing order details */
let purchaseDetails = [];

let bool = false;
let orderAmount = 0;

loadAllOrderDetailsForm();

loadAllCustomersToCombo();
loadAllItemToCombo();
loadAllOrder();

var autoGeneratedOrderId = 0;
$('#txtOrderID').val('O-00' + (autoGeneratedOrderId += 1));

//TODO completed ----------------------------------------------------------------------------------------

/** loading all customer id's in to the combo */
function loadAllCustomersToCombo() {
    $('#orderCustomerID').empty();

    $.ajax({
        url: baseURL + "/get_all_customers", method: "GET", dataType: "json", success: function (res) {
            for (let customer of res.data) {
                $("#orderCustomerID").append(`<option>${customer.id}</option>`);
            }
        }, error: function (error) {
            let message = JSON.parse(error.responseText).message;
            alert(message);
        }
    });
}

/** combo operation on oder id */
$('#orderCustomerID').on('click', function () {
    let customerID = $('#orderCustomerID').val();
    $.ajax({
        url: baseURL + "/get_all_customers", method: "GET", dataType: "json", success: function (res) {
            for (let customer of res.data) {
                if (customer.id === customerID) {
                    $("#selectCusName").val(customer.name);
                    $("#orderCustomerAddress").val(customer.address);
                    $("#orderCustomerContact").val(customer.contact);
                }
            }
        }
    });
});

/** loading all item id's in to the combo */
function loadAllItemToCombo() {
    $('#itemCodeCombo').empty();
    $.ajax({
        url: baseURL + "/get_all_items", method: "GET", dataType: "json", success: function (res) {
            for (let item of res.data) {
                $("#itemCodeCombo").append(`<option>${item.itemId}</option>`)
            }
        }, error: function (error) {
            let message = JSON.parse(error.responseText).message;
            alert(message);
        }
    });
}

/** combo operation on oder id */
$('#itemCodeCombo').on('click', function () {
    $.ajax({
        url: baseURL + "/get_all_items", method: "GET", dataType: "json", success: function (res) {
            for (let item of res.data) {
                if (item.itemId === $('#itemCodeCombo').val()) {
                    $("#selectItemCode").val(item.itemId);
                    $("#txtItemDescription").val(item.itemName);
                    $("#txtItemPrice").val(item.unitPrice);
                    $("#txtQTYOnHand").val(item.qty);
                }
            }
        }
    });
})

//TODO completed ----------------------------------------------------------------------------------------


/** loading all details for cart */
function loadAllOderDetails() {

    /** removing table row repeating issue */
    $("#orderTblBody").empty();

    for (let oDetails of orderDetails) {
        let orderRow = `<tr>
                        <td>${oDetails.iCode}</td>
                        <td>${oDetails.itemName}</td>
                        <td>${oDetails.price}</td>
                        <td>${oDetails.Qty}</td> 
                        <td>${oDetails.total}</td>
                   </tr>`;
        $('#orderTblBody').append(orderRow);
        bool = false;
    }
}

/** add to cart option */
$('#btnAddToTable').on('click', function () {
    $("#orderTblBody").empty();
    loadAllOderDetails();

    let t1 = $("#txtItemPrice").val();
    let t2 = $('#txtQty').val();

    let tot = t1 * t2;
    console.log(tot);
    let tott = $("#txtItemPrice").val();
    console.log(tott);

    let txtItemPrice = $("#txtItemPrice").val();

    let orderArray = new Order($('#selectItemCode').val(), $("#txtItemDescription").val(), txtItemPrice, $("#txtQty").val(), tot, $('#txtOrderID').val());

    let qty1;
    let qty2;
    let tot1;
    let tot2;
    let setAmount = 0;

    for (let i = 0; i < orderDetails.length; i++) {
        let test = orderDetails[i];

        if ($('#selectItemCode').val() === test.iCode && $('#txtOrderID').val() === test.orderId) {
            bool = true;
            qty1 = parseInt(test.Qty);
            tot1 = parseInt(test.total);
            qty2 = parseInt($("#txtQty").val());
            tot2 = tot;

            test.iCode = $("#selectItemCode").val();
            test.itemName = $("#txtItemDescription").val();
            test.price = parseInt($("#txtItemPrice").val());
            test.Qty = (qty1 + qty2);
            test.total = (tot1 + tot2);

            $('#orderTblBody').empty();

            $('#total').val();//TODO set up total value here
        }
    }

    if (bool === false) {
        orderDetails.push(orderArray);
    }

    loadAllOderDetails();

    let z = $("#txtItemPrice").val() * parseInt($('#txtQty').val());

    let singleOrder = new OrderDetails($('#txtOrderID').val(), $('#txtDate').val(), $("#orderCustomerID").val(), $("#selectItemCode").val(), $("#txtQty").val(), z, $("#txtDiscount").val());

    purchaseDetails.push(singleOrder);
    orderAmount += tot;
});

$("#btnSubmitOrder").on('click', function () {

    loadAllOrder();

    let order_id = $('#txtOrderID').val();
    let order_date = $('#txtDate').val();
    let customer_id = $('#orderCustomerID').val();
    let customer_name = $('#selectCusName').val();
    let customer_contact = $('#orderCustomerContact').val();
    let cartObj = getItemDetails();

//TODO ******************************************************************
    let ob = {
        order_id: order_id,
        order_date: order_date,
        customer_id: customer_id,
        customer_name: customer_name,
        customer_contact: customer_contact,
        fullObj: cartObj
    }

    let disCount = parseInt($('#txtDiscount').val());// 10%

    let discountedPrice = ((orderAmount / 100) * disCount);//50


    let oAmount = parseInt(orderAmount);

    $('#total').val("Rs/= " + (oAmount - discountedPrice));

    let customCash = parseInt($('#txtCash').val());//1000

    let subTotal = ((orderAmount / 100) * disCount);//500 - 50
    $('#subtotal').val(subTotal) // 450

    let s = customCash;//1000

    let d = discountedPrice;

    let sbTot;

    /** discount label management */
    if (discountedPrice > 0) {
        sbTot = subTotal;
        $('#subtotal').val(sbTot);
    } else {
        $('#subtotal').val("No discount");
    }

    $('#txtBalance').val(s - (oAmount - discountedPrice));

    //TODO ******************************************************************
    $.ajax({
        url: baseURL + "/get_transaction_details",
        method: "post",
        dataType: "json",
        data: JSON.stringify(ob),
        contentType: "application/json",
        success: function (resp) {
            alert(resp.message);
        },
        error: function (error) {
            alert(JSON.parse(error.responseText).message);
        }
    });

    refresh();
});

function getItemDetails() {
    let rows = $("#orderTblBody").children().length;

    var array = [];
    for (let i = 0; i < rows; i++) {
        let code = $("#orderTblBody").children().eq(i).children(":eq(0)").text();
        let name = $("#orderTblBody").children().eq(i).children(":eq(1)").text();
        let price = $("#orderTblBody").children().eq(i).children(":eq(2)").text();
        let quantity = $("#orderTblBody").children().eq(i).children(":eq(3)").text();
        let total = $("#orderTblBody").children().eq(i).children(":eq(4)").text();
        array.push({
            item_code: code, item_name: name, item_price: price, item_quantity: quantity, item_total: total
        });
    }
    return array;
}


function refresh() {
    loadAllOrder();
    loadAllOrderDetailsForm();
    location.reload();
}

function loadAllOrder() {
    $("#tblOrder").empty();
    $.ajax({
        url: baseURL + "/load_all_orders_table",

        success: function (res) {
            for (let c of res.data) {

                let orderID = c.order_id;//TODO working ....
                let orderDate = c.order_date;
                let customerId = c.customer_id;
                let customerName = c.customer_name;
                let customerContact = c.customer_contact;


                let row = "<tr>" + "<td>" + orderID + "</td>" + "<td>" + orderDate + "</td>" + "<td>" + customerId + "</td>" + "<td>" + customerName + "</td>" + "<td>" + customerContact + "</td>" + "</tr>";

                $("#tblOrder").append(row);
            }
        }, error: function (error) {
            let message = JSON.parse(error.responseText).message;
            alert(message);
        }
    });
}

function loadAllOrderDetailsForm() {
    $("#tblOrderDetails").empty();
    $.ajax({
        url: baseURL + "/load_all_order_details_table",
        success: function (res) {

            for (let c of res.data) {
                //TODO discounted values missed .............
                let order_id = c.order_id;//TODO working ....
                let code = c.item_code;//TODO working ....
                let name = c.item_name;//TODO working ....
                let price = c.item_price;//TODO working ....
                let quantity = c.item_qty;//TODO working ....
                let total = c.tot;//TODO working ....


                console.log(order_id, code, name, price, quantity, total);

                let row = "<tr>" + "<td>" + order_id + "</td>" + "<td>" + code + "</td>" + "<td>" + name + "</td>" + "<td>" + price + "</td>" + "<td>" + quantity + "</td>" + "<td>" + total + "</td>" + "</tr>";

                $("#tblOrderDetails").append(row);
            }
        }, error: function (error) {
            let message = JSON.parse(error.responseText).message;
            alert(message);
        }
    });
}



