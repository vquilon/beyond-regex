// highlight.js

import { styleTags, tags as t } from "@codemirror/highlight"

// Estilos comunes a todos los dialectos
const baseStyles = [
  t.dot,
  t.char,
  t.escape,
  t.range,
  t.ref,
  t.num
]

// Estilos específicos para el dialecto regex-py
const regexPyStyles = [
  // Agrega aquí los estilos específicos para regex-py
]

// Estilos específicos para el dialecto regex-js
const regexJsStyles = [
  // Agrega aquí los estilos específicos para regex-js
]

// Estilos para el base y los dialectos
const styles = [
  ...baseStyles,
  { tag: styleTags.keyword, class: "keyword" },
  { tag: styleTags.comment, class: "comment" },
  { tag: styleTags.string, class: "string" },
  { tag: styleTags.modifier, class: "modifier" },
  { tag: styleTags.variableName, class: "variable" },
  { tag: styleTags.operator, class: "operator" },
  ...regexPyStyles,
  ...regexJsStyles
]

// Exportar los estilos
export const regexStyles = tags => {
  let result = {}
  for (let { tag, class: cls } of styles) result[tag] = cls
  return result
}
