var PendingKeyboardEvent = require('./PendingKeyboardEvent')
var filter = require('lodash/filter')

class PendingKeyboardEventManager {

    registeredEvents = []

    register(...keys) {
        var event = new PendingKeyboardEvent(this, ...keys)
        this.registeredEvents.push(event)
        return event
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