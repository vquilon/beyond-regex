window.onbeforeunload = function (e) {
    var areChanges = window.hasChanges || false;
    var areUnsavedData = window.hasUnsavedData || true;
    if (areChanges & areUnsavedData) {
        var confirmationMessage = "You have made changes since you last saved, leaving the website will result in a permanent loss of the data.";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Webkit, Safari, Chrome
    }
}


/* < body onbeforeunload = "ConfirmClose()" onunload = "HandleOnClose()" > */

// var myclose = false;

// function ConfirmClose() {
//     if (event.clientY < 0) {
//         event.returnValue = 'You have closed the browser. Do you want to logout from your application?';
//         setTimeout('myclose=false', 10);
//         myclose = true;
//     }
// }

// function HandleOnClose() {
//     if (myclose == true) {
//         //the url of your logout page which invalidate session on logout 
//         location.replace('/contextpath/j_spring_security_logout');
//     }
// }