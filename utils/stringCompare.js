function findClosestStringByLength(inputString, stringList) {
    // console.log('....string comparison', inputString, stringList)
    try {
        const initialClosest = stringList[0]
        const initialDist = Math.abs(inputString.length - initialClosest.word.length)

        const [overallDist, overallClosest] = stringList.reduce(([oldDist, oldClosest], currWordObj) => {
            const newDist = Math.abs(currWordObj.word.length - inputString.length)
            return newDist < oldDist ? [newDist, currWordObj] : [oldDist, oldClosest]
            }, [initialDist, initialClosest]
        )
        // console.log('....string comparison done', inputString, overallClosest.word)
        return overallClosest
    } catch (error) {
        console.log(error)
        return stringList[0]
    }
    
}

module.exports = {
    closestStringByLength: findClosestStringByLength
}