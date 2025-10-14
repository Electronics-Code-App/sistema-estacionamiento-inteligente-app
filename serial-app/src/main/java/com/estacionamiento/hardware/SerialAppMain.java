package com.estacionamiento.hardware;

public class SerialAppMain {

    public static void main(String[] args) {
        SerialLibreria serial = new SerialLibreria();
        SerialEmisor emisor = new SerialEmisor("http://localhost:8080");

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
            for (int i = 0; i < 5; i++) {
                String linea = serial.leerLinea();
                if (linea != null && !linea.isEmpty()) {
                    System.out.println("Arduino dice: " + linea);

                    emisor.enviarDato(linea);

                } else {
                    System.out.println("No se recibió dato.");
                }
                Thread.sleep(1000);
            }

            serial.enviarComando("LED_ON");
            System.out.println("Comando enviado: LED_ON");
            Thread.sleep(1000);

            serial.enviarComando("LED_OFF");
            System.out.println("Comando enviado: LED_OFF");

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            serial.cerrarPuerto();
            System.out.println("Puerto cerrado.");
        }
    }
}
