import { Howl } from "howler";

export const placeSound = new Howl({
  src: ["/sounds/place.mp3"],
  volume: 0.5,
});

export const winSound = new Howl({
  src: ["/sounds/win.mp3"],
  volume: 0.7,
});

export const clickSound = new Howl({
  src: ["/sounds/click.mp3"],
  volume: 0.4,
});
