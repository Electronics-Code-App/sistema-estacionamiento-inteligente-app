package com.estacionamiento.hardware;

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

        StringBuilder sb = new StringBuilder();
        while (puerto.bytesAvailable() > 0) {
            byte[] buffer = new byte[1];
            puerto.readBytes(buffer, 1);
            char c = (char) buffer[0];
            if (c == '\n') break;
            sb.append(c);
        }
        return sb.toString().trim();
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
