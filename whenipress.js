var PendingKeyboardEventManager = require('./PendingKeyboardEventManager')

const manager = new PendingKeyboardEventManager();

window.whenipress = (...keys) => {
    if (keys.length === 0) {
        return manager
    }

    return manager.register(...keys);
}

module.exports = whenipress