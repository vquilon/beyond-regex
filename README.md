# Regex Beyond
Proyecto sin animo de lucro que busca la creacion de un editor **RegEx**,
  capaz de editar y comprender estas expresiones regulares de una forma unica. **Visualizando, construyendo y analizando**, de manera que se podrá exprimir la máxima capacidad de comprension y optimización del uso de esta tecnología, en todos los ambitos aplicados.

## Core
Se hara uso de diferentes cores, como el tradicional `backtracking` o una optimizacion basada en `NFA (nondeterministic finite automaton)`. Aunque esto acarrea la definicion de una tabla de estados muy extensa, tal y como se analiza en el paper [Y. E. Yang and V. K. Prasanna, "Optimizing Regular Expression Matching with SR-NFA on Multi-Core Systems"](https://ieeexplore.ieee.org/abstract/document/6113850?section=abstract). Esta tabla de estados dicta la transicion de un token de regex a otro.

> _"Puede requerir una tabla de transición de estado (STT) extremadamente grande debido a la explosión de estado exponencial"_.

## Herramientas
Por otra parte, se desarrollan herramientas que ayuden a la comprension y aprovechamiento completo de las expresiones regulares. Entre otras se destacan las siguientes:
- **Regex B(V)isualizer**: Mediante grafos se podra ver los caminos que sigue la expresion regular para realizar la busqueda, dando la capcidad de entender como funciona internamente y por lo tanto haciendo un mejor uso.
- **Regex Builder**: Esta herramienta capacita al usuario a una  mejor construccion de la regex mediante la creacion de `entidades` que aunen un conjunto de caracteres y composiciones sintacticas pudiendo construir los elementos basicos de los que esta compuesta la lengua natural, realizando asi busquedas con mas sentido y critero.

  > Aunque la lengua natural parezca algo complicado en un principio, se rige por unas normas y estructuras regladas, lo cual significa que se pueden modelar caracter a caracter,pero no significa que una estructura bien definida sea capaz de comprender la semantica, unicamente seremos capaces de capturar estas _entidades_, las cuales no tienen porque que corresponder de forma unica a un grupo concreto.

- **Regex deBugger**: Una herramienta para analizar el patrón regex y el texto de prueba para verificar en que paso coincide y en cual no, comprobando así posibles fallos, o ejecuciones inesperadas.


# TODOs
- [x] Compartir panel B(V)isualizacion como imagenes.
- [x] Compartir paneles de visualizacion como iframes interactivos.
- [ ] Optimizacion de carga independiente entre los diferentes scripts y styles.
- [x] Separacion de los diferentes paneles y editor.