class PluginsManager {

    _manager = null
    plugins = []

    constructor(manager) {
        this._manager = manager
    }

    add(...plugins) {
        this.plugins = [...this.plugins, ...plugins]
    }

    handle(event, ...parameters) {
        return this._loopOverPlugins(plugin => this.handlePlugin(plugin, event, ...parameters))
    }

    handleSpecific(plugins, event, ...parameters) {
        return this._loopOverPlugins(plugin => this.handlePlugin(plugin, event, ...parameters), plugins)
    }

    handlePlugin(plugin, event, ...parameters) {
        if (!plugin[event]) {
            return
        }

        return plugin[event](...parameters, this._manager, plugin)
    }

    _loopOverPlugins(action, plugins = this.plugins) {
        return plugins.map(plugin => action(plugin))
    }

}

module.exports = PluginsManager