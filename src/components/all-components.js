import _ from 'lodash'
import PZHello from './PZHello.vue'
import icon from './icon.vue'
import ToggleButton from './ToggleButton.vue'
import PanelConfigGameFolders from './PanelConfigGameFolders.vue'
import PanelSavedSnapshots from './PanelSavedSnapshots.vue'
import PanelFileDiffs from './PanelFileDiffs.vue'

const AllComps = {
  icon,
  PanelConfigGameFolders,
  PanelSavedSnapshots,
  PanelFileDiffs,
  PZHello,
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
