var p_photo;

$(document).ready(function(){
    // Prepare the preview for profile picture
        $("#wizard-picture").change(function(){
            readURL(this);
        });
    });

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
        readFile();
    }
}

//function for getting the current details of the product
function getDetails(product_name){
    $.ajax({
    		url: 'http://localhost:8000/api/products/' + product_name,
    		type:"GET",
    		dataType: "json",
    		success: function(resp) {
                document.getElementById("produ_name").value = product_name;
				if (resp.status  == 'OK') {
                    var product = resp.products[0];
                    document.getElementById("product_name").value = product.product_name;
                    document.getElementById("code_name").value = product.product_code;
                    document.getElementById("desc_name").value = product.product_describe;
                    document.getElementById("desc_name").value = product.product_describe;
                    document.getElementById("wizardPicturePreview").src = product.product_image;
                    document.getElementById('details_pop').style.display = 'block';
                    
				} else
				{
					alert(resp.status);
				}
    		},error:function(){
                alert("Request Error!");
            }
		}); 
}
//function for reading a file
function readFile(){ 
    var file = document.querySelector('input[type=file]')['files'][0];
    var lainreader = new FileReader();
    var baseString;

    lainreader.onloadend = function () {
        baseString = lainreader.result;
        p_photo = baseString;
    };

    lainreader.readAsDataURL(file);
}
//function for updating the details of the product
function updateDetails(product_name){
    var p_name =  document.getElementById("product_name").value;
    var p_code =  document.getElementById("code_name").value;
    var p_desc =  document.getElementById("desc_name").value;
    
    $.ajax({
    		url: 'http://localhost:8000/api/products/',
    		type:"PUT",
    		contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                product_code: p_code,
                product_name: p_name,
                product_image: p_photo,
                product_describe: p_desc
		    }),
            dataType: "json",
    		success: function(resp) {
                if (resp.status == 'OK'){
                    alert("Product details successfully updated.");
                    document.getElementById('details_pop').style.display = 'none';
                    loadProducts();
                } else {
                    alert(resp.status); 
                }
    		},error:function(){
                alert("Request Error!");
            }
		});
}
//function for clearing details
function clDetails(){
    document.getElementById("product_name").value = "";
    document.getElementById("desc_name").value = "";
}
//function for back button
function detailBack(){
    clDetails();
    document.getElementById("code_name").value = "";
    document.getElementById("details_pop").style.display = "none";
}