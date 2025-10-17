package com.estacionamiento.hardware;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;

import com.fazecast.jSerialComm.SerialPort;

public class SerialLibreria {

    private SerialPort puerto;
    private BufferedReader lector;

    // 1. Conectar al puerto serial por nombre
    public boolean conectarPuerto(String nombrePuerto, int baudios) {
        puerto = SerialPort.getCommPort(nombrePuerto);
        puerto.setBaudRate(baudios);

        puerto.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 1000, 0);

        boolean abierto = puerto.openPort();

        if (abierto) {
            try {
                InputStream input = puerto.getInputStream();
                lector = new BufferedReader(new InputStreamReader(input));
                System.out.println("Puerto conectado correctamente.");
            } catch (Exception e) {
                System.err.println("Error al iniciar lector: " + e.getMessage());
                abierto = false;
            }
        } else {
            System.err.println("No se pudo abrir el puerto.");
        }
        return abierto;
    }

    // 2. Leer una línea de datos del Arduino
    public String leerLinea() {
        if (puerto == null || !puerto.isOpen() || lector == null) return null;

        try {

            if (puerto.bytesAvailable() > 0) {
                String linea = lector.readLine();
                if (linea != null) {
                    return linea.trim();
                }
            }
        } catch (Exception e) {
            System.err.println("Error leyendo datos: " + e.getMessage());
        }

        return null;
    }

    // 3. Enviar un comando al Arduino
    public void enviarComando(String comando) {
        if (puerto != null && puerto.isOpen()) {
            byte[] datos = (comando + "\n").getBytes();
            puerto.writeBytes(datos, datos.length);
        }
    }

    // 4. Cerrar el puerto serial
    public void cerrarPuerto() {
        if (puerto != null && puerto.isOpen()) {
            puerto.closePort();
            System.out.println("Puerto cerrado.");
        }
    }
}
