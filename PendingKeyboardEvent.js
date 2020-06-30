class PendingKeyboardEvent {

    constructor(manager, ...keys) {
        this.keysCurrentlyBeingPressed = []
        this._keyDownHandler = null
        this._keyUpHandler = null
        this._stopAfterNextRun = false
        this._onlyFireOnDoublePress = false
        this._doublePressTimeout = 500
        this._pressCount = 0
        this._totalKeyDownCountForKeysToWatch = 0
        this._totalKeyUpCountForKeysToWatch = 0
        this._releasedHandler = null

        this._manager = manager
        this._pluginsManager = this._manager.pluginsManager
        this.keysToWatch = keys
    }

    then(handler) {
        this.createKeyDownListener(event => {
            this._storeKeyBeingPressed(event)

            if (!this.checkArraysHaveSameValuesRegardlessOfOrder(this.keysCurrentlyBeingPressed, this.keysToWatch)) {
                return
            }

            if (!this._shouldHandleOrSkipDoublePress()) {
                return
            }

            if (this._manager.focusedElement) {
                return
            }

            if (this._pluginsManager.handle('beforeBindingHandled', this.keysToWatch).includes(false)) {
                return this._resetPressCount()
            }

            handler({
                keys: this.keysCurrentlyBeingPressed
            })

            this._resetPressCount()
            this._totalKeyDownCountForKeysToWatch++

            this._pluginsManager.handle('afterBindingHandled', this.keysToWatch)

            if (!this._stopAfterNextRun) {
                return
            }

            this.stop()
        })

        this.createKeyUpListener(event => {
            this._removeReleasedKeyFromKeysBeingPressedArray(event)

            if (this.keysCurrentlyBeingPressed.length !== 0) {
                return
            }

            if (this._totalKeyDownCountForKeysToWatch <= this._totalKeyUpCountForKeysToWatch) {
                return
            }

            this._totalKeyUpCountForKeysToWatch = this._totalKeyDownCountForKeysToWatch

            if (!this._releasedHandler) {
                return
            }

            this._releasedHandler(event)
        })

        return this
    }

    do(handler) {
        return this.then(handler)
    }

    run(handler) {
        return this.then(handler)
    }

    whenReleased(handler) {
        this._releasedHandler = handler

        return this
    }

    _storeKeyBeingPressed(event) {
        if (this.keysToWatch.includes(event.code)) {
            return this.keysCurrentlyBeingPressed.push(event.code)
        }

        return this.keysCurrentlyBeingPressed.push(event.key)
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

    _removeReleasedKeyFromKeysBeingPressedArray(event) {
        this.keysCurrentlyBeingPressed = [...this.keysCurrentlyBeingPressed].filter(key => {
            return key !== event.key && key !== event.code
        })
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
        if (!this._arraysAreEqual(array1, array2)) {
            return false
        }

        return array1.length === array2.length;
    }

    _arraysAreEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }

        if (!array2.every(item => array1.includes(item))) {
            return false
        }

        if (!array1.every(item => array2.includes(item))) {
            return false
        }

        return true;
    }

}

module.exports = PendingKeyboardEvent