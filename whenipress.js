var PendingKeyboardEventManager = require('./PendingKeyboardEventManager')

const manager = new PendingKeyboardEventManager();

function whenipress(...keys) {
    if (keys.length === 0) {
        return manager
    }

    return manager.register(...keys);
}

module.exports = whenipress