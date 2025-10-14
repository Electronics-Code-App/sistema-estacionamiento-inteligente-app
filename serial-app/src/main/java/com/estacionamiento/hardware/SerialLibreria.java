package com.estacionamiento.hardware;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.fazecast.jSerialComm.SerialPort;

public class SerialLibreria {

    private SerialPort puerto;

    // 1. Conectar al puerto serial por nombre
    public boolean conectarPuerto(String nombrePuerto, int baudios) {
        puerto = SerialPort.getCommPort(nombrePuerto);
        puerto.setBaudRate(baudios);
        return puerto.openPort();
    }

    // 2. Leer una línea de datos del Arduino
    public String leerLinea() {
        if (puerto == null || !puerto.isOpen()) return null;

        try {
            InputStreamReader reader = new InputStreamReader(puerto.getInputStream());
            BufferedReader br = new BufferedReader(reader);
            return br.readLine(); // ← Aquí se lee la línea completa
        } catch (Exception e) {
            System.out.println("Error leyendo datos: " + e.getMessage());
            return null;
        }
    }

    // 3. Enviar un comando al Arduino
    public void enviarComando(String comando) {
        if (puerto != null && puerto.isOpen()) {
            byte[] datos = (comando + "\n").getBytes();
            puerto.writeBytes(datos, datos.length);
        }
    }

    // Cerrar el puerto serial
    public void cerrarPuerto() {
        if (puerto != null && puerto.isOpen()) {
            puerto.closePort();
        }
    }
}
