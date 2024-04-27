var { distance } = require("fastest-levenshtein");
function recursiveFuzzyIndexOf(text, query, start = 0, end = null, parentDistance = Infinity) {
    if (end === null) end = text.length;
    console.log([text.substr(start,end), end - start, 2 * query.length])
    if (end - start <= 2 * query.length) {
        console.log('iterative')
        return iterativeReduction(text, query, start, end, parentDistance);
    }
    let midPoint = start + Math.floor((end - start) / 2);
    let leftEnd = Math.min(end, midPoint + query.length); // Include query length to cover overlaps
    let rightStart = Math.max(start, midPoint - query.length); // Include query length to cover overlaps
    // Calculate distance for current segment
    let leftDistance = distance(text.substring(start, leftEnd), query);
    let rightDistance = distance(text.substring(rightStart, end), query);
    let bestDistance = Math.min(leftDistance, parentDistance, rightDistance);
    let bestIndex = start; // Start is tentative, improved below
    if (parentDistance === bestDistance) return iterativeReduction(text, query, start, end, parentDistance);
    // Calculate distance for left and right halves
    if(leftDistance < rightDistance) {
        return recursiveFuzzyIndexOf(text, query, start, leftEnd, bestDistance);
    } else {
        return recursiveFuzzyIndexOf(text, query, rightStart, end, bestDistance);
    }
}
function iterativeReduction(text, query, start, end, parentDistance) {
    let bestDistance = parentDistance;
    let bestStart = start;
    let bestEnd = end;
    let nextDistance = distance(text.substring(bestStart + 1, bestEnd), query);

    while(nextDistance < bestDistance) {
        bestDistance = nextDistance;
        bestStart++;
        const smallerString = text.substring(bestStart + 1, bestEnd);
        nextDistance = distance(smallerString, query);
        console.log(smallerString, nextDistance, bestDistance)
    }

    nextDistance = distance(text.substring(bestStart, bestEnd - 1), query);

    while (nextDistance < bestDistance) {
        bestDistance = nextDistance;
        bestEnd--;
        const smallerString = text.substring(bestStart, bestEnd - 1);
        nextDistance = distance(smallerString, query);
        console.log(smallerString, nextDistance, bestDistance)
    }
    return { start: bestStart, end: bestEnd, value: text.substring(bestStart, bestEnd),distance: bestDistance };
}

module.exports = recursiveFuzzyIndexOf;