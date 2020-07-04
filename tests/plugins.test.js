const whenipress = require('./../whenipress')
const PendingKeyboardEvent = require('./../PendingKeyboardEvent')

afterEach(() => {
    whenipress().stopAll()
    whenipress().flushPlugins()
})

test('it can be notified of when a new binding is registered', done => {
    const examplePlugin = {
        bindingRegistered: (binding, globalInstance) => {
            expect(binding).toBeInstanceOf(PendingKeyboardEvent)
            expect(binding.keysToWatch).toEqual(['a'])
            expect(globalInstance.bindings().length).toBe(1)
            done()
        }
    }

    whenipress().use(examplePlugin)

    whenipress('a').then(e => {})
})

test('it can be notified of when all bindings are stopped', done => {
    const plugin = {
        allBindingsStopped: globalInstance => {
            expect(globalInstance.bindings().length).toBe(0)
            done()
        }
    }

    whenipress().use(plugin)

    whenipress('a').then(e => {})
    expect(whenipress().bindings().length).toBe(1)
    whenipress().stopAll()
})

test('it may be notified of when a single binding is stopped', done => {
    const plugin = {
        bindingStopped: (keys, globalInstance) => {
            expect(keys).toBeInstanceOf(PendingKeyboardEvent)
            expect(keys.keysToWatch).toEqual(['a'])
            expect(globalInstance.bindings().length).toBe(0)
            done()
        }
    }

    whenipress().use(plugin)

    let binding = whenipress('a').then(e => {})
    expect(whenipress().bindings().length).toBe(1)
    binding.stop()
})

test('it may hook in directly before an event handler', () => {
    var eventFiredCount = 0
    var beforeHandled = false

    const plugin = {
        beforeBindingHandled: (keys, globalInstance) => {
            expect(keys).toBeInstanceOf(PendingKeyboardEvent)
            expect(keys.keysToWatch).toEqual(['a'])
            expect(eventFiredCount).toBe(0)
            beforeHandled = true
        }
    }

    whenipress().use(plugin)
    whenipress('a').then(e => eventFiredCount++)

    press('a')
    expect(eventFiredCount).toBe(1)
    expect(beforeHandled).toBeTruthy()
})

test('the pre event handler hook may interrupt the handler', () => {
    var eventFiredCount = 0
    var beforeHandled = false

    const plugin = {
        beforeBindingHandled: (keys, globalInstance) => {
            expect(eventFiredCount).toBe(0)
            beforeHandled = true

            return false
        }
    }

    whenipress().use(plugin)
    whenipress('a').then(e => eventFiredCount++)

    press('a')
    expect(eventFiredCount).toBe(0)
    expect(beforeHandled).toBeTruthy()
})

test('it may hook into the post event handler', () => {
    var eventFiredCount = 0
    var postHandled = false

    const plugin = {
        afterBindingHandled: (keys, globalInstance) => {
            expect(keys).toBeInstanceOf(PendingKeyboardEvent)
            expect(keys.keysToWatch).toEqual(['a'])
            expect(eventFiredCount).toBe(1)
            postHandled = true
        }
    }

    whenipress().use(plugin)
    whenipress('a').then(e => eventFiredCount++)

    press('a')
    expect(eventFiredCount).toBe(1)
    expect(postHandled).toBeTruthy()
})

test('it can hook into the constructor', () => {
    var eventFiredCount = 0

    const plugin = {
        mounted: globalInstance => {
            globalInstance.register('a').then(e => eventFiredCount++)
        }
    }

    whenipress().use(plugin)

    press('a')

    expect(eventFiredCount).toBe(1)
})

test('a plugin may omit options', () => {
    const examplePlugin = {}

    whenipress().use(examplePlugin)

    whenipress('a').then(e => {})

    expect(whenipress().pluginsManager.plugins.length).toBe(1)
})

test('multiple plugins may be registered', () => {
    var pluginCalledCount = 0

    const examplePlugin = {
        bindingRegistered: (binding, globalInstance) => {
            pluginCalledCount++
        }
    }

    whenipress().use(examplePlugin, examplePlugin)

    whenipress('a').then(e => {})

    expect(pluginCalledCount).toBe(2)
})

test('plugins may be cleared', () => {
    whenipress().use({})

    expect(whenipress().pluginsManager.plugins.length).toBe(1)

    whenipress().flushPlugins()

    expect(whenipress().pluginsManager.plugins.length).toBe(0)
})

test('plugins may allow users to specify custom options', () => {
    var eventFiredCount = 0

    const plugin = {
        mounted: (globalInstance, self) => {
            globalInstance.register(self.options.binding).then(e => self.options.handler(e))
        },
        options: {
            binding: 'a',
            handler: e => eventFiredCount++
        }
    }

    whenipress().use(plugin)
    press('a')

    whenipress().flushPlugins()
    whenipress().use(whenipress().pluginWithOptions(plugin, { binding: 'b' }))
    press('b')

    expect(eventFiredCount).toBe(2)
})

function press(...keys) {
    keys.forEach(key => dispatchKeyDown(key))
    keys.forEach(key => dispatchKeyUp(key))
}

function dispatchKeyDown(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}))
}

function dispatchKeyUp(key) {
    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
}