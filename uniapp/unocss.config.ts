import presetWeapp from "unocss-preset-weapp";
import { transformerClass } from "unocss-preset-weapp/transformer";

// remove style attributify mode 😡 it is ugly
// https://github.com/MellowCo/unocss-preset-weapp?tab=readme-ov-file#attributify-autocomplete-v0531
// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
// const { presetWeappAttributify, transformerAttributify } = extractorAttributify();

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
  ],
  shortcuts: [
    {
      "flex-center": "flex justify-center items-center flex-wrap",
      "flex-start": "flex justify-start items-center",
      "flex-end": "flex justify-end items-center",
      "flex-between": "flex justify-between items-center",
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
};
