function loadNotSeen() {
    var rowSize = 5
    var notSeen = [
        'fastcompany',
        'forbes',
        'wired',
        'wsj',
    ];

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
    ];

    var message = messages[getRandomInt(0, messages.length)];

    return message;
}

$(function() {
    loadNotSeen();
    $('#messages').text(loadMessages());
    setInterval(function() {
        $('#messages').text(loadMessages());
    }, 2000);
});
