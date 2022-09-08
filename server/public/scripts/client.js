console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    // let koalaToSend = {
    //   name: 'testName',
    //   age: 'testName',
    //   gender: 'testName',
    //   readyForTransfer: 'testName',
    //   notes: 'testName',
    // };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); 
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

function putKoala( newKoala ) {

}

function saveKoala( ){
  // creates new koala data object //outputs 'newKoala'
 
  let newKoala = {
    name: $('#nameIn').val(),
  }

  
 
 
  console.log( 'in saveKoala', newKoala );
  putKoala( newKoala );
} //end saveKoala
  
  