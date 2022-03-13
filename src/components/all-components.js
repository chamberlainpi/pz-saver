import _ from 'lodash'
import icon from './icon.vue'
import ToggleButton from './ToggleButton.vue'
import PanelConfigGameFolders from './PanelConfigGameFolders.vue'
import PanelTimedSnapshot from './PanelTimedSnapshot.vue'
import PanelSavedSnapshots from './PanelSavedSnapshots.vue'

// Man do we ever need wildcard * imports in JS.....FUUUUUUUUU@#$%&^^%&!!!
const AllComps = {
  icon,
  PanelConfigGameFolders,
  PanelTimedSnapshot,
  PanelSavedSnapshots,
  ToggleButton,
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
