export const text = 
`
~~~css
/* ========================================================= */
/* AT-RULES y DIRECTIVAS: AtKeyword (import, charset, namespace, keyframes, media, supports) */
@import url("styles.css");             /* AtKeyword: import */
@charset "UTF-8";                      /* AtKeyword: charset */
@namespace url("http://www.w3.org/1999/xhtml"); /* AtKeyword: namespace */

@media screen and (min-width: 768px) {   /* AtKeyword: media; ParenthesizedContent por (min-width: 768px) */
  /* Uso de KeywordQuery en propiedad */
  .keyword-query {
    text-transform: KeywordQuery;     /* Token: KeywordQuery */
  }
}

@supports (display: grid) {             /* AtKeyword: supports; se usa paréntesis para contenido */
  .supportsTest {
    display: grid;
  }
}

@keyframes slideIn {                   /* AtKeyword: keyframes */
  from {                              /* keyword: from */
    opacity: 0;
  }
  to {                                /* keyword: to */
    opacity: 1;
  }
}

/* Definición de keyframes que usa literal KeyframeName y sirve para incluir KeyframeRangeName */
@keyframes KeyframeName {             /* Token KeyframeName, t.labelName */
  0% {
    transform: translateX(0%);
  }
  50% {                             /* Aquí se supone que “50%” ejemplifica el rango, pudiendo verse como KeyframeRangeName */
    transform: translateX(50%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ========================================================= */
/* SELECTORES, CLASES, IDS y PSEUDO-CLASES */

/* Selector literal "selector" */
selector {                           /* Token: selector (keyword) */
  property: value;                  /* Se usan “:” (puntuación) y “;” (separador) */
}

/* Uso de TagName como selector de elemento (TagName) */
TagName {
  font-size: 16px;
}

/* Uso de .ClassName */
.ClassName {                        /* Token: ClassName */
  margin: 10px;
}

/* Uso de PseudoClassName en selector */
button:PseudoClassName {             /* Token: PseudoClassName */
  background-color: lightblue;
}

/* Uso de ID: #IdName */
#IdName {                           /* Token: IdName */
  border: 2px solid #000;
}

/* ========================================================= */
/* PROPIEDADES Y ATRIBUTOS */

/* Regla que emplea FeatureName y PropertyName (como nombres de propiedad) */
.feature {
  FeatureName: bold;                /* Token: FeatureName */
  PropertyName: 10px;               /* Token: PropertyName */
}

/* Seleccionador por atributo con AttributeName */
[AttributeName="value"] {           /* Token: AttributeName (dentro de [ ]) */
  padding: 5px;
}

/* Regla que incluye NumberLiteral en valores numéricos */
.NumberLiteral {                    /* Token: NumberLiteral */
  width: 100px;
  height: 50px;
}

/* ========================================================= */
/* EJEMPLOS DE USO DE OTROS TOKENS */

/* Uso de KeywordQuery (además de estar en propiedad) ya aparece aquí también */

/* Regla que “forza” la aparición de UnaryQueryOp */
.unary {
  /* Aunque no es un valor CSS válido, lo usamos para resaltar el token */
  opacity: UnaryQueryOp;
}

/* Regla para CallTag, y en el contenido se muestra ValueName */
CallTag {                           /* Token: CallTag (ámbito de CallTag ValueName, t.atom) */
  content: "ValueName";             /* Se muestra también ValueName */
}

/* Variable CSS usando VariableName */
:root {
  --VariableName: 20px;              /* Token: VariableName */
}

/* Uso de función en calc() con un comentario que señala Callee */
.callee {
  width: calc(100% - 20px /* Callee */);  /* Token: Callee se asocia a operadores en función */
}

/* Uso de un “unidad” custom: Unit */
.unit-test {
  margin-top: 10Unit;               /* Token: Unit */
}

/* ========================================================= */
/* SELECTORES UNIVERSAL Y ANIDAMIENTO (Nesting) */

/* UniversalSelector */
* {                                /* Token: UniversalSelector (selector universal) */
  box-sizing: border-box;
}

/* Ejemplo de NestingSelector (estilo anidado, propio de preprocesadores o CSS anidado) */
.parent {
  color: black;
  /* Simulación de anidamiento (NestingSelector) */
  & .child {
    color: red;
  }
}

/* ========================================================= */
/* OPERADORES Y COMBINADORES */

/* Uso de MatchOp: se incluye en una propiedad custom */
.match {
  --match: MatchOp;                /* Token: MatchOp (compareOperator) */
}

/* Uso de combinadores: ChildOp, SiblingOp y LogicOp se muestran en contenido */
.combinators::after {
  content: "ChildOp, SiblingOp, LogicOp";  /* Tokens: ChildOp, SiblingOp, LogicOp (logicOperator) */
}

/* Uso de BinOp: se incluye en contenido para resaltar el operador aritmético */
.calc::before {
  content: "BinOp";                /* Token: BinOp (arithmeticOperator) */
}

/* Uso de !important para incluir Important */
.important {
  color: blue !important;          /* Token: Important (modifier) */
}

/* ========================================================= */
/* COMENTARIOS, COLOR, CADENAS Y MÁS */

/* BlockComment: Ejemplo de comentario de bloque (Comment) */
 /*
    Comment: Este es un comentario de bloque usado para tokens.
 */

/* ColorLiteral: uso de literal de color (hexadecimal) */
.color-lit {
  color: #abcdef;                  /* Token: ColorLiteral */
}

/* ParenthesizedContent y StringLiteral en contenido */
.quote::after {
  content: "(ParenthesizedContent StringLiteral)";  /* Ambos tokens en cadena y con paréntesis */
}

/* PseudoOp y #: uso combinado en un selector (literalmente se muestra “PseudoOp#”) */
.PseudoOp#example {
  padding: 5px;
}

/* Separators ; y ,: Se usan naturalmente en propiedades y en listas de fuentes */
.list {
  font-family: "Arial", sans-serif;  /* Se usa , y ; */
}

/* Los paréntesis ( ) se ven en media queries, [ ] en selectores de atributo y { } en bloques de reglas */
~~~`;