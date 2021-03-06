
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


function addProduct(){
    var p_name = document.getElementById("name-input").value;
    var p_code = document.getElementById("code-input").value;
    var p_desc = document.getElementById("desc-input").value;
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
                    alert("Product added");
                    clearEntryAdd();
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
    var lainreader = new FileReader();
    var baseString;

    lainreader.onloadend = function () {
        baseString = lainreader.result;
        p_photo = baseString;
    };

    lainreader.readAsDataURL(file);
}

function clearEntryAdd(){
     document.getElementById("name-input").value="";
    document.getElementById("code-input").value="";
    document.getElementById("desc-input").value="";
    document.getElementById("size1-input").value="";
    document.getElementById("size2-input").value="";
}
