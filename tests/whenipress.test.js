const whenipress = require('./../whenipress')

afterEach(() => {
    whenipress().stopAll()
})

test('registers an event listener for the given alphanumeric', done => {
    let testHelpers = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-*()[]{}<>?\\|:;!@£$%^&'

    testHelpers.split('').forEach(letter => {
        whenipress(letter).then(e => {
            expect(e.keys).toEqual([letter])
            done()
        })

        press(letter)
    })
})

test('can be given multiple parameters for key combinations', done => {
    whenipress('a', 'b', 'c').then(e => {
        expect(e.keys).toEqual(['b', 'a', 'c'])
        done()
    })

    press('b', 'a', 'c')
})

test('can register multiple different key combinations that share similar keys', done => {
    var pressedKeys = []
    whenipress('g', 'h', 'i').then(e => pressedKeys.push(e.keys))
    whenipress('d', 't', 'o').then(e => pressedKeys.push(e.keys))

    press('g', 'h', 'i')
    press('d', 't', 'o')

    expect(pressedKeys[0]).toEqual(['g', 'h', 'i'])
    expect(pressedKeys[1]).toEqual(['d', 't', 'o'])
    done()
})

test('can fire multiple times', done => {
    eventFiredCount = 0

    whenipress('a').then(values => {
        eventFiredCount++

        if (eventFiredCount === 2) {
            done()
        }
    })

    press('a')
    press('a')
})

test('can cleanup event listeners', done => {
    eventFiredCount = 0

    var wip = whenipress('p').then(values => {
        eventFiredCount++
    })

    var otherWip = whenipress('o').then(e => {
    })

    expect(whenipress().bindings().length).toBe(2)

    press('p')
    press('p')

    wip.stop()

    press('p')

    expect(eventFiredCount).toBe(2)
    expect(whenipress().bindings().length).toBe(1)

    done()
})

test('can stop all event listeners', () => {
    eventFiredCount = 0

    whenipress('a', 'b', 'c').then(e => eventFiredCount++)
    whenipress('c', 'f', 'g').then(e => eventFiredCount++)

    press('a', 'b', 'c')
    press('a', 'b', 'c')
    press('c', 'f', 'g')
    press('c', 'f', 'g')

    whenipress().stopAll()

    press('a', 'b', 'c')
    press('a', 'b', 'c')
    press('c', 'f', 'g')
    press('c', 'f', 'g')

    expect(eventFiredCount).toBe(4)
    expect(whenipress().bindings().length).toBe(0)
})

test('can retrieve all registered bindings', () => {
    whenipress('n', 'e', 's').then(e => {
    })
    whenipress('l', 'i', 'h').then(e => {
    })

    expect(whenipress().bindings()).toEqual([['n', 'e', 's'], ['l', 'i', 'h']])
})

test('can listen for an event only once', () => {
    eventFiredCount = 0

    whenipress('z').then(e => eventFiredCount++).once()

    press('z')
    press('z')
    press('z')
    press('z')

    expect(eventFiredCount).toBe(1)
})

test('can place the once modifier anywhere in the chain', () => {
    eventFiredCount = 0

    whenipress('z').once().then(e => eventFiredCount++)

    press('z')
    press('z')
    press('z')
    press('z')

    expect(eventFiredCount).toBe(1)
})

test('only fires if the exact keys are being pressed', () => {
    eventFiredCount = 0

    whenipress('z', 'a').then(e => eventFiredCount++)

    press('z', 'c', 'a')

    expect(eventFiredCount).toBe(0)
})

test('it can have a grouped key modifier', () => {
    eventFiredCount = 0

    whenipress().group(['a', 'z'], () => {
        whenipress('b').then(e => eventFiredCount++)
        whenipress('c').then(e => eventFiredCount++)
    })

    press('b')
    press('c')
    press('a', 'b')
    press('a', 'c')
    press('a', 'c', 'z')
    press('a', 'b', 'z')

    expect(eventFiredCount).toBe(2)
})

test('a single string group modifier may be passed', () => {
    eventFiredCount = 0

    whenipress().group('Shift', () => {
        whenipress('b').then(e => eventFiredCount++)
        whenipress('c').then(e => eventFiredCount++)
    })

    press('b')
    press('c')
    press('Shift', 'b')
    press('Shift', 'c')

    expect(eventFiredCount).toBe(2)
})

test('it can listen for double taps', done => {
    eventFiredCount = 0

    whenipress('a').twiceRapidly().then(e => eventFiredCount++)

    press('a')
    press('a')

    press('a')
    setTimeout(e => {
        press('a')
        expect(eventFiredCount).toBe(1)
        done()
    }, 600)
})

test('the double tap timeout can be altered', done => {
    eventFiredCount = 0

    whenipress('a').twiceRapidly(300).then(e => eventFiredCount++)

    press('a')
    press('a')

    press('a')
    setTimeout(e => {
        press('a')
        expect(eventFiredCount).toBe(1)
        done()
    }, 350)
})

test('it can listen for keys release', () => {

    var keysPressed = false

    whenipress('a', 'b', 'c')
        .then(e => {
            keysPressed = true
        })
        .whenReleased(e => {
            keysPressed = false
        })

    expect(keysPressed).toBeFalsy()
    dispatchKeyDown('a')
    dispatchKeyDown('b')
    dispatchKeyDown('c')
    expect(keysPressed).toBeTruthy()
    dispatchKeyUp('a')
    expect(keysPressed).toBeTruthy()
    dispatchKeyUp('b')
    dispatchKeyUp('c')
    expect(keysPressed).toBeFalsy()

})

test('it will only fire the when released if the active shortcut was released', () => {
    var releasedEventFired = false

    whenipress('a')
        .then(e => {})
        .whenReleased(e => releasedEventFired = true)

    press('b')
    press('c', 'b', 'a')
    press('z')
    press('x')
    expect(releasedEventFired).toBeFalsy()

    press('a')
    expect(releasedEventFired).toBeTruthy()
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