import _ from 'lodash'
import PZHello from './PZHello.vue'

const AllComps = {
  PZHello,
}

export default {
  install(vue, opts) {
    const registered = []
    _.forOwn(AllComps, (comp, compName) => {
      vue.component(compName, comp)
      registered.push(compName)
    })

    trace('VUE - Registered: ', registered.join(' '))
  },
}
