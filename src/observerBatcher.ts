import { _getGlobalState, configure } from "mobx"

import { reactionScheduler } from "./observerBatching"

let isRendering = false
let queue: (() => void)[] | undefined

export function startObserverBatch() {
    isRendering = true
    queue = undefined
}

export function endObserverBatch() {
    isRendering = false
    const result = queue
    queue = undefined
    return result
}

export function executeObserverBatch(observerBatch: (() => void)[]) {
    reactionScheduler(() => {
        observerBatch.forEach(callback => callback())
    })
}

function mobxReactionScheduler(callback: () => void) {
    if (isRendering && _getGlobalState().pendingReactions.length > 0) {
        // If there were any reactions triggered during useObserver execution, push them into the queue which will be returned from endObserverBatch
        if (!queue) {
            queue = []
        }
        queue.push(callback)
    } else {
        reactionScheduler(callback)
    }
}

configure({ reactionScheduler: mobxReactionScheduler })
