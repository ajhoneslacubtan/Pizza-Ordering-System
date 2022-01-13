// function to validate the form
function checkPassword(form) {
    password1 = form.newpassword.value;
    password2 = form.confirmPassword.value;

    // If password not entered
    var pw1 = document.getElementById("newpassword").value;  
    var pw2 = document.getElementById("confirmPassword").value;
    
    if(pw1 != pw2) {  
        document.getElementById("message").innerHTML = "Passwords did not match!";  
        return false;  
      } 
    else {  
        return true;
      }  
}

// check if a .alert has a #alert-body element then display it

if (document.getElementById("alert-body") == null) {
    document.getElementsByClassName("alert")[0].style.display = "none";
}