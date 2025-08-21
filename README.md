# Project: Load Balancer and Health Checker

This project is a clear and practical demonstration of two fundamental concepts in distributed systems architecture: **Load Balancing** and **Fault Tolerance** through `Health Checks`.

## Why Is This Important?

In large projects, web servers are not infallible and have limited capacity. To ensure that an application can handle a large number of users and doesn't crash if one of its servers fails, architectures that distribute the workload are used.

1. **Load Balancing:** The load balancer acts as a **director**, distributing incoming requests among multiple identical replicas of a single service. This prevents any individual server from becoming overloaded and improves the overall system performance. The strategy used here is **Round Robin**, a simple method that assigns each new request to the next server on the list, in a circular fashion.

2. **Fault Tolerance (`Health Checks`):** A load balancer is not useful if it continues to send traffic to servers that are not working. The **Health Checker** is responsible for periodically verifying the status of each server. If a server stops responding, the balancer "removes it from rotation" until it becomes operational again. This ensures that the application continues to function without interruptions for the user, even if one or more of its components fail.

This project allows you to see how these two concepts work together to create a scalable system.

---

<img width="60" height="300" alt="image" src="https://github.com/user-attachments/assets/4f351df3-69ac-4aa3-a0ca-3fd28267bddc" />


## Project Structure

- **`loadBalancer.js`**: The load balancer script that listens on port `8080`, distributes requests to services, and monitors their health status.
- **`service.js`**: A template for replica servers. It's a simple web service with a single endpoint that can be started in multiple instances, each on a different port (`3001`, `3002`, `3003`, etc.).
- **`public/`**: A static website (`index.html`) that allows you to interact with the system and view the server status in real-time.
---

## How to Run the Project

1. **Install dependencies.**

   ```bash
   npm install

3. **Start all services (balancer and replicas).**

   ```bash
   npm run dev

5. **Local demonstration.**

   [http://localhost:8080](http://localhost:8080)
