function deleted(name) {
  swal({
    // title: "Are you sure?",
    text: "apakah anda yakin menghapus data " + name,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      window.location.href = "/contact/deleted/".concat(name);
    }
  });
}
