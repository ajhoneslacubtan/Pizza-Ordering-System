//function to getting the current availability of the product
function getAvailability(product_name)
{
    $.ajax({
    		url: 'https://mayz-pizza.herokuapp.com/api/products/' + product_name,
    		type:"GET",
    		dataType: "json",
    		success: function(resp) {
                document.getElementById("avail_prod_name").value = product_name;
				if (resp.status  == 'OK') {
                    for (i = 0; i < resp.size; i++){
                        var product= resp.products[i];
                        if (product.product_size == '9'){
                            document.getElementById("avail9").value = (product.product_avail == true) ? ('Available'):"Unavailable";
                            document.getElementById("avail_button-inch9").onclick = function(){updateAvailability(product.product_code,"avail9",'9')};
                        }
                        else if (product.product_size == '12'){
                            document.getElementById("avail12").value = (product.product_avail == true) ? ('Available'):"Unavailable";
                            document.getElementById("avail_button-inch12").onclick = function(){updateAvailability(product.product_code,"avail12",'12')};
                        }
                    }
                    document.getElementById("avail_pop").style.display = "block";
                    
				} else
				{
					alert(resp.status);
				}
    		}
		}); 
}
//function for updating the availability of the product
function updateAvailability(product_code, field_inch, product_size)
{
    var avail_text = document.getElementById(field_inch).value;
    var product_avail = (avail_text == 'Available') ? (true):false;
    var u_id =  document.getElementById("username").innerHTML;
    $.ajax({
        url: 'https://mayz-pizza.herokuapp.com/api/products/status/',
        type:"POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            product_code: product_code,
            u_id: u_id,
            product_avail: product_avail,
            product_size: product_size
        }),
        dataType: "json",
        success: function(resp) {
            if (resp.status  == 'OK') {
                alert("Product availability sucessfully changed.");
                document.getElementById("avail_pop").style.display = "none";
                loadProducts();
            } else
            {
                console.log("else");
                alert(resp.status);
            }
        }, error: function(){console.log("error");}
    }); 
}
//functiopn for back button
function availBack(){
    document.getElementById("avail_pop").style.display = "none";
}
