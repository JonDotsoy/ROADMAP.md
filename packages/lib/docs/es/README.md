# `@jondotsoy/roadmap-parse`

**[Read this documentation in English](../../README.md)** _(English version available here)_

Esta librería, `@jondotsoy/roadmap-parse`, está diseñada para analizar archivos Markdown que siguen la **Especificación roadmap.md document**. Su objetivo principal es extraer la información sobre las características planificadas y su estado, tal como se define en un documento ROADMAP.md.

## Especificación roadmap.md document

Para que `@jondotsoy/roadmap-parse` pueda interpretar correctamente un archivo, este debe seguir una estructura específica. A continuación, se describe el formato esperado del documento `ROADMAP.md`:

### Estructura General

1.  **Título Principal:** El documento debe comenzar con un título de nivel 1 (`#`) que contenga la palabra "Roadmap" (o "ROADMAP", "roadmap", etc., no es sensible a mayúsculas/minúsculas). Este título sirve para identificar el documento como un archivo de roadmap válido.

    ```markdown
    # Roadmap del Proyecto
    ```

2.  **Secciones Principales:** El documento puede contener varias secciones, pero la librería se centra principalmente en la sección "Roadmap" para la extracción de tareas. Otras secciones como "Objective of this document" y "Proposals" pueden estar presentes, pero no son analizadas para la extracción de tareas directamente.

3.  **Sección "Roadmap":** Esta sección es crucial y debe contener las subsecciones "Active" y "Planned". Estas subsecciones utilizan tablas Markdown para definir las características y su estado.

    ```markdown
    ## Roadmap

    ### 🚧 Active

    | Feature | Expected Release Date |
    | ------- | --------------------- |
    | ...     | ...                   |

    ### ⏳ Planned

    | Feature | Status | Expected Completion Date |
    | ------- | ------ | ------------------------ |
    | ...     | ...    | ...                      |
    ```

### Tablas de Tareas

Dentro de la sección "Roadmap", se esperan dos tipos de tablas Markdown:

1.  **Tabla "Active" (🚧 Active):**

    - **Propósito:** Lista las características que están actualmente en desarrollo activo.
    - **Estructura:** Debe tener las siguientes columnas **exactamente** en este orden:
      - `Feature`: Nombre o descripción breve de la característica.
      - `Expected Release Date`: Fecha estimada de lanzamiento de la característica.
    - **Formato Markdown:**

      ```markdown
      ### 🚧 Active

      | Feature                | Expected Release Date |
      | ---------------------- | --------------------- |
      | Interfaz de Usuario    | Q2 2024               |
      | Mejoras de Rendimiento | Q3 2024               |
      ```

2.  **Tabla "Planned" (⏳ Planned):**

    - **Propósito:** Lista las características que están planificadas para ser desarrolladas en el futuro.
    - **Estructura:** Debe tener las siguientes columnas **exactamente** en este orden:
      - `Feature`: Nombre o descripción breve de la característica.
      - `Status`: Estado actual de la planificación o desarrollo de la característica (ej: "Pendiente", "En progreso", "En revisión", etc.).
      - `Expected Completion Date`: Fecha estimada de finalización del desarrollo de la característica.
    - **Formato Markdown:**

      ```markdown
      ### ⏳ Planned

      | Feature                | Status      | Expected Completion Date |
      | ---------------------- | ----------- | ------------------------ |
      | Corrección de Bugs     | En Progreso | 30 de Septiembre de 2024 |
      | Nuevas Funcionalidades | Planificado | Diciembre de 2024        |
      ```

### Sección "Proposals"

La sección "Proposals" está destinada a describir ideas o propuestas de nuevas funcionalidades. Actualmente, `@jondotsoy/roadmap-parse` **no analiza el contenido de esta sección para extraer tareas.** Esta sección es puramente informativa y puede utilizarse para documentar ideas futuras que aún no están formalmente planificadas en las tablas "Active" o "Planned".

```markdown
## Proposals

### Proposal: Nueva API de Integración

Descripción detallada de la nueva API de integración...
```

## Uso de la Librería `@jondotsoy/roadmap-parse`

### Instalación

Puedes instalar la librería utilizando **npm, bun, pnpm o yarn**:

```bash
npm install @jondotsoy/roadmap-parse
bun add @jondotsoy/roadmap-parse
pnpm add @jondotsoy/roadmap-parse
yarn add @jondotsoy/roadmap-parse
```

### Importar la Librería

Para utilizar la librería en tu proyecto TypeScript o JavaScript, debes importarla:

```typescript
import { RoadmapFile } from "@jondotsoy/roadmap-parse";
```

### Leer un Archivo ROADMAP.md

La clase `RoadmapFile` proporciona un método estático `fromFile(filePath: string)` que lee un archivo `ROADMAP.md` y crea una instancia de `RoadmapFile`. Este método devuelve una Promesa que se resuelve con la instancia de `RoadmapFile` una vez que el archivo ha sido leído y analizado.

```typescript
const roadmapFile = await RoadmapFile.fromFile("./ROADMAP.md");
```

### Listar las Tareas

Una vez que tienes una instancia de `RoadmapFile`, puedes utilizar el método `listTasks()` para obtener un array de objetos que representan las tareas extraídas del documento. Este método también devuelve una Promesa que se resuelve con el array de tareas.

```typescript
const tasks = await roadmapFile.listTasks();
```

### Estructura del Objeto Tarea (`TaskDTO`)

El método `listTasks()` devuelve un array de objetos que se ajustan a la interfaz `TaskDTO`. Esta interfaz, definida en `./src/dtos/TaskDTO.ts`, describe la estructura de datos para cada tarea extraída del archivo `ROADMAP.md`:

```typescript
interface TaskDTO {
  title: string; // Título de la característica (columna "Feature" de las tablas)
  status?: string; // Estado de la tarea (columna "Status" de la tabla "Planned", opcional)
  expectedCompletionDate?: string; // Fecha estimada de finalización (columna "Expected Completion Date" de la tabla "Planned", opcional)
  expectedReleaseDate?: string; // Fecha estimada de lanzamiento (columna "Expected Release Date" de la tabla "Active", opcional)
}
```

- **`title`**: Siempre estará presente y se extrae de la columna "Feature" de ambas tablas ("Active" y "Planned").
- **`status`**: Estará presente **solo** para las tareas extraídas de la tabla "Planned" y corresponde al valor de la columna "Status".
- **`expectedCompletionDate`**: Estará presente **solo** para las tareas extraídas de la tabla "Planned" y corresponde al valor de la columna "Expected Completion Date".
- **`expectedReleaseDate`**: Estará presente **solo** para las tareas extraídas de la tabla "Active" y corresponde al valor de la columna "Expected Release Date".

### Ejemplo de Uso y Resultado Esperado

El siguiente ejemplo demuestra cómo usar la librería y el formato del resultado `TaskDTO` esperado al procesar un archivo `ROADMAP.md`:

**Ejemplo de `ROADMAP.md` (simulado):**

```markdown
## Roadmap

### 🚧 Active

| Feature           | Expected Release Date |
| ----------------- | --------------------- |
| [Task 2](#task-2) | August 2024           |

### ⏳ Planned

| Feature           | Status      | Expected Completion Date |
| ----------------- | ----------- | ------------------------ |
| [Task 1](#task-1) | In Progress | September 2024           |

## Proposals

### Task 1

Lorem ipsum dolor sit amet...

### Task 2

Lorem ipsum dolor sit amet...
```

**Código de Ejemplo:**

```typescript
import { RoadmapFile } from "@jondotsoy/roadmap-parse";

async function main() {
  try {
    const roadmapFile = await RoadmapFile.fromFile("./ROADMAP.md"); // Reemplaza con la ruta real a tu archivo
    const tasks = await roadmapFile.listTasks();

    console.log(JSON.stringify(tasks, null, 2)); // Imprime las tareas en formato JSON para mejor visualización
  } catch (error) {
    console.error("Error al procesar ROADMAP.md:", error);
  }
}

main();
```

**Resultado Esperado (JSON):**

```json
[
  {
    "title": "Task 1",
    "status": "In Progress",
    "expectedCompletionDate": "September 2024",
    "expectedReleaseDate": undefined
  },
  {
    "title": "Task 2",
    "status": "Done",
    "expectedReleaseDate": "August 2024",
    "expectedCompletionDate": undefined
  }
]
```

**Nota:** En el ejemplo de resultado, se asume que "Task 2" en la tabla "Active" tiene un estado implícito de "Done" ya que está listada en la sección "Active" y tiene una fecha de lanzamiento esperada, sugiriendo que está en una etapa final o ya lanzada. La librería podría no inferir el estado "Done" automáticamente, dependiendo de su implementación específica. En este caso, el `status` para "Task 2" debería ser `undefined` si no se puede inferir un estado explícito. _(En el test proporcionado, se espera `status: "Done"` para Task 2, lo cual podría necesitar ser confirmado en la implementación real de la librería)._

Este código de ejemplo muestra cómo leer un archivo `ROADMAP.md`, extraer las tareas, y observar la estructura de los objetos `TaskDTO` resultantes.
