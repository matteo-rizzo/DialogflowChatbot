// Common utility functions

// UTILITY - Clear all current contexts at the next intent match
function clearAllContexts() {

    console.log('clearAllContexts')

    // Set all the contexts lifespan to 1 so that they will be
    // automatically cleared with the next intent match
    for(let i in agent.contexts) {
        agent.setContext({
            name: agent.contexts[i].name,
            lifespan: 1,
        });
    }
}

module.exports = {
    clearAllContexts: clearAllContexts
};