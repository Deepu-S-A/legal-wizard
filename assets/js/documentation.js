//let componentsPath = './components/';
//const routeContainer = document.getElementById('route-container');
let documentsList = [];

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
                case 'overview.html': renderOverviewPage(); break;
                case 'make-document.html': renderMakeDocumentData();
                $('.make-document-page').addClass('width-70'); break;
                case 'my-documents.html': renderMyDocuments(); break
                case 'doc-business.html': getApi(baseUrl+`DocManagement/GetMyAccount/`).then(response => initDocBusinessPage(response.data));
                break;
            }
        });
    }

  let availableTemplatesMaxCount = 25;

  const initDocBusinessPage = (info) => {
    availableTemplatesMaxCount = info.totalDoc;
    if(true) {
      //$('.doc-business-page').addClass('blur');
    }
    getFileContents(document.getElementById('docsWrap'), 'make-document.html');
    setTimeout(() => {
      setTemplatesInfo();
      $('.csss1').show();
    }, 1000);
  }

  const setTemplatesInfo = () => {
    const selectedTemplateCount = $('.selectedDoc').length;
    $('#selectedTemplateCount').html(selectedTemplateCount);
    $('#availableTemplatesMaxCount').html(availableTemplatesMaxCount);
    $('#remainingTemplatesInfo').html(availableTemplatesMaxCount - selectedTemplateCount + ' more to go');
  }

  const renderMyDocuments = () => {
    const myDocuments = [
      { docName: 'Afidavit of marrige1', percentage: '10', status: 'inprogress' },
      { docName: 'Afidavit of marrige2', percentage: '20', name: 'Jeswin Jose', status: 'completed' },
      { docName: 'Afidavit of marrige1', percentage: '10', status: 'inprogress' },
      { docName: 'Afidavit of marrige2', percentage: '40', name: 'Jeswin Jose', status: 'completed' },
      { docName: 'Afidavit of marrige1', percentage: '60', name: 'Deepu S A', status: 'inprogress' },
      { docName: 'Afidavit of marrige2', percentage: '20', name: 'Jeswin Jose', status: 'completed' }
    ];
    let myDocumentsHtml = '';
    for (let doc of myDocuments) {
      const statusClass = doc.status == 'Completed' ? 'success' : 'fail';
      const status = doc.status == 'inprogress' ? 'In progress' : 'Completed';
      myDocumentsHtml += `<div class="mydoc-box d-flex box-style1">
            <div class="t20 col2 grey-text colm">${doc.docName}</div>
            <div class="doc-status col3 colm ${doc.status}-icon">

              <div class="t20">${status}</div>
            </div>
            <div class="colm">
              <div class="progress w-100 mt-2" style="height: 0.6rem;">
                <div class="progress-bar ${statusClass}" role="progressbar" style="width: ${doc.percentage}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
      </div>`;
    }
    $('.my-documents-list').html(myDocumentsHtml);
    $(".my-documents-list").mCustomScrollbar();
  }

  loadHelpLandingPage = ()=> {
    getFileContents(routeContainer, 'help-topics.html');
  }

  $(document).ready(function () {
    setTimeout(()=>init(), 1000);
  });

  const renderDocuments = (data) => {
    documentsList.length = 0;
    documentsList = [...data];


    let html = "", counter = 0;
    for (let item of data) {
      item.tag = item.tag.split('.')[0];
      const dateModified = item.lastUpdatedDate != null ? item.lastUpdatedDate : "";
      let btnElement = `<a href="../core/document-transit.html?docid=${item.id}&docname=${item.tag}&lastmodified=${item.lastUpdatedDate}">
              <button type="button" class="btn btn-green right-arrow">Cancel</button></a>`;
      if ($('.doc-business-page').length === 1) {
        $('.make-document-page').removeClass('width-70');
        btnElement = `<button type="button" data-docname="${item.tag}" data-docid="${item.id}" class="addToListB btn btn-green right-arrow">Select</button>`;
      }
      html += `<div class="doc">
            <div class="doc-icon">
              <img src="../assets/img/dashboard/icons/document.png" alt="" class="Document" />
            </div>
            <div class="left-container">
              ${item.tag}
            </div>
            ${btnElement}
            </div>`;
    }
    $("#docsList").html(html)
  }

  init = () => {
    showToastMsg('success', 'This is a test message for success !');
    componentsPath = componentsPath += 'documentation/';
    getFileContents(routeContainer, 'overview.html');
    $('.link').click(function () {
      const pageTobeLoaded = $(this).attr('data-page');
      getFileContents(routeContainer, pageTobeLoaded);
      $('.link').removeClass('active');
      $(this).addClass('active');
    });
    $(document).on('click', '.docCategory-toggle', function () {
      $('.docCategory-toggle').removeClass('active');
      $(this).addClass('active');
    });
    $(document).on('click', '.search-box', function () {
      const searchText = $('.input-style-text').val().toLowerCase();
      if (searchText !== '') {
        const filteredArray = documentsList.filter(el => el.tag.toLowerCase().indexOf(searchText) > -1);
        console.log(filteredArray);
        renderDocuments(filteredArray);
      } else {
        $('.docCategory-toggle.active').trigger('click');
      }
    });
    $(document).on('click', '.threedots-img', function () {
      $(this).next().toggle();
    });
    $(document).on('click', '.help-page .topicsList .box1', function () {
      const pageTobeLoaded = $(this).attr('data-page');
      getFileContents(routeContainer, pageTobeLoaded);
    });
    const businessDocListB = [];
    $(document).on('click', '.addToListB', function () {
      let docId = $(this).attr('data-docid');
      let name = $(this).attr('data-docname');
      if ($(`.selectedDoc.${docId}`).length == 0) {
        const html = `<div class="selectedDoc ${docId} d-flex" data-docid="${docId}">
          <div class="doc-icon mr-4">
            <img src="../assets/img/dashboard/icons/document.png" alt="" class="Document" />
          </div>
          <div class="t18">${name}</div><button class="btn-red deselectDoc ml-auto">Deselect</button>
        </div>`;
        $('#selectedDocs').append(html);
        setTemplatesInfo();
      }
    });
    $(document).on('click', '.deselectDoc', function () {
      let docId = $(this).closest('.selectedDoc').remove();
      setTemplatesInfo();
    });
    $(document).on('click', '.backToHelpLandingPage', function(){
      $('.link.active').trigger('click');
    });
  }

  const renderMakeDocumentData = async () => {
    const docCategories = await fetch('http://ezyhostings-001-site1.dtempurl.com/api/Master/GetAllCategorys/', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return []
      });
    let html = "";
    for (let doc of docCategories) {
      html += `<div class="docCategory-toggle" onclick="getDocumentsOfCategory(${doc.categoryID});">${doc.categoryName}</div>`;
    }
    $("#docCategoryList").html(html);
    if (docCategories.length > 0) {
      setTimeout(() => {
        $('.docCategory-toggle').first().trigger('click');
      }, 500);
    }
  }

  getDocumentsOfCategory = (categoryId) => {
    $.ajax({
      url: "http://ezyhostings-001-site1.dtempurl.com/api/DocManagement/GetDocumentDropDownData/" + categoryId,
      type: 'GET',
      success: function (response) {
        renderDocuments(response.data);
        $(".scroll-element").mCustomScrollbar();
      }, error: function (err) {
        //alert(err);
      }
    });
  }

  const renderOverviewPage = () => {
    const inProgressDocs = [
      { docName: 'Afidavit of marrige1', name: 'Deepu S A' },
      { docName: 'Afidavit of marrige2', name: 'Jeswin Jose' }
    ];
    let inProgressHtml = '';
    for (let doc of inProgressDocs) {
      inProgressHtml += `<div class="inprogress-box d-flex box-style1">
        <div class="lhs1">
            <img src="../assets/img/dashboard/icons/doc-inprogress.png" alt="No Items">
          </div>
          <div class="rhs1 ml-4">
            <div class="t20">${doc.docName}</div>
            <div class="t18 mt-3 d-flex">
              <div class="t18 grey-text">${doc.name}</div>
              <div class="t18 ml-auto mt-2 green-text">Continue > </div>
            </div>
          </div>
      </div>`;
    }
    $('.inprogress-docs-wrap').html(inProgressHtml);
    const suggestionsDocs = [
      { docName: 'Afidavit of marrige' },
      { docName: 'Afidavit of marrige' }, { docName: 'Afidavit of marrige' }, { docName: 'Afidavit of marrige' }
    ];
    let suggestionsHtml = '';
    for (let doc of suggestionsDocs) {
      suggestionsHtml += `<div class="col-sm-12 col-md-6"><div class="suggestion-box d-flex box-style1">
        <div class="lhs1">
            <img src="../assets/img/dashboard/icons/document.png" alt="No Items">
          </div>
          <div class="rhs1 ml-4">
            <div class="t20">${doc.docName}</div>
          </div>
          <div class="rhs2 ml-auto">
            <img src="../assets/img/dashboard/icons/help-circle.png" alt="No Items">
          </div>
      </div></div>`;
    }
    $('.suggestions-docs-wrap').html(suggestionsHtml);
  }