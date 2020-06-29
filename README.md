# whenipress
A gorgeous, simple, tiny JavaScript package to add keyboard bindings into your application.

## Table of Contents
* [Features](#features)
* [Installation](#installation)
* [Why use?](#why-use-whenipress)
* [Usage](#using-whenipress)
    - [Simple key presses](#listening-for-key-presses)
    - [Key combos](#listening-for-key-combinations)
    - [Stop listening for a single binding](#stop-listening-for-a-single-key-binding)
    - [Stop listening for all bindings](#stop-listening-for-all-key-bindings)
    - [Retrieve registered bindings](#retrieve-a-list-of-every-registered-key-binding)
    - [Listen for an event just once](#listening-for-an-event-just-once)
    - [Create keybinding groups](#creating-keybinding-groups)
    - [Listen for double taps](#listening-for-double-taps)
    - [Listen for keys being released](#listening-for-when-keys-are-released)
    

## Features
- A simple, intuitive syntax for adding keyboard shortcuts for key presses and key combinations.
- Takes the complexity out of key codes and values, allowing you to mix and match to your heart's content.
- Provides advanced functionality, such as listening for double tapping keys and only listening for a keyboard event once.
- Stores all your key bindings in one place, allowing you to have access to every binding in your application.
- Allows for key groups using the `group` function, making your code more readable and powerful.
- Provides a hook to be notified when a keyboard shortcut has been released.
- Includes a powerful plugin syntax for extending the base functionality of whenipress

## Installation
Whenipress is available via npm: `npm i whenipress`. 
You should then require it as a module in your main JavaScript file.

```javascript
import whenipress from 'whenipress/whenipress';

whenipress('a', 'b', 'c').then(e => console.log('Nice key combo!'));
```

But you can equally use it via a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/whenipress@1.2.0/dist/whenipress.js"></script>
<script>
whenipress('a', 'b', 'c').then(e => console.log('Nice key combo!'));
</script>
```

## Why use whenipress?
Keyboard shortcuts are often an add-on in most web applications. Why? Usually, because it can be pretty complicated to
add them in JavaScript. The `keydown` and `keyup` events are pretty low level stuff, and require a fair bit of abstraction
to make adding shortcuts a simple task. 

Say hello to whenipress. We've done all the abstraction for you, and provided the functionality you'll need in a
much simpler, easier to manage way. Getting started is as simple as calling the global `whenipress` method, passing
in the key-combo you want to listen for. Check out our guide below...

## Using whenipress
What follows is an in depth look at all the juicy functionality offered to you out of the box by whenipress. Enjoy!

### Listening for key presses
So, how do you get started? After you've installed the package using one of the methods described in the 'getting started'
section, you can get to registering your first keyboard shortcut. Let's imagine we want to register a shortcut on the '/'
key that will focus the global search bar in our web application. We've already set up a method, `focusGlobalSearchBar()`,
that will actually focus the input for us. We just need to wire it up to our shortcut. Check it out:

```javascript
whenipress('/').then(event => focusGlobalSearchBar())
```

### Listening for key combinations
And we're done. Yeah, it's that easy. However, that's also pretty easy to set up in vanilla JavaScript, right? What isn't
so easy to wire up are key combinations. There is no way in native JavaScript to listen for multiple keys at the same time.
Fret not, we have you covered here too. Let's imagine that, when the 'left control' key is pressed in combination with
the 'n' key, we want to redirect to a page where a new CRUD entry can be added. Once again, we've already set up a method,
`redirectToCreateForm()`, that will do the redirecting. Here's how we wire it up:

```javascript
whenipress('ControlLeft', 'n').then(event => redirectToCreateForm())
```

Pretty nice, right? We can pass any number of keys or key codes into the `whenipress` method to set up complex and
powerful shortcuts. 

### Stop listening for a single key binding
Sometimes, you'll want to disable a key binding. No problem! When you create the key binding, you'll be returned a 
reference to it. You can call the `stop` method on that reference at any time to stop listening.

```javascript
var nKeyPress = whenipress('n').then(e => console.log('You pressed n'));

nKeyPress.stop();
```

Even better, the related event listener will be completely removed from the DOM, keeping performance snappy.

### Stop listening for all key bindings
If you wish to stop listening for all registered key bindings, you can call the `stopAll` method on the global
`whenipress` instance.

```javascript
whenipress('A', 'B', 'C').then(e => console.log('Foo'));
whenipress('T', 'A', 'N').then(e => console.log('Bar'));

whenipress().stopAll();
```   

### Retrieve a list of every registered key binding
Because all key bindings are stored in a single location, it is possible to retrieve them programmatically at any time.
This is super useful in whenipress plugins, where you can't be sure which key bindings have been registered.

```javascript
    whenipress('n', 'e', 's').then(e => console.log('Foo'));
    whenipress('l', 'i', 'h').then(e => console.log('Bar'));

    whenipress().bindings() // Will return [['n', 'e', 's'], ['l', 'i', 'h']]
```  

### Listening for an event just once
Only want to register a key binding for a single press? Just add the `once` modifier!

```javascript
whenipress('z').then(e => console.log("z was pressed")).once();
```

The event listener will be removed the first time it is fired. You can place the `once` modifier before the `then`
call if you wish.

### Creating keybinding groups
Whenipress supports key groups for easily adding modifiers without having to repeat yourself over and over.

```javascript
whenipress().group('Shift', () => {
        whenipress('b').then(e => console.log('Shift + b pressed'));
        whenipress('c').then(e => console.log('Shift + c pressed'));
    });
```

### Listening for double taps
Want to listen for keys pressed twice in quick succession? We have you covered. You can even alter the timeout between
key presses.

```javascript
whenipress('a').twiceRapidly().then(e => console.log('You just double pressed the a key'));

// Use a 300ms timeout
whenipress('a').twiceRapidly(300).then(e => console.log('You just double pressed the a key'));
```

### Listening for when keys are released
The `then` callback you provide whenipress will be fired as soon as all keys in the binding are pressed down at the same
time. Sometimes, however, you'll want to listen for when the keys are released too. No sweat here!

```javascript
whenipress('a', 'b', 'c')
        .then(e => {
            console.log('Keys are depressed!');
        })
        .whenReleased(e => {
            console.log('Keys are released!');
        });
```

## Extending whenipress
Whenipress was created to be extended. Whilst it offers tons of functionality out of the box, it can 