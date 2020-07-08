import draggable from 'vuedraggable'

if (!draggable.provide) {
    // 往子组件注入属性
    draggable.provide = function () {
        return {
            draggable: this
        }
    }

    draggable.inject = {
        parentDraggable: {
            from: 'draggable',
            default: null
        }
    }
}

export default draggable
