var isEqual = require('lodash/_baseIsEqual')
var filter = require('lodash/filter')

class PendingKeyboardEvent {

    keysToWatch = []
    keysCurrentlyBeingPressed = []
    _keyDownHandler
    _keyUpHandler
    _manager
    _stopAfterNextRun = false

    constructor(manager, ...keys) {
        this._manager = manager
        this.keysToWatch = keys
    }

    then(handler) {
        this.createKeyDownListener(event => {
            this.keysCurrentlyBeingPressed.push(event.key)

            if (!this.checkArraysHaveSameValuesRegardlessOfOrder(this.keysCurrentlyBeingPressed, this.keysToWatch)) {
                return
            }

            handler({
                keys: this.keysCurrentlyBeingPressed
            })

            if (!this._stopAfterNextRun) {
                return
            }

            this.stop()
        })

        this.createKeyUpListener(
            event => this.keysCurrentlyBeingPressed = filter(this.keysCurrentlyBeingPressed, key => key !== event.key)
        )

        return this
    }

    once() {
        this._stopAfterNextRun = true

        return this
    }

    stop() {
        this.removeKeyDownListener()
        this.removeKeyUpListener()
        this._manager._childStopped(this)
    }

    createKeyDownListener(eventHandler) {
        this._keyDownHandler = eventHandler
        document.addEventListener('keydown', this._keyDownHandler)
    }

    removeKeyDownListener() {
        if (!this._keyDownHandler) {
            return
        }

        document.removeEventListener('keydown', this._keyDownHandler)
    }

    createKeyUpListener(eventHandler) {
        this._keyUpHandler = eventHandler
        document.addEventListener('keyup', this._keyUpHandler)
    }

    removeKeyUpListener() {
        if (!this._keyUpHandler) {
            return
        }

        document.removeEventListener('keyup', this._keyUpHandler)
    }

    checkArraysHaveSameValuesRegardlessOfOrder(array1, array2) {
        if (!isEqual([...array1].sort(), [...array2].sort())) {
            return false
        }

        return array1.length === array2.length;
    }

}

module.exports = PendingKeyboardEvent