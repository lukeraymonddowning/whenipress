var isEqual = require('lodash/_baseIsEqual')
var filter = require('lodash/filter')

class PendingKeyboardEvent {

    keysToWatch = []
    keysCurrentlyBeingPressed = []
    _keyDownHandler
    _keyUpHandler
    _manager
    _pluginsManager
    _stopAfterNextRun = false
    _onlyFireOnDoublePress = false
    _doublePressTimeout = 500
    _pressCount = 0

    constructor(manager, ...keys) {
        this._manager = manager
        this._pluginsManager = this._manager.pluginsManager
        this.keysToWatch = keys
    }

    then(handler) {
        this.createKeyDownListener(event => {
            this.keysCurrentlyBeingPressed.push(event.key)

            if (!this.checkArraysHaveSameValuesRegardlessOfOrder(this.keysCurrentlyBeingPressed, this.keysToWatch)) {
                return
            }

            if (!this._shouldHandleOrSkipDoublePress()) {
                return
            }

            this._pluginsManager.handle('beforeBindingHandled', this.keysToWatch)
            handler({
                keys: this.keysCurrentlyBeingPressed
            })

            this._resetPressCount()

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

    _resetPressCount() {
        this._pressCount = 0
    }

    _shouldHandleOrSkipDoublePress() {
        if (!this._onlyFireOnDoublePress) {
            return true
        }

        this._pressCount++

        if (this._pressCount === 2) {
            return true
        }

        setTimeout(e => this._resetPressCount(), this._doublePressTimeout)

        return false
    }

    once() {
        this._stopAfterNextRun = true

        return this
    }

    twiceRapidly(timeout = 500) {
        this._onlyFireOnDoublePress = true
        this._doublePressTimeout = timeout

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