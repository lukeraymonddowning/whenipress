var PendingKeyboardEvent = require('./PendingKeyboardEvent')
var filter = require('lodash/filter')

class PendingKeyboardEventManager {

    registeredEvents = []
    modifiers = []

    register(...keys) {
        var event = new PendingKeyboardEvent(this, ...[...this.modifiers, ...keys])
        this.registeredEvents.push(event)
        return event
    }

    group(keys, handler) {
        this.modifiers = typeof keys === 'string' ? [keys] : keys
        handler()
        this.modifiers = []
    }

    bindings() {
        return this.registeredEvents.map(event => event.keysToWatch)
    }

    stopAll() {
        this.registeredEvents.forEach(event => event.stop())
        this.registeredEvents = []
    }

    _childStopped(child) {
        this.registeredEvents = filter(this.registeredEvents, event => event !== child)
    }

}

module.exports = PendingKeyboardEventManager