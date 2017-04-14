package com.edu.udea.sever;

import com.edu.udea.ws.Figure;
import com.edu.udea.ws.FigureDecoder;
import com.edu.udea.ws.FigureEncoder;
import java.io.IOException;
import static java.lang.String.format;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/tablero",
        encoders={FigureEncoder.class},
        decoders={FigureDecoder.class})
public class MyWhiteboard {
private static Set<Session> peers=Collections.synchronizedSet(new HashSet<Session>());
    
    @OnMessage
    public void broadcastFigure(Figure figure,Session session) throws IOException, EncodeException{
        for(Session peer:peers){
            if(!peer.equals(session)){
              peer.getBasicRemote().sendObject(figure);
            }
        }
    }
            
    @OnOpen
    public void onOpen(Session peer) {
        System.out.println(format("%s joined:", peer.getId()));
        peers.add(peer);
    }

    @OnClose
    public void onClose(Session peer) {
        System.out.println(format("%s left:", peer.getId()));
        peers.remove(peer);
    }
    
}
