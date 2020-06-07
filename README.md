# whenipress
A gorgeous, simple, tiny JavaScript package to add keyboard bindings into your application.

## Features
- A simple, intuitive syntax for adding keyboard shortcuts for key presses and key combinations.
- Takes the complexity out of key codes and values, allowing you to mix and match to your heart's content.
- Provides advanced functionality, such as listening for double tapping keys and only listening for a keyboard event once.
- Stores all your key bindings in one place, allowing you to have access to every binding in your application.
- Allows for key groups using the `group` function, making your code more readable and powerful.
- Provides a hook to be notified when a keyboard shortcut has been released.
- Includes a powerful plugin syntax for extending the base functionality of whenipress

## Why use whenipress?
Keyboard shortcuts are often an add-on in most web applications. Why? Usually, because it can be pretty complicated to
add them in JavaScript. The `keydown` and `keyup` events are pretty low level stuff, and require a fair bit of abstraction
to make adding shortcuts a simple task. 

Say hello to whenipress. We've done all the abstraction for you, and provided the functionality you'll need in a
much simpler, easier to manage way. Getting started is as simple as calling the global `whenipress` method, passing
in the key-combo you want to listen for. Check out our guide below...

## Using whenipress
So, how do you get started? After you've installed the package using one of the methods described in the 'getting started'
section, you can get to registering your first keyboard shortcut. Let's imagine we want to register a shortcut on the '/'
key that will focus the global search bar in our web application. We've already set up a method, `focusGlobalSearchBar()`,
that will actually focus the input for us. We just need to wire it up to our shortcut. Check it out:

```javascript
whenipress('/').then(event => focusGlobalSearchBar())
```

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