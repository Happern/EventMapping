"use strict";

var mainFilterToggle = function mainFilterToggle() {
  var button = document.querySelector(".filter-wrapper > .filter-title");

  button.addEventListener('click', function () {
    button.closest(".filter-wrapper").classList.toggle("filter-wrapper-opened");
  });
};

var dropdownToggle = function dropdownToggle() {
  var buttons = document.querySelectorAll(".filter-dropdown-item > .filter-dropdown-title:not(.view-type-2) > span");

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      if (window.innerWidth > 767) {
        if (document.querySelector(".filter-dropdown-item.filter-item-opened") && !button.closest(".filter-dropdown-item").classList.contains("filter-item-opened")) {
          document.querySelector(".filter-dropdown-item.filter-item-opened").classList.remove("filter-item-opened");
        }
        button.closest(".filter-dropdown-item").classList.toggle("filter-item-opened");
        if (button.closest(".datepicker-wrap")) {
          setTimeout(function () {
            button.closest(".filter-content").classList.toggle("filter-overflow-visibility");
          }, 500);
        } else {
          document.querySelector(".filter-content.filter-overflow-visibility").classList.remove("filter-overflow-visibility");
        }
      } else {
        document.querySelector(".filter-wrapper").classList.toggle("has-opened");
      }
    });
  });
};

var subDropdownToggle = function subDropdownToggle() {
  var buttons = document.querySelectorAll(".filter-sub-dropdown-title");

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      if (document.querySelector(".filter-sub-dropdown-item.sub-item-opened") && !button.closest(".filter-sub-dropdown-item").classList.contains("sub-item-opened")) {
        document.querySelector(".filter-sub-dropdown-item.sub-item-opened").classList.remove("sub-item-opened");
      }
      button.closest(".filter-sub-dropdown-item").classList.toggle("sub-item-opened");
      // button.closest(".filter-sub-dropdown-item").querySelector(".filter-sub-dropdown-content").classList.toggle("opened");
    });
  });
};

var optionSelection = function optionSelection() {
  var buttons = document.querySelectorAll(".filter-option");

  var optText = void 0,
      optClass = void 0,
      optId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
		
			 

      button.classList.toggle("has-selected");

      optText = button.innerText;
      optClass = button.dataset.optclass ? button.dataset.optclass : "";
      optId = button.dataset.id;

      if (button.classList.contains("has-selected")) {
        optionAppendTag(optText, optClass, optId, "add");
      } else {
        optionAppendTag(optText, optClass, optId, "remove");
      }
	  
		_GLOBAL.event.applyFilter();
    });
  });
};

var optionAppendTag = function optionAppendTag(optText, optClass, id, parameter) {
  var tagWrapper = document.querySelector(".tag");
  if (parameter === "add") {
    var output = "\n        <span class=\"tag-item " + optClass + "\" data-id=\"" + id + "\">\n          " + optText + "\n          <a href=\"javascript:;\" class=\"tag-item-remove\"></a>\n        </span>\n    ";

    tagWrapper.insertAdjacentHTML('beforeend', output);
    removeTagItem();
  } else if (parameter === "remove") {
    document.querySelector(".tag-item[data-id=\"" + id + "\"]").remove();
  }
};

var selectBox = function selectBox() {
  var titles = document.querySelectorAll(".filter-select-title"),
      selectOptions = document.querySelectorAll(".filter-select-list li"),
      filterTitle = document.querySelector(".filter-title"),
      filterWrapper = filterTitle.closest(".filter-wrapper"),
      selectDynamicTitle = document.querySelector(".filter-select-title.changed-title"),
      filterDropdownTitles = document.querySelectorAll(".filter-dropdown-title>span");

  Array.prototype.forEach.call(titles, function (title) {
    title.addEventListener('click', function () {
      if (title.closest(".filter-select").querySelector(".filter-select-list")) {
        title.closest(".filter-select").classList.toggle("select-opened");
        title.closest(".filter-dropdown-content").classList.toggle("select-opened");
        title.closest(".filter-content").classList.toggle("select-opened");
      }
    });
  });
  Array.prototype.forEach.call(selectOptions, function (selectOption) {
    selectOption.addEventListener('click', function () {
      if (selectOption.closest(".filter-select").querySelector(".filter-select-list")) {
        selectOption.closest(".filter-select").classList.toggle("select-opened");
        selectOption.closest(".filter-dropdown-content").classList.toggle("select-opened");
        selectOption.closest(".filter-content").classList.toggle("select-opened");
        selectDynamicTitle.innerHTML = selectOption.innerHTML;
      }
    });
  });

  filterTitle.addEventListener('click', function () {
    filterWrapper.querySelector(".filter-list.select-opened") ? filterWrapper.querySelector(".filter-list.select-opened").classList.remove("select-opened") : null;
    filterWrapper.querySelector(".filter-dropdown-content.select-opened") ? filterWrapper.querySelector(".filter-dropdown-content.select-opened").classList.remove("select-opened") : null;
    filterWrapper.querySelector(".filter-content.select-opened") ? filterWrapper.querySelector(".filter-content.select-opened").classList.remove("select-opened") : null;
  });

  Array.prototype.forEach.call(filterDropdownTitles, function (filterDropdownTitle) {
    filterDropdownTitle.addEventListener('click', function () {
      filterWrapper.querySelector(".filter-list.select-opened") ? filterWrapper.querySelector(".filter-list.select-opened").classList.remove("select-opened") : null;
      filterWrapper.querySelector(".filter-dropdown-content.select-opened") ? filterWrapper.querySelector(".filter-dropdown-content.select-opened").classList.remove("select-opened") : null;
      filterWrapper.querySelector(".filter-content.select-opened") ? filterWrapper.querySelector(".filter-content.select-opened").classList.remove("select-opened") : null;
    });
  });
};

var menuDropdown = function menuDropdown() {
  var buttons = document.querySelectorAll(".menu-item-drop > a");

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      button.parentNode.classList.toggle("item-drop-opened");
    });
  });
};

var toggleMenu = function toggleMenu() {
  var buttons = document.querySelectorAll(".trigger-menu"),
      menu = document.querySelector(".menu");

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      menu.classList.toggle("menu-opened");
    });
  });
};

var connectedItems = function connectedItems() {
  var options = document.querySelectorAll(".filter-radiallist-item[data-filter-name] > a"),
      optClass = "";

  var optText = void 0,
      optId = void 0;

  Array.prototype.forEach.call(options, function (option) {
    option.addEventListener('click', function () {
      document.body.classList.remove("filter-few");
      document.body.classList.remove("filter-some");
      document.body.classList.remove("filter-many");
      option.parentNode.classList.toggle("radiallist-item-selected");
      option.parentNode.classList.contains("radiallist-item-selected") ? document.body.classList.add(option.parentNode.dataset.filterName) : "";
      !document.querySelector(".filter-radiallist-item.radiallist-item-selected") ? document.body.classList.remove(option.parentNode.dataset.filterName) : "";

      optText = option.querySelector(".filter-radiallist-text >*:first-child").innerText;
      optId = option.parentNode.dataset.id;
      option.parentNode.classList.contains("radiallist-item-selected") ? optionAppendTag(optText, optClass, optId, "add") : optionAppendTag(optText, optClass, optId, "remove");
    _GLOBAL.event.applyFilter();
	  
	  });
  });
};

var priceList = function priceList() {
  var buttons = document.querySelectorAll(".filter-pricelist-item"),
      optClass = "";

  var optText = void 0,
      optId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {

      optText = button.querySelector(".filter-pricelist-text").innerText;
      optId = button.dataset.id;

      if (button.classList.contains("has-selected")) {
        button.classList.remove("has-selected");
        optionAppendTag(optText, optClass, optId, "remove");
      } else {
        button.classList.add("has-selected");
        optionAppendTag(optText, optClass, optId, "add");
      }
	  
	  _GLOBAL.event.applyFilter();
    });
  });
};

var venueList = function venueList() {
  var buttons = document.querySelectorAll(".filter-corneredlist-item"),
      optClass = "";

  var optText = void 0,
      optId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {

      optText = button.querySelector(".filter-corneredlist-text > *:first-child").innerText + " venue";
      optId = button.dataset.id;

      if (button.classList.contains("corneredlist-item-selected")) {
        button.classList.remove("corneredlist-item-selected");
        optionAppendTag(optText, optClass, optId, "remove");
      } else {
        button.classList.add("corneredlist-item-selected");
        optionAppendTag(optText, optClass, optId, "add");
      }
	  
	  _GLOBAL.event.applyFilter();
    });
  });
};

var quietOrLoud = function quietOrLoud() {
  var buttons = document.querySelectorAll(".filter-radiallist2-item > a"),
      optClass = "";

  var optText = void 0,
      optId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {

      optText = button.parentNode.querySelector(".filter-radiallist2-item > *").innerText;
      optId = button.parentNode.dataset.id;

      if (button.parentNode.classList.contains("radiallist2-item-selected")) {
        button.parentNode.classList.remove("radiallist2-item-selected");
        optionAppendTag(optText, optClass, optId, "remove");
      } else {
        if (document.querySelector(".radiallist2-item-selected")) {
          var prevId = document.querySelector(".radiallist2-item-selected").dataset.id;
          document.querySelector(".tag-item[data-id=\"" + prevId + "\"]").remove();
          document.querySelector(".radiallist2-item-selected").classList.remove("radiallist2-item-selected");
        }
        button.parentNode.classList.add("radiallist2-item-selected");
        optionAppendTag(optText, optClass, optId, "add");
      }
	  _GLOBAL.event.applyFilter();
    });
  });
};
var calmOrActive = function calmOrActive() {
  var buttons = document.querySelectorAll(".filter-radiallist3-item > a"),
      optClass = "";

  var optText = void 0,
      optId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {

      optText = button.parentNode.querySelector(".filter-radiallist3-item > *").innerText;
      optId = button.parentNode.dataset.id;

      if (button.parentNode.classList.contains("radiallist3-item-selected")) {
        button.parentNode.classList.remove("radiallist3-item-selected");
        optionAppendTag(optText, optClass, optId, "remove");
      } else {
        if (document.querySelector(".radiallist3-item-selected")) {
          var prevId = document.querySelector(".radiallist3-item-selected").dataset.id;
          document.querySelector(".tag-item[data-id=\"" + prevId + "\"]").remove();
          document.querySelector(".radiallist3-item-selected").classList.remove("radiallist3-item-selected");
        }
        button.parentNode.classList.add("radiallist3-item-selected");
        optionAppendTag(optText, optClass, optId, "add");
      }
	  _GLOBAL.event.applyFilter();
    });
  });
};

var removeTagItem = function removeTagItem() {
  var items = document.body.querySelectorAll(".tag-item-remove");

  var itemId = void 0,
      removedClass = void 0;

  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener('click', function () {
      itemId = item.parentNode.dataset.id;
      if (itemId.indexOf("ent") >= 0 || itemId.indexOf("cult") >= 0 || itemId.indexOf("edu") >= 0 || itemId.indexOf("oth") >= 0 || itemId.indexOf("wie") >= 0 || itemId.indexOf("prc") >= 0) {
        removedClass = "has-selected";
      } else if (itemId.indexOf("hmp") >= 0) {
        removedClass = "radiallist-item-selected";
      } else if (itemId.indexOf("ven") >= 0) {
        removedClass = "corneredlist-item-selected";
      } else if (itemId.indexOf("qol") >= 0) {
        removedClass = "radiallist2-item-selected";
      } else if (itemId.indexOf("coa") >= 0) {
        removedClass = "radiallist3-item-selected";
      }

      document.querySelector(".tag-item[data-id=\"" + itemId + "\"]").remove();
      document.querySelector("[data-id=\"" + itemId + "\"]").classList.remove(removedClass);
	  
	  _GLOBAL.event.applyFilter();
    });
  });
};

var sizeForSections = function sizeForSections() {
  /* window resize olduğunda eğer mobil görünüme geçildiyse tüm kapsayıcılara inline width verilir. */
  var items = document.querySelectorAll(".filter-dropdown-item"),
      parentSelector = document.querySelector(".filter-content");

  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {

      Array.prototype.forEach.call(items, function (item) {
        item.style.width = parentSelector.clientWidth + "px";
      });
    } else {
      Array.prototype.forEach.call(items, function (item) {
        item.style.width = "";
      });
    }
  });

  window.dispatchEvent(new Event('resize'));
};

var confirmButton = function confirmButton() {
  var confirmButton = document.querySelector(".confirm-button");

  confirmButton.addEventListener('click', function () {
    document.querySelector(".filter-wrapper.has-opened").classList.remove("has-opened");
  });
};

var swipeSections = function swipeSections() {
  var buttons = document.querySelectorAll(".slide-button"),
      wrapper = document.querySelector(".filter-dropdown"),
      instance = document.querySelector(".filter-content"),
      confirmButton = document.querySelector(".confirm-button");

  var value = void 0,
      selectedItemId = void 0;

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      selectedItemId = parseInt(document.querySelector(".slide-number-selected").dataset.id);
      value = instance.clientWidth;
      if (button.classList.contains("next-button") && document.querySelector(".slide-number[data-id=\"" + (selectedItemId + 1) + "\"]")) {
        wrapper.style.marginLeft = (wrapper.style.marginLeft ? parseInt(wrapper.style.marginLeft) : 0) - value + "px";
        document.querySelector(".slide-number[data-id=\"" + selectedItemId + "\"]").classList.remove("slide-number-selected");
        document.querySelector(".slide-number[data-id=\"" + (selectedItemId + 1) + "\"]").classList.add("slide-number-selected");
        !document.querySelector(".slide-number[data-id=\"" + (selectedItemId + 2) + "\"]") ? button.classList.add("hidden") : button.classList.remove("hidden");
        document.querySelector(".prev-button").classList.remove("hidden");
        document.querySelector(".filter-dropdown-item[data-id=\"" + (selectedItemId + 1) + "\"]").classList.add("dropdown-item-next-selected");
        button.classList.remove("hidden");
        confirmButton.classList.add("hidden");
        if (document.querySelector(".filter-dropdown-item[data-id=\"" + (selectedItemId + 1) + "\"]").classList.contains("datepicker-wrap")) {
          document.querySelector(".filter-content").classList.add("filter-overflow-visibility");
        } else {
          document.querySelector(".filter-content").classList.remove("filter-overflow-visibility");
        }
        setTimeout(function () {
          document.querySelector(".filter-dropdown-item.dropdown-item-selected").classList.remove("dropdown-item-selected");
          document.querySelector(".filter-dropdown-item.dropdown-item-next-selected").classList.add("dropdown-item-selected");
          document.querySelector(".filter-dropdown-item.dropdown-item-next-selected").classList.remove("dropdown-item-next-selected");
        }, 600);
      }

      if (button.classList.contains("next-button") && !document.querySelector(".slide-number[data-id=\"" + (selectedItemId + 2) + "\"]")) {
        button.classList.add("hidden");
        confirmButton.classList.remove("hidden");
      }

      if (button.classList.contains("prev-button") && document.querySelector(".slide-number[data-id=\"" + (selectedItemId - 1) + "\"]")) {
        wrapper.style.marginLeft = (wrapper.style.marginLeft ? parseInt(wrapper.style.marginLeft) : 0) + value + "px";
        document.querySelector(".slide-number[data-id=\"" + selectedItemId + "\"]").classList.remove("slide-number-selected");
        document.querySelector(".slide-number[data-id=\"" + (selectedItemId - 1) + "\"]").classList.add("slide-number-selected");
        !document.querySelector(".slide-number[data-id=\"" + (selectedItemId - 2) + "\"]") ? button.classList.add("hidden") : button.classList.remove("hidden");
        document.querySelector(".next-button").classList.remove("hidden");
        document.querySelector(".filter-dropdown-item[data-id=\"" + (selectedItemId - 1) + "\"]").classList.add("dropdown-item-next-selected");
        confirmButton.classList.add("hidden");
        if (document.querySelector(".filter-dropdown-item[data-id=\"" + (selectedItemId - 1) + "\"]").classList.contains("datepicker-wrap")) {
          document.querySelector(".filter-content").classList.add("filter-overflow-visibility");
        } else {
          document.querySelector(".filter-content").classList.remove("filter-overflow-visibility");
        }
        setTimeout(function () {
          document.querySelector(".filter-dropdown-item.dropdown-item-selected").classList.remove("dropdown-item-selected");
          document.querySelector(".filter-dropdown-item.dropdown-item-next-selected").classList.add("dropdown-item-selected");
          document.querySelector(".filter-dropdown-item.dropdown-item-next-selected").classList.remove("dropdown-item-next-selected");
        }, 600);
      }
    });
  });
};

var mapType = function mapType() {
  var button = document.querySelector(".map-type-icon"),
      items = document.querySelectorAll(".map-type-content-item");

  button.addEventListener('click', function () {
    document.querySelector(".map-type-content").classList.toggle("has-opened");
	

  });

  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener('click', function () {
      document.querySelector(".map-type-content").classList.toggle("has-opened");
      item.classList.toggle("has-selected");
	var selected=$(item).attr("data-value");
	switch(selected)
	{
		case "weather":
			toggleWeather($(item).hasClass("has-selected"));
		break;
		case "people":
			toggleCrowd($(item).hasClass("has-selected"));
		break;
		case "traffic":
			toggleTraffic($(item).hasClass("has-selected"));
		break;
		case "event":
			toggleEvent($(item).hasClass("has-selected"));
		break;
	}
	
    });
  });
};

window.addEventListener('load', function () {
  mainFilterToggle();
  dropdownToggle();
  subDropdownToggle();
  optionSelection();
  selectBox();
  menuDropdown();
  toggleMenu();
  connectedItems();
  priceList();
  venueList();
  removeTagItem();
  quietOrLoud();
  calmOrActive();
  sizeForSections();
  swipeSections();
  confirmButton();
  mapType();
});

window.addEventListener('resize', function () {
  /* margin-left değerini kaldırıp en baştakine slide olmasını sağlıyor ve noktalardan birincisini seçiyor */
  document.querySelector(".filter-dropdown").style.marginLeft = "";
  document.querySelector(".slide-number.slide-number-selected").classList.remove("slide-number-selected");
  document.querySelector(".slide-number").classList.add("slide-number-selected");
  /* margin-left değerini kaldırıp en baştakine slide olmasını sağlıyor ve noktalardan birincisini seçiyor */
  document.querySelector(".filter-content").classList.remove("filter-overflow-visibility");
});