package com.JoseAngel.Notea;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        //aqui los plugin no oficiales
        registerPlugin(GoogleAuth.class);
    }
}
