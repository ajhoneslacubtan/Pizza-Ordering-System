// Function for loading orders on respective div
function loadOrders(order_status, order_frame, order_total)
{
$.ajax({
    		url: 'http://localhost:8000/api/orders/' + order_status,
    		type:"GET",
    		dataType: "json",
    		success: function(resp) {
                // Condition if "status" of request is okay
				if (resp.status  == 'OK') {
                   document.getElementById(order_total).innerText = resp.size;
                   document.getElementById(order_frame).innerHTML = "";
                   // Loop through orders 
				   for (i = 0; i < resp.size; i++){
                      var order = resp.oder_codes[i].order_code;
                      //Make div for every order 
                      var order_div = document.createElement('div');
                      order_div.setAttribute('class','pending-div');
                      var color_div = (order_status == 'PENDING') ? ('border: 0.2vw solid #FFE047') : (order_status == 'PREPARING') ? ('border: 0.2vw solid #9290FE') : (order_status == 'COMPLETED') ? ('border: 0.2vw solid #50D1AA'):"";
                      order_div.setAttribute('style',color_div);
                      document.getElementById(order_frame).append(order_div);
                      
                      //Div for order lables 
                      var order_label = document.createElement('div');
                      order_label.setAttribute('class','labels');
                      order_div.append(order_label);
                      //Div for order buttons 
                      var button_div = document.createElement('div');
                      button_div.setAttribute('class','order-buttons')
                      order_div.append(button_div);
                      
                      //Order Labels
                      var ocode_label = document.createElement('span');
                      ocode_label.setAttribute('class', 'order-label');
                      ocode_label.textContent = "Order Code";
                      var ocode_number = document.createElement('span');
                      ocode_number.setAttribute('class', 'order-number');
                      ocode_number.textContent = order;
                      var color_number = (order_status == 'PENDING') ? ('color: #FFE047') : (order_status == 'PREPARING') ? ('color: #9290FE') : (order_status == 'COMPLETED') ? ('color: #50D1AA'):"";
                      ocode_number.setAttribute('style',color_number);
                      order_label.append(ocode_label);
                      order_label.append(ocode_number);
                      
                      //Order buttons 
                      var dis_button = document.createElement('button');
                      var dis_image = document.createElement('img');
                      var display_image = (order_status == 'PENDING') ? ('img/pending-display.png') : (order_status == 'PREPARING') ? ('img/preparing-display.png') : (order_status == 'COMPLETED') ? ('img/completed-display.png'):"";
                      dis_image.setAttribute('src',display_image);
                      dis_image.setAttribute('style','height:4vh');
                      dis_button.append(dis_image);
                      dis_button.setAttribute('class','dis-button');
                      dis_button.onclick = (function(order){return function(){update_list(order)}})(order);
                      button_div.appendChild(dis_button);

                      if ((i == 0 && order_status == 'PENDING') || order_status == 'PREPARING'){
                          var move_button = document.createElement('button');
                          var mo_image = document.createElement('img');
                          var move_image = (order_status == 'PENDING') ? ('img/move_prepare.png') : (order_status == 'PREPARING') ? ('img/move_complete.png'):"";
                          mo_image.setAttribute('src',move_image);
                          mo_image.setAttribute('style','height:4vh');
                          move_button.append(mo_image);
                          move_button.setAttribute('class','move-button');
                          if (order_status == 'PENDING'){
                              move_button.onclick = (function(order){return function(){moveOrder(order, 'PREPARING')}})(order);
                          }
                          else{
                              move_button.onclick = (function(order){return function(){moveOrder(order, 'COMPLETED')}})(order);
                          }
                          button_div.appendChild(move_button);
                      }
                    }
                    
				} 
                // Request successful but "status" not okay
                else{
                    document.getElementById(order_total).innerText = "0";
					document.getElementById(order_frame).innerHTML = "";
				}
    		}, error: function(){
                //Function if request not sucessful
                alert("Request Error");
            }
		}); 
}

//Function changing order status
function moveOrder(order_code, order_status)
{
    $.ajax({
    		url: 'http://localhost:8000/api/orders/status/',
    		type:"PUT",
    		contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                order_code: order_code,
                order_status: order_status
		    }),
            dataType: "json",
    		success: function(resp) {
                // Condition if "status" of request is okay
                if (resp.status  == 'OK') {
                    // Repopulate order divs
                    displayOrders();
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

// Function for toggling pop-up
function toggle_pop(){
    document.getElementById('popup-1').classList.toggle("active");
}

// Function for displaying order details
function update_list(order_code)
{
    $.ajax({
    		url: 'http://localhost:8000/api/order_details/' + order_code,
    		type:"GET",
    		dataType: "json",
    		success: function(resp) {
                // Condition if "status" of request is okay
				if (resp.status  == 'OK') {
                    toggle_pop();
                    // Change value of elements according to order
                    document.getElementById('specific-code').textContent=resp.ord_code;
                    document.getElementById('custo-name').textContent=resp.customer_name;
                    document.getElementById('ord-status').textContent=resp.order_status;
                    document.getElementById('ord-status').classList.add(resp.order_status);
                    document.getElementById('ord-total').textContent=("Total: " + resp.order_total.toFixed(2));
                    document.getElementById('num_items').textContent=(resp.size + " items (Qty. " + resp.size + ")");
                    document.getElementById('order-details').innerHTML = "";
                    // Loop through order details
                    for (var i=0; i<resp.size; i++){
                        var prod = resp.product[i];
                        // Create div for each order detail
                        var ord_detail = document.createElement('div');
                        ord_detail.setAttribute('class', 'ord-detail');
                        document.getElementById('order-details').append(ord_detail);
                        
                        ord_detail.append(prod.quantity+ "x" +"\t");
                        ord_detail.append("\t\t"+prod.product_size+'"'+"\t");
                        ord_detail.append("\t"+prod.product_name);
                        
                        var price_div = document.createElement('div');
                        ord_detail.append(price_div);
                        price_div.setAttribute('style','float:right');
                        price_div.append(prod.subtotal.toFixed(2));
                    }
                    
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

// Function for populating all order div
function displayOrders(){
    var order_status = ['PENDING', 'PREPARING', 'COMPLETED'];
    var order_frame = ['pending-orders', 'preparing-orders', 'completed-orders'];
    var order_total = ['pending-number', 'preparing-number', 'completed-number'];
    
    // Populates each order div 
    for (var i=0; i<order_status.length; i++){
        loadOrders(order_status[i], order_frame[i], order_total[i]);
    }
}

displayOrders();