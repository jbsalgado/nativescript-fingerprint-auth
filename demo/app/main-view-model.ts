import { alert } from "tns-core-modules/ui/dialogs";
import { Observable } from "tns-core-modules/data/observable";
import { FingerprintAuth, BiometricIDAvailableResult } from "nativescript-fingerprint-auth";

export class HelloWorldModel extends Observable {
  private fingerprintAuth: FingerprintAuth;
  public status: string = "Tap a button below..";

  constructor() {
    super();
    this.fingerprintAuth = new FingerprintAuth();
  }

  public doCheckAvailable(): void {
    this.fingerprintAuth.available()
        .then(
            (result: BiometricIDAvailableResult) => {
              console.log("doCheckAvailable result: " + JSON.stringify(result));
              this.set('status', "Biometric ID available? - " + (result.any ? (result.face ? "Face" : "Touch") : "NO"));
            })
        .catch(err => {
          console.log("doCheckAvailable error: " + err);
          this.set('status', "Error: " + err);
        });
  }

  public doCheckFingerprintsChanged(): void {
    this.fingerprintAuth.didFingerprintDatabaseChange().then(
        (changed: boolean) => {
          this.set('status', "Biometric ID changed? - " + (changed ? "YES" : "NO"));
        });
  }

  public doVerifyFingerprint(): void {
    this.fingerprintAuth.verifyFingerprint(
        {
          message: 'Scan yer finger', // optional
          authenticationValidityDuration: 10 // Android
        })
        .then(() => {
          alert({
            title: "Biometric ID / passcode OK",
            okButtonText: "Sweet"
          });
        })
        .catch(err => {
          alert({
            title: "Biometric ID NOT OK / canceled",
            message: JSON.stringify(err),
            okButtonText: "Mmkay"
          });
        });
  }

  public doVerifyFingerprintWithCustomUI(): void {
    this.fingerprintAuth.verifyFingerprint(
        {
          message: 'Scan yer finger', // optional
          useCustomAndroidUI: true // Android
        })
        .then(() => this.set('status', "Biometric ID OK"))
        .catch(err => this.set('status', `Biometric ID NOT OK: " + ${JSON.stringify(err)}`));
  }

  public doVerifyFingerprintWithCustomFallback(): void {
    this.fingerprintAuth.verifyFingerprintWithCustomFallback(
        {
          message: 'Scan yer finger', // optional
          fallbackMessage: 'Enter PIN', // optional
          authenticationValidityDuration: 10 // Android
        })
        .then(() => {
          this.set('status', "Biometric ID OK");
          alert({
            title: "Biometric ID OK",
            okButtonText: "Sweet"
          });
        })
        .catch(error => {
          this.set('status', "Biometric ID NOT OK: " + JSON.stringify(error));
          alert({
            title: "Biometric ID NOT OK",
            message: (error.code === -3 ? "Show custom fallback" : error.message),
            okButtonText: "Mmkay"
          });
        });
  }
}