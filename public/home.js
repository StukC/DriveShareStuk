document.addEventListener('DOMContentLoaded', function() {
    const homeMediator = (function() {
        const channels = {};

        function subscribe(channel, fn) {
            if (!channels[channel]) channels[channel] = [];
            channels[channel].push(fn);
        }

        function publish(channel, ...args) {
            if (!channels[channel]) return false;
            channels[channel].forEach(callback => {
                callback(...args);
            });
        }

        return {
            subscribe,
            publish
        };
    })();

});
