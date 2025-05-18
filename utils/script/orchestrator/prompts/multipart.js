
const multipart = (n = 3, structure) => {

    return `
    You are given the structure of a story, and you task is to break it into ${n} chapters.
    
    For each chapter, I want to see:
    - title of the chapter
        . point 1
        . point 2
        . point 3
        . point 4
        . point 5
    
    
    The number of major points in a chapter don't have to reach 5 tho.

    The output should be just the chapters, and no extra commentary

    e.g:
    - title 1
     . pt1
     . pt2
     . pt3
    
    - title 2
    . pt1
    . pt2

    The structure: ${structure}

    `
}

const multipartSysMsg = `
You are an incredible story writer and today, you are given the structure of a stroy to turn it into a more a more direct layout.
`
export {
    multipart,
    multipartSysMsg
}