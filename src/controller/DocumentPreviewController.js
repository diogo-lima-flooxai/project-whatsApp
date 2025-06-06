const pdfjsLib = require('pdfjs-dist');
const path = require('path')

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js')

export class DocumentPreviewController {
  constructor(file){
    this._file = file
  }

  getPreviewData(){
    return new Promise((s, f) => {

      let reader = new FileReader();

      switch (this._file.type){
        case 'image/png':
        case 'image/jepg':
        case 'image/jpg':
        case 'image/gif':

        reader.onload = e => {
          s({
            src: reader.result,
            info: this._file.name
          });
        }
        reader.onerror = e =>{
          f(e);
        }
        reader.readAsDataURL(this._file);
        break;

        case 'application/pdf':
        
        reader.onload = e =>{
          pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf =>{
            pdf.getPage(1).then(page=>{

              let viewport = page.getViewPort(1);

              let canvas = document.createElement('canvas');
              let canvasContext = canvas.getContext('2d');

              canvas.width = viewport.width;
              canvas.height = viewport.height;

              page.reader({
                canvasContext,
                viewport
              }).then(() =>{
                _s = (pdf.numPages > 1) ? 's' : '';

                s({
                  src: canvas.toDataURL('image/png'),
                  info: `${pdf.numPages} páginas${_s}`

                })


              }).catch(err=>{
                f(err)
              });

            }).catch(err=>{
              f(err)
            });

          }).catch(err =>{
            f(err)
          })
        }

        reader.readAsArrayBuffer(this._file)

        break;
        default:
          f();
      }
    })
  }
}