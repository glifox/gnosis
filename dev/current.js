export const text = 
`
~~~c++
// --- MÓDULO & DIRECTIVAS PREPROCESADOR ---
export module dummy;
import <iostream>;
#include <string>
#include <coroutine>

#define MacroName 100
#define True true
#define False false
// PreProcArg: macro con argumento
#define PRINT_ARG(x) std::cout << "PreProcArg: " << x << std::endl

#ifdef SOMETHING
  // LineComment: Este es un comentario de línea dentro de un bloque condicional.
#endif
#ifndef SOMETHING_ELSE
  #define SOMETHING_ELSE 1
#elif defined(ALTERNATIVE)
#endif

// La siguiente sección incluye __based en un bloque inactivo (para mostrar la palabra sin afectar la compilación)
#if 0
int __based(void)* basedPointer = nullptr;
#endif

// --- DECLARACIONES DE IDENTIFICADORES Y MODIFICADORES ---
// Usa tokens de: typedef, struct, union, enum, class, typename, decltype, auto,
// template, operator, friend, noexcept, namespace, using, requires, concept,
// import, export, module, __attribute__, __declspec, __based

// Declaración de variable mediante extern (MsCallModifier y MsPointerModifier son identificadores inventados)
extern int MsCallModifier;
int MsPointerModifier = 0;

// Para "typedef" usamos un alias simple
typedef int MyTypedef;

// "TypeSize" y "PrimitiveType" (no son palabras reservadas; se usan aquí como nombres de identificador)
struct TypeSize { int size; };
int PrimitiveType = 10;

// "TypeIdentifier" como nombre de un tipo
class TypeIdentifier { };

// --- DEFINICIONES DE ESTRUCTURAS Y CLASES ---
// * MyStruct usa la palabra clave struct e incluye un campo llamado FieldIdentifier.
struct MyStruct {
    int FieldIdentifier;
    MyStruct() : FieldIdentifier(0) { }
};

// * CallExpression: incluye además un método llamado FieldExpression y un campo FieldIdentifier.
struct CallExpression {
    void FieldExpression() {
         std::cout << "CallExpression/FieldExpression/FieldIdentifier invoked" << std::endl;
    }
    int FieldIdentifier;
};

// Definición de una unión (union)
union MyUnion {
    int i;
    float f;
};

// Definición de un enum
enum MyEnum { Value1, Value2 };

// Clase MyClass que incorpora "class", un destructor, un método que usa "this", una sobrecarga de operator+ y un friend.
class MyClass {
public:
    MyClass() { }
    ~MyClass() { }
    virtual MyClass operator+(const MyClass& rhs) { return MyClass(); }
    friend void friendFunction(MyClass&);
    int getMember() { return this->FieldIdentifier; } // uso de "this"
private:
    int FieldIdentifier;
};

void friendFunction(MyClass& obj) { /* implementación vacía */ }

// Función plantilla (template) usando typename, template, noexcept y auto.
template<typename T>
T templateFunction(T value) noexcept { return value; }

auto autoVar = 42;

// Definición de un concept (C++20) usando requires y concept.
template<typename T>
concept Integral = requires(T x) { x + 1; };

// Función con atributo __attribute__
int functionWithAttribute() __attribute__((deprecated)) { return 0; }

// Función con __declspec
__declspec(dllexport) int declspecFunction() { return 0; }

// Una función dummy para "incorporar" __based (se menciona en un comentario)
int dummyBasedFunction() { 
    // Aquí aparece el token __based
    return 0;
}

// Uso de "restrict" en una declaración (no estándar en C++, pero muchas veces admitido como extensión)
int* restrict pointerRestricted = nullptr;

// Uso de _Atomic (estilo C11, disponible como extensión)
_Atomic int atomicNumber = 10;

// Clase con miembro mutable (mutable aparece aquí)
class MutableClass {
public:
    mutable int mutableVar;
};

// Uso explícito de constexpr
constexpr int constExpr = 6;

// Uso explícito de constinit (C++20)
constinit int constInitVar = 20;

// Función consteval (C++20)
consteval int computeConstEval() { return 42; }

// Clase VirtualDemo que usa virtual y explicit, e incluye dos miembros con los nombres VirtualSpecifier y Access.
class VirtualDemo {
public:
    explicit VirtualDemo(int x) : value(x), VirtualSpecifier(x), Access(x) { }
    virtual void demo() { }
    int VirtualSpecifier;
    int Access;
private:
    int value;
};

// --- ESPACIOS DE NOMBRE ---
// * ScopedIdentifier: su función Identifier se usará en llamadas con el operador de resolución de ámbito.
namespace ScopedIdentifier {
    void Identifier() {
         std::cout << "CallExpression/ScopedIdentifier/Identifier invoked" << std::endl;
    }
}

// * ModuleName: incluye un miembro Identifier.
namespace ModuleName {
    int Identifier = 0;
}

// * NamespaceIdentifier: otro namespace, tal como se solicitó.
namespace NamespaceIdentifier {
    int dummy = 0;
}

// --- LITERAL DEFINIDO POR EL USUARIO ---
// Se define una función literal para el literal _udl.
unsigned long long operator"" _udl(unsigned long long x) { return x; }

// --- CORUTINAS: co_return, co_yield, co_await ---
// Se define un tipo dummy de coroutine para emplear las palabras clave de corutina.
struct DummyCoroutine {
    struct promise_type {
        DummyCoroutine get_return_object() { return {}; }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void unhandled_exception() { }
        void return_void() { }
        std::suspend_always yield_value(int) { return {}; }
    };
};

DummyCoroutine myCoroutine() {
    co_yield 1;
    co_await std::suspend_always{};
    co_return;
}

// --- OTRA FUNCIÓN (Name: Identifier) ---
// Se usa para simular "CallExpression/Identifier".
void Identifier() { std::cout << "CallExpression/Identifier function called" << std::endl; }

// --- FUNCIÓN MAIN ---
// Aquí se incluyen los tokens de control: if, else, switch, for, while, do, case, default, return, break, continue, goto, throw, try, catch
int main() {
    // Uso de control de flujo: if / else
    if (True) {
        std::cout << "if branch" << std::endl;
    } else {
        std::cout << "else branch" << std::endl;
    }
    
    // switch con case y default; además se usa MacroName (macro y número)
    switch (MacroName) {
        case 100:
            std::cout << "switch case" << std::endl;
            break;
        default:
            std::cout << "default case" << std::endl;
            break;
    }
    
    // for
    for (int i = 0; i < 3; i++) {
        std::cout << "for loop iteration: " << i << std::endl;
    }
    
    // while
    int count = 0;
    while (count < 3) {
        count++;
    }
    
    // do-while
    do {
        std::cout << "do while loop executed" << std::endl;
    } while (False);
    
    // try-catch con throw; dentro de try se usa también continue y un bucle for
    try {
        if (count > 0) {
            for (int j = 0; j < 1; j++) {
                continue;
            }
            throw std::runtime_error("throwing error");
        }
    } catch (const std::exception& e) {
        std::cout << "Caught exception: " << e.what() << std::endl;
        goto StatementIdentifier;
    }
    
    // goto; salto al label PartitionName
    goto PartitionName;
    
PartitionName:
    std::cout << "Reached PartitionName label" << std::endl;
    
StatementIdentifier:
    std::cout << "Reached StatementIdentifier label" << std::endl;
    
    // Uso de new, sizeof, delete, y static_assert
    int* p = new int(5);
    static_assert(sizeof(int) >= 2, "Size check");
    delete p;
    
    // Uso de NULL y nullptr
    int* pNull = NULL;
    int* pNullptr = nullptr;
    
    // Uso de operadores aritméticos, lógicos, bit a bit, de comparación, asignación y actualización:
    int a = 3 + 4;        // suma (arithmetic operator)
    a = a * 2 - 1;        // multiplicación y sustracción
    int b = a / 2;        // división
    if (a < b) { }        // comparación
    bool logicFlag = (a > 2 && b < 5) || (a == 3);  // &&, || (logical operators)
    int bitResult = a & b | (a ^ b);  // bitwise &, |, ^
    bitResult = ~bitResult;           // bitwise NOT
    a++;  // incremento (update operator)
    b--;  // decremento (update operator)
    
    // Comentarios: LineComment y BlockComment
    // This is a line comment
    /* This is a block comment */
    
    // Literales: número, cadena (string), raw string, SystemLibString, caracter (char), secuencias de escape
    std::string str = "Hello, world!";
    std::string rawStr = R"(This is a raw string literal with <angle brackets>)";
    std::string systemLibString = "SystemLibString";
    char ch = 'A';
    std::string escapeStr = "Line1\\nLine2\\tTabbed";
    
    // Uso de literal definido por el usuario
    auto udlValue = 123_udl;
    
    // Array con corchetes [ ]
    int arr[5] = {1, 2, 3, 4, 5};
    
    // Uso de operadores punto (.) y flecha (->)
    MyStruct ms;
    ms.FieldIdentifier = 0;
    MyStruct* ms_ptr = &ms;
    ms_ptr->FieldIdentifier = 1;
    
    // Llamadas a funciones (se usan paréntesis ( ) )
    Identifier();
    ScopedIdentifier::Identifier();
    
    // Variables locales con nombres "Identifier" y "DestructorName" (simulando FunctionDeclarator/Identifier y /DestructorName)
    int Identifier = 5;
    int DestructorName = 10;
    // Se vuelve a llamar a Identifier() para incluir la forma call expression.
    Identifier();
    
    // Uso de un objeto CallExpression
    CallExpression ce;
    ce.FieldExpression();
    ce.FieldIdentifier = 123;
    
    // Uso del namespace ModuleName y su miembro Identifier
    std::cout << "ModuleName::Identifier = " << ModuleName::Identifier << std::endl;
    
    // Usar el macro que imprime un argumento (PreProcArg)
    PRINT_ARG(42);
    
    return 0; // return
}
~~~`;