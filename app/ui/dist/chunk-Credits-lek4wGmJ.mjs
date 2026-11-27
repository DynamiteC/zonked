import { jsx as e, jsxs as t } from "react/jsx-runtime";
import { C as o } from "./chunk-crewLink-Cq0htOCx.mjs";
const c = [
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
  }
];
function l({ id: r, synth: d = !1 }) {
  if (d) return /* @__PURE__ */ e("p", { className: "c-credit", "data-testid": `credit-${r}`, children: o.natureMade });
  const i = c.find((a) => a.id === r);
  return i === void 0 ? /* @__PURE__ */ e("p", { className: "c-muted", children: "Credit details are missing for this sound." }) : /* @__PURE__ */ t("dl", { className: "c-credit", "data-testid": `credit-${r}`, children: [
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
  l as Credits
};
