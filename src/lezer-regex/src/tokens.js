const { ExternalTokenizer, ContextTracker } = require("@lezer/lr");

// Define los tokens
const tokens = {
  LParen: "lparen",
  RParen: "rparen",
  Pipe: "pipe",
  // Define más tokens para otros elementos léxicos
  // ...
};

// Define los estados de contexto
const contextStates = {
  outside: new ContextTracker(),
  insideString: new ContextTracker(),
};

// Define el analizador léxico externo
class RegexTokenizer extends ExternalTokenizer {
  constructor(input) {
    super(input);
    this.context = contextStates.outside;
  }

  // Define el método `token` para reconocer los tokens
  token(stream) {
    // Establece el estado de contexto actual
    this.context = this.context.update(stream.start);

    // Verifica el estado de contexto y realiza el reconocimiento del token correspondiente
    if (this.context.state === contextStates.outside) {
      // Tokenización para el estado 'outside'
      // Implementa tu lógica para reconocer los tokens aquí

      // Ejemplo: reconocer un paréntesis de apertura
      if (stream.eat("(")) {
        return tokens.LParen;
      }

      // Ejemplo: reconocer un paréntesis de cierre
      if (stream.eat(")")) {
        return tokens.RParen;
      }

      // Ejemplo: reconocer el operador de alternativa (|)
      if (stream.eat("|")) {
        return tokens.Pipe;
      }

      // ...
    } else if (this.context.state === contextStates.insideString) {
      // Tokenización para el estado 'insideString'
      // Implementa tu lógica para reconocer los tokens aquí

      // ...
    }

    // Si no se reconoce ningún token, devuelve `null`
    return null;
  }
}

// Exporta los tokens y el analizador léxico externo
module.exports = {
  tokens,
  regexTokenizer: new RegexTokenizer(),
};






// Segunda version

// tokens.js

import { ExternalTokenizer } from "lezer"

// Tokens comunes a todos los dialectos
export const baseTokens = {
  dot: { token: "dot" },
  char: { token: "char" },
  escape: { token: "escape" },
  range: { token: "range" },
  ref: { token: "ref" },
  num: { token: "num" }
}

// Tokenizador externo para el dialecto regex-py
export const regexPyTokenizer = new ExternalTokenizer((input, token, stack) => {
  // Definir aquí la lógica de tokenización específica para regex-py
})

// Tokens específicos para regex-py
export const regexPyTokens = {
  // Agrega aquí los tokens específicos para regex-py
}

// Tokenizador externo para el dialecto regex-js
export const regexJsTokenizer = new ExternalTokenizer((input, token, stack) => {
  // Definir aquí la lógica de tokenización específica para regex-js
})

// Tokens específicos para regex-js
export const regexJsTokens = {
  // Agrega aquí los tokens específicos para regex-js
}
