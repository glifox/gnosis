export const text = 
`
~~~python
#!/usr/bin/env python3
"""
Script de ejemplo para probar distintos tipos de objetos en Python.

Este código muestra ejemplos de:
  - Tipos básicos: enteros, flotantes, números complejos, cadenas, booleanos y None.
  - Estructuras compuestas: listas, tuplas, diccionarios y conjuntos.
  - Otros tipos: datos en bytes, bytearray y memoryview.
  - Funciones: función definida, función lambda.
  - Clases y objetos personalizados.
  - Generadores y conversión de generadores en listas.
"""
import asyncio;

def ejemplo_funcion(x):
    """Función de ejemplo que devuelve una cadena con el parámetro recibido."""
    return f"Recibido: {x}"

class Ejemplo:
    """Clase de ejemplo para crear objetos personalizados."""
    def __init__(self, valor):
        self.valor = valor

    def __repr__(self):
        return f"Ejemplo({self.valor})"

async def generador_ejemplo(n):
    """Generador de ejemplo que produce los cuadrados de números de 0 a n-1."""
    for i in range(n):
        yield i ** 2

if __name__ == "__main__":
    # --- Tipos básicos ---
    entero = 10
    flotante = 3.14
    complejo = 2 + 3j
    cadena = "Hola mundo"
    booleano = True
    nulo = None
    
    with open("archivo.txt", "w") as archivo:
        archivo.write("Contenido del archivo")
    
    # --- Estructuras compuestas ---
    lista = [1, 2, 3, "texto", 5.5]
    tupla = (10, 20, "treinta")
    diccionario = {"clave1": "valor1", "clave2": 2, "clave3": [1, 2, 3]}
    conjunto = {1, 2, 3, 3, 2, 1}  # La repetición se ignora en sets

    # --- Otros tipos de datos ---
    bytes_data = b"datos en bytes"
    byte_array = bytearray(b"datos en bytearray")
    # Memoryview: si está disponible (permite ver los datos sin copiarlos)
    mem_view = memoryview(byte_array)

    # --- Objetos relacionados con funciones y clases ---
    funcion_obj = ejemplo_funcion
    lambda_obj = lambda x: x * 2
    clase_objeto = Ejemplo("prueba")

    # --- Generador ---
    gen = generador_ejemplo(5)
    lista_gen = list(gen)  # Convierte el generador en una lista para visualizar su contenido

    # Lista de pares (descripción, objeto) para iterar y mostrar sus tipos y valores.
    objetos = [
        ("Entero", entero),
        ("Flotante", flotante),
        ("Complejo", complejo),
        ("Cadena", cadena),
        ("Booleano", booleano),
        ("None", nulo),
        ("Lista", lista),
        ("Tupla", tupla),
        ("Diccionario", diccionario),
        ("Conjunto", conjunto),
        ("Bytes", bytes_data),
        ("Bytearray", byte_array),
        ("MemoryView", mem_view),
        ("Función", funcion_obj),
        ("Lambda", lambda_obj),
        ("Objeto de clase", clase_objeto),
        ("Generador convertido a lista", lista_gen)
    ]

    # Imprime la descripción, el tipo y la representación del objeto.
    for desc, obj in objetos:
        print(f"{desc}: ({type(obj).__name__}) --> {obj}")
~~~`;