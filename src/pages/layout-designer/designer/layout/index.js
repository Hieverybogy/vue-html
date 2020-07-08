export default async function layoutProxy (layout, applyType, callback) {
    let layoutModule
    switch (layout + '-' + applyType) {
        // case 'form-web':
        //     layoutModule = await import('./form/index.js')
        //     callback(layoutModule.default)
        //     break
        // case 'list-web':
        //     layoutModule = await import('./list/index.js')
        //     callback(layoutModule.default)
        //     break
        // case 'tree-list-web':
        //     layoutModule = await import('./tree-list/index.js')
        //     callback(layoutModule.default)
        //     break
        case 'online-form-web':
            layoutModule = await import('./online-form/index.js')
            callback(layoutModule.default)
            break
        case 'online-list-web':
            layoutModule = await import('./online-list/index.js')
            callback(layoutModule.default)
            break
        case 'flow-form-web':
            layoutModule = await import('./flow-form/index.js')
            callback(layoutModule.default)
            break
    }
}
