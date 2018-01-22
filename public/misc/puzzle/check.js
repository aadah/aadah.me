/* global $ location */

function getInput (num) {
  return $('input[id=answer' + num.toString() + ']')
}

function getAnswer (num) {
  var input = getInput(num)
  var ans = input.val()
  return ans
}

function setInputColor (num, correctBit) {
  var input = getInput(num)
  var color = correctBit === 1 ? 'green' : 'red'
  input.css('border-color', color)
}

function check () {
  var ans = [getAnswer(1), getAnswer(2), getAnswer(3)]

  $.post('check', {'ans': ans}, function (data) {
    if (typeof (data) === 'string') {
      location.pathname = '/misc/puzzle' + data
    } else {
      setInputColor(1, data[0])
      setInputColor(2, data[1])
      setInputColor(3, data[2])
    }
  })
}

$(window).load(function () {
  $('#solve').click(check)
})
