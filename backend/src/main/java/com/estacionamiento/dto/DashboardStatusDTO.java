package com.estacionamiento.dto;

public class DashboardStatusDTO {
    private boolean arduinoConectado;
    private int posicionServo;
    private int distancia;
    private boolean vehiculoDetectado;
    private boolean solicitudSalida;

    public boolean isArduinoConectado() { return arduinoConectado; }
    public void setArduinoConectado(boolean arduinoConectado) { this.arduinoConectado = arduinoConectado; }

    public int getPosicionServo() { return posicionServo; }
    public void setPosicionServo(int posicionServo) { this.posicionServo = posicionServo; }

    public int getDistancia() { return distancia; }
    public void setDistancia(int distancia) { this.distancia = distancia; }

    public boolean isVehiculoDetectado() { return vehiculoDetectado; }
    public void setVehiculoDetectado(boolean vehiculoDetectado) { this.vehiculoDetectado = vehiculoDetectado; }

    public boolean isSolicitudSalida() { return solicitudSalida; }
    public void setSolicitudSalida(boolean solicitudSalida) { this.solicitudSalida = solicitudSalida; }
}
