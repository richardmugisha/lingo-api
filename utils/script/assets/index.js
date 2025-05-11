import fs from 'fs';

const fileReader = (path) => {
    try {
        const content = JSON.parse(fs.readFileSync(path, 'utf8'));
        return content;
    } catch (error) {
        console.error(`Error reading ${path}: ${error.message}`);
        return null;
    }
};

const loadStructure = () => fileReader('./utils/script/assets/structure.json');
const loadAssetLog = () => fileReader('./utils/script/assets/asset_log.json');
const loadAssetsStore = () => fileReader('./utils/script/assets/assets.json');

const loadAssets = (needs) => {
    const assets = loadAssetsStore();
    if (!assets) throw new Error("Failed to load assets");

    const itemAndContent = Object.entries(needs).map(
        ([item, path]) => [item, getValueByPath(assets, path)]
    );

    return Object.fromEntries(itemAndContent);
};


function getValueByPath(obj, path) {
    return path.split('/').reduce((acc, key) => acc?.[key] || null, obj);
}

const saveAssets = (guide, updatedAssets) => {
    const assets = loadAssetsStore();
    if (!assets) throw new Error("Failed to load assets");

    Object.entries(updatedAssets).forEach(([item, update]) => {
        const setter = updateValueByPath(assets, guide[item]);
        if (setter) {
            setter(update);
        }
    });

    fs.writeFileSync('./utils/script/assets/assets.json', JSON.stringify(assets, null, 4));

    updateAssetLog(guide);

}

function updateValueByPath(obj, path) {
    const pathArray = path.split('/');
    const lastKey = pathArray.pop();
    const parentPath = pathArray.reduce((acc, key) => acc?.[key], obj);
    
    if (!parentPath) return false;
    
    return function(value) {
        parentPath[lastKey] = value;
        return true;
    };
}

const updateAssetLog = (guide) => {
    const assetLog = loadAssetLog()
    if (!assetLog) throw new Error("Failed to load asset log");

    console.log(guide)

    Object.entries(guide).forEach(([_, path]) => {
        const pathArray = path.split('/');
        const lastKey = pathArray.pop();
        const parentPath = pathArray.reduce((acc, key) => acc?.[key], assetLog);
        console.log(path)
        console.log(parentPath, typeof parentPath)
        if (parentPath && !parentPath.includes(lastKey)) {
            parentPath.push(lastKey);
        }
    });

    fs.writeFileSync('./utils/script/assets/asset_log.json', JSON.stringify(assetLog, null, 4));
}

const extractKeyDetails = (structure, epIndex, actIndex, sceneIndex) => {
    const episode = structure.episodes[epIndex]
    const act = episode.acts[actIndex]
    const scenes = act.scenes
    const scene = scenes[sceneIndex]
    const words = scene.words

    return { episode, act, scenes, scene, words }
}

export {
    loadStructure,
    loadAssetLog,
    loadAssets,
    extractKeyDetails,
    saveAssets
};
