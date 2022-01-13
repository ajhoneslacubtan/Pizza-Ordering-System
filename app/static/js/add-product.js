
var p_photo;

function addProduct(){
    var p_name = document.getElementById("name-input").value;
    var p_code = document.getElementById("code-input").value;
    var p_desc = document.getElementById("desc-input").value;
    
    var p_inch9 = document.getElementById("size1-input").value;
    var p_inch12 = document.getElementById("size2-input").value;
    var p_id = document.getElementById("username").innerHTML;
    
    console.log(p_id);
    
    $.ajax({
    		url: 'http://localhost:8000/api/products/',
    		type:"POST",
    		contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                product_code: p_name,
                product_name: p_code,
                product_image: p_photo,
                product_describe: p_desc,
                price_9in: parseFloat(p_inch9),
                price_12in: parseFloat(p_inch12),
                u_id: p_id
		    }),
            dataType: "json",
    		success: function(resp) {
                if (resp.status == 'OK'){
                    alert("OK");
                } else {
                    alert(resp.status); 
                }
    		},error:function(){
                alert("Request Error!");
            }
		});
}

function readFile(){ 
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
        p_photo = baseString;
    };
    reader.readAsDataURL(file);
    return baseString;
}
