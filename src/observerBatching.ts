import { getGlobal, getSymbol } from "./utils"

type IReactionScheduler = (callback: () => any) => void

const observerBatchingConfiguredSymbol = getSymbol("observerBatching")

export let reactionScheduler: IReactionScheduler = cb => cb()

export const observerBatching = (_reactionScheduler?: IReactionScheduler) => {
    if (typeof _reactionScheduler === "function") {
        reactionScheduler = _reactionScheduler
    }
    getGlobal()[observerBatchingConfiguredSymbol] = true
}

export const observerBatchingOptOut = () => {
    getGlobal()[observerBatchingConfiguredSymbol] = true
}

export const isObserverBatched = () => getGlobal()[observerBatchingConfiguredSymbol]
