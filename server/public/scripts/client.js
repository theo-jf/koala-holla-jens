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
  $( '#viewKoalas' ).on( 'click', '.delete', deleteKoala );
  $( '.dropOption' ).on( 'click', inputDropValue);
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
    $('#viewKoalas').append(`
      <tr data-id=${koala.id}>
        <td>${koala.name}</td>
        <td>${koala.age}</td>
        <td>${koala.gender}</td>
        <td>${koala.ready_to_transfer}</td>
        <td>${koala.notes}</td>
        <td><button class="delete">DELETE</button></td>
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