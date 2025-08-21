# Proyecto: Balanceador de Carga y Health Checker

Este proyecto es una demostración clara y práctica de dos conceptos fundamentales en la arquitectura de sistemas distribuidos: el **Balanceo de Carga** y la **Tolerancia a Fallos** mediante `Health Checks`.

## ¿Por Qué es Esto Importante?

En grandes proyectos, los servidores web no son infalibles, tienen capacidad limitada. Para asegurar que una aplicación pueda manejar un gran número de usuarios y no se caiga si uno de sus servidores falla, se utilizan arquitecturas que distribuyen el trabajo.

1.  **Balanceo de Carga:** El balanceador de carga actúa como un **director**, distribuyendo las peticiones entrantes entre múltiples réplicas idénticas de un único servicio. Evitando que cualquier servidor individual se sobrecargue y mejora el rendimiento general del sistema. La estrategia utilizada es **Round Robin**, un método sencillo que asigna cada nueva petición al siguiente servidor en la lista, de forma circular.

2.  **Tolerancia a Fallos (`Health Checks`):** Un balanceador de carga no es útil si sigue enviando tráfico a servidores que no funcionan. El **Health Checker** es el encargado de verificar periódicamente el estado de cada servidor. Si un servidor deja de responder, el balanceador lo "saca de la rotación" hasta que vuelva a estar operativo. Esto garantiza que la aplicación siga funcionando sin interrupciones para el usuario, incluso si uno o más de sus componentes fallan.

Este proyecto permite ver cómo estos dos conceptos trabajan en conjunto para crear un sistema escalable.

---

## Estructura del Proyecto

-   **`loadBalancer.js`**: Script balanceador de carga que escucha en el puerto `8080`, distribuye las peticiones a los servicios y monitorea su estado de salud.
-   **`service.js`**: Plantilla para servidores de réplica. Es un servicio web con un endpoint simple que puede ser iniciado en múltiples instancias, cada una en un puerto diferente (`3001`, `3002`, `3003`, etc.).
-   **`public/`**: Página web estática (`index.html`) que permite interactuar con el sistema y ver el estado de los servidores en tiempo real.
---

## Iniciar el Proyecto

1.  **Instalar dependencias.**
    ```bash
    npm install
    ```

2.  **Iniciar todos los servicios (balanceador y réplicas).**
    ```bash
    npm run dev
    ```

3.  **Demostración local.**
    [http://localhost:8080](http://localhost:8080)