package com.estacionamiento.hardware;

import io.github.cdimascio.dotenv.Dotenv;

public class SerialAppMain {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
            .directory("./")
            .ignoreIfMissing()
            .load();

        String backendUrl = dotenv.get("BACKEND_URL");
        SerialEmisor emisor = new SerialEmisor(backendUrl);
        SerialLibreria serial = new SerialLibreria();

        String puerto = "COM3";
        int baudios = 9600;

        System.out.println("Conectando al puerto " + puerto + "...");

        boolean conectado = serial.conectarPuerto(puerto, baudios);
        if (!conectado) {
            System.out.println("No se pudo conectar al puerto.");
            return;
        }

        System.out.println("✅ Puerto conectado correctamente.");
        System.out.println("Leyendo datos...");

        try {
            while (true) {
                String linea;
                while ((linea = serial.leerLinea()) != null) {
                    linea = linea.trim();
                    if (!linea.isEmpty()) {
                        System.out.println("Arduino dice: " + linea);
                        emisor.enviarDato(linea);
                    }
                }
                Thread.sleep(50);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            serial.cerrarPuerto();
            System.out.println("Puerto cerrado.");
        }
    }
}
