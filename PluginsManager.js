class PluginsManager {

    manager = null
    plugins = []

    constructor(manager) {
        this.manager = manager
    }

    add(...plugins) {
        this.plugins = [...this.plugins, ...plugins]
    }

    handle(event, ...parameters) {
        this._loopOverPlugins(plugin => {
            if (!plugin[event]) {
                return
            }

            plugin[event](...parameters, this.manager)
        })
    }

    _loopOverPlugins(action) {
        this.plugins.forEach(plugin => action(plugin))
    }

}

module.exports = PluginsManager