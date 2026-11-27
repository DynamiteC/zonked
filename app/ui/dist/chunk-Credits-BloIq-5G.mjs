import { jsx as e, jsxs as a } from "react/jsx-runtime";
import { C as d } from "./chunk-crewLink-CU32qOP4.mjs";
const n = [
  {
    id: "rain",
    title: "Rain",
    author: "ezwa (PDSounds record 682)",
    source: "Wikimedia Commons, File:Rain_(1).ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "stream",
    title: "Stream, river water up close",
    author: "jackthemurray (Freesound 433589)",
    source: "Wikimedia Commons, File:433589_jackthemurray_stream-river-water-up-close.wav",
    licence: "CC0 1.0"
  },
  {
    id: "ocean",
    title: "Ocean Waves on a Tropical Beach",
    author: "Jarrod stanley",
    source: "Wikimedia Commons, File:Ocean_Waves_on_a_Tropical_Beach.ogg",
    licence: "CC0 1.0"
  },
  {
    id: "rapids",
    title: "Florida Rapids",
    author: "Jarrod stanley",
    source: "Wikimedia Commons, File:Florida_Rapids.ogg",
    licence: "CC0 1.0"
  },
  {
    id: "forest",
    title: "Forest ambience",
    author: "nille (PDSounds record 707)",
    source: "Wikimedia Commons, File:20090610_0_ambience.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "birds",
    title: "Birds singing in garden",
    author: "ezwa (PDSounds record 128)",
    source: "Wikimedia Commons, File:Birds_singing_in_garden.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "breeze",
    title: "Gentle breeze and birds singing",
    author: "ezwa (PDSounds record 129)",
    source: "Wikimedia Commons, File:Gentle_breeze_and_birds_singing.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "lightrain",
    title: "Light Rain Distant Thunder July 5th 2016",
    author: "kvgarlic (Freesound 349454)",
    source: "Wikimedia Commons, File:Light_Rain_Distant_Thunder_July_5th_2016.wav",
    licence: "CC0 1.0"
  },
  {
    id: "thunder",
    title: "Light Rain Distant Thunder July 5th 2016",
    author: "kvgarlic (Freesound 349454)",
    source: "Wikimedia Commons, File:Light_Rain_Distant_Thunder_July_5th_2016.wav",
    licence: "CC0 1.0"
  },
  {
    id: "veranda",
    title: "Rain on a veranda and thunder (1)",
    author: "ezwa (PDSounds record 684)",
    source: "Wikimedia Commons, File:Rain_on_a_veranda_and_t.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "window",
    title: "Rain against the window",
    author: "cori (PDSounds record 600)",
    source: "Wikimedia Commons, File:Rain_against_the_window.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "waves",
    title: "Waves",
    author: "Dsw4 (Commons user, own work)",
    source: "Wikimedia Commons, File:Waves.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "pebbles",
    title: "On a pebble beach",
    author: "earthcalling (PDSounds record 343)",
    source: "Wikimedia Commons, File:On_a_pebble_beach.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "chimes",
    title: "Windchime",
    author: "stephan (PDSounds record 381)",
    source: "Wikimedia Commons, File:Windchime.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "koshi",
    title: "Windglockenspiel Koshi",
    author: "Membeth (Commons user, own work)",
    source: "Wikimedia Commons, File:Windglockenspiel.Koshi.ogg",
    licence: "CC0 1.0"
  },
  {
    id: "gong",
    title: "Gong or bell vibrant",
    author: "stephan (PDSounds record 200)",
    source: "Wikimedia Commons, File:Gong_or_bell_vibrant.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "fire",
    title: "Dry grass burning in open fireplace",
    author: "ezwa (PDSounds record 303)",
    source: "Wikimedia Commons, File:Dry_grass_burning_in_open_fireplace.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "creek",
    title: "Forest lawn creek",
    author: "Dsw4 (Commons user, own work)",
    source: "Wikimedia Commons, File:Forest_lawn_creek.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "trickle",
    title: "Water trickle",
    author: "FractalStudios (Freesound 363120)",
    source: "Wikimedia Commons, File:363120_fractalstudios_water-trickle.wav",
    licence: "CC0 1.0"
  },
  {
    id: "fountain",
    title: "Fountain in Toulouse",
    author: "aldor (PDSounds record 579)",
    source: "Wikimedia Commons, File:Fountain_in_toulouse.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "storm",
    title: "Thunderstorm after hot summer day, part 1 of 4",
    author: "stephan (PDSounds record 279)",
    source: "Wikimedia Commons, File:Thunderstorm_after_hot_summer_day_17_minutes_01_of_04.ogg",
    licence: "Public domain (PD-author, dedicated by the author)"
  },
  {
    id: "hum",
    title: "Resident air-conditioned out door unit",
    author: "Ranch9613 (Commons user, own work)",
    source: "Wikimedia Commons, File:Resident_air-conditioned_out_door_unit.ogg",
    licence: "CC0 1.0"
  }
];
function u({ id: o, synth: r = !1 }) {
  if (r) return /* @__PURE__ */ e("p", { className: "c-credit", "data-testid": `credit-${o}`, children: d.natureMade });
  const i = n.find((t) => t.id === o);
  return i === void 0 ? /* @__PURE__ */ e("p", { className: "c-muted", children: "Credit details are missing for this sound." }) : /* @__PURE__ */ a("dl", { className: "c-credit", "data-testid": `credit-${o}`, children: [
    /* @__PURE__ */ e("dt", { children: "Title" }),
    /* @__PURE__ */ e("dd", { children: i.title }),
    /* @__PURE__ */ e("dt", { children: "Author" }),
    /* @__PURE__ */ e("dd", { children: i.author }),
    /* @__PURE__ */ e("dt", { children: "Licence" }),
    /* @__PURE__ */ e("dd", { children: i.licence }),
    /* @__PURE__ */ e("dt", { children: "Source" }),
    /* @__PURE__ */ e("dd", { children: i.source })
  ] });
}
export {
  u as Credits
};
