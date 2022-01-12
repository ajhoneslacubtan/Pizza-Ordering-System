
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
        p_photo = reader.readAsDataURL(input.files[0]);
        console.log(p_photo);
    }
}


function addProduct(){
    var p_name = document.getElementById("name-input").value;
    var p_code = document.getElementById("code-input").value;
    var p_desc = document.getElementById("desc-input").value;
    readFile();
    var p_inch9 = document.getElementById("size1-input").value;
    var p_inch12 = document.getElementById("size2-input").value;
    var p_id = document.getElementById("username").innerHTML;
    
    $.ajax({
    		url: 'http://localhost:8000/api/products/',
    		type:"POST",
    		contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                product_code: p_code,
                product_name: p_name,
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
                //alert("Product succesfully added.");
    		}
		});
}

function readFile(){ 
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
    };
    p_photo = reader.readAsDataURL(file);
}
