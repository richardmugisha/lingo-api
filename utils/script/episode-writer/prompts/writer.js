

const writer = (assets, script, previousEpisode, currentEpisode) => `
Context:
- story theme: ${script.theme}
- episodes: ${script.episodes.map(ep => ep.logline)}
- previous episode: ${JSON.stringify(previousEpisode?.logline)}
- The episode to develop: ${JSON.stringify(currentEpisode)}
- words (Have to be used at some point in spoken lines of the scene)
    !! The usage of these words should be logical to show the student how such a word is used in practical contexts.
    words: ${currentEpisode.words}

- act 1: act log line
        - scene 1 [chosen one or few words from the word lsit]: scene log line
        - scene 2 [chosen words]: scene log line
        - scene 3 [chosen words]: scene log line

- act 2: act log line
    ...
    ...
- act 3: ..

Typical json output:
{
    acts: [
        {
            title
            logline
            words: [chosen set out of the word set put aside for this episode] // this set has to come from that set (it's a requirement)
            scenes: [
                {
                    logline,
                    words[]
                }
                ...,
                ...
            ]
        },
        {...},
        {...}
    ]
}


`

const writerSysMsg = `
You are master episode writer inside a script writing machine. Your job is use the context given to you to craft the best episode that flows well within the script
`

export {
    writer,
    writerSysMsg
}