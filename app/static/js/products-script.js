//function that will load the products
function loadProducts(){ 
    $.ajax({
        url: "http://localhost:8000/api/products/",
        type: "GET",
        dataType: "json",
        success: function(resp) {
            if (resp.status  == 'OK') {
                displayProducts(resp);
            } else
            {
                alert(resp.status);
            }
        }
    });
}
// display the product on the div
function displayProducts(resp){
     document.getElementById('product-panel').innerHTML="";
                // Loop through all the products
                var curr_product = [];
                var curr_avail;
                
                var sort_array = [];
                for (var x=0; x<resp.size; x++){
                    var that_product = resp.products[x];
                    if (sort_array.includes(that_product)){
                        continue;
                    }else{
                        if  (that_product.product_size == "9"){
                            sort_array.push(that_product);
                        } else{
                            var this_code = that_product.product_code;
                            for (var y=0; y<resp.size; y++){
                                var this_product = resp.products[y];
                                if (this_code == this_product.product_code && this_product.product_size == "9"){
                                    sort_array.push(this_product);
                                    sort_array.push(that_product);
                                    
                                }
                            }
                        }
                    }
                    }
                    

                
                for (var i=0; i<sort_array.length; i++){
                    var product = sort_array[i];
                    var pr_name = product.product_name;
                    
                    if (curr_product.includes(product.product_code)){
                        
                         if (product.product_size=='9'){
                            document.getElementById(product.product_code+'9').innerHTML = "PHP "+ product.product_prize;
                        }
                        else if (product.product_size=='12'){
                            document.getElementById(product.product_code+'12').innerHTML = "PHP "+ product.product_prize;
                        }
                        
                         if (product.product_avail==true){
                            document.getElementById(product.product_code+'pizza-'+product.product_size).classList.add('avail');
                        }
                        else{
                             document.getElementById(product.product_code+'pizza-'+product.product_size).classList.add('notavail');
                        }
                        
                        if (curr_avail == false && product.product_avail == false){
                            prod_status.innerHTML = "NOT AVAILABLE";
                            prod_status.classList.add("not-available");
                        } else{
                            prod_status.innerHTML = "AVAILABLE";
                            prod_status.classList.add("available");
                        }
                    }
                
                    else {
                        curr_product.push(product.product_code);
                        var product_div = document.createElement('div');
                        product_div.setAttribute('class','product-div');
                        document.getElementById('product-panel').append(product_div);

                        var pizza_image = document.createElement('img');
                        pizza_image.setAttribute('class','pizza-image');
                        product_div.append(pizza_image);

                        var pizza_title = document.createElement('heading');
                        pizza_title.setAttribute('class','pizza-title');
                        pizza_title.innerHTML = product.product_name;
                        product_div.append(pizza_title);

                        var prod_status = document.createElement('container');
                        prod_status.setAttribute('class','prod-status'); 
                        curr_avail = product.product_avail;
                        product_div.append(prod_status);
                        
                        var price_show = document.createElement("div");
                        price_show.setAttribute('class','price-size');
                        product_div.append(price_show);
                                                 
                        var pizza_9 = document.createElement('div');
                        pizza_9.setAttribute('class', 'pizza-1');
                        pizza_9.setAttribute('id', (product.product_code)+'pizza-9');
                        price_show.append(pizza_9);
                        
                                            
                        var pizza_size9 = document.createElement('span');
                        pizza_size9.setAttribute('class','pizza-size');
                        pizza_size9.innerHTML = '9"';
                        pizza_9.append(pizza_size9);

                        pizza_price9 = document.createElement('span');
                        pizza_price9.setAttribute('class','pizza-price');
                        pizza_price9.setAttribute('id', (product.product_code + '9'));
                        pizza_price9.innerHTML='';
                        pizza_9.append(pizza_price9);

                        
                        var pizza_12 = document.createElement('div');
                        pizza_12.setAttribute('class', 'pizza-2');
                        pizza_12.setAttribute('id', (product.product_code)+'pizza-12');
                        price_show.append(pizza_12);
                        
                        var pizza_size12 = document.createElement('span');
                        pizza_size12.setAttribute('class','pizza-size');
                        pizza_size12.innerHTML = '12"';
                        pizza_12.append(pizza_size12);
                        
                        var pizza_price12 = document.createElement('span');
                        pizza_price12.setAttribute('class','pizza-price');
                        pizza_price12.setAttribute('id', (product.product_code + '12'));
                        pizza_price12.innerHTML='';
                        pizza_12.append(pizza_price12);

                        if (product.product_size=='9'){
                            document.getElementById(product.product_code+'9').innerHTML = "PHP "+ product.product_prize;
                        }
                        else if (product.product_size=='12'){
                            document.getElementById(product.product_code+'12').innerHTML = "PHP "+ product.product_prize;
                        }
                        if (product.product_avail==true){
                            document.getElementById(product.product_code+'pizza-'+product.product_size).classList.add('avail');
                        }
                        else{
                             document.getElementById(product.product_code+'pizza-'+product.product_size).classList.add('notavail');
                        }
                        
                        var desclabel = document.createElement("Label");
                        desclabel.setAttribute('class','pizza-descriptionlbl');
                        desclabel.innerHTML = 'Description:';
                        product_div.append(desclabel);

                        var pizza_description = document.createElement('p');
                        pizza_description.setAttribute('class','pizza-description');
                        pizza_description.innerHTML = product.product_describe;
                        product_div.append(pizza_description);

                        var butngroup1 = document.createElement("div");
                        var butngroup2 = document.createElement("div");
                        butngroup1.setAttribute('class','buttons');
                        butngroup2.setAttribute('class','buttons');
                        product_div.append(butngroup1);
                        product_div.append(butngroup2);
                        
                        var update_details = document.createElement('button');
                        update_details.setAttribute('class','update-details');
                        update_details.textContent = "UPDATE DETAILS";
                        update_details.onclick = (function(pr_name){return function(){getDetails(pr_name)}})(pr_name);
                        butngroup1.append(update_details);

                        var del_product = document.createElement('button');
                        del_product.setAttribute('class','del-product');
                        del_product.textContent = "DELETE PRODUCT";
                        var product_code = product.product_code;
                        del_product.onclick = (function(product_code){return function(){deleteProduct(product_code)}})(product_code);
                        butngroup1.append(del_product);


                        var update_price = document.createElement('button');
                        update_price.setAttribute('class','update-price');
                        update_price.textContent = "UPDATE PRICE";
                        update_price.onclick = (function(pr_name){return function(){getProduct(pr_name)}})(pr_name);
                        butngroup2.append(update_price);


                        var update_avail = document.createElement('button');
                        update_avail.setAttribute('class','update-avail');
                        update_avail.textContent = "UPDATE AVAILABILITY";
                        update_avail.onclick = (function(pr_name){return function(){getAvailability(pr_name)}})(pr_name);
                        butngroup2.append(update_avail);
                        
                        
                        
                        }
                    
                }
            }
        

// function that will delete the product
function deleteProduct(product_code){
     $.ajax({
        url: "http://localhost:8000/api/products/" + product_code,
        type: "DELETE",
        data: product_code,
        success: function(resp) {
            if (resp.status  == 'OK') {
                document.getElementById('product-panel').innerHTML = '';
                loadProducts();
                alert ("PRODUCT DELETED");
            } else
            {
                loadProducts();
                alert(resp.status);
            }
        }
    }); 
}
// function for search
function LoadSearchResult(keyword){
    $.ajax({
        url: "http://localhost:8000/api/products/" + keyword,
        type: "GET",
        dataType: "json",
        success: function(resp){
            if (resp.status  == 'OK') {
                displayProducts(resp);
            } else
            {
                document.getElementById('product-panel').innerHTML="";
            }
        }
            
        , error: function(){
            alert("Request Error");
        }
        
    });
};

function SearchProduct(){
    var keyword = document.getElementById('sear-in').value;
    LoadSearchResult(keyword);
};

document.getElementById('sear-in').addEventListener('input', SearchProduct);

loadProducts();