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
    }
}

async function loadUsersData() {
    let response = await fetch('https://mayz-pizza.herokuapp.com/api/users/');
    let data = await response.json();

    // Populate the table body #user-table with the data
    for (let i = 0; i < data.users.length; i++) {
        let user = data.users[i];
        // Not using jQuery here because it's not working
        let row = document.createElement('tr');
        row.innerHTML = `<td><img src="` + user.user_image + `"><span class="username-holder">`+user.user_name+`</span></td> <td>`+user.user_role+`</td>`;
        document.getElementById('users-table').appendChild(row);
    }

};

loadUsersData();