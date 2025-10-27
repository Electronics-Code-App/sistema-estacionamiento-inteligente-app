package com.estacionamiento.hardware;

import org.springframework.stereotype.Service;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class SerialCommandService {

    private boolean vehiculoDetectado = false;
    private boolean solicitudSalida = false;
    private int distancia = 0;
    private int posicionServo = 0;
    private boolean arduinoConectado = true;

    public void actualizarDato(String dato) {
        try {
            if (dato.startsWith("DISTANCIA:")) {
                distancia = Integer.parseInt(dato.split(":")[1]);
            } else if (dato.startsWith("SERVO:")) {
                posicionServo = Integer.parseInt(dato.split(":")[1]);
            } else if (dato.contains("VEHICULO_DETECTADO")) {
                vehiculoDetectado = true;
                System.out.println("Vehículo detectado, habilitando botón de Ingreso...");
            } else if (dato.contains("SOLICITUD_SALIDA")) {
                solicitudSalida = true;
                System.out.println("Botón físico presionado, habilitando botón de Salida...");
            }
            arduinoConectado = true;
        } catch (Exception e) {
            System.out.println("Error procesando dato recibido: " + dato + " -> " + e.getMessage());
        }
    }

    public void setVehiculoDetectado(boolean valor) {
        this.vehiculoDetectado = valor;
    }

    public void setSolicitudSalida(boolean valor) {
        this.solicitudSalida = valor;
    }

    public Map<String, Object> obtenerEstadoActual() {
        Map<String, Object> estado = new HashMap<>();
        estado.put("arduinoConectado", arduinoConectado);
        estado.put("posicionServo", posicionServo);
        estado.put("distancia", distancia);
        estado.put("vehiculoDetectado", vehiculoDetectado);
        estado.put("solicitudSalida", solicitudSalida);
        return estado;
    }

    public void enviarComandoAlArduino(String comando) {
        try {
            URL url = new URI("http://localhost:8081/api/serial/comando").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");

            String json = "{\"comando\":\"" + comando + "\"}";
            byte[] out = json.getBytes(StandardCharsets.UTF_8);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(out);
            }

            int code = conn.getResponseCode();
            System.out.println("Comando enviado al Arduino: " + comando + " (respuesta " + code + ")");
            conn.disconnect();

        } catch (Exception e) {
            System.out.println("Error enviando comando al Arduino: " + e.getMessage());
        }
    }

    public void abrirYcerrarPluma() {
        new Thread(() -> {
            try {
                System.out.println("Abriendo pluma...");
                enviarComandoAlArduino("SERVO_OPEN");
                Thread.sleep(5000);
                enviarComandoAlArduino("SERVO_CLOSE");
                System.out.println("Pluma cerrada.");

                resetEstados();

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    public void resetEstados() {
        System.out.println("Reiniciando estados del hardware...");
        vehiculoDetectado = false;
        solicitudSalida = false;
    }
}
