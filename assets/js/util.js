const baseUrl = 'http://ezyhostings-001-site1.dtempurl.com/api/';
let token = "";
let userID = 0;
let userTypeID = 0;

showToastMsg = (type, message) => {
  let selector;
  switch (type) {
    case 'success':selector = '.toast-success-wrap';break;
    case 'error':selector = '.toast-success-wrap';break;
    case 'warning':selector = '.toast-success-wrap';break;
  }
  $(selector).find('.toast-msg').html(message);
  $(selector).show().addClass('show');
  console.log($(selector).length)
  setTimeout(()=> $(selector).hide(), 5000)
}

const getApi = (url) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        headers: {
          'Authorization': 'Bearer '+ token
        },
        url: url,
        cache: false, contentType: false, processData: false, timeout: 60000,
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          console.log(error);
          alert('Fetch failed');
          reject(error);
        }
      });
    });
}

const postApi = (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data,
      url: baseUrl+url,
        cache: false, contentType: false, processData: false, timeout: 60000,
        success: function (response) {
          console.log(response);
          if (response.messageType === 1) {
            resolve();
          }
        },
        error: function (error) {
          console.log(error);
          alert('Saving failed');
          reject();
        }
      });
  })
}
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByClassName("section");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      getFileContents(elmnt, file);
    }
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  includeHTML();
  getTokenInfo();
});

const getTokenInfo = () => {
  const userName = localStorage.getItem('__lw_user');
  $('.user-name').html(userName);
  token = localStorage.getItem("__lw_token");
  userID = localStorage.getItem("__lw_user_id");
  userTypeID = localStorage.getItem("__lw_user_type_id");
}

const fillDomWithData = (container, domRef, data) => {
  for(let input of domRef) {
    $(container).find("."+input).val(data[input]);
  }
 }