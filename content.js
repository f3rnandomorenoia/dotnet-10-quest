(function () {
  "use strict";

  window.DOTNET_QUEST_SOURCES = [
    {
      label: ".NET 10 overview",
      url: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview"
    },
    {
      label: "Microsoft .NET lifecycle",
      url: "https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core"
    },
    {
      label: "C# 14",
      url: "https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14"
    },
    {
      label: ".NET 10 SDK and tooling",
      url: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk"
    },
    {
      label: "ASP.NET Core in .NET 10",
      url: "https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0"
    },
    {
      label: "EF Core 10",
      url: "https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew"
    },
    {
      label: ".NET 10 runtime",
      url: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/runtime"
    }
  ];

  window.DOTNET_QUEST_MISSIONS = [
    {
      id: "m01-platform",
      rank: "Cero",
      area: "Mapa mental",
      title: "La nave .NET",
      xp: 40,
      kind: "choice",
      prompt: "Empiezas desde cero. ¿Qué es .NET en una frase útil para un proyecto real?",
      code: ".NET 10 = runtime + bibliotecas + SDK + lenguajes + tooling",
      options: [
        "Un editor de código exclusivo para Windows",
        "Una plataforma abierta y multiplataforma para construir apps",
        "Solo un lenguaje llamado C#",
        "Una base de datos integrada en Visual Studio"
      ],
      answer: 1,
      explanation: ".NET es una plataforma de desarrollo abierta, multiplataforma y de alto rendimiento. C# es el lenguaje más usado encima de ella, pero no es lo único que trae.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/introduction"
    },
    {
      id: "m02-sdk-runtime",
      rank: "Cero",
      area: "CLI",
      title: "SDK o runtime",
      xp: 45,
      kind: "choice",
      prompt: "Quieres crear y compilar tu primera app. ¿Qué instalación necesitas como desarrollador?",
      code: "dotnet new console -n HolaNet\ndotnet run --project HolaNet",
      options: [
        "Solo el runtime",
        "El SDK de .NET 10",
        "Solo NuGet",
        "Solo un servidor IIS"
      ],
      answer: 1,
      explanation: "El SDK incluye la CLI, plantillas, compiladores y runtime para crear, compilar y ejecutar proyectos.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/tools/"
    },
    {
      id: "m03-lts",
      rank: "Cero",
      area: "Versiones",
      title: "El contrato LTS",
      xp: 45,
      kind: "choice",
      prompt: ".NET 10 aparece en la tabla oficial de ciclo de vida con inicio el 11 de noviembre de 2025. ¿Qué implica para una empresa?",
      code: ".NET 10: 2025-11-11 -> 2028-11-14",
      options: [
        "Es experimental y no debe usarse en producción",
        "Es una versión con ventana de soporte largo",
        "Solo sirve para apps móviles",
        "Reemplaza automáticamente todo .NET Framework"
      ],
      answer: 1,
      explanation: ".NET 10 es una versión estable con ciclo de vida largo según Microsoft Lifecycle. Eso la hace buena candidata para proyectos que necesitan soporte sostenido.",
      source: "https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core"
    },
    {
      id: "m04-file-apps",
      rank: "Cero",
      area: "SDK .NET 10",
      title: "C# de un archivo",
      xp: 50,
      kind: "choice",
      prompt: ".NET 10 mejora las apps basadas en archivo. ¿Cuál es el uso correcto para un script C# pequeño?",
      code: "#!/usr/bin/env dotnet\nConsole.WriteLine(\"Hola .NET 10\");",
      options: [
        "Crear siempre una solución con tres proyectos",
        "Ejecutar un archivo C# directamente con dotnet",
        "Compilarlo solo con MSBuild clásico de .NET Framework",
        "Convertirlo primero a JavaScript"
      ],
      answer: 1,
      explanation: ".NET 10 hace más potentes las file-based apps, incluyendo publicación y escenarios Native AOT para utilidades pequeñas.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#file-based-apps-enhancements"
    },
    {
      id: "m05-types",
      rank: "Base",
      area: "C#",
      title: "Tipos con intención",
      xp: 50,
      kind: "multi",
      prompt: "Selecciona las afirmaciones correctas sobre C# en .NET.",
      code: "string name = \"Ada\";\nint score = 42;\nbool active = true;",
      options: [
        "C# comprueba tipos en compilación",
        "Todas las variables son cadenas",
        "Un buen nombre de tipo ayuda a leer dominio",
        "El compilador no detecta errores antes de ejecutar"
      ],
      answer: [0, 2],
      explanation: "C# es fuertemente tipado. El compilador ayuda a detectar errores temprano y los tipos expresan intención del dominio.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/"
    },
    {
      id: "m06-field",
      rank: "Base",
      area: "C# 14",
      title: "Propiedad con guardia",
      xp: 55,
      kind: "choice",
      prompt: "C# 14 añade el keyword contextual `field`. ¿Qué mejora permite en esta propiedad?",
      code: "public string Message\n{\n    get;\n    set => field = value ?? throw new ArgumentNullException(nameof(value));\n}",
      options: [
        "Evitar declarar manualmente un backing field",
        "Convertir una clase en record",
        "Ejecutar la propiedad en otro hilo",
        "Desactivar nullable reference types"
      ],
      answer: 0,
      explanation: "`field` permite escribir lógica de acceso usando el campo generado por el compilador, sin declarar uno privado a mano.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14#the-field-keyword"
    },
    {
      id: "m07-null-assignment",
      rank: "Base",
      area: "C# 14",
      title: "Asignación segura",
      xp: 55,
      kind: "choice",
      prompt: "¿Qué hace esta asignación null-conditional de C# 14?",
      code: "customer?.Order = GetCurrentOrder();",
      options: [
        "Lanza excepción si customer es null",
        "Asigna solo si customer no es null",
        "Crea un customer vacío automáticamente",
        "Hace await implícito a GetCurrentOrder"
      ],
      answer: 1,
      explanation: "El lado derecho solo se evalúa si el receptor no es null. Reduce ruido sin esconder la intención.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14#null-conditional-assignment"
    },
    {
      id: "m08-nameof",
      rank: "Base",
      area: "C# 14",
      title: "Nombre sin tipo cerrado",
      xp: 55,
      kind: "choice",
      prompt: "Desde C# 14, ¿qué devuelve `nameof(List<>)`?",
      code: "var label = nameof(List<>);",
      options: [
        "List",
        "List<T>",
        "System.Collections.Generic.List",
        "Error de compilación siempre"
      ],
      answer: 0,
      explanation: "`nameof` admite tipos genéricos no cerrados y devuelve el nombre del tipo sin exigir argumentos genéricos.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14#unbound-generic-types-and-nameof"
    },
    {
      id: "m09-linq-order",
      rank: "Base",
      area: "LINQ",
      title: "Pipeline limpio",
      xp: 60,
      kind: "order",
      prompt: "Ordena el pipeline para filtrar pedidos pagados, proyectar importes y materializar la lista.",
      code: "var totals = orders\n    .Where(o => o.Paid)\n    .Select(o => o.Total)\n    .ToList();",
      options: [
        ".ToList()",
        "orders",
        ".Select(o => o.Total)",
        ".Where(o => o.Paid)"
      ],
      answer: [1, 3, 2, 0],
      explanation: "LINQ se lee como una tubería: fuente, filtro, proyección y materialización. Mantener ese orden reduce errores.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/linq/"
    },
    {
      id: "m10-async",
      rank: "Base",
      area: "Async",
      title: "No bloquees la UI",
      xp: 60,
      kind: "choice",
      prompt: "En una app web o móvil, ¿por qué prefieres `await` sobre bloquear con `.Result`?",
      code: "var user = await client.GetFromJsonAsync<User>(\"/api/users/7\");",
      options: [
        "Porque `await` libera el hilo mientras espera I/O",
        "Porque `await` siempre hace el código más rápido en CPU",
        "Porque `.Result` no existe en .NET",
        "Porque `await` elimina todos los errores de red"
      ],
      answer: 0,
      explanation: "Async/await expresa espera asíncrona sin bloquear el hilo. En servidores ayuda a escalar I/O; en UI mantiene respuesta táctil.",
      source: "https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/"
    },
    {
      id: "m11-di",
      rank: "Intermedio",
      area: "Arquitectura",
      title: "Dependencias explícitas",
      xp: 65,
      kind: "choice",
      prompt: "ASP.NET Core usa DI de forma nativa. ¿Qué registro encaja para un servicio sin estado usado por petición?",
      code: "builder.Services.AddScoped<IInvoiceService, InvoiceService>();",
      options: [
        "AddScoped",
        "Thread.Sleep",
        "new InvoiceService() en cada controlador",
        "static global mutable"
      ],
      answer: 0,
      explanation: "Scoped encaja con servicios por petición HTTP. La inyección deja dependencias explícitas, testeables y configurables.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection"
    },
    {
      id: "m12-minimal-api",
      rank: "Intermedio",
      area: "ASP.NET Core",
      title: "Levanta una API mínima",
      xp: 70,
      kind: "order",
      prompt: "Ordena los pasos básicos de una Minimal API.",
      code: "var builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddOpenApi();\nvar app = builder.Build();\napp.MapGet(\"/health\", () => Results.Ok(\"ok\"));\napp.Run();",
      options: [
        "app.MapGet(\"/health\", handler)",
        "builder.Services.AddOpenApi()",
        "WebApplication.CreateBuilder(args)",
        "app.Run()",
        "builder.Build()"
      ],
      answer: [2, 1, 4, 0, 3],
      explanation: "Primero configuras builder y servicios, construyes la app, mapeas endpoints y arrancas el host.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis"
    },
    {
      id: "m13-middleware",
      rank: "Intermedio",
      area: "ASP.NET Core",
      title: "Pipeline HTTP",
      xp: 70,
      kind: "order",
      prompt: "Ordena una tubería razonable para una API con errores, autenticación y autorización.",
      code: "app.UseExceptionHandler();\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapControllers();",
      options: [
        "Mapear endpoints",
        "Autorización",
        "Manejador de errores",
        "Autenticación"
      ],
      answer: [2, 3, 1, 0],
      explanation: "El orden importa: errores pronto, autenticación antes de autorización y endpoints al final.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/"
    },
    {
      id: "m14-openapi",
      rank: "Intermedio",
      area: "Contratos",
      title: "Contrato vivo",
      xp: 70,
      kind: "choice",
      prompt: "ASP.NET Core 10 añade soporte OpenAPI 3.1. ¿Para qué te sirve en un equipo profesional?",
      code: "builder.Services.AddOpenApi();\napp.MapOpenApi();",
      options: [
        "Para documentar y compartir el contrato HTTP de la API",
        "Para reemplazar la base de datos",
        "Para compilar C# en CSS",
        "Para ocultar endpoints en producción automáticamente"
      ],
      answer: 0,
      explanation: "OpenAPI describe endpoints, esquemas y respuestas. Facilita documentación, clientes generados y pruebas de contrato.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0#openapi"
    },
    {
      id: "m15-passkeys",
      rank: "Intermedio",
      area: "Seguridad",
      title: "Menos contraseñas",
      xp: 70,
      kind: "choice",
      prompt: "ASP.NET Core Identity en .NET 10 incorpora soporte de passkeys. ¿Qué problema ataca?",
      code: "WebAuthn + FIDO2 + Identity",
      options: [
        "Autenticación resistente a phishing sin contraseña clásica",
        "Serialización de JSON más rápida",
        "Compresión de imágenes",
        "Consultas SQL automáticas"
      ],
      answer: 0,
      explanation: "Las passkeys usan criptografía de clave pública y autenticadores del dispositivo. Mejoran seguridad y experiencia frente a contraseñas.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0#passkey-support-for-aspnet-core-identity"
    },
    {
      id: "m16-ef-dbcontext",
      rank: "Avanzado",
      area: "EF Core",
      title: "Unidad de trabajo",
      xp: 75,
      kind: "choice",
      prompt: "En EF Core, ¿qué representa principalmente un `DbContext`?",
      code: "await using var db = new ShopDbContext();\nvar items = await db.Products.Where(p => p.Active).ToListAsync();",
      options: [
        "Una sesión de trabajo con seguimiento de entidades y acceso a la base",
        "Un fichero CSS",
        "Un runtime alternativo a CLR",
        "Una plantilla de GitHub Actions"
      ],
      answer: 0,
      explanation: "DbContext coordina consultas, cambios y guardado. Conviene mantenerlo con vida corta, normalmente por petición.",
      source: "https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/"
    },
    {
      id: "m17-ef-migration",
      rank: "Avanzado",
      area: "EF Core",
      title: "Migración sin caos",
      xp: 75,
      kind: "order",
      prompt: "Ordena un flujo básico de migración de esquema con EF Core.",
      code: "dotnet ef migrations add AddInvoices\ndotnet ef database update",
      options: [
        "Aplicar a la base con database update",
        "Cambiar el modelo C#",
        "Revisar la migración generada",
        "Crear migración con migrations add"
      ],
      answer: [1, 3, 2, 0],
      explanation: "Primero cambia el modelo, genera migración, revisa el SQL/intención y aplica en el entorno correcto.",
      source: "https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/"
    },
    {
      id: "m18-ef10-filters",
      rank: "Avanzado",
      area: "EF Core 10",
      title: "Filtros con nombre",
      xp: 80,
      kind: "multi",
      prompt: "EF Core 10 introduce filtros de consulta con nombre. ¿Qué ventajas prácticas tienen?",
      code: "modelBuilder.Entity<Post>()\n    .HasQueryFilter(\"SoftDelete\", p => !p.IsDeleted)\n    .HasQueryFilter(\"Tenant\", p => p.TenantId == tenantId);",
      options: [
        "Permiten separar filtros como soft delete y tenant",
        "Permiten desactivar selectivamente un filtro",
        "Eliminan la necesidad de índices",
        "Hacen que todas las consultas sean síncronas"
      ],
      answer: [0, 1],
      explanation: "Los filtros con nombre ayudan a combinar reglas transversales y desactivar una concreta sin perder las demás.",
      source: "https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-10.0/whatsnew#named-query-filters"
    },
    {
      id: "m19-tools",
      rank: "Avanzado",
      area: "SDK .NET 10",
      title: "Tooling efímero",
      xp: 80,
      kind: "choice",
      prompt: ".NET 10 añade `dotnet tool exec` y `dnx`. ¿Cuándo brilla especialmente?",
      code: "dotnet tool exec dotnetsay \"Hola\"\ndnx dotnetsay \"Hola\"",
      options: [
        "En CI/CD o tareas puntuales sin instalar globalmente",
        "Solo para compilar aplicaciones WinForms",
        "Para sustituir HTTPS",
        "Para convertir NuGet en una base de datos"
      ],
      answer: 0,
      explanation: "La ejecución one-shot descarga y ejecuta herramientas para usos efímeros. Reduce estado global y mejora scripts reproducibles.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#one-shot-tool-execution"
    },
    {
      id: "m20-aot-file",
      rank: "Avanzado",
      area: "Rendimiento",
      title: "AOT consciente",
      xp: 80,
      kind: "choice",
      prompt: "Una file-based app en .NET 10 se publica por defecto con Native AOT. ¿Qué compruebas antes de elegirlo para producción?",
      code: "dotnet publish app.cs\n#:property PublishAot=false",
      options: [
        "Compatibilidad de paquetes y reflexión usada por la app",
        "Que el CSS tenga variables",
        "Que el endpoint tenga OpenAPI",
        "Que todas las clases sean static"
      ],
      answer: 0,
      explanation: "Native AOT mejora arranque y despliegue, pero no todos los patrones o paquetes encajan igual. Hay que validar compatibilidad.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#enhanced-file-based-apps-with-publish-support-and-native-aot"
    },
    {
      id: "m21-containers",
      rank: "Avanzado",
      area: "Deploy",
      title: "Contenedor desde publish",
      xp: 80,
      kind: "choice",
      prompt: ".NET 10 permite a apps de consola crear imágenes de contenedor con `PublishContainer` sin propiedad extra. ¿Qué escenario cubre?",
      code: "dotnet publish /t:PublishContainer",
      options: [
        "Empaquetar una app como imagen OCI/Docker desde el SDK",
        "Instalar Visual Studio en producción",
        "Convertir una tabla SQL en YAML",
        "Evitar todos los tests"
      ],
      answer: 0,
      explanation: "El SDK puede publicar imágenes de contenedor, útil para workers, jobs y servicios que se despliegan en plataformas container-ready.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#console-apps-can-natively-create-container-images"
    },
    {
      id: "m22-testing",
      rank: "Experto",
      area: "Calidad",
      title: "Runner moderno",
      xp: 90,
      kind: "choice",
      prompt: ".NET 10 soporta Microsoft.Testing.Platform en `dotnet test`. ¿Qué decisión es sensata en un repo grande?",
      code: "{\n  \"test\": {\n    \"runner\": \"Microsoft.Testing.Platform\"\n  }\n}",
      options: [
        "Probarlo en CI y medir compatibilidad antes de migrar todo",
        "Borrar los tests existentes",
        "Usarlo solo si la app no tiene NuGet",
        "Activarlo en producción en caliente"
      ],
      answer: 0,
      explanation: "En repos grandes se migra con evidencia: compatibilidad, tiempos, informes y estabilidad del pipeline.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#support-for-microsofttestingplatform-mtp-in-dotnet-test"
    },
    {
      id: "m23-runtime",
      rank: "Experto",
      area: "Runtime",
      title: "JIT sin magia",
      xp: 90,
      kind: "choice",
      prompt: ".NET 10 mejora el JIT con mejor generación de código. ¿Cuál es la actitud correcta ante una optimización de runtime?",
      code: "struct Point { public int X; public int Y; }",
      options: [
        "Medir con benchmarks antes de cambiar arquitectura",
        "Eliminar todos los structs",
        "Reescribir la app en ensamblador",
        "Desactivar el GC siempre"
      ],
      answer: 0,
      explanation: "Las mejoras del JIT ayudan, pero el trabajo experto mide antes de rediseñar. BenchmarkDotNet y perfiles reales mandan.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/runtime"
    },
    {
      id: "m24-observability",
      rank: "Experto",
      area: "Operación",
      title: "Señales antes que sustos",
      xp: 90,
      kind: "multi",
      prompt: "ASP.NET Core 10 amplía métricas de autenticación, autorización e Identity. ¿Qué usarías para operar mejor una API?",
      code: "OpenTelemetry + logs estructurados + métricas + trazas",
      options: [
        "Contadores de challenge, forbid y sign-in",
        "Trazas y logs correlacionados por request",
        "Silenciar todos los errores",
        "Medir solo en localhost"
      ],
      answer: [0, 1],
      explanation: "Operar una API exige señales: métricas, logs y trazas. Las métricas nuevas de ASP.NET Core ayudan a ver problemas de seguridad y acceso.",
      source: "https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0#metrics"
    },
    {
      id: "m25-architecture",
      rank: "Experto",
      area: "Diseño",
      title: "Fronteras limpias",
      xp: 95,
      kind: "multi",
      prompt: "Diseñas una solución .NET 10 para crecer. ¿Qué decisiones suelen bajar el coste de cambio?",
      code: "Api -> Application -> Domain\nInfrastructure -> EF Core, HTTP, Files",
      options: [
        "Separar dominio/aplicación de infraestructura",
        "Cubrir reglas críticas con tests automatizados",
        "Meter SQL, HTTP y UI en la misma clase",
        "Usar DI para invertir dependencias externas"
      ],
      answer: [0, 1, 3],
      explanation: "La arquitectura experta no es ceremonia: separa reglas de negocio, puertos externos y pruebas donde el cambio duele.",
      source: "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/"
    },
    {
      id: "m26-release",
      rank: "Experto",
      area: "Producción",
      title: "Salida controlada",
      xp: 100,
      kind: "order",
      prompt: "Ordena una salida sensata de una API .NET 10 a producción.",
      code: "test -> build -> scan -> deploy -> observe -> rollback if needed",
      options: [
        "Observar métricas y errores",
        "Ejecutar tests y build reproducible",
        "Preparar rollback",
        "Desplegar por entorno",
        "Revisar dependencias y configuración"
      ],
      answer: [1, 4, 2, 3, 0],
      explanation: "Un despliegue serio no termina en publish: valida, prepara marcha atrás, despliega de forma controlada y observa.",
      source: "https://learn.microsoft.com/en-us/dotnet/architecture/cloud-native/devops"
    },
    {
      id: "m27-final",
      rank: "Experto",
      area: "Incidente",
      title: "Jefe de guardia",
      xp: 120,
      kind: "multi",
      prompt: "La API responde lento tras migrar a .NET 10. ¿Qué haces antes de culpar al framework?",
      code: "p95 latency up\nCPU normal\nDB calls slower\nnew dependency version",
      options: [
        "Comparar métricas antes/después por endpoint",
        "Perfilar consultas y dependencias externas",
        "Revertir a ciegas sin mirar logs",
        "Reproducir con carga controlada"
      ],
      answer: [0, 1, 3],
      explanation: "El nivel experto separa síntomas de causas: métricas, trazas, perfiles y reproducción. Después decides fix, rollback o ajuste.",
      source: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/"
    }
  ];
})();
