package com.estacionamiento.hardware;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class SerialEmisor {

    private final String backendUrl;

    public SerialEmisor(String backendUrl) {
        this.backendUrl = backendUrl;
    }

    public void enviarDato(String dato) {
        try {
            URL url = new URI(backendUrl + "/api/sensor-data").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");

            String json = "{\"dato\":\"" + dato + "\"}";
            byte[] out = json.getBytes(StandardCharsets.UTF_8);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(out);
            }

            int respuesta = conn.getResponseCode();
            System.out.println("Respuesta del backend: " + respuesta);

            conn.disconnect();
        } catch (Exception e) {
            System.out.println("Error al enviar dato al backend: " + e.getMessage());
        }
    }
}
