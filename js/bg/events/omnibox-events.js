/* Copyright (c) 2012 Joel Thornton <sidewise@joelpt.net> See LICENSE.txt for license details. */

function registerOmniboxEvents() {
  chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);
  chrome.omnibox.onInputEntered.addListener(onOmniboxInputEntered);
  chrome.omnibox.setDefaultSuggestion({
    description: getMessage("omniboxDefaultSuggestion")
  })
}

function onOmniboxInputChanged(a, g) {
  var c = tree.filter(function(b) {
      return "page" == b.elemType && b.title && 0 == b.title.toLowerCase().indexOf(a)
    }),
    c = c.concat(tree.filter(function(b) {
      if ("page" != b.elemType) return !1;
      var d = !1;
      b.title && 0 < b.title.toLowerCase().indexOf(a) ? d = !0 : b.label && -1 < b.label.toLowerCase().indexOf(a) && (d = !0);
      return d && -1 == c.indexOf(b) ? !0 : !1
    })),
    f = RegExp("(" + a + ")", "i"),
    h = c.map(function(b) {
      var a = b.label ? escapeOmniboxText(b.label) + ": " : "",
        c = escapeOmniboxText(b.url),
        e = escapeOmniboxText(b.title),
        a = a.replace(f, "<match>$1</match>"),
        e = e.replace(f, "<match>$1</match>"),
        a = "<url>" + getMessage("omniboxSuggestionPrefix") + "</url> " + a + (b.hibernated ? "<dim>(" + getMessage("text_hibernated") + ")</dim> " : "") + e + " <dim> - " + c + "</dim>";
      return {
        content: b.id,
        description: a
      }
    });
  g(h)
}

function escapeOmniboxText(a) {
  return a.replace(/;/g, "&#59;").replace(/&(?!#59;)/g, "&amp;")
}

function onOmniboxInputEntered(a) {
  a = tree.getNode(a);
  a.hibernated ? tree.awakenPages([a], !0) : chrome.tabs.update(a.chromeId, {
    active: !0
  })
};
