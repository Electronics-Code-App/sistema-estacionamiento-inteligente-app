package com.estacionamiento.hardware;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class SerialHttpServer {

    private final SerialLibreria serial;

    public SerialHttpServer(SerialLibreria serial) {
        this.serial = serial;
    }

    public void iniciarServidor() {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);
            server.createContext("/api/serial/comando", new ComandoHandler());
            server.setExecutor(null);
            server.start();
            System.out.println("Servidor HTTP embebido iniciado en puerto 8081");
        } catch (IOException e) {
            System.err.println("Error iniciando servidor HTTP: " + e.getMessage());
        }
    }

    private class ComandoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                JSONObject json = new JSONObject(body);
                String comando = json.optString("comando", "");
                if (!comando.isEmpty()) {
                    System.out.println("Recibido comando desde backend: " + comando);
                    serial.enviarComando(comando);
                }
                String response = "{\"status\":\"ok\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        }
    }
}
