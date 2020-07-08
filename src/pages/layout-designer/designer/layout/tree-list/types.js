import utils from '@/static/js/utils.js'
import { Types } from '../../types/index.js'

let types = Object.create(Types)

const formTypes = require.context('../../types/', true, /\/.*?\/tree-list\.js$/i)

formTypes.keys().forEach(key => {
    key.replace(/\/(.*?)\/tree-list\.js$/i, function (p, type) {
        type = utils.camelCase(type)
        types[type] = formTypes(key).default
    })
})

export default types
