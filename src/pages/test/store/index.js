import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        count: 1
    },
    getters:{
        getStateCount(state) {
            return state.count + 1
        }
    },
    mutations: {
        add(state) {
            state.count = state.count + 1
        },
        reduct(state) {
            state.count = state.count - 1
        }
    },
    actions: {
        addfn (context) {
            context.commit('add')
        },
        reductfn(context) {
            context.commit('reduct')
        }
    }
})

export default store
