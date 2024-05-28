<script lang="ts">

	// I want to make a memory game, where you have to match pairs of cards.
	// each card has a unique id, and a value.
	// the value is what the player sees, the id is what the game uses to match pairs.
	// the game starts with all cards face down.
	// the player can click on a card to flip it over.
	// the player can click on a second card to flip it over.
	// if the two cards have the same value, they stay face up.
	// if the two cards have different values, they flip back over.
	// the game ends when all pairs are matched.

	// I need a grid of cards.
	// I need a way to shuffle the cards.
	// I need a way to flip a card.

	// I need a way to match a pair of cards.

	// give me the set of cards.
	//add flipped property to each card
	// add matched property to each card

	// create a set of cards


	import { cards,flippedCards, matchedCards, type Card } from '$lib/stores';
	const emojis = ['🥕', '🍎', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑'];

	let moves = 0;
	$: score = $matchedCards.length / 2 || 0;

	cards.fillFromStrings(emojis);
	// give me an array of 8 emojis
	cards.shuffle();

	const isReady = () => {
		return $cards.filter(c => c.flipped && !c.matched).length < 2;
	}


	const handleClickedCard = (card: Card) => {
		if (!isReady() || card.flipped || card.matched) return;
		const pending = $flippedCards[0]
		cards.flipCard(card);
		if (pending) {
			if (pending.value === card.value) {
				cards.matchCards(pending, card);
			} else {
				setTimeout(() => {
					cards.flipCard(pending);
					cards.flipCard(card);
				}, 500);
			}
			moves++;
		}
	};

	const reset = () => {
		cards.fillFromStrings(emojis);
		cards.shuffle();
		moves = 0;
	
	}

</script>

<div class="container h-full mx-auto flex flex-col gap-10 p-5 my-10">
	<section class="justify-self-start flex justify-around">
		<button class="btn variant-filled-primary">Start</button>
		<button class="btn variant-filled-primary" on:click={reset}>Reset</button>
	</section>

	<section class="flex justify-around items-center">
		<p class="font-bold uppercase flex items-center">Score
			<span class="text-3xl ml-2 text-blue-300">{score}</span> 
		</p>
		<p class="font-bold uppercase flex items-center">Moves 
			<span class="text-3xl ml-2 text-blue-300">{moves}</span> 
		</p>
	</section>

	<section class="flex-grow flex flex-col mt-10 items-center">
		<!-- Need a structure to iterate over cards and display each one in grid template  -->
		<div class="grid grid-cols-4 gap-4">
			{#each $cards as card}
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
				role="button"
				on:click={() => handleClickedCard(card)} 
				class="card-container card w-24 h-24 cursor-pointer border hover:border-primary-800"
				class:flip={card.flipped}
				>
					<div class="card-front">🎁</div>
					<div class="card-back">{card.value}</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style lang="postcss">

	.card-container {
		perspective: 1000px;
	}

	.card {
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.6s;
	}

	.card.flip {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
	}

	.card-front {
		@apply bg-secondary-500;
		color: black;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		border: 1px solid #ccc;
	}

	.card-back {
		@apply bg-surface-200;
		color: white;
		transform: rotateY(180deg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		border: 1px solid #ccc;
	}
</style>
