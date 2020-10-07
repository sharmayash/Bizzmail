$(document).ready(function() {
  
  // materialize js

  $(".modal").modal();
  $("#account_btn").on("click", () => {
    $("#modal1").modal("open");
  });
  $("#all_account").on("click", () => {
    $("#modal2").modal("open");
  });
  $(".tooltipped").tooltip();
  $(".sidenav").sidenav();
  $(".collapsible").collapsible();
  $(".addAccFromInbox").on("click", () => {
    $("#modal").modal("open");
  });

  //   ------custom menu functionalty-----

  //   close app
  
  document.querySelector(".exit").onclick = e => {
    e.preventDefault();
    const { app } = require("electron").remote;
    app.quit();
  };

  //   minimize app

  document.querySelector(".minimize").onclick = e => {
    e.preventDefault();
    const { BrowserWindow } = require("electron").remote;
    BrowserWindow.getFocusedWindow().minimize();
  };

  //   reload window
  
  document.querySelector(".refresh").onclick = e => {
    e.preventDefault();
    const { BrowserWindow } = require("electron").remote;
    BrowserWindow.getFocusedWindow().reload();
  };

  // set default user

  $(".setDefault").click(function() {
    axios
      .post("/setDefault", { id: this.id })
      .then(res => {
        M.toast({ html: res.data, classes: "rounded" });
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => console.log(err));
  });

  // remove a user

  $(".del_btn").click(function() {
    axios
      .post("/removeUser", { id: this.id })
      .then(res => {
        M.toast({ html: res.data, classes: "rounded" });
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => console.log(err));
  });
});
