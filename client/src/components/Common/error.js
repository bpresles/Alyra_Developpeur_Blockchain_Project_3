export const getRPCErrorMessage = (err) => {
    var open = err.stack.indexOf('{')
    var close = err.stack.lastIndexOf('}')
    var j_s = err.stack.substring(open, close + 1);
    var j = JSON.parse(j_s);

    var reason
    if (typeof j.data === 'object') {
        var data = j.data[Object.keys(j.data)[0]];

        // Sometimes the reason key is absent.
        reason = data.reason;
    }

    if (!reason) {
        var regexReason = /reason string ['](.+)[']/
        var regexResult = regexReason.exec(data)

        if (regexResult && regexResult.length > 1) {
            reason = regexResult[1]
        } else {
            if (j && j.originalError && j.originalError.message) {
                reason = j.originalError.message
            } else if (j && j.message) {
                reason = j.message
            } else {
                reason = 'Unknown error'
            }
        }
    }

    return reason;
}