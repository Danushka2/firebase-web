const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const load = document.getElementById('load');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


$('#testbtn').click(function(){
	$.ajax({
        url: "/users",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $(data.users).each(function (index) {
                var arr = data.users[index];
                $('#load').append('<p>name: ' + arr.name + '<br></p>')
            });
        }
    });
});
