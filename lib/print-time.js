module.exports = function printTime (date) {
  var hours = date.getHours().toString()
  while (hours.length < 2) hours = `0${hours}`

  var minutes = date.getMinutes().toString()
  while (minutes.length < 2) minutes = `0${minutes}`

  return `${hours}:${minutes}`
}
