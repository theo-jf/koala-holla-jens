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
      </tr>
    `);
  }
  $('input').val('');
}

function saveKoala( ){
  // creates new koala data object //outputs 'newKoala'
  let newKoala = {
    name: $('#nameIn').val(),
    age: $('#ageIn').val(),
    gender: $('#genderIn').val(),
    ready_to_transfer: $('#readyForTransferIn').val(),
    notes: $('#notesIn').val(),
  }
  putKoala( newKoala );
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
  
  