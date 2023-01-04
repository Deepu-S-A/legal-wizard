  let componentsPath = './components/';
  const routeContainer = document.getElementById('route-container');

  let mydocumentsData = [];
  let currentMyDocsTab = '';

  const getMyDocsData = (type, target) => {
    getApi(baseUrl+`DocManagement/GetMyDocumentsByType/${type}`).then(res=> {
      mydocumentsData.length = 0;
      mydocumentsData = [...res.data];
      renderMydocumentsData(res.data, target)
    });
  }

  const renderMydocumentsData = (tableData, selector) => {
    currentMyDocsTab = selector;
    $('.db-mydocs .docsCounts').html(tableData.length + ' Records');
    let html = '', i = 0;
    for (let row of tableData) {
      const signerClass = row.totalTobeSigned <= 3 ? 'signers-wrap' : 'extra';
      const signerLength = row.totalTobeSigned >= 3 ? 3 : row.totalTobeSigned;
      let signers = `<div class="${signerClass}">`;
      for (let k = 0; k < signerLength; k++) {
        signers += '<img src="../assets/img/dashboard/db/signed-icon.png" alt="dots" class="signer"/>';
      } signers += '</div>';

      const statusClass = row.totalSigned == row.totalTobeSigned ? 'success' : 'fail';
      const percentage = statusClass == 'success' ? '100%' : ((row.totalTobeSigned - row.totalSigned) / row.totalTobeSigned) * 100 + '%';
      let statusHtml = `<div class="status-wrap"><div class="status-text d-flex"><div class="${statusClass}">`;
      if (statusClass === 'success') {
        statusHtml += `Completed</div><div class="t12">${row.totalTobeSigned} signed</div></div>`;
      } else {
        statusHtml += `Out for signature</div> <div class="t12">${row.totalTobeSigned - row.totalSigned}/${row.totalTobeSigned} signed</div></div>`;
      }
      statusHtml += `<div class="progress w-100" style="height: 0.6rem;">
  <div class="progress-bar ${statusClass}" role="progressbar" style="width: ${percentage}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
</div></div>`;
      html += `<tr>
        <td>
          <div class="t14">${row.documentName}</div>
          <div class="desc">Document ID : ${row.documentNo}</div>
        </td>
        <td>
          <div class="t14">${row.createdDate}</div>
          <div class="desc">Time : ${row.createdDate}</div>
        </td>
        <td>
          ${signers}
        </td>
        <td class="threedots">
          <div class="status-column">
            ${statusHtml}
            <button class="btn btn-green btn-small ml-4 mr-4">View</button>
          </div>
        </td>
      </tr>`;
    }
    $(selector).html(html);
  }