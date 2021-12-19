export const state = () => ({
  sideBarState: false
})

export const mutations = {
  sideBarState (state) {
    state.sideBarState = !state.sideBarState
  }
}

export const actions = {
  notify (_, { $buefy, message, type, position }) {
    if (!$buefy) { throw new Error('You should pass $buefy') }
    if (!message) { throw new Error('You should pass message') }
    if (!type) { type = 'danger' }
    if (!position) { position = 'bottom' }
    try {
      $buefy.notification.open({
        duration: 40000,
        message,
        type: `is-${type}`,
        position: `is-${position}`,
        queue: false,
        hasIcon: false
      })
    } catch (err) {
      throw new Error('Document Not Defined')
    }
  },
  toast (_, { $buefy, message, type, position }) {
    if (!$buefy) { throw new Error('You should pass $buefy') }
    if (!message) { throw new Error('You should pass message') }
    if (!type) { type = 'danger' }
    if (!position) { position = 'bottom' }
    try {
      $buefy.toast.open({ message, type: `is-${type}`, position: `is-${position}` })
    } catch (err) {
      throw new Error('Document Not Defined')
    }
  }
}
export const getters = {}
