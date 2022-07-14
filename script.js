$(function () {
    var body = $("body"),
    StageID = $("#StageID"),
    back = $("a.back");
    $("#stepOne .encrypt").click(function () {
    body.attr("class", "encrypt");
    step(2);
    });
    $("#stepOne .decrypt").click(function () {
    body.attr("class", "decrypt");
    step(2);
    });
    $("#stepTwo .button").click(function () {
    $(this).parent().find("input").click();
    });
    var file = null;
    $("#stepTwo").on("change", "#encrypt-input", function (e) {
    if (e.target.files.length != 1) {
    alert("Please select a file to encrypt!");
    return false;
    }
    file = e.target.files[0];
    if (file.size > 1024 * 1024) {
    alert(
    "Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue."
    );
    return;
    }
    step(3);
    });
    $("#stepTwo").on("change", "#decrypt-input", function (e) {
    if (e.target.files.length != 1) {
    alert("Please select a file to decrypt!");
    return false;
    }
   
    file = e.target.files[0];
    step(3);
    });
    $("a.button.generate").click(function () {
    let allIncluded = false;
    var lowercase = "abcdefghijklmnopqrstuvwxyz",
    uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers = "0123456789",
    punctuation = "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    lowercaseInput = document.getElementById("lowercase"),
    uppercaseInput = document.getElementById("uppercase"),
    punctuationInput = document.getElementById("punctuation"),
    numbersInput = document.getElementById("numbers"),
    lengthInput = document.getElementById("length"),
    passwordField = document.getElementById("generatedPass"),
    plength,
    userPassword,
    passwordCharSet;
    userPassword = "";
    passwordCharSet = "";
    if (lowercaseInput.checked) {
    passwordCharSet += lowercase;
    }
    if (uppercaseInput.checked) {
    passwordCharSet += uppercase;
    }
    if (punctuationInput.checked) {
    passwordCharSet += punctuation;
    }
    if (numbersInput.checked) {
    passwordCharSet += numbers;
    }
    do{
    userPassword = "";
    plength = Number(lengthInput.value);
    for (let i = 0; i < plength; i++) {
    userPassword += passwordCharSet.charAt(
    Math.floor(Math.random() * passwordCharSet.length)
    );
    }
    allIncluded = true;
    if(numbersInput.checked ){
    if( ! /\d/.test(userPassword)){
    allIncluded = false;
   
    }

    }
    if(punctuationInput.checked ){
    if( ! /[!@#$%^&*()-_+={}|;:'"<,>.?/~`\\]/.test(userPassword)){
    allIncluded = false;
    }
    }
    if(lowercaseInput.checked ){
    if( ! /[a-z]/.test(userPassword)){
    allIncluded = false;
    }
    }
    if(uppercaseInput.checked ){
    if( ! /[A-Z]/.test(userPassword)){
    allIncluded = false;
   
    }
    }
   
    }while(!allIncluded);
    if (userPassword == "") {
    alert("Please select an option before generating");
    } else {
    passwordField.value = userPassword;
    }
    });
    $("a.button.process").click(function () {
    var input = $(this).parent().find("input[type=password]"),
    a = $("#stepFour a.download"),
    password = input.val();
    input.val("");
    if (password.length < 5) {
    alert("Please choose a longer password!");
    return;
    }
    var reader = new FileReader();
    if (body.hasClass("encrypt")) {
    reader.onload = function (e) {
    var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
    a.attr("href", "data:application/octet-stream," + encrypted);
    a.attr("download", file.name + ".encrypted");
   
    step(4);
    };
    reader.readAsDataURL(file);
    } else {
    reader.onload = function (e) {
    var decrypted = CryptoJS.AES.decrypt(
    e.target.result,
    password
    ).toString(CryptoJS.enc.Latin1);
    if (!/^data:/.test(decrypted)) {
    alert("Invalid pass phrase or file! Please try again.");
    return false;
    }
    a.attr("href", decrypted);
    a.attr("download", file.name.replace(".encrypted", ""));
    step(4);
    };
    reader.readAsText(file);
    }
    });
    back.click(function () {
    $("#stepTwo input[type=file]").replaceWith(function () {
    return $(this).clone();
    });
    step(1);
    });
    function step(i) {
    if (i == 1) {
    back.fadeOut();
    } else {
    back.fadeIn();
    }
    StageID.css("top", -(i - 1) * 100 + "%");
    }
   });