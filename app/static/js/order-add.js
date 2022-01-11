var order = {};
var code = "";

function Add_Order_Code_List(){
  const date = new Date();
  var month = date.getUTCMonth() + 1; //months from 1-12
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  
  var month_text = ('0' + month).slice(-2);
  var day_text = ('0' + day).slice(-2);
  var numordid = generate_order_code();
  
  code = year + "" + month_text + ""+ day_text + numordid;
  document.getElementById('order-code').value=code;
  order[code]=[];
}


function showProductBySize(size_type, pizza_size){
    $.ajax({
                url: 'https://mayz-pizza.herokuapp.com/api/products/size/'+ pizza_size,
                type:"GET",
                dataType: "json",
                success: function(resp){
                    if (resp.status == 'OK'){
                        
                        document.getElementById(size_type).innerHTML="";
                        for (i=0; i < resp.size; i++) {
                            var item = resp.products[i];
                            
                            var code = item.product_code;
                            var image = item.product_image;
                            var name = item.product_name;
                            var price = item.product_prize;
                            
                            var product_info = {product_code: code, product_image: image, product_name:name, product_price: price, product_size:pizza_size};
                
                            item_div = document.createElement('div');
                            item_div.setAttribute('class','item');
                            
                            item_img = document.createElement('img');
                            document.getElementById(size_type).append(item_div);
                            item_div.appendChild(item_img);

                            desc1_item = document.createElement('div');
                            desc1_item.setAttribute('class','desc1');
                            
                            span_name = document.createElement('span');
                            span_name.setAttribute('class','pizza-name');
        
                            span_name.textContent = name;
                            desc1_item.appendChild(span_name);
                            item_div.appendChild(desc1_item);
                            
                            
                            add_to_order = document.createElement('div');
                            add_to_order.setAttribute('class','add-to-order')
                            add_item_button = document.createElement('a');
                            add_item_button.setAttribute('class','btn-');
                            var size_code = code.concat(pizza_size);
                            add_item_button.addEventListener('click', (function(size_code, product_info){return function(){Add_Item_to_Order(size_code, product_info)}})(size_code, product_info));
                    
                            add_item_button.textContent = "+";

                            add_to_order.appendChild(add_item_button);
                            item_div.appendChild(add_to_order);
                
                            desc2_item = document.createElement('div');
                            desc2_item.setAttribute('class', 'desc2');
                            span_price = document.createElement('span');
                            span_price.setAttribute('class','pizza-price');
                            span_price.textContent = ("PHP ").concat(price.toFixed(2));
                            
                            desc2_item.appendChild(span_price);
                            item_div.appendChild(desc2_item);
                            
                            
                        }
                    }
                    else{
                        alert(resp.status);
                    }
                }
    })
}


function displayOrderDetails(order_list){
    document.getElementById('itemlist').innerHTML = "";
    var form_order = document.getElementById('form-order-info');
    
    var total_cost = 0; 
    var order_details = order_list[code];
    if (order_details.length > 0){
        for (var i=0; i<order_details.length; i++){
        var json_item = order_details[i];
        var size_code = Object.keys(json_item)[0];
        var item = Object.values(json_item)[0];
        
        var row_item_div = document.createElement('div');
        row_item_div.setAttribute('class', 'item_order');
        document.getElementById('itemlist').append(row_item_div);
        
        var prod_code = item.product_code;
        var prod_image = item.product_image;
        var prod_name = item.product_name;
        var prod_size = item.product_size;
        var prod_price = item.product_price;
        var prod_quantity = item.quantity;

        var pzimage = document.createElement('img');
        pzimage.setAttribute('class', 'pz_img');
        row_item_div.append(pzimage);
        var pzname = document.createElement('span');
        pzname.setAttribute('class', 'pz_name');
        pzname.textContent = prod_name;
        row_item_div.appendChild(pzname);

        var remove_button = document.createElement('button');
        remove_button.setAttribute('class', 'remove_button');
        remove_button.addEventListener("click", 
                                      (function(size_code){return function(){Remove_Item_from_Order(size_code)}})(size_code));
        row_item_div.appendChild(remove_button);
        
        
        var div2 = document.createElement('div');
        div2.setAttribute('class', 'divqtytot');
        row_item_div.appendChild(div2);
        var pzsize_div = document.createElement('div');
        if (prod_size == "9"){
            pzsize_div.setAttribute('class', 'pz_size_9');
        } else if (prod_size == "12") {
            pzsize_div.setAttribute('class', 'pz_size_12');
        }
        div2.append(pzsize_div);
        var pzsize = document.createElement('span');
        pzsize.textContent = prod_size;
        pzsize_div.append(pzsize);
        
        var pzqty = document.createElement('span');
        pzqty.setAttribute('class', 'pz_qty');
        pzqty.textContent = ("x ").concat(prod_quantity);
        div2.append(pzqty);
        
        var subtotal = prod_price * prod_quantity;
        
        var subtotal_span = document.createElement('span');
        subtotal_span.setAttribute('class', 'subtotal');
        total_cost = total_cost + subtotal;
        subtotal_span.textContent = subtotal.toFixed(2);
        div2.appendChild(subtotal_span);
    }
    var total_input = document.getElementById('total-cost');
    total_input.value = total_cost.toFixed(2);
    
    document.getElementById('add-order').remove();
    
    var add_order_button = document.createElement('input');
    add_order_button.setAttribute('id','add-order');
    add_order_button.setAttribute('type','button');
    add_order_button.setAttribute('value','ADD ORDER');
    add_order_button.classList.add('active');
    add_order_button.addEventListener('click', (function(){return function(){Add_Order(order_details)}})(order_details));
    form_order.append(add_order_button);
    }
    else{
        document.getElementById('add-order').classList.remove('active');
        document.getElementById('total-cost').value=(0).toFixed(2);
    }
    
}

function Remove_Item_from_Order(size_code){
    var details = order[code];
    var exist = details.filter(function(item) { return Object.keys(item)[0] === size_code; });
    if (exist.length !=0){
        var index = details.indexOf(exist[0]);
        details.splice(index,1);
        //document.getElementById('add-order').classList.remove('active');
        displayOrderDetails(order);
}
}


showProductBySize('pizza-nine', '9');
showProductBySize('pizza-twelve', '12');

function Add_Item_to_Order(size_code, product_info){
    var customer_name = document.getElementById('cust-name').value;
    if (customer_name==""){
        alert('Please provide customer name!');
    }
    else {
      var item_add = product_info;
      var item_json = {};
      var details = order[code];

      var exist = details.filter(function(item) { return Object.keys(item)[0] === size_code; });

      if (exist.length !=0){
        var exist_details = Object.values(exist)[0];
        var exist_item = exist_details[size_code];
        var old_quantity = exist_item.quantity;
      var quantity = old_quantity + 1;
      exist_details[size_code].quantity = quantity;
      }
      else{
          item_add['quantity'] = 1;
        item_json[size_code] = item_add;
      order[code].push(item_json);
      }
        displayOrderDetails(order);
        
        
    }
}

function Add_Order(order_list){
    var order_code = document.getElementById('order-code').value;
    var customer_name = document.getElementById('cust-name').value;
    var total = document.getElementById('total-cost').value;
    Add_Order_to_Database(order_code, customer_name, total, order_list);
}

function Add_Order_to_Database(ord_code, cust_name, total, order_list){
    $.ajax({
    		url: 'https://mayz-pizza.herokuapp.com/api/orders/',
    		type: "POST",
    		contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                order_code: ord_code,
                customer_name: cust_name,
                total: total
		    }),
            dataType: "json",
    		success: function(resp) {
                // Condition if "status" of request is okay
                alert('Order is still being processed!');
                if (resp.status  == 'OK') {
                    for (var n=0; n<order_list.length; n++){
                        var item = Object.values(order_list[n])[0];
                        var prod_code = item.product_code;
                        var prod_size = item.product_size;
                        var prod_qty = item.quantity;
                        Add_OrderDetails_to_Database(ord_code, prod_code, prod_size, prod_qty);
                    }
                    document.getElementById('total-cost').value=(0).toFixed(2);
                    document.getElementById('cust-name').value="";
                    document.getElementById('itemlist').innerHTML = "";
                    var order = {};
                    var code = "";
                    Add_Order_Code_List();
                }
                // Request sucessful but "status" not okay
                else{
                    alert('resp.status');
                }
    		},error: function(){
                // Function if request was unsuccessful
                alert("Request Error");
            }
		}); 
}

function Add_OrderDetails_to_Database(ord_code, prod_code, prod_size, prod_qty){
    $.ajax({
    		url: 'https://mayz-pizza.herokuapp.com/api/order_details/',
    		type:"POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                order_code: ord_code,
                product_code: prod_code,
                product_size: prod_size,
                product_qty: prod_qty
		    }),
            dataType: "json",
    		success: function(resp) {
                // Condition if "status" of request is okay
                if (resp.status  == 'OK') {
                    alert('Okay');
                }
                // Request sucessful but "status" not okay
                else{
                    alert(resp.status);
                }
    		},error: function(){
                // Function if request was unsuccessful
                alert("Request Error");
            }
		}); 
}

Add_Order_Code_List();



function generate_order_code(){
    var startcode = 1;
    var status_list = ['PENDING', 'PREPARING', 'COMPLETED'];
    for (i=0; i<status_list.length; i++){
        var numord = function(){
            var numorders = 0;
                $.ajax({
                    async:false,
                    url: 'https://mayz-pizza.herokuapp.com/api/orders/' + status_list[i],
                    type:"GET",
                    dataType: "json",
                    success: function(resp) {
                        // Condition if "status" of request is okay
                        if (resp.status  == 'OK') {
                           numorders = resp.size;
                           
                         //  console.log(startcode);
                        }
                        else{
    
                        }
                    },error: function(){
                    // Function if request was unsuccessful
                    alert("Request Error");
                }
                });
                return numorders;
            }();
        startcode += numord;
    }
        var orde_code = String(startcode).padStart(4, '0');
        return orde_code;
    }







