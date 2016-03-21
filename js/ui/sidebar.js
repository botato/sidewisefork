/* Copyright (c) 2012 Joel Thornton <sidewise@joelpt.net> See LICENSE.txt for license details. */

var manager, bg, settings;
$(document).ready(onReady);

function onReady() {
  bg = chrome.extension.getBackgroundPage();
  settings = bg.settings;
  $.fx.off = !settings.get("animationEnabled");
  manager = new SidebarNavManager($("ul#sidebarButtons"), $("tr#sidebars"), $("table#main"), $("body"), "td");
  manager.addSidebarPanes(bg.paneCatalog.items);
  var a = settings.get("lastSidebarPaneId");
  if (void 0 === a || -1 == bg.paneCatalog.getPaneIds().indexOf(a)) a = bg.paneCatalog.items[0].id;
  manager.showSidebarPane(a);
  $(window).load(function() {
    setTimeout(function() {
      manager.scrollToCurrentSidebarPane(!0)
    }, 0);
    setTimeout(function() {
      manager.scrollToCurrentSidebarPane(!0)
    }, 100)
  });
  $(document).keydown(onDocumentKeyDown).scroll(onDocumentScroll).mouseover(onDocumentMouseOver);
  $(window).resize(onWindowResize);
  $("#optionsButton").attr("title", getMessage("sidebars_optionsButtonTooltip")).tooltip({
    position: "bottom center",
    predelay: 400,
    offset: [15, -15]
  }).click(onClickOptionsButton).mousedown(onMouseDownOptionsButton).mouseup(onMouseUpOptionsButton).mouseover(onMouseOverOptionsButton).mouseout(onMouseUpOptionsButton);
  setI18NText();
  bg.sidebarHandler.registerSidebarPane("sidebarHost", window)
}

function onDocumentKeyDown(a) {
  if (27 == a.keyCode || a.ctrlKey && 70 == a.keyCode || !a.ctrlKey && !a.altKey && 48 <= a.keyCode && 90 >= a.keyCode || a.ctrlKey && 86 == a.keyCode || a.ctrlKey && 115 == a.keyCode) try {
    var b = $("#sidebarContainer__" + manager.currentSidebarId).children("iframe").get(0).contentWindow;
    b.jQuery(b.document).trigger(a);
    return !1
  } catch (c) {}
  return !0
}

function onDocumentScroll() {
  manager.scrolling || manager.scrollToCurrentSidebarPane(!0)
}

function onDocumentMouseOver() {
  settings.get("focusSidebarOnHover") && bg.sidebarHandler.focus()
}

function onWindowResize() {
  bg.sidebarHandler.onResize();
  manager.scrollToCurrentSidebarPane(!0)
}

function onClickOptionsButton() {
  var a = chrome.extension.getURL("/options.html");
  chrome.tabs.query({
    url: a
  }, function(b) {
    0 == b.length ? chrome.tabs.create({
      url: a
    }) : chrome.tabs.update(b[0].id, {
      active: !0
    })
  })
}

function onMouseDownOptionsButton(a) {
  $("optionsButtonIcon" == a.target.id ? a.target.parentElement : a.target).addClass("mousedown");
  a.stopPropagation()
}

function onMouseUpOptionsButton(a) {
  $("optionsButtonIcon" == a.target.id ? a.target.parentElement : a.target).removeClass("mousedown");
  a.stopPropagation()
}

function onMouseOverOptionsButton(a) {
  1 == a.which && onMouseDownOptionsButton(a);
  a.stopPropagation()
};