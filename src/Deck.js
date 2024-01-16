// Deck.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const Deck = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);
  const [cardsRemaining, setCardsRemaining] = useState(true);
  const [shuffling, setShuffling] = useState(false);


  useEffect(() => {
    const newDeck = async () => {
      try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/');
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error('error getting deck', error);
      }
    };
    newDeck();
  }, []);

  const drawCard = async () => {
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      const card = response.data.cards[0];
      if (response.data.remaining === 0) {
        setCardsRemaining(false);
      } else {
        setCardsRemaining(true);
      }

      if (cardsRemaining) {
        setDrawnCard(card);
      } else {
        setDrawnCard(null)
      }
      

    }
      catch (error) {
      console.error('Error drawing a card:', error);
    }
  };

  const shuffle = async () => {
    setShuffling(true);
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`);
    if (!response.data.success) {
      console.log("Error shuffling deck");
    }
    setShuffling(false);

  }

  return (
    <div>
      <h2>Card Deck</h2>
      <button onClick={drawCard}>Draw Card</button>
      {drawnCard && <button onClick={shuffle} disabled={shuffling}>Shuffle</button>}
      {drawnCard === null && !cardsRemaining 
        ? (<div><p>Error: no cards remaining!</p></div>) 
        : (drawnCard && <Card {...drawnCard} />)
      }
    </div>
  );
};

export default Deck;
