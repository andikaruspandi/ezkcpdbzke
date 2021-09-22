(function($) {
  $('#data-tab').click(); 

  $.ajax({
    url: '/products/total',
    method: 'GET',
    processData: false,
    contentType: false
  })
  .done(function(msg) {
    $("#total-data").text('Total products with price > 80000: ' + msg.total_products);
  })
  .fail(function(jqXHR, textStatus) {
    console.log('total_data', jqXHR);
  });

  $.ajax({
    url: '/products',
    method: 'GET',
    processData: false,
    contentType: false
  })
  .done(function(msg) {
    for (let i = 0; i < msg.length; i++) {
      $("#table-data tbody").append(
        '<tr id="td-' + msg[i].id + '">' +
          '<td class="td-id">' + msg[i].id + '</td>' +
          '<td class="td-name">' + msg[i].name + '</td>' +
          '<td class="td-price"> Rp. ' + msg[i].price + '</td>' +
          '<td class="td-action">' +
            '<button class="btn btn-primary mt-3 edit-button" style="margin-right: 5px;" data-id="' + msg[i].id + '">Edit</button>' +
            '<button class="btn btn-primary mt-3 delete-button" data-id="' + msg[i].id + '">Delete</button>' +
          '</td>' +
        '</tr>'
      );
    }
  })
  .fail(function(jqXHR, textStatus) {
    $("#table-data tbody").append(
      '<tr>' +
        '<td colspan="5" text="center">Data not available</td>' +
      '</tr>'
    );
  });

  $('body').on('click', '.delete-button', function() {
    let r = confirm("Data with ID " + $(this).data('id') + " will be deleted, are you sure to continue?");
    if (r == true) {
      $.ajax({
        url: '/products/delete/' + $(this).data('id'),
        method: 'POST',
      })
      .done(function(msg) {
        window.location.reload();
      })
      .fail(function(jqXHR, textStatus) {
        alert('An error occured, please try again!');
        console.log('delete-error-xhr', jqXHR);
        console.log('delete-error', textStatus);
      });
    }
  });

  $('body').on('click', '.edit-button', function() {
    $('.edit-nav').css('display', 'block');
    $('#edit-tab').click();
    $('#edit-id').val($(this).data('id'));

    $.ajax({
      url: '/products/' + $(this).data('id'),
      method: 'GET',
    })
    .done(function(msg) {
      $('#edit-name').val(msg.name);
      $('#edit-price').val(msg.price);
    })
    .fail(function(jqXHR, textStatus) {
      alert('An error occured, please try again!');
      console.log('edit-error-xhr', jqXHR);
      console.log('edit-error', textStatus);
    });
  });

  $('#add-button').on('click', function() {
    let name  = $('#name').val();
    let price = $('#price').val();

    if (name && price) {
      $.ajax({
        url: '/products',
        method: 'POST',
        data: { name, price }
      })
      .done(function(msg) {
        window.location.reload();
      })
      .fail(function(jqXHR, textStatus) {
        alert('An error occured, please try again!');
        console.log('add-error-xhr', jqXHR);
        console.log('add-error', textStatus);
      });
    } else {
      alert('Please enter name and price!');
    }
  });

  $('#edit-button').on('click', function() {
    let name  = $('#edit-name').val();
    let price = $('#edit-price').val();

    if (name && price) {
      $.ajax({
        url: '/products/' + $('#edit-id').val(),
        method: 'POST',
        data: { name , price }
      })
      .done(function(msg) {
        window.location.reload();
      })
      .fail(function(jqXHR, textStatus) {
        alert('An error occured, please try again!');
        console.log('add-error-xhr', jqXHR);
        console.log('add-error', textStatus);
      });
    } else {
      alert('Please enter name and price!');
    }
  });
})(jQuery);