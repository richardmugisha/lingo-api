// import fs from 'fs';

// const fileReader = (path) => {
//     try {
//         const content = JSON.parse(fs.readFileSync(path, 'utf8'));
//         return content;
//     } catch (error) {
//         console.error(`Error reading ${path}: ${error.message}`);
//         return null;
//     }
// };

// const loadStructure = () => fileReader('./utils/script/assets/structure.json');
// const loadAssetLog = () => fileReader('./utils/script/assets/asset_log.json');
// const loadAssetsStore = () => fileReader('./utils/script/assets/assets.json');

const loadAssets = (needs, assets) => {
    if (!assets) throw new Error("Failed to load assets");

    const itemAndContent = Object.entries(needs).map(
        ([item, tag]) => [item, getValueByPath(assets, tag, item)]
    );

    return Object.fromEntries(itemAndContent);
};


function getValueByPath(obj, tag, item) {
    return obj[tag]?.find(asset => asset.name === item)
}

const saveAssets = (guide, updatedAssets, assets) => {
    Object.entries(updatedAssets).forEach(([item, update]) => {
        updateValueByPath(assets, guide, item, update);
    });

}

function updateValueByPath(assets, guide, item, update) {
    const tag = guide[item]
    const assetGroup = assets[tag]
    const asset = assetGroup.find(asset => asset.name === item.name)
    if (asset) {
        const assetIndex = assetGroup.indexOf(asset)
        assets[guide[item]][assetIndex] = update
    } else {
        assets[guide[item]].push(update)
    }
}


export {
    loadAssets,
    saveAssets
};
