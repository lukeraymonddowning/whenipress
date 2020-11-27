class PendingKeyboardEvent {

    constructor(manager, ...keys) {
        this.scope = null
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
        this.handleEvenOnForms = false

        this._manager = manager
        this._pluginsManager = this._manager.pluginsManager
        this.keysToWatch = keys
    }

    whileFocusIsWithin(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element)
        }

        this.scope = element

        return this
    }

    then(handler) {
        this.createKeyDownHandler(handler)
        this.createKeyUpHandler()

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

    evenOnForms() {
        this.handleEvenOnForms = true

        return this
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
        this._manager._childStopped(this)
    }

    createKeyDownHandler(handler) {
        this._keyDownHandler = event => {
            this._storeKeyBeingPressed(event)

            if (!this._isInScope(event.target)) {
                return
            }

            if (!this._arraysAreEqual(this.keysCurrentlyBeingPressed, this.keysToWatch)) {
                return
            }

            if (!this._shouldHandleOrSkipDoublePress()) {
                return
            }

            if (this._pluginsManager.handle('beforeBindingHandled', this).includes(false)) {
                return this._resetPressCount()
            }

            handler({
                keys: this.keysCurrentlyBeingPressed,
                nativeEvent: event,
            })

            this._resetPressCount()
            this._totalKeyDownCountForKeysToWatch++

            this._pluginsManager.handle('afterBindingHandled', this)

            this._stopAfterNextRun && this.stop()
        }
    }

    _isInScope(element) {
        if (!this.handleEvenOnForms && this._isUserInput(element)) {
            return false
        }

        if (this.scope) {
            return this.scope.isSameNode(element) || this.scope.contains(element)
        }

        return true
    }

    _isUserInput(element) {
        return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
    }

    createKeyUpHandler() {
        this._keyUpHandler = event => {
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
        }
    }

    _arraysAreEqual(array1, array2) {
        return array1.length === array2.length && array2.every(item => array1.includes(item))
    }

}

module.exports = PendingKeyboardEvent