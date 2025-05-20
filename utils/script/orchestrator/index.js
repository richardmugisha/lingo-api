import sceneWriter from "../scene-writer/index.js"
import episodeWriter from "../episode-writer/executors/writer.js";
import Script from "../../../models/script.js"
import structureBuild from "../structure-writer/index.js"
import assetSaver from "../asset-saver/index.js";
import assetRetriever from "../asset-retriever/index.js";
import fs from 'fs';
import path from 'path';

const orchestractor = async (scriptID, epIdx) => {
    try {
        // Create logging directories
        // const logDirs = ['needed', 'all-assets', 'scene'];
        // const baseLogPath = path.join(process.cwd(), 'utils', 'script', 'assets', 'logs');
        
        // // Create base logs directory if it doesn't exist
        // if (!fs.existsSync(baseLogPath)) {
        //     fs.mkdirSync(baseLogPath);
        // }
        
        // // Create subdirectories
        // logDirs.forEach(dir => {
        //     const dirPath = path.join(baseLogPath, dir);
        //     if (!fs.existsSync(dirPath)) {
        //         fs.mkdirSync(dirPath);
        //     }
        // });

        const script = await Script.findById(scriptID) //|| await structureBuild()

        const assetLog = {
            people: script.assets.people.map(asset => asset.name),
            objects: script.assets.objects.map(asset => asset.name),
            places: script.assets.places.map(asset => asset.name),
            events: script.assets.events.map(asset => asset.name),
            abstract: script.assets.abstract.map(asset => asset.name),
        }

        const props = {
            script: script,
            episode: null,
            previousEpisode: null,
            act: null,
            scenes: null,
            scene: null,
            previousScene: null,
            assets: script.assets,
            assetLog
        }

        props.episode = props.script.episodes[epIdx]
        const acts = await episodeWriter(props)
        props.episode.acts = acts
        // return renderEpisode(props.episode)

        // Process each act in the episode
        for (const [actIndex, act] of props.episode.acts.entries()) {
            props.act = act
            props.scenes = act.scenes
            console.log('----')
            // Process each scene in the act
            for (const [sceneIndex, scene] of act.scenes.entries()) {
                props.scene = scene

                // Retrieve assets needed for this scene
                const neededAssets = await assetRetriever(props)
                props.neededAssets = neededAssets

                // console.log('logline: ', scene.logline)

                // console.log("needed: ", neededAssets)

                // Log needed assets
                // fs.writeFileSync(
                //     path.join(baseLogPath, 'needed', `${sceneIndex}.json`),
                //     JSON.stringify(neededAssets, null, 2)
                // );
                
                // Write the scene
                const [rawDevelopedScene, jsonDevelopedScene] = await sceneWriter(props)
                props.previousScene = rawDevelopedScene
                
                // Log the scene
                // fs.writeFileSync(
                //     path.join(baseLogPath, 'scene', `${sceneIndex}.json`),
                //     JSON.stringify({
                //         raw: rawDevelopedScene,
                //         json: jsonDevelopedScene
                //     }, null, 2)
                // );
                
                // Save any new assets from the scene
                await assetSaver(props, rawDevelopedScene)
                
                // Log the updated assets
                // fs.writeFileSync(
                //     path.join(baseLogPath, 'all-assets', `${sceneIndex}.json`),
                //     JSON.stringify(props.assets, null, 2)
                // );
                // console.log("assets: ", props.assets)
                props.scenes[sceneIndex].details = jsonDevelopedScene
                props.scenes[sceneIndex].raw = rawDevelopedScene

                // if (sceneIndex == 1) break
            }

            props.episode.acts[actIndex].scenes = props.scenes
            
            // break
        }

        props.episode.ready = true

        console.log('done', props.episode)

        script.episodes[epIdx] = props.episode
        script.assets = props.assets

        await script.save()
    
    } catch (error) {
        console.log(error.message)
    }
}


export default orchestractor

function renderEpisode(episode) {
    let output = '';
    
    // Add episode title and logline
    output += `EPISODE: ${episode.title}\n`;
    output += `Logline: ${episode.logline}\n\n`;
    
    // Process each act
    episode.acts.forEach((act, actIndex) => {
        output += `ACT ${actIndex + 1}: ${act.title}\n`;
        output += `Logline: ${act.logline}\n\n`;
        
        // Process each scene
        act.scenes.forEach((scene, sceneIndex) => {
            output += `SCENE ${sceneIndex + 1}: ${scene.title || `Scene ${sceneIndex + 1}`}\n`;
            output += `Logline: ${scene.logline}\n\n`;
            
            // Process scene details (narration and dialogue)
            if (scene.details && scene.details.length > 0) {
                scene.details.forEach(detail => {
                    if (detail.type === 'narration') {
                        output += `${detail.text}\n\n`;
                    } else if (detail.type === 'line') {
                        output += `${detail.character.toUpperCase()}\n${detail.text}\n\n`;
                    }
                });
            }
            
            output += '---\n\n';
        });
        
        output += '==========\n\n';
    });

    console.log(output)
    
    return output;
}