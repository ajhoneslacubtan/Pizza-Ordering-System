//function for getting the current price of the product
function getProduct(product_name)
{
    document.getElementById("price_pop").style.display = "block";
    $.ajax({
    		url: 'http://localhost:8000/api/products/' + product_name,
    		type:"GET",
    		dataType: "json",
    		success: function(resp) {
                document.getElementById("prod_name").value = product_name;
				if (resp.status  == 'OK') {
                    for (i = 0; i < resp.size; i++){
                        var product= resp.products[i];
                        if (product.product_size == '9'){
                            document.getElementById("inch9").defaultValue = product.product_prize;
                            document.getElementById("button-inch9").onclick = function(){updatePrice("inch9", product.product_code)};
                        }
                        else if (product.product_size == '12'){
                            document.getElementById("inch12").defaultValue = product.product_prize;
                            document.getElementById("button-inch12").onclick = function(){updatePrice("inch12", product.product_code)};
                        }
                    }
                    
				} else
				{
					alert(resp.status);
				}
    		}
		}); 
}
//function for updating price of the product
function updatePrice(button_inch, product_code)
{
    var input_field = document.getElementById(button_inch);
    if (input_field.value == input_field.defaultValue){
        alert("Input Unchange");
    } else if (input_field.value == "" || isNaN(input_field.value) == true){
        alert("No/Invalid Input");
    } else{
        var id = document.getElementById("username").innerHTML; 
        var size = (button_inch == 'inch9') ? ('9') : (button_inch == 'inch12') ? ('12') :"";
        var price = parseFloat(input_field.value);
        $.ajax({
    		url: 'http://localhost:8000/api/products/price/',
    		type:"POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                product_code: product_code,
                u_id: id,
                product_size: size,
                product_price: price
		    }),
            dataType: "json",
    		success: function(resp) {
				if (resp.status  == 'OK') {
                    alert("Succesfully changed price.");
                    document.getElementById("price_pop").style.display = "none";
                    loadProducts();
				} else
				{
                    console.log("else");
					alert(resp.status);
				}
    		}, error: function(){console.log("error");}
		}); 
    }
}
//function for back button
function backButton(){
    document.getElementById("price_pop").style.display = "none";
}