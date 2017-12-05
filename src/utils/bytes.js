
export const toBytes = function (text) {
  var data = []
  for (var i = 0; i < text.length; i++) {
    data.push(text.charCodeAt(i))
  }
  return data
}
