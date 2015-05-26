var $previewer = $("#previewer"),
	currentDeviceName = null,
    devices = {
		"phone": { width: 360, height: 660 },
		"phone-landscape": { width: 620, height: 400 },
		"tablet": { width: 808, height: 1204 },
		"tablet-landscape": { width: 1164, height: 848 },
		"desktop-medium": { width: 1320, height: 1004 },
		"desktop-large": { width: 1960, height: 1340 }
	};

function debounce(fn, delay) {
	var timer = null;
	return function () {
		var context = this, 
			args = arguments;

		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

function hashChange() {
    var deviceName = window.location.hash.slice(1);

    if (!deviceName || !devices[deviceName]) {
    	deviceName = "phone";
    }

	$previewer.attr("data-device", deviceName);

	$("nav a.active").removeClass("active");
	$("nav a[href=#" + deviceName + "]").addClass("active");
	currentDeviceName = deviceName;

	checkResize();
}

function checkResize() {
	var percentOfWidth = ($(window).width() - 80) / (devices[currentDeviceName].width),
		percentOfHeight = ($(window).height() - 130) / (devices[currentDeviceName].height),
		percentOfScreen = Math.min(percentOfHeight, percentOfWidth);

	if (percentOfScreen > 1) {
		$previewer.css("transform", "translateZ(0)");
	} else {
		$previewer.css("transform", "scale(" + percentOfScreen + ") translateZ(0)");
	}
}

$(".refresh").on('click', function () {
	var iframe = $previewer.find("iframe");

	iframe.attr("src", iframe.attr("src"));

	return false;
});

$("#address").keypress(function(e) {
    if(e.which == 13) {
		var iframe = $previewer.find("iframe"),
			address = $("#address").val();

		if (address.indexOf("http://") !== 0 && 
			address.indexOf("https://") !== 0 && 
			address.indexOf("file://") !== 0) {
			address = "http://" + address;
		}
		try {
			iframe.attr("src", address);
		} catch(e) {
			alert(e);
		}

		$("#address").val(address)
    }
});

$("#address").focus(function() {
		setTimeout(function () {
			$("#address").select();  
		}, 10);
	})
	.val($previewer.find("iframe").attr("src"))
	.focus();

$(window).on('hashchange', hashChange);
$(window).on('resize', debounce(checkResize));
$("#menu-toggle").on('click', function () {
	$(this).closest("nav").toggleClass("open");
	return false;
});
hashChange();
$previewer.show();