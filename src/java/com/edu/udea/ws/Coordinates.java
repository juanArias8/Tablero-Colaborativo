package com.edu.udea.ws;

/**
 *
 * @author Juan Diego
 */
public class Coordinates {

    private float x;
    private float y;
    private String nombre;
    private String mensaje;

    public Coordinates() {
    }

    public Coordinates(float x, float y, String nom, String men) {
        this.x = x;
        this.y = y;
        this.nombre = nom;
        this.mensaje = men;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
