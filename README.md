# whenipress
A gorgeous, simple, tiny JavaScript package to add keyboard bindings into your application.

## Table of Contents
* [Features](#features)
* [Installation](#installation)
* [Why use?](#why-use-whenipress)
* [Usage](#using-whenipress)
    - [Simple key presses](#listening-for-key-presses)
    - [Key combos](#listening-for-key-combinations)
    - [Alternatives to `then`](#alternatives-to-then)
    - [Stop listening for a single binding](#stop-listening-for-a-single-key-binding)
    - [Stop listening for all bindings](#stop-listening-for-all-key-bindings)
    - [Retrieve registered bindings](#retrieve-a-list-of-every-registered-key-binding)
    - [Listen for an event just once](#listening-for-an-event-just-once)
    - [Create keybinding groups](#creating-keybinding-groups)
    - [Listen for double taps](#listening-for-double-taps)
    - [Listen for keys being released](#listening-for-when-keys-are-released)
    - [Keybindings and form elements](#keybindings-and-form-elements)
* [Extending whenipress](#extending-whenipress)
    - [Registering plugins](#registering-plugins)
    - [Plugin syntax](#plugin-syntax)
        * [Initialising your plugin](#initialising-your-plugin)
        * [Listen for new bindings](#listen-for-when-a-new-binding-is-registered)
        * [Listen for a stopped binding](#listen-for-when-a-binding-is-stopped)
        * [Listen for when all bindings are stopped](#listen-for-when-all-bindings-are-stopped)
        * [Hook in before a handler is fired](#hook-in-before-an-event-is-handler-is-fired)
        * [Hook in after a handler is fired](#hook-in-after-an-event-has-been-handled)
        * [Plugin options](#plugin-options)
        * [Stopping plugins](#stopping-plugins)
    

## Features
- A simple, intuitive syntax for adding keyboard shortcuts for key presses and key combinations.
- Takes the complexity out of key codes and values, allowing you to mix and match to your heart's content.
- Teeny and tiny and dependency free - just 1.4kB minified & gzipped.
- Stores all of your keyboard combinations under a single keydown and keyup listener, improving your app's performance.
- Provides advanced functionality, such as listening for double tapping keys and only listening for a keyboard event once.
- Stores all your key bindings in one place, allowing you to have access to every binding in your application.
- Allows for key groups using the `group` function, making your code more readable and powerful.
- Provides a hook to be notified when a keyboard shortcut has been released.
- Includes a powerful plugin syntax for extending the base functionality of whenipress.

## Installation
Whenipress is available via npm: `npm i whenipress`. 
You should then require it as a module in your main JavaScript file.

```javascript
import whenipress from 'whenipress/whenipress';

whenipress('a', 'b', 'c').then(e => console.log('Nice key combo!'));
```

But you can equally use it via a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/whenipress@1.6.0/dist/whenipress.js"></script>
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

### Alternatives to `then`
Because `then` is used in JavaScript promises, some of you may wish to use a different syntax to avoid any confusion.
Whenipress aliases `then` to `do` and `run`, so you can use those instead if you prefer.

```javascript
// This...
whenipress('a').then(e => alert('e pressed!'))

// Is the same as this...
whenipress('a').do(e => alert('e pressed!'))

// And this...
whenipress('a').run(e => alert('e pressed!'))
```

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
            console.log('Keys are pressed!');
        })
        .whenReleased(e => {
            console.log('Keys are released!');
        });
```

### Keybindings and form elements
By default, whenipress will ignore keybindings on form elements like inputs, textareas, and select boxes so that you
don't have unexpected side effects in your application. To overrride this functionality and cause a keybinding to 
fire even on these form elements, you may tag `evenOnForms` on to the end of your binding registration.

```javascript
whenipress('LeftShift', 'KeyA').then(e => alert("I work, even in inputs, textareas and selects!")).evenOnForms()
```

## Extending whenipress
Whenipress was created to be extended. Whilst it offers tons of functionality out of the box, it can do so much more with a plugin.
What follows is a brief guide on how to get started creating your own plugins for whenipress.

> Created a great plugin that you think would benefit the community? Create an issue for it and we'll link you here!

### Registering plugins
To register a plugin in your application, whenipress provides a `use` method.

```javascript
import whenipress from 'whenipress/whenipress'
import plugin from 'awesomeplugin/plugin'
import anotherPlugin from 'thegreatplugin/plugin'

whenipress().use(plugin, anotherPlugin)
```

### Plugin syntax
Whenipress plugins are essentially JSON objects. The properties on that JSON object will be called by whenipress during 
different stages of the process, allowing you to hook in and perform any functionality you can think of. You do not
need to include every hook, only the ones you're interested in using for your plugin.

What follows is a list of available hooks.

#### Initialising your plugin
If you need to perform a setup step in your plugin, you should use the `mounted` hook. It is called when your plugin
is first registered by the user. This receives the global `whenipress` instance as a parameter.
You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    mounted: globalInstance => {
        alert('Hello world!')
        globalInstance.register('a', 'b', 'c').then(e => alert('You pressed a, b and  c'))                            
    }
}
```

Note that in a plugin, we can register new keyboard bindings using the `register` method on the globalInstance.

#### Listen for when a new binding is registered
If you want to be notified every time a new key combination is registered with whenipress, you can use the `bindingRegistered`
hook. It will receive the binding that was registered as the first parameter and the global `whenipress` instance as the second
parameter. You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    bindingRegistered: (binding, globalInstance) => {
        alert(`I'm now listening for any time you press ${binding.join(" + ")}.`)
    }
}
```

Note that it is not guaranteed the user has initialised your plugin prior to creating their bindings. If you need to ensure
you have all bindings, you should iterate over registered bindings in your plugin's mounted method. 

#### Listen for when a binding is stopped
If you wish to be notified of when a binding has been removed from whenipress, you can use the `bindingStopped` hook.
It will receive the binding that was stopped as the first parameter and the global `whenipress` instance as the second
parameter. You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    bindingStopped: (binding, globalInstance) => {
        alert(`You are no longer listening for ${binding.join(" + ")}.`)
    }
}
```

#### Listen for when all bindings are stopped
To be informed when all bindings in the application are stopped, you should use the `allBindingsStopped` hook. 
This receives the global `whenipress` instance as a parameter.
You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    allBindingsStopped: globalInstance => {
        alert(`Do not go gently into that good night...`)
    }
}
```

#### Hook in before an event is handler is fired
It may be useful to perform an action just before a keyboard shortcut is handled. Say hello to the `beforeBindingHandled` hook.
It will receive the binding that is to be handled as the first parameter and the global `whenipress` instance as the second
parameter. You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    beforeBindingHandled: (binding, globalInstance) => {
        alert(`You just pressed ${binding.join(" + ")}, but I got here first.`)
    }
}
```

You can actually prevent the handler from ever firing by returning `false` in you hook. This is useful if your plugin
adds conditional functionality.

```javascript
const myPlugin = {
    beforeBindingHandled: (binding, globalInstance) => {
        if (userHasDisabledKeyboardShortcuts()) { 
            return false; 
        }
    }
}
```

#### Hook in after an event has been handled
You may wish to know when a keyboard binding has been handled. You can use the `afterBindingHandled` hook for this.
It will receive the binding that has been handled as the first parameter and the global `whenipress` instance as the second
parameter. You should use this in your plugin instead of calling `whenipress` as the end user may have aliased `whenipress` under
a different name.

```javascript
const myPlugin = {
    afterBindingHandled: (binding, globalInstance) => {
        alert(`You just pressed ${binding.join(" + ")}. It has been handled, but now I'm going to do something as well.`)
    }
}
```

#### Plugin options
Whenipress provides a unified method of handling custom options to users of your plugin. To do so, register an `options`
field in your plugin JSON.

```javascript
const myPlugin = {
    options: {
        urlsToSkip: [],
        skipAllUrls: false                        
    }
}
```

Now, when your plugin is registered, these options can be overridden by the user.

```javascript
import whenipress from 'whenipress/whenipress'
import myPlugin from 'awesomeplugin/myPlugin'

whenipress().use(whenipress().pluginWithOptions(myPlugin, { skipAllUrls: true }))
```

#### Stopping plugins
If you wish to stop all plugins running, you may use the `flushPlugins` method.

```javascript
whenipress().flushPlugins()
```