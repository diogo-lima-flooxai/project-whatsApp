import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {
  constructor() {
    super();

    this._available = false;

    this._mimeType = "audio/webm";

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this._available = true;
        this._stream = stream;

        this.trigger("ready", this._stream);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  isAvailable() {
    return this._available;
  }

  stop() {
    this._stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  startRecorder() {
    if (this.isAvailable()) {
      this._mediaRecoder = new MediaRecorder(this._stream, {
        mimeType: this._mimeType,
      });

      this._recordedChunks = [];

      this._mediaRecoder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) this._recordedChunks.push(e.data);
      });

      this._mediaRecoder.addEventListener("stop", (e) => {
        let blob = new Blob(this._recordedChunks, {
          type: this._mimeType,
        });

        let filename = `rec${Date.now()}.webm`;

        let file = new File([blob], filename, {
          type: this._mimeType,
          lastModified: Date.now(),
        });
        console.log("file", file);

        let reader = new FileReader();

        reader.onload = (e) => {
          console.log("reader file", file);

          let audio = new Audio(reader.result);

          audio.play();
        };

        reader.readAsDataURL(file);
      });

      this._mediaRecoder.start();
      this.startTimer();
    }
  }

  stopRecorder() {
    if (this.isAvailable()) {
      this._mediaRecoder.stop();
      this.stop();
      this.stopTimer();
    }
  }

  startTimer() {
    let start = Date.now();

    this._recordMicrophoneInterval = setInterval(() => {
      this.trigger('recordTimer', (Date.now() - start));
    }, 100);
  }

  stopTimer(){
    clearInterval(this._recordMicrophoneInterval);
  }
}
