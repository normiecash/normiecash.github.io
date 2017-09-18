function loadNotSeen() {
    var notSeen = [
        'fastcompany',
        'forbes',
        'wired',
        'wsj',
    ];
    var rowSize = notSeen.length
    var rows = [];
    var goFor = Math.floor(notSeen.length / rowSize);

    for (i=0; i < goFor + 1; i++) {
        var tempRow = notSeen.slice(rowSize*i, rowSize*i + rowSize);
        rows[i] = tempRow;
    }

    rows.forEach(function(row, i) {
        var htmlRow = '<div class="row justify-content-center">';

        row.forEach(function(value, j) {
            var path = 'img/' + value + '.svg';
            htmlRow += '<div class="notseen-spacer">';
            htmlRow += '<img src="' + path + '" class="img-fluid desaturate normie-size">';
            htmlRow += '</div>';
        });

        htmlRow += '</div>';

        $('#notseen').append(htmlRow)
    });
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function loadCopyrightYear(){
    var date = new Date();
    var year = date.getFullYear();
    $('#copyright').text(year);
}

function loadMessages() {
    var messages = [
        "take back your future",
        "`while (true) { bankAccount += 1 };`",
        "weaponize honey bees",
        "realize gains",
        "setup trap house",
        "change careers",
        "support normie detection",
        "thwart the user",
        "pay penance for being a normie",
        "wing it",
        "bribe a fed",
    ];

    var message = messages[getRandomInt(0, messages.length)];

    $('#messages').text(message);
}

// init
$(function() {
    new Clipboard('.clippy');
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'bottom',
        title: 'Copied!',
        trigger: 'click',
    });

    loadCopyrightYear();
    loadNotSeen();
    setInterval(function() {
        loadMessages();
    }, 2000);
});

$('[data-toggle="tooltip"]').on('shown.bs.tooltip', function () {
    setTimeout(function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
    }, 1000);
})

console.log("nothing to see here, move along");

function decodeStats(response, price) {
    if (response == null) return null;

    var result = response.result;
    if (result == null || result.length == null || result.length < 193) return null;

    var weiPerEther = new BigNumber("1000000000000000000", 10);

    var totalContributionExact = new BigNumber(result.substr(2, 64), 16).div(weiPerEther);
    var totalContributionUSDExact = totalContributionExact.times(new BigNumber(price));

    return {
        totalContribution: totalContributionExact.round(3, BigNumber.ROUND_DOWN),
        totalContributionUSD: totalContributionUSDExact.round(0, BigNumber.ROUND_DOWN),
        totalContributionTVs: totalContributionUSDExact.div(new BigNumber("1200")).round(0, BigNumber.ROUND_DOWN),
        totalSupply: new BigNumber(result.substr(66, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        totalBonusTokensIssued: new BigNumber(result.substr(130, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        purchasingAllowed: new BigNumber(result.substr(194, 64), 16).isZero() == false
    };
}

function getStats(price) {
    var url = "https://api.etherscan.io/api?module=proxy&action=eth_call&to=0xbc7406c26a2ed08267d6daa298f0909752e264f4&data=0xc59d48470000000000000000000000000000000000000000000000000000000000000000&tag=latest";
    return $.ajax(url, {
        cache: false,
        dataType: "json"
    }).then(function (data) { return decodeStats(data, price); });
}

function getPrice() {
    var url = "https://api.etherscan.io/api?module=stats&action=ethprice";
    return $.ajax(url, {
        cache: false,
        dataType: "json"
    }).then(function (data) {
        if (data == null) return null;
        if (data.result == null) return null;
        if (data.result.ethusd == null) return null;

        return parseFloat(data.result.ethusd);
    });
}

function updatePage(stats) {
    if (stats == null) return;


    $("#total-ether").text(stats.totalContribution.toFixed(3));

    $("#total-usd").text("$" + stats.totalContributionUSD.toFixed(0));

    $("#total-tokens").text(stats.totalSupply.toFixed(3));

    $("#stats").show();
}

function refresh() { getPrice().then(getStats).then(updatePage); }

$(function() {
    try {
        refresh();
        setInterval(refresh, 1000 * 60 * 5);
    } catch (err) { }
});
