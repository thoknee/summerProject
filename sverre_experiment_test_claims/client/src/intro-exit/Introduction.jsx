import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-1 sm:mt-5 p-10">
      <h1 className="text-lg leading-6 font-large text-gray-900" style={{ fontSize: '30px' }}>
        Marketplace Game Instructions
      </h1>
      <div className="text-lg mt-10 mb-6">
        Welcome to the Marketplace Game! In this game, you'll take on the role of either a producer or a consumer in a virtual market.
        <br />
        <strong>As a Producer:</strong>
      </div>
      <p>
        - Determine the quality of the toothpaste you produce.
      </p>
      <p>
        - Decide how to advertise your products and set their selling prices.
      </p>
      <p>
        Your goal is to maximize profits, and you'll earn points based on the profits from your sales.
      </p>
      <div className="mt-10 mb-6">
        <strong>As a Consumer:</strong>
      </div>
      <p>
        - Assess advertisements to choose the toothpaste you wish to purchase, considering quality and price.
      </p>
      <p>
        Your objective is to ensure value for money – the quality of the product should match the price you pay.
      </p>
      <p>
        You'll earn points for making wise purchasing decisions that align with this principle.
      </p>
      <div style={{ marginTop: '30px' }}>
        <Button handleClick={next} autoFocus>
          <p>Next</p>
        </Button>
      </div>
    </div>
  );
}
