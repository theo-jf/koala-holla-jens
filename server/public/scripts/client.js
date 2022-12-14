console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', saveKoala );
  $( '.dropOption' ).on( 'click', inputDropValue);
  $( '#viewKoalas' ).on( 'click', ".delete", deleteKoala );
  $( '#viewKoalas' ).on( 'click', ".readyStatus", updateStatus );
  $( '#viewKoalas' ).on( 'click', ".edit", editKoala );
  $( '#viewKoalas' ).on( 'click', '.dropOption', inputDropValue);
}

function inputDropValue() {
  console.log( $(this).parent().siblings('.dropbtn') );
  $(this).parent().siblings('.dropbtn').val( $(this).data('val') );
}

function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  })
  .then((response) => {
    console.log('success');
    renderKoalas(response);
  })
  .catch((error) => {
    console.log('error',error);
  });
} // end getKoalas

//accepts GET /koalas response as argument
function renderKoalas(koalaList) {
//clears koala table
  $('#viewKoalas').empty();
  for (let koala of koalaList) { //update this for proper formatting of rows/etc
    let readyStatus = (koala.ready_to_transfer === true) ? 'Y' : 'N';
    $('#viewKoalas').append(`
      <tr data-id=${koala.id}>
        <td class="name">${koala.name}</td>
        <td class="age">${koala.age}</td>
        <td class="gender">${koala.gender}</td>
        <td class="ready"><button class="readyStatus">${readyStatus}</button></td>
        <td class="notes">${koala.notes}</td>
        <td><button class="delete">DELETE</button></td>
        <td class="editTd"><button class="edit">EDIT</button></td>
      </tr>
    `);
  }
  $('input').val('');
}

function saveKoala( ){
  if (!checkKoalaInput()) {
    return false;
  } else {
    let newKoala = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      gender: $('#genderIn').val(),
      ready_to_transfer: $('#readyForTransferIn').val(),
      notes: $('#notesIn').val(),
    }
    putKoala( newKoala );
  }
} //end saveKoala

function putKoala ( newKoala ) {
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  })
    .then((response) => {
      console.log('POST /koalas successful', response);
      Swal.fire({
        icon: 'success',
        title: 'Koala Added',
        text: 'Success',
      })
      getKoalas();
    })
    .catch((error) => {
      console.log('error in POST /koalas',error)
    })
}

function deleteKoala() {
  $.ajax({
    method: 'DELETE',
    url: `/koalas/${$(this).parent().parent().data('id')}`
  })
    .then((response) => {
      console.log('DELETE /koalas success',response);
      Swal.fire({
        icon: 'success',
        title: 'Koala Gone',
        text: 'Success',
      })
      getKoalas();
    })
    .catch((error) => {
      console.log('error in DELETE /koalas',error);
    });
}


function checkKoalaInput() {
  if ( $( '#nameIn' ).val() === '' || $( '#ageIn' ).val() === '') {
    alert('Please complete form with name and age');
    return false
  } else if ( Number($( '#ageIn' ).val()) === NaN || Number($( '#ageIn' ).val()) < 0 ) {
    alert('Please enter a correct age');
    return false;
  } else if (  $( '#genderIn' ).val() === '' ) {
    alert('Please submit gender in fascist binary format');
    return false;
  } else if ( $( '#readyForTransferIn' ).val() === '' ) {
    alert('Transfer Status?');
    return false;
  } else {
    return true;
  }
}

function updateStatus() {
  $.ajax({
    method: 'PUT',
    url: `/koalas/${$(this).parent().parent().data('id')}`
  })
    .then((response) => {
      console.log('PUT /koalas success',response);
      getKoalas();
    })
    .catch((error) => {
      console.log('error in PUT /koalas',error);
    });
}

function editKoala() {
  let updateId = $(this).parent().parent().data('id');

  let savedKoalaInfo = {
    name: $(this).parent().closest('tr').find('.name').text(),
    age: $(this).parent().closest('tr').find('.age').text(),
    gender: $(this).parent().closest('tr').find('.gender').text(),
    ready_to_transfer: $(this).parent().closest('tr').find('.ready').children().text(),
    notes: $(this).parent().closest('tr').find('.notes').text()
  }

  // If this is confirming previous edits, end function
  if ($(this).text() === 'Confirm') {
    savedKoalaInfo = {
    name: $(this).parent().closest('tr').find('#nameInEdit').val(),
    age: $(this).parent().closest('tr').find('#ageInEdit').val(),
    gender: $(this).parent().closest('tr').find('.gender').children().children().val(),
    ready_to_transfer: $(this).parent().closest('tr').find('.ready').children().children().val(),
    notes: $(this).parent().closest('tr').find('#notesInEdit').val()
    }
    submitKoalaEdit(savedKoalaInfo, updateId);
    return;
  }

  // changes td to text inputs ---> previous text supplanted

  console.log(savedKoalaInfo);

  $(this).parent().closest('tr').find('.name').empty();
  $(this).parent().closest('tr').find('.name').append(`
    <input type="text" id="nameInEdit" value="${savedKoalaInfo.name}" placeholder="Name">
  `);

  $(this).parent().closest('tr').find('.age').empty();
  $(this).parent().closest('tr').find('.age').append(`
    <input type="text" id="ageInEdit" value="${savedKoalaInfo.age}" placeholder="Age">
  `);

  $(this).parent().closest('tr').find('.gender').empty();
  $(this).parent().closest('tr').find('.gender').append(`
    <div class="dropdown">
      <input class="dropbtn" id="genderInEdit" disabled value="${savedKoalaInfo.gender}" placeholder="Gender">
        <div id="transferDropdown" class="dropdown-content">
          <p class="dropOption" data-val="M">M</p>
          <p class="dropOption" data-val="F">F</p>
        </div>
    </div>
  `);

  $(this).parent().closest('tr').find('.ready').empty();
  $(this).parent().closest('tr').find('.ready').append(`
    <div class="dropdown">
      <input class="dropbtn" id="readyForTransferInEdit" disabled value="${savedKoalaInfo.ready_to_transfer}" placeholder="Ready to Transfer?">
        <div id="transferDropdown" class="dropdown-content">
          <p class="dropOption" data-val="Y">Y</p>
          <p class="dropOption" data-val="N">N</p>
        </div>
    </div>
  `);

  $(this).parent().closest('tr').find('.notes').empty();
  $(this).parent().closest('tr').find('.notes').append(`
    <input type="text" id="notesInEdit" value="${savedKoalaInfo.notes}" placeholder="Notes">
  `);

  $(this).parent().closest('tr').find('.delete').remove();

  $(this).parent().closest('tr').find('.edit').text('Confirm');


  // New button ---> confirm edit which calls the submitKoalaEdit function
}

function submitKoalaEdit(savedKoalaInfo, updateId) {

  $.ajax({
    method: 'PUT',
    url: `/update/${updateId}`,
    data: savedKoalaInfo
  })
    .then((response) => {
      console.log('PUT /update success', response);
      getKoalas();
    })
    .catch((error) => {
      console.log('error in PUT /update', error);
    });
}
