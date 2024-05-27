import { writable, derived } from 'svelte/store';

export type Card = {
    id: number;
    value: string;
    flipped: boolean;
    matched: boolean;
};



function createCardsStore() {
    const { subscribe, set, update } = writable([] as Card[]);

    return {
        subscribe,
        set: (cards: Card[]) => set(cards),
        flipCard: (card: Card) => update((c) => c.map((c) => (c.id === card.id ? { ...c, flipped: !c.flipped } : c))),
        matchCards: (card1: Card, card2: Card) => update((c) => c.map((c) => (c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c))),
        fillFromStrings: (values: string[]) => set([...values, ...values].map((value, index) => ({ id: index + 1, value, flipped: false, matched: false }))),
        shuffle: () => update((c) => c.sort(() => Math.random() - 0.5)),
        update,
        reset: () => set([])
    };
}

export const cards = createCardsStore();


export const flippedCards = derived(cards, ($cards) => $cards.filter((card) => card.flipped && !card.matched));