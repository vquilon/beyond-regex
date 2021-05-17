# BeyondEs un proyecto sin animo de lucro que busca la creacion de un editor RegEx,
  capaz de editar y comprender estas expresiones regulares de una forma unica. Visualizando, construyendo y analizando, de forma que se podrá exprimir la máxima capacidad y llegar a la optimización del uso de esta tecnología, la cual posee una busqueda mas avanzada de como se creo en un inicio.

## Core
Se hara uso de diferentes cores, como el tradicional `backtracking` o una optimizacion basada en ´NFA (nondeterministic finite automaton)´.

Aunque, sin embargo tal y como asegura el paper de [Y. E. Yang and V. K. Prasanna, "Optimizing Regular Expression Matching with SR-NFA on Multi-Core Systems"](https://ieeexplore.ieee.org/abstract/document/6113850?section=abstract), `puede requerir una tabla de transición de estado (STT) extremadamente grande debido a la explosión de estado exponencial`.

## Herramientas
Por otra parte, se desarrollan herramientas que ayuden a la comprension y aprovechamiento completo de las expresiones regulares. Entre otras se destacan las siguientes:
- Regex Bisualizer: Mediante grafos se podra ver los caminos que sigue la expresion regular para realizar la busqueda, dando la capcidad de entender como funciona internamente y por lo tanto haciendo un mejor uso.
- Regex Builder: Esta herramienta capacita al usuario a una  mejor construccion de la regex mediante la creacion de `entidades` que aunen un conjunto de caracteres y composiciones sintacticas pudiendo construir los elementos basicos de los que esta compuesta la lengua natural, realizando asi busquedas con mas sentido y critero. 

#### AVISO SOBRE EL REGEX BUILDER
Aunque la lengua natural parezca algo complicado en un principio, se rige por unas normas y estructuras regladas, lo cual significa que se pueden modelar caracter a caracter,pero no significa que una estructura bien definida sea capaz de comprender la semantica, unicamente seremos capaces de capturar estas `entidades`, las cuales no tienen porque que corresponder de forma unica a un grupo concreto.