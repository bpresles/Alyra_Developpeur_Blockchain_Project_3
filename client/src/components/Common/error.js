export const getRPCErrorMessage = (err) => {
    var open = err.stack.indexOf('{')
    var close = err.stack.lastIndexOf('}')
    var j_s = err.stack.substring(open, close + 1);
    var j = JSON.parse(j_s);
    var data = j.data[Object.keys(j.data)[0]];

    // Sometimes the reason key is absent.
    var reason = data.reason;
    if (!reason) {
        var regexReason = /reason string ['](.+)[']/
        var regexResult = regexReason.exec(data)
        console.log(regexResult)
        reason = regexResult[1]
    }

    return reason;
}