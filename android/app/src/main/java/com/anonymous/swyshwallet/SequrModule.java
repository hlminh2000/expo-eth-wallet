package com.anonymous.swyshwallet;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;

public class SequrModule extends ReactContextBaseJavaModule {
  sequrJavaWrapper qeepWrapper = new sequrJavaWrapper();

  SequrModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "QeepModule";
  }

  @ReactMethod
  public byte[] decode(String qk, String iv, String message) {
    Log.d(
      "QeepModule",
      "decrypt, qk: " + qk + ", iv: " + iv + ", message: " + message
    );

    int messageLen = message.length();
    byte[] encrypted_message = new byte[messageLen];
    byte[] decrypted_message = new byte[messageLen];

    int ret = qeepWrapper.decode(
      qk.getBytes(),
      iv.getBytes(),
      encrypted_message,
      decrypted_message
    );

    return decrypted_message;
  }
}
