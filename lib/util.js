var counter = -1;

var pad = function(d) {
  return d < 10 ? '0' + d : d;
};

exports.getTime = function(isSeries) {
  var date = new Date();
  var year = date.getFullYear();
  var month = pad((date.getMonth() + 1));
  var day = pad(date.getDate());
  var hour = pad(date.getHours());
  var minute = pad(date.getMinutes());
  var seconds = pad(date.getSeconds());

  return (isSeries ? (++counter) +'-' : '') + seconds +'' + minute + '' +
    hour + '-' + day + '-' + month + '-' + year;
};
