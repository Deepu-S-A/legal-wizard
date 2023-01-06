 let notificationsArray = [];
 let notificationDataFromServer = [];

 const renderSettingsHtml = () => {
    $(document).on('click', '.setting', function () {
      const page = $(this).attr('data-view');
      const settingsViewContainer = document.getElementById('settingsContainer');
      getFileContents(settingsViewContainer, 'settings/' + page);
      $('.setting').removeClass('active');
      $(this).addClass('active');
      setTimeout(() => {
        renderSettingsPageData(page);
      }, 1000);
    });
    $(document).on('change', '.main-checkbox', function(){
      const current = $(this);
      const value = $(current).is(':checked');
      const childListRef = $(current).attr('data-childlistref');
      console.log(childListRef);
      $(childListRef).prop('checked', value);
    });
    $('.setting.info').trigger('click');
  }

  const saveNotificationSettings = () => {
    let checkedIds = "";
    $('input.notf-checkbox:checked').each(function(){
      checkedIds+=$(this).attr('data-id') + ",";
    });
    console.log(checkedIds)
    postApi('User/SaveNotificationByUser', JSON.stringify({
      "mapping": 0,
      "userID": userID,
      "notifications": checkedIds.slice(0, checkedIds.length-1)
    })).then(()=>showToastMsg('success', 'Settings updated !'))
  }

  const renderSettingsPageData = (page) => {
    const settingsContainer = $('#settingsContainer');
    switch (page) {
      case 'teams.html': renderSettingsTeamsTableData(); break;
      case 'info.html': getApi(baseUrl+`User/GetProfileByID/${userID}/`).then(result => renderPersonalInfoSettings(result, settingsContainer)).catch(err=>console.log('error'));
      break;
      case 'account.html': getApi(baseUrl+`DocManagement/GetMyAccount/`).then(result => {
        setAccountsPage(result);
      }).catch(err=>console.log('error'));
      break;
      case 'notification.html': getApi(baseUrl+`Master/GetNotificationMasterList`).then(result =>{
         getApi(baseUrl+`User/GetNotificationByUser`).then(settings => {
          setNotificationPage(result.data, settings.data.notifications.split(","));
         });
      }).catch(err=>console.log('error'));
      break;
    }
  }

  setNotificationPage = (result, settings) => {
    notificationsArray.length = 0;
    notificationsArray = result.filter(el => el.parentID === null);
    let html = '',i=-1;
    for(let item of notificationsArray) {
      item['childList'] = result.filter(el=>el.parentID === item.id);
      item['childListRef'] = item['childList'].map(el => '.notf_'+el.id);
      html += `<div class="form-group form-check input-style-wrap">
          <input type="checkbox" class="form-check-input main-checkbox notf-checkbox notf_${item.id}"
          id="notf_${item.id}" data-childlistref="${item.childListRef}" data-id="${item.id}">
            <label class="form-check-label" for="notf_${item.id}"></label>
            <div class="label-text t16">${item.notificationName}</div>
        </div>`;
        for(let child of item.childList) {
           html += `<div class="form-group form-check input-style-wrap child-notification">
          <input type="checkbox" class="form-check-input child-checkbox notf-checkbox notf_${child.id}"
          id="notf_${child.id}" data-id="${child.id}">
            <label class="form-check-label" for="notf_${child.id}"></label>
            <div class="label-text t16">${child.notificationName}</div>
        </div>`;
        }
    }
    console.log(notificationsArray)
    $('.notification-settings-wrap').html(html);
    for(let item of settings) {
      $('#notf_'+item).prop('checked', true);
    }
  }

  setAccountsPage = (result) => {
        const accountInfo = result.data;
        $('.s_accountType').html(accountInfo.planName);
        $('.s_planExpiryDate').html(accountInfo.expiryDate);
        $('.s_planAmount').html('₹'+accountInfo.planAmount);
        $('.s_totalDocUsed').html(accountInfo.totalDocUsed);
        $('.s_totalDoc').html('/'+accountInfo.totalDoc);
        $('.s_totalAdhar').html('/'+accountInfo.totalAdhar);
        $('.s_totalAdharUsed').html(accountInfo.totalAdharUsed);
        $('.s_totalUsres').html('/'+accountInfo.totalUsres);
        $('.s_totalUsresAdded').html(accountInfo.totalUsresAdded);
        $('.s_docCreatedDays').html(accountInfo.docCreatedDays);
        $('.s_fullName').html(accountInfo.fullName);
        $('.s_role').html(accountInfo.role);
        $('.s_email').html(accountInfo.email);
        $('.s_phone').html(accountInfo.phone);
  }

  renderPersonalInfoSettings = (response, setingscontainer) => {
    const domRef = ['firstName', 'lastName','email','phone','address','zipCode','password'];
    fillDomWithData(setingscontainer, domRef, response.data);
    $(container).find('.name-display').html(data.firstName+ " "+data.lastName);
    $(container).find('.phone-display').html(data.phone);
    $(container).find('.email-display').html(data.email);
  }

  updatePersonalInfoSettings = () => {
    let infoSettings = {
      "userID": userID,
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "password": "string",
      "userTypeID": userTypeID,
      "zipCode": "string",
      "address": "string",
      "userQuestions": [
        {
          "id": 0,
          "userID": 0,
          "question": "string",
          "anwer": "string"
        }
      ]
    };
    const domRef = ['firstName', 'lastName', 'email', 'phone', 'address', 'zipCode', 'password'];
    const container = $('#settingsContainer');
    for (let input of domRef) {
      infoSettings[input] = $(container).find("." + input).val();
    }
    postApi('/User/UpdateProfile/', JSON.stringify(infoSettings)).then(()=>showToastMsg('success', 'Settings updated !'));
  }

  changePassWord = () => {
    const container = $('#settingsContainer');
    const password = $('#changePassword').val();
    $('.error-input').removeClass('error-input');
    if(password === $('#confirmChangePassword').val() && password.length >= 6) {
      postApi('User/UpdatePassword/', JSON.stringify({
        "userID": userID,
        "password": password
      })).then(()=>showToastMsg('success', 'Settings updated !'));
    } else {
      $('#confirmChangePassword').addClass('error-input');
    }
  }
  const addNewUser = () => {
    $('#upgradeNotificationModal').modal('show')
  }

  const renderSettingsTeamsTableData = () => {
    const esignTable = [
      { name: 'User1', role: 'Admin ( Owner )', lisence: 'Standard' },
      { name: 'User2', role: 'Admin ( Owner )', lisence: 'Standard' },
      { name: 'User3', role: 'Admin ( Owner )', lisence: 'Standard' }
    ];
    const roleData = `<div class="dropdown-menu user-role">
    <a class="dropdown-item" href="#">Role 1</a>
    <a class="dropdown-item" href="#">Role 2</a>
  </div>`;
    let html = '';
    for (let i = 0; i < esignTable.length; i++) {
      html += `<tr data-row=esignSettingsRow"${i}">
        <td>
          <div class="form-group form-check input-style-wrap">
            <input type="checkbox" class="form-check-input" id="selectrow${i}">
            <label class="form-check-label grey-text" for="selectrow${i}"></label>
          </div>
        </td>
        <td class="ddn-item input-style-wrap">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">${esignTable[i].role}</button>
            ${roleData}
          </div>
        </td>
        <td class="t16">${esignTable[i].lisence}</td>
        <td></td>
      </tr>`;
    }
    console.log(html);
    $('#esignTeamsTbody').html(html);
  }
