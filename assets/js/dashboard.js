  $(document).ready(function () {
    init();
    $('.link').click(function () {
      const pageTobeLoaded = $(this).attr('data-page');
      getFileContents(routeContainer, pageTobeLoaded);
      $('.link').removeClass('active');
      $(this).addClass('active');
    })
  });

    getFileContents = (element, name) => {
      new Promise((resolve, reject) => {
        let file = componentsPath + name;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) { element.innerHTML = this.responseText; resolve(); }
            if (this.status == 404) { element.innerHTML = "Page not found."; reject() }
              element.removeAttribute("w3-include-html");
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
      }).then(() => {
        switch (name) {
          case 'home.html': renderHomePageData(); break;
          case 'mydocument.html': getMyDocsData(0, '#esignedDocTbody');break;
          case 'users.html': renderUsersPage(); break
          case 'settings.html': renderSettingsHtml(); break;
        }
      })
  }

  init = () => {
    getFileContents(routeContainer, 'home.html');
    $("#planType").on("change", function () {
      planTypeChanged(this);
    });
    $(document).on("change", "#selectAllDbHome", function () {
      $("#db-home-table").find('input').prop('checked', $("#selectAllDbHome").prop('checked'))
    });
    $(document).on("click", ".mydocuments-search-btn", function () {
      const searchText = $('.mydocuments-search-text').val().toLowerCase();
      if(searchText !== '') {
        renderMydocumentsData(mydocumentsData.filter(el => el.documentName.toLowerCase().includes(searchText)), currentMyDocsTab);
      } else {
        renderMydocumentsData(mydocumentsData, currentMyDocsTab);
      }
    });
  }

  const renderUsersPage = () => {
    const users = [
      { name: 'Deepu S A', email: 'deepusa1988@gmail.com', userid: 'u1', dp: 'avatar.png' },
      { name: 'Akhil', email: 'deepusa1988@gmail.com', userid: 'u2', dp: 'avatar.png' },
      { name: 'Jeswin', email: 'deepusa1988@gmail.com', userid: 'u3', dp: 'avatar.png' }
    ];
    let html = '';
    const imgPath = "../assets/img/dashboard/db/"
    for (let user of users) {
      html += `<div class="user box">
        <div class="dp"><img src="${imgPath}${user.dp}"/></div>
        <div class="t16"><b>${user.name}</b></div>
        <div class="t14">${user.email}</div>
      </div>`;
    }
    $('.users-wrap').html(html);
  }

    planTypeChanged = (ele) => {
    if ($(ele).prop("checked") == true) {
      $("#businessBoxesWrap").show();
      $("#eSignatureBoxesWrap").hide();
      $("#subscriptionTypeWrap").hide();
    }
    else if ($(ele).prop("checked") == false) {
      $("#businessBoxesWrap").hide();
      $("#eSignatureBoxesWrap").show();
      $("#subscriptionTypeWrap").show();
    }
  }

    //HOME PAGE FUNCTIONALITIES STARTS
  const renderHomePageData = () => {
    drawDonoughtChart();
    renderDbHomeTable();
    renderBarCharts();
  }
  const renderBarCharts = () => {
    const documentationData = [
      { 'month': 'Jan', count: 30 }, { 'month': 'Feb', count: 50 }, { 'month': 'Mar', count: 70 }, { 'month': 'Apr', count: 20 }
    ];
    const esignData = [
      { 'month': 'Jan', count: 10 }, { 'month': 'Feb', count: 100 }, { 'month': 'Mar', count: 20 }, { 'month': 'Apr', count: 50 }
    ];
    const unit = 75;
    renderChart('#documentationBarChart', documentationData, unit);
    renderChart('#esignBarChart', esignData, unit);
  }
  const renderChart = (selector, data, baseUnit) => {
    let html = '';
    for (let item of data) {
      let percentage = (item.count / baseUnit) * 100;
      html += `<div class="column-wrap"><div class="fullbar"><div class="bar" style="height:${percentage}px"></div></div><div class="month t12">${item.month}</div></div>`;
    }
    $(selector).html(html);
  }
  const renderDbHomeTable = () => {
    const tableData = [
      { name: 'The Argon reseach Global 2022_243 transaction', documentId: '124559766542', date: '9th May', time: '9:45 PM', status: 'Draft' },
      { name: 'The Argon reseach Global 2022_243 transaction', documentId: '999999999999', date: '9th May', time: '9:45 PM', status: 'Draft' }
    ];
    let html = '', i = 0;
    for (let row of tableData) {
      html += `<tr>
        <th>
          <div class="form-group form-check input-style-wrap">
            <input type="checkbox" class="form-check-input" id="selectrow${++i}">
            <label class="form-check-label grey-text" for="selectrow${i}"></label>
          </div>
        </th>
        <td>
          <div class="t14">${row.name}</div>
          <div class="desc">Document ID : ${row.documentId}</div>
        </td>
        <td><button class="btn btn-green btn-small">View</button></td>
        <td>
          <div class="t14">${row.date}</div>
          <div class="desc">Document ID : ${row.time}</div>
        </td>
        <td>
          <div class="t14">${row.status}</div>
        </td>
        <td class="threedots">
          <img src="../assets/img/three-dots.png" alt="dots" class="threedots-img">
          <div class="db-home-options">
            <div class="db-home-option">option1</div>
            <div class="db-home-option">option2</div>
            <div class="db-home-option">option3</div>
          </div>
        </td>
      </tr>`;
    }
    let documentsProgressBar = document.getElementById('documentsProgressBar');
    let documentsProgressBarEl = new ProgressBar.Circle(documentsProgressBar, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 100,
      color: '#FED2B9',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });
    documentsProgressBarEl.animate(0.7);
    let storageProgressBar = document.getElementById('storageProgressBar');
    let storageProgressBarEl = new ProgressBar.Circle(storageProgressBar, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 100,
      color: '#19C194',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });
    storageProgressBarEl.animate(0.5);
    $('#dbHomeTable').html(html);
    $('.threedots-img').click(function () {
      $(this).next().toggle();
    });
    $('.db-home-option').click(function () {
      $(this).closest('.db-home-options').hide();
    });
  }

  const drawDonoughtChart = () => {
    const data = {
      labels: [
        'Documents',
        'Esign',
        'Storage'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [200, 50, 100],
        backgroundColor: [
          'rgb(60, 186, 146)',
          'rgb(230, 200, 190)',
          'rgb(250, 94, 97)'
        ],
        hoverOffset: 4
      }]
    };
    const config = {
      type: 'doughnut',
      data: data,
      options: {
        //maintainAspectRatio:false,
        plugins: {
          legend: {
            position: 'bottom', maxWidth: 15, align: 'center',
            labels: {
              boxWidth: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    };
    let donoughtChart = new Chart(document.getElementById('donoughtChart'), config);
  }
  //HOME PAGE FUNCTIONALITIES ENDS